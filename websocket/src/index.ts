import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import prisma from "./lib/prismaClient";


const app = express();
app.use(cors());
app.use(bodyParser.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // bisa ganti ke domain Next.js lo
    methods: ["GET", "POST"]
  }
});

// ✅ Socket Connection
io.on("connection", async (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ Endpoint webhook Midtrans
app.post("/notify", async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.body;

    // Update DB order
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Emit ke semua client real-time
    io.emit("order:update", { orderId, status });

    console.log(`📡 Order ${orderId} updated → ${status}`);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Notify error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

httpServer.listen(4000, () => {
  console.log("⚡ Realtime server running on port 4000");
});
