import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chandan's Sweet Shop | Premium Confections",
  description: "Discover premium handcrafted sweets and chocolates. A modern e-commerce platform by Chandan.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}