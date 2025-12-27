import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Find the order first to get the associated courierId
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { courierId: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Transaction: Finish order and free courier
    await prisma.$transaction(async (tx) => {
      // 1. Update Order Status
      await tx.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });

      // 2. Update Courier Status back to AVAILABLE (if a courier was assigned)
      if (order.courierId) {
        await tx.courier.update({
          where: { id: order.courierId },
          data: { status: "AVAILABLE" },
        });
      }
    });

    return NextResponse.json({ message: "Order completed and courier is now available" });
  } catch (error) {
    console.error("Complete Order Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
