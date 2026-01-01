import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LazorProvider } from "@/components/Lazorkit/LazorProvider";
import { ConsoleProvider } from "@/components/ui/DevConsole"; 
import { GlobalHeader } from "@/components/ui/GlobalHeader"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LazorPay Checkout",
  description: "The Invisible Wallet Experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 1. Outer Layer: Developer Console (X-Ray) */}
        <ConsoleProvider>
          
          {/* 2. Inner Layer: Auth & Logic */}
          <LazorProvider>
            
            {/* 3. Navigation Header */}
            <GlobalHeader />
            
            {/* 4. Main Content */}
            <main className="min-h-screen bg-black text-white selection:bg-neon-green selection:text-black">
               {children}
            </main>
            
          </LazorProvider>
        </ConsoleProvider>
      </body>
    </html>
  );
}
