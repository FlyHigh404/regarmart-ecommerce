import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getServerSession} from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {name, description, price, stock, categoryId, imageUrl} = await request.json();
    const newProduct = await prisma.product.create({
        data: {
            name,
            description,
            price,
            stock,
            categoryId,
            imageUrl,
        },
      include: {
        category: true,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}



