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
    const { paymentMethod } = await req.json();

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // Tambahkan timeout untuk query
    const order = (await Promise.race([
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

    // Update order dengan payment method
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod: paymentMethod,
      },
    });

    if (paymentMethod === "QRIS") {
      const parameter = {
        payment_type: "qris",
        transaction_details: {
          order_id: order.id, // UUID dari Prisma, udah unik
          gross_amount: Number(order.totalAmount),
        },
        qris: { acquirer: "gopay" },
        customer_details: {
          first_name: order.user.name || "Customer",
          email: order.user.email || "customer@example.com",
          phone: order.user.phone || "0000000000",
        },
      };

      // ⚡ Core API -> charge()
      const midtransResponse = await new midtransClient.CoreApi({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY!,
        clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
      }).charge(parameter);

      return NextResponse.json({
        success: true,
        orderId: order.id,
        paymentMethod: "QRIS",
        totalAmount: Number(order.totalAmount),
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
      console.log(midtransResponse);
    } else if (paymentMethod === "COD") {
      // Untuk COD, update status
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PROCESSING" },
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
