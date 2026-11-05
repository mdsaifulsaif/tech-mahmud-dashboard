
"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  orderID: string;
  orderNumber: string;
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: {
    area: string;
    city: string;
    houseNo?: string;
    road?: string;
  };
  itemCount: number;
  paymentMethod: string;
  createdAt: string;
  read: boolean;
  timestamp: string;
  area?: string;
  customerName?: string;
  customerPhone?: string;
}

export const useSocket = () => {
  const { data: session, status } = useSession();

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const isInitialized = useRef(false);

  const addNotification = (data: any) => {
    const notificationArea = data.area || data.deliveryAddress?.area || "Unknown";

    const newNotification: Notification = {
      id: data.orderID || data.orderId || Date.now().toString(),
      orderID: data.orderID || data.orderId,
      orderNumber: data.orderNumber || `ORD-${Date.now()}`,
      totalAmount: data.totalAmount || data.amount || 0,
      deliveryFee: data.deliveryFee || data.deliveryCharge || 0,
      deliveryAddress: data.deliveryAddress || { area: "Unknown", city: "Unknown" },
      itemCount: data.itemCount || data.items || 0,
      paymentMethod: data.paymentMethod || "cod",
      createdAt: data.createdAt || new Date().toISOString(),
      read: false,
      timestamp: new Date().toISOString(),
      area: notificationArea,
      customerName: data.customerName || "Customer",
      customerPhone: data.customerPhone || "N/A",
    };

    setNotifications((prev) => {
      const exists = prev.some((n) => n.id === newNotification.id);
      if (exists) return prev;
      return [newNotification, ...prev];
    });
    setUnreadCount((prev) => prev + 1);

    toast.success(
      `🆕 New Order in ${notificationArea}! #${newNotification.orderNumber} - ${newNotification.totalAmount} TK`,
      { duration: 5000, position: "top-right" },
    );

    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(`🆕 New Order!`, {
        body: `Order #${newNotification.orderNumber} - ${newNotification.totalAmount} TK\n📍 Area: ${notificationArea}`,
        icon: "/admin-icon.png",
      });
    }

    try {
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (isInitialized.current) return;
    if (status === "loading") return;

    // ✅ শুধু admin role হলেই socket connect করি
    if (status !== "authenticated" || session?.user?.role !== "admin") {
      setIsLoading(false);
      return;
    }

    // ✅ Vercel বা অন্য পরিবেশে socket disable করা থাকলে connect করবে না
    if (process.env.NEXT_PUBLIC_USE_SOCKET === "false") {
      console.log("ℹ️ [Admin] Socket is disabled (NEXT_PUBLIC_USE_SOCKET === 'false')");
      setIsLoading(false);
      return;
    }

    const adminID = session.user.id;
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
      "http://localhost:5001";
    console.log("🔌 [Admin] Connecting to socket server:", socketUrl);

    const socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ [Admin] Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("admin-join", { adminID });
      console.log(`👨‍💼 Emitted admin-join with ID: ${adminID}`);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ [Admin] Socket disconnected:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.warn("⚠️ [Admin] Socket connect notice:", error?.message || error);
    });

    socket.on("admin-join-ack", (data: any) => {
      console.log("✅ [Admin] Join acknowledgment:", data);
    });

    // backend থেকে admin room এ broadcast হওয়া সব order notification
    socket.on("admin-new-order-notification", (data: any) => {
      console.log("👨‍💼 Admin new order notification:", data);
      addNotification(data);
    });

    setIsLoading(false);
    isInitialized.current = true;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      isInitialized.current = false;
    };
    // ✅ পুরো `session` object কে dependency তে দেওয়া হয়নি — token refresh হলে
    // NextAuth প্রতিবার নতুন session object বানায় (একই user হলেও), যেটা এই effect
    // কে বারবার re-run করাতো (disconnect + reconnect প্রতি token-expiry cycle এ)।
    // এখন শুধু id/role (primitive) বদলালেই reconnect হবে।
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id, (session?.user as any)?.role]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return {
    isConnected,
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
};