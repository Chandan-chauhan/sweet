import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="b507be27-f477-411c-bdef-cabef6f2c4c3"
        />
        {children}
      </body>
    </html>
  );
}