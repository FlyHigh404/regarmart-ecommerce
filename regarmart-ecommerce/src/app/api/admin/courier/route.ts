import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const couriers = await prisma.courier.findMany();
  return NextResponse.json(couriers);
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        // 1. Find the courier with the highest ID alphabetically/numerically
        const lastCourier = await prisma.courier.findFirst({
            orderBy: {
                id: 'desc',
            },
        });

        let nextNumber = 1;

        if (lastCourier) {
            // lastCourier.id is "C-003", we split at "-" and get "003"
            const lastIdParts = lastCourier.id.split("-");
            if (lastIdParts.length === 2) {
                const lastNum = parseInt(lastIdParts[1]);
                nextNumber = lastNum + 1;
            }
        }

        const formattedId = `C-${String(nextNumber).padStart(3, '0')}`;
        
        const courier = await prisma.courier.create({
          data: { 
            id: formattedId, 
            name, 
            status: "AVAILABLE" 
          }
        });

        return NextResponse.json(courier);
    } catch (error) {
        console.error("Create Courier Error:", error);
        return NextResponse.json({ error: "Gagal membuat kurir" }, { status: 500 });
    }
}

