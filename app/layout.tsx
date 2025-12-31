import type { Metadata } from "next";
import "./globals.css";
import { LazorProvider } from "@/components/Lazorkit/LazorProvider";
import { ConsoleProvider } from "@/components/ui/DevConsole";
import { GlobalHeader } from "@/components/ui/GlobalHeader";

export const metadata: Metadata = {
  title: "LazorPay Hub",
  description: "The Ultimate Checkout Suite for Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black min-h-screen text-white selection:bg-neon-green/30">
        <ConsoleProvider>
          <LazorProvider>
            {/* The Shell */}
            <div className="relative min-h-screen flex flex-col">
              <GlobalHeader />
              
              {/* Main Content Area (Padded for Header) */}
              <main className="flex-1 pt-20 px-4 pb-12 w-full max-w-6xl mx-auto">
                {children}
              </main>

              {/* Background Grid */}
              <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-50 pointer-events-none" />
            </div>
          </LazorProvider>
        </ConsoleProvider>
      </body>
    </html>
  );
}
