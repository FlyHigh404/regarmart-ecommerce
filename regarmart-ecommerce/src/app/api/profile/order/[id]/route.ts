import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { status } = await request.json();

    // Find the current state of the order
    const order = await prisma.order.findUnique({
      where: { id },
      select: { courierId: true, status: true }
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // --- CASE 1: COMPLETED or CANCELED ---
    // If the order is ending, we MUST check if a courier needs to be freed
    if (status === 'COMPLETED' || status === 'CANCELED') {
      
      // Safety check: Don't allow completion if it hasn't been shipped yet
      if (status === 'COMPLETED' && order.status !== 'SHIPPED') {
        return NextResponse.json({ error: "Hanya pesanan dikirim yang bisa diselesaikan" }, { status: 400 });
      }

      const result = await prisma.$transaction(async (tx) => {
        // 1. Update the Order
        const updated = await tx.order.update({
          where: { id },
          data: { status, updatedAt: new Date() },
          include: { orderItems: { include: { product: true } } }
        });

        // 2. Release Courier if one was assigned
        if (order.courierId) {
          await tx.courier.update({
            where: { id: order.courierId },
            data: { status: 'AVAILABLE' }
          });
        }
        return updated;
      });

      return NextResponse.json(result);
    }

    // --- CASE 2: Other Status Updates (e.g. PROCESSING) ---
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { orderItems: { include: { product: true } } }
    });

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "CUSTOMER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
