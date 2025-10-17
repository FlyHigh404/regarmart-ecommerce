"use client";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function useOrderSocket(orderId: string | undefined, onUpdate: (status: string) => void) {
  useEffect(() => {
    if (!orderId) return;

    // connect ke websocket server
    socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket:", socket?.id);
    });

    socket.on("order:update", (data) => {
      if (data.orderId === orderId) {
        console.log("🟢 Update Order:", data);
        onUpdate(data.status);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from WebSocket");
    });

    // cleanup connection saat unmount
    return () => {
      socket?.disconnect();
    };
  }, [orderId, onUpdate]);
}
