"use client";

import { ProductDisplay } from "@/components/ui/ProductDisplay";
import { CheckoutWidget } from "@/components/ui/CheckoutWidget";
import { useConsole } from "@/components/ui/DevConsole";
import { Terminal } from "lucide-react";

export default function Home() {
  const { toggle, isOpen } = useConsole();

  return (
    // CHANGE 1: min-h-screen with padding, allowing scroll (No overflow-hidden)
    <main className="min-h-screen flex flex-col items-center justify-start py-12 px-4 relative bg-black">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] fixed z-0" />

      {/* CHANGE 2: Header is static, not absolute, so it pushes content down */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6 mb-8">
        
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
            LAZOR<span className="text-white">PAY</span>
          </h1>
          <p className="text-cyber-muted text-xs tracking-[0.3em] uppercase">
            Secure • Invisible • Instant
          </p>
        </div>

        {/* Dev Toggle - Now part of the flow, not floating blindly */}
        <button 
            onClick={toggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono transition-all ${
                isOpen 
                ? "bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                : "bg-cyber-gray border-cyber-border text-cyber-muted hover:text-white"
            }`}
        >
            <Terminal className="w-3 h-3" />
            {isOpen ? "DEV_MODE: ACTIVE" : "ENABLE DEV_MODE"}
        </button>
      </div>

      {/* CHANGE 3: Spaced out container */}
      <div className="w-full max-w-md space-y-8 z-10 pb-20">
        <ProductDisplay />
        <CheckoutWidget />
      </div>
    </main>
  );
}
