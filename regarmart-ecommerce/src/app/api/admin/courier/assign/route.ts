import {NextResponse, NextRequest} from 'next/server';
import {getServerSession} from 'next-auth';
import {prisma} from '@/lib/prisma';
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { orderId, courierId } = await req.json();

    if (!orderId || !courierId) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Use a transaction to ensure both updates succeed or both fail
    const result = await prisma.$transaction([
      // 1. Update the Order
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: "SHIPPED",
          courierId: courierId,
        },
      }),
      // 2. Update the Courier status
      prisma.courier.update({
        where: { id: courierId },
        data: {
          status: "ON_DELIVERY",
        },
      }),
    ]);

    return NextResponse.json({ message: "Courier assigned successfully", result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
