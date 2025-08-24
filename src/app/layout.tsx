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
  themeColor: "#030F1C",
};

export const metadata: Metadata = {
  title: "Sui dApp Workshop",
  description: "A modern Sui dApp built with Next.js and dApp Kit",
  keywords: ["Sui", "blockchain", "dApp", "voting", "NFT", "DeFi"],
  authors: [{ name: "Sui dApp Workshop" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
