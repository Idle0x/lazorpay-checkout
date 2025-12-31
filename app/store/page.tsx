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
  ArrowRight,
  Box
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

// --- TYPES ---
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  color: string; // The fill color class
  textColor: string;
  accentColor: string;
  icon: any;
};

// --- DATA ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "NEURAL LINK",
    category: "HARDWARE",
    price: 0.5,
    // Gunmetal Metallic Fill
    color: "bg-gradient-to-br from-zinc-700 to-zinc-900 border-zinc-600", 
    textColor: "text-white",
    accentColor: "text-zinc-400",
    icon: Cpu
  },
  {
    id: 2,
    name: "DEV CREDITS",
    category: "DIGITAL ASSET",
    price: 1.0,
    // Vibrant Digital Fill
    color: "bg-gradient-to-br from-blue-600 to-violet-600 border-blue-400", 
    textColor: "text-white",
    accentColor: "text-blue-200",
    icon: Zap
  },
  {
    id: 3,
    name: "VIP ACCESS",
    category: "EVENT TICKET",
    price: 2.5,
    // Bone White Fill
    color: "bg-[#e5e5e5] border-zinc-400", 
    textColor: "text-zinc-900",
    accentColor: "text-zinc-500",
    icon: Ticket
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
    <div className="min-h-screen py-20 px-4 relative overflow-y-auto overflow-x-hidden flex flex-col items-center">
      
      {/* 1. HEADER */}
      <div className={`text-center space-y-4 mb-16 transition-all duration-500 ${activeId ? 'opacity-0 translate-y-[-50px] pointer-events-none' : 'opacity-100'}`}>
        <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold font-mono uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">HUB</Link> / STORE
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
          SELECT ARTIFACT
        </h1>
      </div>

      {/* 2. THE CARDS */}
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-8 perspective-[1000px]">
        
        {PRODUCTS.map((product) => {
          const isActive = activeId === product.id;
          if (activeId !== null && !isActive) return null;

          return (
            <div
              key={product.id}
              onClick={() => !isActive && setActiveId(product.id)}
              className={`
                relative transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${isActive 
                  ? 'fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4' 
                  : 'w-72 h-96 cursor-pointer hover:scale-[1.05] hover:-translate-y-4' // 20% Smaller & Slimmer
                }
              `}
            >
              {/* THE CARD */}
              <div className={`
                ${isActive ? 'w-full max-w-2xl h-auto min-h-[600px] text-left p-10' : 'w-full h-full flex flex-col items-center justify-center text-center p-6'}
                rounded-[2rem] overflow-hidden relative shadow-2xl ${product.color} border
                transition-all duration-700
              `}>
                
                {/* Close Button */}
                {isActive && (
                  <button 
                    onClick={closeActive}
                    className="absolute top-8 right-8 p-3 rounded-full bg-black/10 hover:bg-black/20 transition-colors z-50"
                  >
                    <X className={`w-8 h-8 ${product.textColor}`} />
                  </button>
                )}

                {/* IDLE STATE CONTENT (Centered & Compact) */}
                {!isActive && (
                  <div className="space-y-6">
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-black/10`}>
                       <product.icon className={`w-10 h-10 ${product.textColor}`} />
                    </div>
                    
                    <div>
                      <h2 className={`text-3xl font-black leading-tight mb-2 ${product.textColor}`}>
                        {product.name}
                      </h2>
                      <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-black/10 ${product.textColor}`}>
                        {product.category}
                      </div>
                    </div>
                    
                    <div className={`opacity-60 text-sm font-medium ${product.textColor}`}>
                       Tap to Expand
                    </div>
                  </div>
                )}

                {/* ACTIVE STATE CONTENT (Expanded & Detailed) */}
                {isActive && (
                  <div className="space-y-8 z-10 h-full flex flex-col justify-between">
                    
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-3 mb-4 opacity-50">
                        <product.icon className={`w-6 h-6 ${product.textColor}`} />
                        <span className={`text-sm font-bold tracking-widest uppercase ${product.textColor}`}>{product.category}</span>
                      </div>
                      <h2 className={`text-6xl md:text-7xl font-black leading-none mb-4 ${product.textColor}`}>
                        {product.name}
                      </h2>
                      <p className={`text-xl font-medium max-w-lg ${product.textColor} opacity-80`}>
                         Zero-latency settlement via LazorKit Session Keys. No popups.
                      </p>
                    </div>

                    {/* Active Footer */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-3">
                         <span className={`text-8xl font-black ${product.textColor}`}>{product.price}</span>
                         <span className={`text-3xl font-bold opacity-60 ${product.textColor}`}>SOL</span>
                      </div>

                      {/* Massive Button */}
                      <button
                         onClick={(e) => { e.stopPropagation(); handlePurchase(product); }}
                         disabled={processing || success}
                         className={`w-full py-8 rounded-3xl text-3xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl
                           ${success 
                             ? 'bg-emerald-500 text-white border-none' 
                             : 'bg-black text-white border-2 border-white/10'
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

                    {/* Tech Spec Box (Float) */}
                    <div className="hidden md:block absolute right-12 bottom-40 text-right pointer-events-none">
                        <div className="inline-block glass-strong p-6 rounded-2xl bg-black/20 border-l-4 border-emerald-500 backdrop-blur-md">
                           <div className="flex items-center justify-end gap-2 text-emerald-400 text-sm font-bold mb-2 uppercase tracking-wider">
                              LazorKit Logic <Code2 className="w-4 h-4" /> 
                           </div>
                           <pre className="text-xs font-mono text-white/80 text-right">
                              {`// Session Key Sign
await signTransaction({
  keys: ["session_key"],
  autoApprove: true
});`}
                           </pre>
                        </div>
                    </div>

                  </div>
                )}
                
                {/* Ticket Effect (Only on Card 3) */}
                {product.id === 3 && (
                   <>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#050505] rounded-r-full" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#050505] rounded-l-full" />
                   </>
                )}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
