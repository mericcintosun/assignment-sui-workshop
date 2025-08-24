import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4DA2FF",
};

export const metadata: Metadata = {
  title: "nexuSUI - Next-Gen Blockchain Platform",
  description:
    "A comprehensive ecosystem of innovative dApps built on the Sui blockchain, connecting the future of decentralized applications.",
  keywords: [
    "nexuSUI",
    "Sui",
    "blockchain",
    "dApp",
    "voting",
    "NFT",
    "DeFi",
    "Web3",
    "2025",
  ],
  authors: [{ name: "nexuSUI Team" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/logo-bg-remove.png",
  },
  openGraph: {
    title: "nexuSUI - Next-Gen Blockchain Platform",
    description:
      "A comprehensive ecosystem of innovative dApps built on the Sui blockchain, connecting the future of decentralized applications.",
    url: "https://nexusui.vercel.app",
    siteName: "nexuSUI",
    images: [
      {
        url: "/logo-bg-remove.png",
        width: 1200,
        height: 630,
        alt: "nexuSUI - Next-Gen Blockchain Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nexuSUI - Next-Gen Blockchain Platform",
    description:
      "A comprehensive ecosystem of innovative dApps built on the Sui blockchain, connecting the future of decentralized applications.",
    images: ["/logo-bg-remove.png"],
    creator: "@nexusui",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/logo-bg-remove.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4DA2FF" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
