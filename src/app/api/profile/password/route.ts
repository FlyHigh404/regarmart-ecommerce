import {NextResponse, NextRequest} from 'next/server';
import {getServerSession} from 'next-auth';
import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "CUSTOMER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { currentPassword, newPassword } = await req.json();
        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { password: true },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (!user.password) {
            // User registered via OAuth and does not have a password set
            if (!currentPassword) {
            // Allow setting password for the first time
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: session.user.id },
                data: { password: hashedPassword },
            });
            return NextResponse.json({ message: "Password set successfully" });
            } else {
            // User tries to provide currentPassword but doesn't have one
            return NextResponse.json({ error: "No existing password. Please leave current password empty to set a new one." }, { status: 400 });
            }
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });
        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }
}