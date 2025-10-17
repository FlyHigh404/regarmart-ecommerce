import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, transaction_status } = body;

    console.log("📩 Midtrans Notification:", transaction_status);

    let newStatus = "PENDING";

    if (transaction_status === "capture" || transaction_status === "settlement") {
      newStatus = "PROCESSING";
      await prisma.order.update({
      where: { id: order_id },
      data: { status: "PROCESSING" },
    });
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      newStatus = "CANCELED";
      await prisma.order.update({
      where: { id: order_id },
      data: { status: "CANCELED" },
    });
    } else if (transaction_status === "pending") {
      newStatus = "PENDING";
      await prisma.order.update({
      where: { id: order_id },
      data: { status: "PENDING" },
    });
    }

    // ✅ Kirim event ke server websocket
    await fetch("http://localhost:4000/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order_id,
        status: newStatus,
      }),
    });

    console.log(`📡 Order ${order_id} → ${newStatus}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error handling notification:", error);
    return NextResponse.json({ error: "Failed to handle notification" }, { status: 500 });
  }
}
