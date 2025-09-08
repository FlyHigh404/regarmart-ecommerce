// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { paymentMethod, customerInfo } = await req.json();

    // Validasi input
    if (!paymentMethod || !customerInfo) {
      return NextResponse.json(
        { error: "Payment method and customer info are required" },
        { status: 400 }
      );
    }

    // Ambil order PENDING
    const order = await prisma.order.findFirst({
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
    });

    if (!order || order.orderItems.length === 0) {
      return NextResponse.json(
        { error: "No pending order found" },
        { status: 404 }
      );
    }

    // Update order dengan payment method dan customer info
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: paymentMethod as any,
        status: "PROCESSING",
      },
    });

    if (paymentMethod === "QRIS") {
      // Generate Midtrans Snap transaction for QRIS
      const parameter = {
        transaction_details: {
          order_id: `ORDER-${order.id}-${Date.now()}`,
          gross_amount: Number(order.totalAmount),
        },
        payment_type: "qris",
        qris: { acquirer: "gopay" },
        customer_details: {
          first_name: customerInfo.firstName || order.user.name || "Customer",
          email: customerInfo.email || order.user.email,
          phone: customerInfo.phone || undefined,
        },
        item_details: order.orderItems.map((item: any) => ({
          id: item.product.id,
          price: Number(item.product.price),
          quantity: item.quantity,
          name: item.product.name,
        })),
      };

      // Create transaction with Midtrans
      const midtransResponse = await snap.createTransaction(parameter);

      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentMethod: "QRIS",
        totalAmount: Number(order.totalAmount),
        midtrans: {
          token: midtransResponse.token,
          redirect_url: midtransResponse.redirect_url,
        },
        message: "QRIS payment initiated. Please complete the payment.",
      });
    } else if (paymentMethod === "COD") {
      // Untuk COD, langsung update status ke SHIPPED
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "SHIPPED" },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentMethod: "COD",
        totalAmount: Number(order.totalAmount),
        message: "Order placed successfully with Cash on Delivery",
      });
    }

    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
