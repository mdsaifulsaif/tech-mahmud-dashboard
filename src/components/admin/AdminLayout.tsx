"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiShoppingCart,
  FiPackage,
  FiSettings,
  FiBarChart2,
  FiTag,
  FiGrid,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiChevronDown,
  FiDroplet,
  FiCreditCard,
  FiTruck,
  FiStar,
  FiImage,
  FiGlobe,
  FiActivity,
  FiMapPin,
  FiLayers,
  FiAward,
  FiBox,
  FiAlertCircle,
  FiMail,
  FiRepeat,
  FiTarget,
  FiMessageSquare,
  FiLayout,
} from "react-icons/fi";
import { useSocket } from "@/lib/socket";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: "Dashboard", href: "/dashboard/admin", icon: FiHome, badge: null as string | null },
  {
    name: "Products",
    href: "/dashboard/admin/products",
    icon: FiShoppingBag,
    badge: null as string | null,
    submenu: [
      { name: "All Products", href: "/dashboard/admin/products" },
      { name: "Add Product", href: "/dashboard/admin/products/new" },
    ],
  },
  {
    name: "Categories",
    href: "/dashboard/admin/categories",
    icon: FiLayers,
    badge: null as string | null,
    submenu: [
      { name: "All Categories", href: "/dashboard/admin/categories" },
      { name: "Create Category", href: "/dashboard/admin/categories/new" },
    ],
  },
  {
    name: "Brands",
    href: "/dashboard/admin/brands",
    icon: FiAward,
    badge: null as string | null,
    submenu: [
      { name: "All Brands", href: "/dashboard/admin/brands" },
      { name: "Create Brand", href: "/dashboard/admin/brands/new" },
    ],
  },
  { name: "Orders & Shipping", href: "/dashboard/admin/orders", icon: FiShoppingCart, badge: null as string | null, badgeColor: "bg-blue-600" },
  { name: "Customers", href: "/dashboard/admin/customers", icon: FiUsers, badge: null as string | null },
  { name: "Subscribers", href: "/dashboard/admin/subscribers", icon: FiMail, badge: null as string | null },
  { name: "Payments", href: "/dashboard/admin/payments", icon: FiCreditCard, badge: null as string | null },
  { name: "Shipping Rates", href: "/dashboard/admin/shipping", icon: FiPackage, badge: null as string | null },
  { name: "Reviews", href: "/dashboard/admin/reviews", icon: FiStar, badge: "5", badgeColor: "bg-yellow-500" },
  { name: "Coupons", href: "/dashboard/admin/coupons", icon: FiTag, badge: null as string | null },
  { name: "Hero Banners", href: "/dashboard/admin/banners", icon: FiImage, badge: null as string | null },
  {
    name: "Promotional Banners",
    href: "/dashboard/admin/promotional",
    icon: FiLayout,
    badge: null as string | null,
    submenu: [
      { name: "Promo Banners (4 Slots)", href: "/dashboard/admin/promotional/3-slots" },
      { name: "Dual Banners (2 Slots)", href: "/dashboard/admin/promotional/2-slots" },
      { name: "Bottom Promo Grid (2 Rows / 6 Slots)", href: "/dashboard/admin/promotional/bottom-promos" },
    ],
  },
  { name: "Marketing & Pixels", href: "/dashboard/admin/marketing", icon: FiTarget, badge: "CAPI", badgeColor: "bg-purple-600" },
  { name: "Live Chat", href: "/dashboard/admin/chat", icon: FiMessageSquare, badge: "Live" as string | null, badgeColor: "bg-emerald-600" },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: FiBarChart2, badge: null as string | null },
  { name: "Complaints", href: "/dashboard/admin/complaints", icon: FiAlertCircle, badge: null as string | null },
  { name: "System Health", href: "/dashboard/admin/health", icon: FiActivity, badge: null as string | null },
];

const settingsItems = [
  { name: "General", href: "/dashboard/admin/settings", icon: FiSettings },
  { name: "Marketing & Tracking", href: "/dashboard/admin/marketing", icon: FiTarget },
  { name: "Site Content", href: "/dashboard/admin/content", icon: FiFileText },
  { name: "Media", href: "/dashboard/admin/media", icon: FiImage },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const notificationRef = useRef<HTMLDivElement>(null);

  // ✅ Socket notification hook
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setMobileMenuOpen(false);
      const activeParent = menuItems.find(
        (item) =>
          "submenu" in item &&
          (item as any).submenu?.some((sub: any) =>
            sub.href === "/dashboard/admin/promotional/3-slots"
              ? pathname === sub.href || pathname === "/dashboard/admin/promotional"
              : pathname === sub.href || pathname.startsWith(sub.href + "/")
          )
      );
      if (activeParent) {
        setExpandedMenu(activeParent.name);
      }
    }
  }, [pathname, isMounted]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    router.push(`/dashboard/admin/orders/${notification.orderID}`);
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "Just now";
    }
  };

  // const handleLogout = async () => {
  //   await signOut({ redirect: false });
  //   router.push("/login");
  // };

const handleLogout = async () => {
  try {
    await signOut({
      redirect: false,
      callbackUrl: "/login",
    });

    router.replace("/login");
    router.refresh();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  const isActive = (href: string) => {
    if (href === "/dashboard/admin") return pathname === href;
    return pathname.startsWith(href);
  };

  // মাউন্ট না হওয়া পর্যন্ত কিছু রেন্ডার করবেন না (hydration-safe)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-[#1E293B] text-white transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-72" : "w-20"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700/50">
          {sidebarOpen && (
            <Link href="/dashboard/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/20">
                TM
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white">Tech Mahmud</span>
                <p className="text-[11px] font-medium text-blue-400">Gadget & Clothing</p>
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            <FiMenu size={20} />
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-md"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-10rem)] sidebar-scrollbar">
          {sidebarOpen && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Main Menu</p>
          )}

          {menuItems.map((item) => {
            const active = isActive(item.href);
            const hasSubmenu = "submenu" in item && (item as any).submenu?.length > 0;
            const isExpanded = expandedMenu === item.name;

            return (
              <div key={item.name}>
                <Link
                  href={hasSubmenu ? "#" : item.href}
                  onClick={(e) => {
                    if (hasSubmenu) {
                      e.preventDefault();
                      setExpandedMenu(isExpanded ? null : item.name);
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 ${
                    active ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25" : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  </div>
                  {sidebarOpen && (
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                            (item as any).badgeColor || "bg-gray-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {hasSubmenu && (
                        <FiChevronDown
                          size={16}
                          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      )}
                    </div>
                  )}
                </Link>

                {hasSubmenu && isExpanded && sidebarOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1">
                    {(item as any).submenu.map((sub: any) => {
                      const isSubActive =
                        pathname === sub.href ||
                        (sub.href === "/dashboard/admin/promotional/3-slots" && pathname === "/dashboard/admin/promotional");
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                            isSubActive
                              ? "text-[#2563EB] bg-[#2563EB]/10 font-semibold"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {sidebarOpen && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mt-8 mb-3">Settings</p>
          )}

          {settingsItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                  active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-[#1E293B]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "lg:ml-20"}`}>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
              <FiMenu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-600 transition-colors"
            >
              <FiGlobe size={16} />
              Visit Store
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FiBell size={22} className="text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#2563EB]/5 to-[#1D4ED8]/5">
                    <div>
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <p className="text-xs text-gray-500">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                      </p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-[400px]">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <FiBell size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">No notifications yet</p>
                        <p className="text-xs text-gray-400">New orders will appear here</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                            !notification.read ? "bg-[#2563EB]/5 border-l-4 border-l-[#2563EB]" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                notification.paymentMethod === "cod" ? "bg-green-100" : "bg-blue-100"
                              }`}
                            >
                              <FiPackage
                                className={notification.paymentMethod === "cod" ? "text-green-600" : "text-blue-600"}
                                size={18}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-800">
                                  New Order
                                  <span className="ml-1 text-xs font-normal text-gray-500">
                                    #{notification.orderNumber}
                                  </span>
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                                )}
                              </div>
                              <div className="mt-1 space-y-1">
                                <p className="text-xs text-gray-600">
                                  <span className="font-medium text-blue-600">৳{notification.totalAmount}</span>
                                  {" • "}
                                  {notification.itemCount} item{notification.itemCount > 1 ? "s" : ""}
                                  {" • "}
                                  <span className="capitalize">{notification.paymentMethod}</span>
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <FiMapPin size={12} className="text-blue-500" />
                                  <span className="font-medium text-blue-600">
                                    {notification.area || notification.deliveryAddress?.area || "N/A"}
                                  </span>
                                </p>
                              </div>
                              <p className="text-xs text-gray-400 mt-1.5">{formatTime(notification.timestamp)}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <Link
                        href="/dashboard/admin/orders"
                        className="block text-center text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all orders →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2 transition-colors">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-bold shadow-md">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <FiChevronDown className="hidden sm:block text-gray-400" />
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;