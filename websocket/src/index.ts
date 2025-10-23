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
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// socket connection
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("joinUser", (userId: string) => {
    socket.join(userId);
    console.log(`👤 user joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

app.post("/notify/order", async (req: Request, res: Response) => {
  try {
    const { userId, notification } = req.body;
    console.log(`📦 Order notification sent to ${userId}`);

    io.to(userId).emit("notification:new", notification);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error sending order notification:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// midtrans webhook (tetap ada)
app.post("/notify", async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.body;
    await prisma.order.update({ where: { id: orderId }, data: { status } });
    io.emit("order:update", { orderId, status });
    console.log(`📦 Order ${orderId} updated → ${status}`);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Notify error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ new endpoint: admin reply notification
app.post("/notify/reply", async (req: Request, res: Response) => {
  try {
    const { userId, notification } = req.body;
    console.log(`📨 Sending notification to user ${userId}`);

    // kirim hanya ke user yang join room userId
    io.to(userId).emit("notification:new", notification);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error sending reply notification:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

httpServer.listen(4000, () => {
  console.log("⚡ Realtime server running on port 4000");
});
