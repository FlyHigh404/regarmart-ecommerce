// src/app/api/cart/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json(order || { orderItems: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity, unitPrice } = await req.json();

    // cari order PENDING
    let order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
        status: "PENDING",
      },
    });

    if (!order) {
      order = await prisma.order.create({
        data: {
          userId: session.user.id,
          totalAmount: 0,
          status: "PENDING",
        },
      });
    }

    
    const existingItem = await prisma.orderItem.findFirst({
      where: {
        orderId: order.id,
        productId,
      },
    });

    if (existingItem) {
      // update quantity
      await prisma.orderItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId,
          quantity,
          unitPrice,
        },
      });
    }

    // update total amount
    const items = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });

    const total = items.reduce(
      (acc, item) => acc + Number(item.unitPrice) * item.quantity,
      0
    );

    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount: total },
    });

    return NextResponse.json({ message: "Added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}
