import type React from "react";
import "../../styles/globals.css";
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";

const inter = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "rhythmChain - music authenticity verification",
  description:
    "verify if music is created by an original creator or ai-generated using blockchain technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
