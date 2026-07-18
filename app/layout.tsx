import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
// @ts-ignore -- ملف JS بدون تعريفات أنواع
import { db } from "@/lib/db";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = db.getPublicConfig();
  return {
    title: config.siteTitle || "اطلب الحين",
    description: config.siteTagline || "اطلب من تطبيق التوصيل المفضل لديك",
    icons: {
      icon: config.siteLogo || "/favicon.ico",
      apple: config.siteLogo || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
