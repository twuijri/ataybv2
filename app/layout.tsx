import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "اطلب الحين",
  description: "اطلب من تطبيق التوصيل المفضل لديك",
};

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
