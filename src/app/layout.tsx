import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "../../styles/globals.css";
import SolanaProvider from "./SolanaProvider";
import "@solana/wallet-adapter-react-ui/styles.css";

const inter = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "rhythmChain - music authenticity verification",
  description:
    "Verify if music is created by an original creator or AI-generated using blockchain technology",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}
