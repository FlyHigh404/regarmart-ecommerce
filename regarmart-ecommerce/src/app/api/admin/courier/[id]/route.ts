import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: Request, 
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params; // This 'id' will be 'C-001', etc.
  
      // Check if the courier is currently delivering an order before deleting
      const courier = await prisma.courier.findUnique({
        where: { id },
        include: { orders: { where: { status: 'SHIPPED' } } }
      });
  
      if (courier && courier.orders.length > 0) {
        return NextResponse.json(
          { error: "Tidak bisa menghapus kurir yang sedang dalam pengiriman!" }, 
          { status: 400 }
        );
      }
  
      await prisma.courier.delete({
        where: { id },
      });
  
      return NextResponse.json({ message: "Kurir berhasil dihapus" });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Gagal menghapus kurir" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { name, status } = await req.json();
  const courier = await prisma.courier.update({
    where: { id: params.id },
    data: { name, status }
  });
  return NextResponse.json(courier);
}
