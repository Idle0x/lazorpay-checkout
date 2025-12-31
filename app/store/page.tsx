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
  Fingerprint
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
  icon: any;
  techSpec: string;
};

// --- DATA ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "NEURAL LINK V2",
    price: 0.5,
    type: "hardware",
    color: "bg-zinc-900 border-zinc-700 text-white", // The Black Card
    icon: Cpu,
    techSpec: "IOT_DEVICE_SIGNATURE"
  },
  {
    id: 2,
    name: "DEV CREDITS",
    price: 1.0,
    type: "digital",
    color: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white", // The Neon Card
    icon: Zap,
    techSpec: "SPL_TOKEN_TRANSFER"
  },
  {
    id: 3,
    name: "BREAKPOINT VIP",
    price: 2.5,
    type: "ticket",
    color: "bg-[#e5e5e5] text-black border-dashed border-4 border-zinc-400", // The Ticket
    icon: Ticket,
    techSpec: "COMPRESSED_NFT_MINT"
  }
];

export default function StorePage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { connect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet } = useLazorContext();

  // --- ACTIONS ---
  const handlePurchase = async (product: Product) => {
    setProcessing(true);
    try {
      if (!isConnected) {
        await connect();
        // Visual delay for effect
        await new Promise(r => setTimeout(r, 1000));
      }
      
      // Simulate Transaction
      if (wallet) {
         const ix = SystemProgram.transfer({
            fromPubkey: new PublicKey(wallet.smartWallet),
            toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
            lamports: Math.floor(product.price * LAMPORTS_PER_SOL),
        });
        
        // In a real app, we would send this. 
        // For the showcase, we simulate the "Signature" delay.
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
    <div className="min-h-screen py-12 px-4 relative overflow-hidden flex flex-col items-center justify-center">
      
      {/* 1. HEADER (Fades out when active) */}
      <div className={`text-center space-y-4 mb-12 transition-opacity duration-500 ${activeId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="inline-flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">HUB</Link> / STORE
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
          ARTIFACTS
        </h1>
      </div>

      {/* 2. THE STAGE (Container for cards) */}
      <div className="relative w-full max-w-6xl h-[60vh] flex items-center justify-center perspective-[1000px]">
        
        {PRODUCTS.map((product) => {
          const isActive = activeId === product.id;
          const isBlurred = activeId !== null && !isActive;

          return (
            <div
              key={product.id}
              onClick={() => setActiveId(product.id)}
              className={`
                absolute transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${isActive 
                  ? 'z-50 w-[90vw] md:w-[600px] h-[70vh] cursor-default rotate-0' 
                  : `w-64 h-96 cursor-pointer hover:scale-105 hover:-translate-y-4 ${isBlurred ? 'opacity-0 scale-50 blur-xl pointer-events-none' : 'opacity-100'}`
                }
                ${product.id === 1 && !isActive ? '-translate-x-64 rotate-y-12' : ''}
                ${product.id === 2 && !isActive ? 'z-10 translate-z-10' : ''}
                ${product.id === 3 && !isActive ? 'translate-x-64 -rotate-y-12' : ''}
              `}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* THE CARD ITSELF */}
              <div className={`w-full h-full rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative shadow-2xl ${product.color}`}>
                
                {/* Close Button (Only visible when active) */}
                {isActive && (
                  <button 
                    onClick={closeActive}
                    className="absolute top-6 right-6 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors z-20"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}

                {/* Card Top: Icon & Title */}
                <div className="space-y-4 z-10">
                  <product.icon className={`w-12 h-12 ${product.id === 3 ? 'text-black' : 'text-white'}`} />
                  <h2 className={`text-4xl font-black leading-none ${product.id === 3 ? 'text-black' : 'text-white'}`}>
                    {product.name}
                  </h2>
                  {isActive && (
                    <p className={`text-lg font-medium ${product.id === 3 ? 'text-black/60' : 'text-white/60'}`}>
                       Experience the future of commerce. Zero latency settlement via LazorKit.
                    </p>
                  )}
                </div>

                {/* Card Center: Tech Spec (Only idle) */}
                {!isActive && (
                  <div className={`text-xs font-mono tracking-widest opacity-50 absolute bottom-8 left-8`}>
                    // {product.techSpec}
                  </div>
                )}

                {/* Card Bottom: Active Interface */}
                {isActive && (
                  <div className="space-y-6 z-10 animate-in fade-in slide-in-from-bottom duration-500">
                    
                    {/* Price Display */}
                    <div className="flex items-baseline gap-2">
                       <span className={`text-6xl font-black ${product.id === 3 ? 'text-black' : 'text-white'}`}>{product.price}</span>
                       <span className={`text-xl font-bold ${product.id === 3 ? 'text-black/50' : 'text-white/50'}`}>SOL</span>
                    </div>

                    {/* Massive Action Button */}
                    <div className="relative group">
                       <button
                         onClick={(e) => { e.stopPropagation(); handlePurchase(product); }}
                         disabled={processing || success}
                         className={`w-full py-6 rounded-2xl text-2xl font-black uppercase tracking-widest transition-all
                           ${success 
                             ? 'bg-emerald-500 text-white' 
                             : product.id === 3 ? 'bg-black text-white hover:scale-105' : 'bg-white text-black hover:scale-105'
                           }
                         `}
                       >
                         {processing ? (
                           <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                         ) : success ? (
                           <div className="flex items-center justify-center gap-2">
                             <CheckCircle className="w-8 h-8" /> CONFIRMED
                           </div>
                         ) : (
                           <div className="flex items-center justify-center gap-3">
                             <Fingerprint className="w-8 h-8" />
                             {isConnected ? "CONFIRM" : "CONNECT"}
                           </div>
                         )}
                       </button>

                       {/* Tech Reveal (Floating Side Panel) */}
                       <div className="absolute left-full top-0 ml-6 w-64 hidden xl:block">
                          <div className="glass p-4 rounded-xl border-l-4 border-emerald-500 text-left">
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">
                              <Code2 className="w-3 h-3" /> LazorKit Logic
                            </div>
                            <div className="space-y-2 text-[10px] font-mono text-white/70">
                               <p className="text-white">{'// 1. Session Check'}</p>
                               <p>if (activeSession) skipPopup()</p>
                               <p className="text-white mt-2">{'// 2. Instant Sign'}</p>
                               <p>await signTransaction(ix)</p>
                            </div>
                          </div>
                       </div>
                    </div>

                  </div>
                )}

                {/* Ticket Perforation Effect (Only for ID 3) */}
                {product.id === 3 && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#050505] rounded-r-full" />
                )}
                {product.id === 3 && (
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#050505] rounded-l-full" />
                )}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
