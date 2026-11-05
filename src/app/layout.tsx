import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/redux";

export const metadata: Metadata = {
  title: "Tech Mahmud | Gadget & Clothing Admin",
  description:
    "Official Admin Dashboard for Tech Mahmud - Manage Gadgets, Apparel, Orders, Courier Tracking, and Marketing.",
  keywords: "tech mahmud, gadget, clothing, fashion, ecommerce admin, bangladesh",
};

import { Toaster } from "react-hot-toast";
import AuthSessionProvider from "@/components/providers/AuthSessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthSessionProvider>
          <ReduxProvider>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </ReduxProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
