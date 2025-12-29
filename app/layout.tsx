import type { Metadata } from "next";
import "./globals.css";
import { LazorProvider } from "@/components/Lazorkit/LazorProvider";
import { ConsoleProvider } from "@/components/ui/DevConsole"; // Import

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
                    <body className={`antialiased`}>
                            {/* Outer: Console (UI Layer) */}
                                    <ConsoleProvider>
                                              {/* Inner: Lazor (Auth Layer) */}
                                                        <LazorProvider>
                                                                    {children}
                                                                              </LazorProvider>
                                                                                      </ConsoleProvider>
                                                                                            </body>
                                                                                                </html>
                                                                                                  );
                                                                                                  }