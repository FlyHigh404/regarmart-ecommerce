import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import midtransClient from "midtrans-client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { paymentMethod, directBuy, productId, quantity } = body;

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    const ONGKIR = 20000;
    let order: any;

    // 🔥 DIRECT BUY: Buat order baru dari productId
    if (directBuy && productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          { error: "Insufficient stock" },
          { status: 400 }
        );
      }

      // Hitung total
      const productTotal = Number(product.price) * quantity;
      const finalTotal = productTotal + ONGKIR;

      // Buat order baru dengan status PENDING
      order = await prisma.order.create({
        data: {
          userId: session.user.id,
          totalAmount: finalTotal,
          status: "PENDING",
          paymentMethod: paymentMethod,
          orderItems: {
            create: [
              {
                productId: product.id,
                quantity: quantity,
                unitPrice: product.price,
              },
            ],
          },
        },
        include: {
          orderItems: {
            include: { product: true },
          },
          user: true,
        },
      });
    } 
    // 🔥 CART: Ambil order PENDING yang sudah ada
    else {
      order = (await Promise.race([
        prisma.order.findFirst({
          where: {
            userId: session.user.id,
            status: "PENDING",
          },
          include: {
            orderItems: {
              include: { product: true },
            },
            user: true,
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Database timeout")), 8000)
        ),
      ])) as any;

      if (!order || order.orderItems.length === 0) {
        return NextResponse.json(
          { error: "No pending order found" },
          { status: 404 }
        );
      }

      // Hitung ulang total dengan ongkir
      const productTotal = order.orderItems.reduce(
        (sum: number, item: any) => sum + Number(item.unitPrice) * item.quantity,
        0
      );
      const finalTotal = productTotal + ONGKIR;

      // Update order dengan payment method dan total amount
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: paymentMethod,
          totalAmount: finalTotal,
        },
        include: {
          orderItems: {
            include: { product: true },
          },
          user: true,
        },
      });
    }

    // Hitung final total (untuk response)
    const productTotal = order.orderItems.reduce(
      (sum: number, item: any) => sum + Number(item.unitPrice) * item.quantity,
      0
    );
    const finalTotal = productTotal + ONGKIR;

    // 🔥 QRIS Payment
    if (paymentMethod === "QRIS") {
      const parameter = {
        payment_type: "qris",
        transaction_details: {
          order_id: order.id,
          gross_amount: finalTotal,
        },
        qris: { acquirer: "gopay" },
        customer_details: {
          first_name: order.user.name || "Customer",
          email: order.user.email || "customer@example.com",
          phone: order.user.phone || "0000000000",
        },
      };

      const midtransResponse = await new midtransClient.CoreApi({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY!,
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
      }).charge(parameter);

      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentMethod: "QRIS",
        totalAmount: finalTotal,
        shippingCost: ONGKIR,
        orderItems: order.orderItems,
        midtrans: {
          transactionId: midtransResponse.transaction_id,
          orderId: midtransResponse.order_id,
          transactionStatus: midtransResponse.transaction_status,
          fraudStatus: midtransResponse.fraud_status,
          actions: midtransResponse.actions || [],
          qrisUrl:
            midtransResponse.actions?.find(
              (a: any) => a.name === "generate-qr-code"
            )?.url || null,
        },
        message:
          "QRIS payment initiated. Please scan the QR to complete the payment.",
      });
    } 
    // 🔥 COD Payment
    else if (paymentMethod === "COD") {
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: "PROCESSING" },
        include: { 
          orderItems: {
            include: { product: true }
          }
        },
      });

      return NextResponse.json({
        success: true,
        id: updatedOrder.id,
        orderId: updatedOrder.id,
        paymentMethod: "COD",
        totalAmount: finalTotal,
        shippingCost: ONGKIR,
        orderItems: updatedOrder.orderItems,
        status: "PROCESSING",
        message: "Order placed successfully with Cash on Delivery",
      });
    }

    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error processing checkout:", error);

    if (error.message === "Database timeout") {
      return NextResponse.json(
        { error: "Database operation timed out. Please try again." },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}