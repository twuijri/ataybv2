import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { db } from "@/lib/db";
import { pick, readLangFromCookie } from "@/lib/i18n";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

const cleanText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getMetadataBase = async () => {
  const store = await headers();
  const host = store.get("x-forwarded-host") || store.get("host");
  if (!host) return undefined;

  const protocol =
    store.get("x-forwarded-proto") ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  try {
    return new URL(`${protocol}://${host}`);
  } catch {
    return undefined;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const config = db.getPublicConfig();
  const lang = await readLangFromCookie(cookies);
  const metadataBase = await getMetadataBase();
  const title = cleanText(pick(config, "siteTitle", lang)) || (lang === "en" ? "My Links" : "روابطي");
  const description =
    cleanText(pick(config, "siteTagline", lang)) ||
    (lang === "en" ? "Choose your preferred way to connect" : "اختر طريقتك المفضلة للتواصل");
  const logo = cleanText(config.siteLogo) || "/favicon.ico";

  return {
    metadataBase,
    title,
    description,
    applicationName: title,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: title,
      locale: lang === "en" ? "en_US" : "ar_SA",
      images: [{ url: logo, alt: title }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [logo],
    },
    icons: {
      icon: logo,
      apple: logo,
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
