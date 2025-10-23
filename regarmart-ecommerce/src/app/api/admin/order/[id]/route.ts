// api/admin/order/[id]/route.ts

import {NextResponse} from 'next/server';
import {prisma} from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    const { id } = params;

    try {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                orderItems: { include: { product: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
    }

}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { status } = await request.json();

  try {
    // update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true, // biar tahu userId pemilik order
      },
    });

    // buat pesan notifikasi dinamis
    let message = "";
    switch (status) {
      case "PROCESSING":
        message = `Pesanan kamu sedang diproses oleh admin.`;
        break;
      case "SHIPPED":
        message = `Pesanan kamu sudah dikirim, harap tunggu kurir mengantarkan.`;
        break;
      case "CANCELED":
        message = `Pesanan kamu dibatalkan. Hubungi admin jika ada kesalahan.`;
        break;
      default:
        message = `Status pesanan kamu diubah menjadi ${status}.`;
    }

    // simpan ke tabel Notification
    const notification = await prisma.notification.create({
      data: {
        userId: updatedOrder.user.id,
        message,
      },
    });

    // kirim event ke server websocket (kalau aktif)
    await fetch(`${process.env.WS_SERVER_URL}/notify/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: updatedOrder.user.id,
        notification,
      }),
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}