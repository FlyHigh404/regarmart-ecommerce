import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import midtransClient from "midtrans-client";




export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { order_id, transaction_status } = body;

    console.log("Midtrans Notification:", body.transaction_status); 

    // Update order sesuai status Midtrans
    if (transaction_status === "capture" || transaction_status === "settlement") {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: "PROCESSING" },
      });
    } else if (transaction_status === "cancel" || transaction_status === "deny" || transaction_status === "expire") {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: "CANCELED" },
      });
    } else if (transaction_status === "pending") {
      await prisma.order.update({
        where: { id: order_id },
        data: { status: "PENDING" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling notification:", error);
    return NextResponse.json({ error: "Failed to handle notification" }, { status: 500 });
  }
}
