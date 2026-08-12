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
  const title =
    cleanText(pick(config, "metaTitle", lang)) ||
    cleanText(pick(config, "siteTitle", lang));
  const description =
    cleanText(pick(config, "metaDescription", lang)) ||
    cleanText(pick(config, "siteTagline", lang));
  const logo = cleanText(config.siteLogo) || "/favicon.ico";

  return {
    metadataBase,
    ...(title ? { title, applicationName: title } : {}),
    ...(description ? { description } : {}),
    openGraph: {
      type: "website",
      ...(title ? { title, siteName: title } : {}),
      ...(description ? { description } : {}),
      locale: lang === "en" ? "en_US" : "ar_SA",
      images: [{ url: logo, alt: title || "Link preview" }],
    },
    twitter: {
      card: "summary",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
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
