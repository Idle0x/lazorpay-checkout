"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Zap, Cpu, Ticket, X, CheckCircle, Loader2, Code2, Fingerprint, ArrowRight, ArrowLeft, ExternalLink
} from "lucide-react";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// --- DEMO MERCHANT ADDRESS (Random Devnet Wallet) ---
const MERCHANT_ADDRESS = new PublicKey("LazorNbGjP3X8Jd9V1w3J9x4jP5X2y8Z1k7M4n3P2qR");

// --- TYPES ---
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  color: string;
  textColor: string;
  icon: any;
};

// --- DATA ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "NEURAL LINK",
    category: "HARDWARE",
    price: 0.01, // Low price for Devnet testing
    color: "bg-gradient-to-br from-zinc-700 to-zinc-900 border-zinc-600",
    textColor: "text-white",
    icon: Cpu
  },
  {
    id: 2,
    name: "DEV CREDITS",
    category: "DIGITAL ASSET",
    price: 0.05,
    color: "bg-gradient-to-br from-blue-600 to-violet-600 border-blue-400",
    textColor: "text-white",
    icon: Zap
  },
  {
    id: 3,
    name: "VIP ACCESS",
    category: "EVENT TICKET",
    price: 0.1,
    color: "bg-[#e5e5e5] border-zinc-400",
    textColor: "text-zinc-900",
    icon: Ticket
  }
];

export default function StorePage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  
  // USE REAL CONTEXT
  const { isConnected, wallet, connectAuth, signAndSend } = useLazorContext();

  // --- REAL TRANSACTION LOGIC ---
  const handlePurchase = async (product: Product) => {
    try {
      // 1. Ensure Auth
      if (!isConnected || !wallet) {
        await connectAuth();
        return;
      }

      setProcessing(true);

      // 2. Create Instruction (Real SOL Transfer)
      const instruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.smartWallet),
        toPubkey: MERCHANT_ADDRESS,
        lamports: product.price * LAMPORTS_PER_SOL,
      });

      // 3. Send via LazorKit (Gasless)
      const sig = await signAndSend([instruction]);
      
      // 4. Success State
      setTxSignature(sig);

    } catch (e) {
      console.error("Purchase Failed:", e);
      alert("Transaction failed. See console.");
    } finally {
      setProcessing(false);
    }
  };

  const closeActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveId(null);
    setTxSignature(null);
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-y-auto overflow-x-hidden flex flex-col items-center">
      
      {/* 1. HEADER & BACK BUTTON */}
      <div className={`w-full max-w-7xl flex items-center justify-between mb-16 transition-all duration-500 ${activeId ? 'opacity-0 translate-y-[-50px] pointer-events-none' : 'opacity-100'}`}>
        <Link href="/" className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
           <div className="p-2 rounded-full border border-zinc-800 group-hover:border-red-500/50 transition-colors">
             <ArrowLeft className="w-5 h-5 text-red-500" />
           </div>
           <span className="text-sm font-bold font-mono uppercase tracking-widest">Back to Hub</span>
        </Link>
        
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter text-right">
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
                  : 'w-72 h-96 cursor-pointer hover:scale-[1.05] hover:-translate-y-4'
                }
              `}
            >
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

                {/* IDLE CONTENT */}
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
                  </div>
                )}

                {/* ACTIVE CONTENT */}
                {isActive && (
                  <div className="space-y-8 z-10 h-full flex flex-col justify-between">
                    
                    {/* Active Header */}
                    <div>
                      <div className="flex items-center gap-3 mb-4 opacity-50">
                        <product.icon className={`w-6 h-6 ${product.textColor}`} />
                        <span className={`text-sm font-bold tracking-widest uppercase ${product.textColor}`}>{product.category}</span>
                      </div>
                      <h2 className={`text-6xl md:text-7xl font-black leading-none mb-4 ${product.textColor}`}>
                        {product.name}
                      </h2>
                      <p className={`text-xl font-medium max-w-lg ${product.textColor} opacity-80`}>
                         Purchase this item using LazorKit. The transaction will be sponsored by the Paymaster.
                      </p>
                    </div>

                    {/* Active Footer */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-3">
                         <span className={`text-8xl font-black ${product.textColor}`}>{product.price}</span>
                         <span className={`text-3xl font-bold opacity-60 ${product.textColor}`}>SOL</span>
                      </div>

                      {/* Main Button / Success State */}
                      {txSignature ? (
                        <div className="space-y-4">
                           <button className="w-full py-6 rounded-3xl bg-emerald-500 text-white text-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-default">
                              <CheckCircle className="w-8 h-8" /> Purchase Successful
                           </button>
                           <a 
                             href={`https://solscan.io/tx/${txSignature}?cluster=devnet`} 
                             target="_blank"
                             rel="noopener noreferrer"
                             className={`block w-full text-center text-sm font-bold uppercase tracking-widest hover:underline ${product.textColor} flex items-center justify-center gap-2`}
                           >
                             View on Solscan <ExternalLink className="w-4 h-4" />
                           </a>
                        </div>
                      ) : (
                        <button
                           onClick={(e) => { e.stopPropagation(); handlePurchase(product); }}
                           disabled={processing}
                           className={`w-full py-8 rounded-3xl text-3xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl
                             ${product.id === 2 ? 'bg-black text-white' : 'bg-white text-black'}
                           `}
                         >
                           {processing ? (
                             <div className="flex items-center justify-center gap-4">
                                <Loader2 className="w-8 h-8 animate-spin" /> PROCESSING
                             </div>
                           ) : (
                             <div className="flex items-center justify-center gap-4">
                               <Fingerprint className="w-10 h-10" />
                               {isConnected ? "CONFIRM PAY" : "CONNECT"}
                             </div>
                           )}
                         </button>
                      )}
                    </div>

                    {/* Tech Spec (Floating X-Ray) */}
                    <div className="hidden md:block absolute right-12 bottom-40 text-right pointer-events-none">
                        <div className="inline-block glass-strong p-6 rounded-2xl bg-black/20 border-l-4 border-emerald-500 backdrop-blur-md">
                           <div className="flex items-center justify-end gap-2 text-emerald-400 text-sm font-bold mb-2 uppercase tracking-wider">
                              Code Execution <Code2 className="w-4 h-4" /> 
                           </div>
                           <pre className="text-xs font-mono text-white/80 text-right">
{`// 1. Define Transfer
const ix = SystemProgram.transfer({
  to: MERCHANT,
  lamports: ${product.price} * SOL
});

// 2. Sign via Passkey & Paymaster
await signAndSend([ix]);`}
                           </pre>
                        </div>
                    </div>

                  </div>
                )}
                
                {/* Ticket Effect */}
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
