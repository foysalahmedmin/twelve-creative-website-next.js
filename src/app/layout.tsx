import { ScrollRestoration } from "@/components/common/scroll-restoration";
import { SmoothFollowerCursor } from "@/components/common/smooth-cursor";
import { WhatsAppFloat } from "@/components/common/whatsapp-float";
import { SITE } from "@/config/site";
import Providers from "@/providers";
import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.name,
  description: SITE.description,
  keywords: SITE.keywords,
  authors: [{ name: SITE.name, url: SITE.url }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${hindSiliguri.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <SmoothFollowerCursor />
        <WhatsAppFloat />
        <ScrollRestoration />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
