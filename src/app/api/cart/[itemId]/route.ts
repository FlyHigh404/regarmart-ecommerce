import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.orderItem.delete({
      where: { id: params.itemId },
    });
    return NextResponse.json({ message: "Item removed" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quantity } = await req.json(); // Get quantity from the request body

    if (quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
    }

    // Update the cart item quantity
    const updatedItem = await prisma.orderItem.update({
      where: { id: params.itemId },
      data: { quantity },
    });

    return NextResponse.json({ message: "Item updated", item: updatedItem });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}