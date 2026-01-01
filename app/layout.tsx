import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LazorProvider } from "@/components/Lazorkit/LazorProvider";
import { GlobalHeader } from "@/components/ui/GlobalHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LazorPay | Checkout Suite",
  description: "The Production Suite for Solana Passkey Payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* WRAP THE APP WITH REAL SDK LOGIC */}
        <LazorProvider>
          <GlobalHeader />
          <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
            {children}
          </main>
        </LazorProvider>
      </body>
    </html>
  );
}
