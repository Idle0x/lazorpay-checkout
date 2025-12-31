"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Cpu, 
  Ticket, 
  X, 
  CheckCircle, 
  Loader2,
  Code2,
  Fingerprint,
  ArrowRight
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

// --- TYPES ---
type Product = {
  id: number;
  name: string;
  price: number;
  type: "hardware" | "digital" | "ticket";
  color: string;
  accent: string;
  icon: any;
  techSpec: string;
};

// --- DATA ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "NEURAL LINK",
    price: 0.5,
    type: "hardware",
    color: "bg-zinc-900 border-zinc-700 text-white", // Black Metal
    accent: "text-zinc-400",
    icon: Cpu,
    techSpec: "IOT_DEVICE_SIGNATURE"
  },
  {
    id: 2,
    name: "DEV CREDITS",
    price: 1.0,
    type: "digital",
    color: "bg-white border-white text-black", // Stark White
    accent: "text-black/50",
    icon: Zap,
    techSpec: "SPL_TOKEN_TRANSFER"
  },
  {
    id: 3,
    name: "VIP ACCESS",
    price: 2.5,
    type: "ticket",
    color: "bg-[#e5e5e5] border-dashed border-4 border-zinc-400 text-zinc-800", // Ticket Style
    accent: "text-zinc-500",
    icon: Ticket,
    techSpec: "COMPRESSED_NFT_MINT"
  }
];

export default function StorePage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { connect } = useWallet();
  const { isConnected, wallet } = useLazorContext();

  // --- ACTIONS ---
  const handlePurchase = async (product: Product) => {
    setProcessing(true);
    try {
      if (!isConnected) {
        await connect();
        await new Promise(r => setTimeout(r, 1000));
      }
      if (wallet) {
        await new Promise(r => setTimeout(r, 2000)); 
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const closeActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveId(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-y-auto overflow-x-hidden">
      
      {/* 1. HEADER */}
      <div className={`text-center space-y-4 mb-20 transition-all duration-500 ${activeId ? 'opacity-0 translate-y-[-50px] pointer-events-none' : 'opacity-100'}`}>
        <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold font-mono uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">HUB</Link> / STORE
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
          SELECT ARTIFACT
        </h1>
      </div>

      {/* 2. THE CARDS (Flex Layout = No Overlap) */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 perspective-[1000px]">
        
        {PRODUCTS.map((product) => {
          const isActive = activeId === product.id;
          // If a card is active, hide the others
          if (activeId !== null && !isActive) return null;

          return (
            <div
              key={product.id}
              onClick={() => !isActive && setActiveId(product.id)}
              className={`
                relative transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${isActive 
                  ? 'fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4' 
                  : 'w-full max-w-md h-[500px] cursor-pointer hover:scale-[1.02] hover:-translate-y-2'
                }
              `}
            >
              {/* THE CARD */}
              <div className={`
                ${isActive ? 'w-full max-w-3xl h-auto min-h-[600px]' : 'w-full h-full'}
                rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative shadow-2xl ${product.color}
                transition-all duration-700
              `}>
                
                {/* Close Button */}
                {isActive && (
                  <button 
                    onClick={closeActive}
                    className="absolute top-8 right-8 p-3 rounded-full bg-black/10 hover:bg-black/20 transition-colors z-50"
                  >
                    <X className="w-8 h-8" />
                  </button>
                )}

                {/* Top Section */}
                <div className="space-y-6 z-10">
                  <div className="flex justify-between items-start">
                    <product.icon className={`w-16 h-16 ${product.id === 2 ? 'text-black' : 'text-current'}`} />
                    {!isActive && <ArrowRight className="w-8 h-8 opacity-50" />}
                  </div>
                  
                  <div>
                    <h2 className={`text-5xl md:text-7xl font-black leading-none mb-4 ${product.id === 2 ? 'text-black' : 'text-current'}`}>
                      {product.name}
                    </h2>
                    {isActive && (
                      <p className={`text-xl md:text-2xl font-medium max-w-lg ${product.accent}`}>
                         Zero-latency settlement via LazorKit Session Keys. No popups.
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Section (Active Interface) */}
                {isActive ? (
                  <div className="space-y-8 z-10 animate-in fade-in slide-in-from-bottom duration-500 pt-12">
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                       <span className={`text-8xl font-black ${product.id === 2 ? 'text-black' : 'text-current'}`}>{product.price}</span>
                       <span className={`text-3xl font-bold ${product.accent}`}>SOL</span>
                    </div>

                    {/* Massive Button */}
                    <div className="relative">
                       <button
                         onClick={(e) => { e.stopPropagation(); handlePurchase(product); }}
                         disabled={processing || success}
                         className={`w-full py-8 rounded-3xl text-3xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95
                           ${success 
                             ? 'bg-emerald-500 text-white' 
                             : product.id === 1 ? 'bg-white text-black' : 'bg-black text-white'
                           }
                         `}
                       >
                         {processing ? (
                           <div className="flex items-center justify-center gap-4">
                              <Loader2 className="w-8 h-8 animate-spin" /> PROCESSING
                           </div>
                         ) : success ? (
                           <div className="flex items-center justify-center gap-4">
                             <CheckCircle className="w-10 h-10" /> PURCHASED
                           </div>
                         ) : (
                           <div className="flex items-center justify-center gap-4">
                             <Fingerprint className="w-10 h-10" />
                             {isConnected ? "CONFIRM PAY" : "CONNECT"}
                           </div>
                         )}
                       </button>
                    </div>

                    {/* Tech Spec Box */}
                    <div className="hidden md:block absolute right-12 bottom-12 text-right">
                        <div className="inline-block glass-strong p-6 rounded-2xl bg-black/5 border-l-4 border-emerald-500 backdrop-blur-md">
                           <div className="flex items-center justify-end gap-2 text-emerald-600 text-sm font-bold mb-2 uppercase tracking-wider">
                              LazorKit Logic <Code2 className="w-4 h-4" /> 
                           </div>
                           <pre className="text-xs font-mono text-zinc-500 text-right">
                              {`await signTransaction({
  keys: ["session_key"],
  autoApprove: true
});`}
                           </pre>
                        </div>
                    </div>

                  </div>
                ) : (
                  // Idle Footer
                  <div className={`text-sm font-mono tracking-widest opacity-50 ${product.id === 2 ? 'text-black' : 'text-current'}`}>
                    // {product.techSpec}
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
