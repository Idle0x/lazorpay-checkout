"use client";

import React from "react";
import Link from "next/link";
import { CheckoutWidget } from "@/components/ui/CheckoutWidget"; // The engine we built
import { Package, Star, ShieldCheck, Zap, ArrowLeft, BrainCircuit } from "lucide-react";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col relative overflow-hidden">
      
      {/* 1. Background Grid (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* 2. Navigation / Back Button */}
      <div className="relative z-10 mb-12">
        <Link href="/" className="group inline-flex items-center gap-2 text-cyber-muted hover:text-white transition-colors">
            <div className="p-2 rounded-full border border-cyber-border group-hover:border-neon-red/50 transition-colors bg-black">
                <ArrowLeft className="w-5 h-5 text-neon-red" />
            </div>
            <span className="text-sm font-bold font-mono uppercase tracking-widest group-hover:text-neon-red transition-colors">
                Back to Hub
            </span>
        </Link>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* LEFT COLUMN: The Product Visuals */}
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
            
            {/* The Image Container */}
            <div className="relative aspect-square w-full max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden border border-cyber-border bg-cyber-gray/30 group">
                {/* Dynamic Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 via-transparent to-neon-blue/10 group-hover:opacity-100 opacity-50 transition-opacity duration-700" />
                
                {/* The Product Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-neon-green/20 blur-3xl rounded-full" />
                        <BrainCircuit className="relative w-40 h-40 text-neon-green drop-shadow-[0_0_30px_rgba(16,185,129,0.6)]" />
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="bg-black/80 backdrop-blur border border-neon-green/30 px-4 py-2 rounded-full text-xs font-mono text-neon-green flex items-center gap-2 shadow-lg">
                        <Star className="w-3 h-3 fill-neon-green" />
                        <span>BESTSELLER</span>
                    </div>
                    <div className="bg-black/80 backdrop-blur border border-cyber-border px-4 py-2 rounded-full text-xs font-mono text-white flex items-center gap-2 shadow-lg">
                        <Zap className="w-3 h-3 text-neon-yellow" />
                        <span>INSTANT DELIVERY</span>
                    </div>
                </div>
            </div>

            {/* Text Details */}
            <div className="space-y-6 max-w-md mx-auto lg:mx-0">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2">
                        NEURAL LINK <span className="text-cyber-muted text-2xl font-normal">v2.0</span>
                    </h1>
                    <p className="text-cyber-muted text-sm font-mono tracking-widest uppercase">
                        Solana-Native Hardware Interface
                    </p>
                </div>

                <p className="text-gray-400 leading-relaxed text-lg">
                    Direct cortex interface allowing zero-latency thought transmission. 
                    Now compatible with LazorKit Paymaster for instant, gasless settlement on the Solana network.
                </p>

                <div className="flex gap-6 py-6 border-t border-cyber-border/30">
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-cyber-muted">Compatibility</span>
                        <div className="flex items-center gap-2 text-white font-bold">
                            <ShieldCheck className="w-4 h-4 text-neon-blue" />
                            Bio-Auth Ready
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-cyber-muted">Network</span>
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Package className="w-4 h-4 text-neon-purple" />
                            Solana Devnet
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: The Checkout Logic */}
        <div className="lg:sticky lg:top-24 animate-in slide-in-from-right duration-700 delay-200">
            {/* This is the Widget we built in the previous step.
               It handles the connection, the X-Ray logs, and the transaction.
            */}
            <CheckoutWidget />
            
            {/* Developer Note */}
            <div className="mt-6 text-center">
                <p className="text-[10px] text-cyber-muted font-mono">
                    POWERED BY LAZORKIT SDK V2 • SECURE ENCLAVE
                </p>
            </div>
        </div>

      </div>
    </div>
  );
}
