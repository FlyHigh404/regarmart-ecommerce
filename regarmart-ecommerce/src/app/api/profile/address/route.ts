import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


// GET -> ambil semua alamat user
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const address = await prisma.address.findMany({
      where: { userId: session.user.id },
    });
    return NextResponse.json(address, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch address", error },
      { status: 500 }
    );
  }
}

// POST -> tambah alamat baru
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { label, fullAddress, recipientName, phoneNumber, note, isPrimary } = body;

  if (!recipientName || !phoneNumber || !fullAddress) {
    return NextResponse.json(
      { message: "Recipient name, phone number, and full address are required" },
      { status: 400 }
    );
  }

  try {
    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        fullAddress,
        recipientName,
        phoneNumber,
        note,
        isPrimary: isPrimary || false,
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add address", error },
      { status: 500 }
    );
  }
}



