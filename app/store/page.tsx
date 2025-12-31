"use client";

import React from "react";
import { CheckoutWidget } from "@/components/ui/CheckoutWidget";
import { Package, Star, ShieldCheck, Zap } from "lucide-react";

export default function StorePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* LEFT: Product Visuals */}
      <div className="space-y-6">
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-cyber-gray group">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-blue/5 group-hover:opacity-75 transition-opacity" />
          
          {/* Product Icon / Image Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-32 h-32 text-neon-green drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>

          {/* Floating Badge */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur border border-neon-green/30 px-3 py-1 rounded-full text-xs font-mono text-neon-green flex items-center gap-1">
            <Star className="w-3 h-3 fill-neon-green" />
            BESTSELLER
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Neural Link v2.0</h1>
          <div className="flex items-center gap-4 text-sm text-cyber-muted">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Lifetime Warranty</span>
            <span className="flex items-center gap-1"><Package className="w-4 h-4" /> Instant Delivery</span>
          </div>
          <p className="text-cyber-muted leading-relaxed">
            The next generation of brain-computer interfaces. Experience zero-latency thought transmission. 
            Now compatible with Solana Pay for instant, gasless settlement.
          </p>
        </div>
      </div>

      {/* RIGHT: The Checkout Logic */}
      <div className="sticky top-24">
        <CheckoutWidget />
      </div>
    </div>
  );
}
