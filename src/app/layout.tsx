import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sui dApp Workshop",
  description: "A modern Sui dApp built with Next.js and dApp Kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#030F1C] text-white min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
