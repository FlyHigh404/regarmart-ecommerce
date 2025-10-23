"use client";

import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:4000");

export default function useReplySocket(userId: string) {
  useEffect(() => {
    if (!userId) return;

    socket.emit("joinUser", userId);

    socket.on("notification:new", (notif) => {
      alert(`🔔 New notification: ${notif.message}`);
    });

    return () => {
      socket.off("notification:new");
    };
  }, [userId]);
}
