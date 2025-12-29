"use client";

import { ProductDisplay } from "@/components/ui/ProductDisplay";
import { CheckoutWidget } from "@/components/ui/CheckoutWidget";
import { useConsole } from "@/components/ui/DevConsole";
import { Terminal } from "lucide-react";

export default function Home() {
  const { toggle, isOpen } = useConsole();

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
              {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

                          {/* DEV MODE TOGGLE (Top Right) */}
                                <div className="absolute top-4 right-4 z-50">
                                        <button 
                                                    onClick={toggle}
                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
                                                                                isOpen 
                                                                                                ? "bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                                                                                                                : "bg-black/50 border-cyber-border text-cyber-muted hover:text-white"
                                                                                                                            }`}
                                                                                                                                    >
                                                                                                                                                <Terminal className="w-3 h-3" />
                                                                                                                                                            {isOpen ? "DEV_MODE: ACTIVE" : "DEV_MODE: OFF"}
                                                                                                                                                                    </button>
                                                                                                                                                                          </div>

                                                                                                                                                                                {/* Main Content */}
                                                                                                                                                                                      <div className={`w-full max-w-md space-y-6 z-10 transition-transform duration-500 ${isOpen ? "-translate-y-20" : ""}`}>
                                                                                                                                                                                              
                                                                                                                                                                                                      <div className="text-center space-y-2 mb-8">
                                                                                                                                                                                                                <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
                                                                                                                                                                                                                            LAZOR<span className="text-white">PAY</span>
                                                                                                                                                                                                                                      </h1>
                                                                                                                                                                                                                                                <p className="text-cyber-muted text-xs tracking-[0.3em] uppercase">
                                                                                                                                                                                                                                                            Secure • Invisible • Instant
                                                                                                                                                                                                                                                                      </p>
                                                                                                                                                                                                                                                                              </div>

                                                                                                                                                                                                                                                                                      <ProductDisplay />
                                                                                                                                                                                                                                                                                              <CheckoutWidget />

                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                        </main>
                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                          }