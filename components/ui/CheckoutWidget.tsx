"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Fingerprint, Lock, Loader2, CheckCircle, Minus, Plus, RefreshCw, ExternalLink, Droplets } from "lucide-react";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

function CyberCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

// ✅ YOUR ADDRESS (Safe String)
const MERCHANT_ADDRESS_STRING = "FvyYz9tqnCmG4XYrRKFG4fCrsUwK7T3KJsd97MFWGSiy";

export function CheckoutWidget() {
  const { isConnected, wallet, connectAuth, disconnectAuth, signAndSend } = useLazorContext();
  
  const [isGasless, setIsGasless] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [signature, setSignature] = useState("");

  const ITEM_PRICE = 0.05;
  const MAX_QUANTITY = 10;

  useEffect(() => {
    if (isConnected && wallet) {
      setIsProcessing(false);
    }
  }, [isConnected, wallet]);

  const handleFaucet = () => {
    window.open("https://faucet.solana.com/", "_blank");
  };

  const handleAction = async () => {
    setIsProcessing(true);

    try {
      if (!isConnected) {
        console.log("[AUTH] Initiating Passkey Flow...");
        await connectAuth();
      } 
      else {
        if (!wallet) throw new Error("Wallet not found");

        const totalCost = quantity * ITEM_PRICE;
        console.log(`[TX] Building Transaction...`);

        // ✅ SAFE KEY CREATION
        const ix = SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.smartWallet),
          toPubkey: new PublicKey(MERCHANT_ADDRESS_STRING),
          lamports: Math.floor(totalCost * LAMPORTS_PER_SOL),
        });

        const sig = await signAndSend([ix]);
        
        setSignature(sig);
        setIsSuccess(true);
        setIsProcessing(false);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Error: ${e.message}`);
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
        <CyberCard className="space-y-6 text-center py-8">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white tracking-widest">PAYMENT COMPLETE</h2>
                <p className="text-zinc-500 text-xs font-mono mt-1">ID: {signature.slice(0, 16)}...</p>
            </div>
            
            <a 
                href={`https://solscan.io/tx/${signature}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-emerald-400 hover:text-white transition-colors border border-zinc-700 p-3 rounded bg-black/50"
            >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-bold">VIEW ON SOLSCAN</span>
            </a>

            <button onClick={() => { setIsSuccess(false); setSignature(""); }} className="text-zinc-500 underline text-xs mt-4">Make Another Purchase</button>
        </CyberCard>
    )
  }

  return (
    <CyberCard className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-zinc-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-5 h-5 ${isGasless ? "text-pink-500" : "text-zinc-500"}`} />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Gasless Mode</span>
            <span className="text-[10px] text-zinc-500">Sponsor pays fees</span>
          </div>
        </div>
        <button
          onClick={() => setIsGasless(!isGasless)}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            isGasless ? "bg-pink-500/20 border-pink-500" : "bg-zinc-800 border-zinc-700"
          } border`}
        >
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            isGasless ? "translate-x-6 bg-pink-500" : "translate-x-0"
          }`} />
        </button>
      </div>

      {/* Summary */}
      <div className="space-y-4 border-t border-zinc-800 py-4">
        <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm">Quantity</span>
            <div className="flex items-center gap-3 bg-black border border-zinc-700 rounded px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white"><Minus className="w-3 h-3" /></button>
                <span className="text-white font-mono text-sm w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))} className="text-white"><Plus className="w-3 h-3" /></button>
            </div>
        </div>
        <div className="flex justify-between text-white font-bold pt-2">
          <span>Total</span>
          <span>{(ITEM_PRICE * quantity).toFixed(2)} SOL</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAction}
        disabled={isProcessing}
        className={`w-full font-bold py-3 rounded transition-all flex items-center justify-center gap-2 ${
            isProcessing ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : 
            isConnected ? "bg-emerald-500 text-black hover:bg-emerald-400" : 
            "bg-white text-black hover:bg-gray-200"
        }`}
      >
        {isProcessing ? (
            <> <Loader2 className="w-5 h-5 animate-spin" /> PROCESSING... </>
        ) : isConnected ? (
            <> <Fingerprint className="w-5 h-5" /> CONFIRM PAYMENT </>
        ) : (
            <> <Lock className="w-4 h-4" /> UNLOCK TO BUY </>
        )}
      </button>

      {/* Footer */}
      {isConnected && (
        <div className="space-y-2">
            <button 
                onClick={handleFaucet}
                className="w-full flex items-center justify-center gap-2 text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors py-1"
            >
                <Droplets className="w-3 h-3" />
                <span>Need Devnet SOL? Open Faucet</span>
            </button>
            
            {wallet && (
                <div className="text-center">
                    <p className="text-[10px] text-zinc-500 font-mono mb-1">
                        CONNECTED: <span className="text-emerald-400">{wallet.smartWallet.slice(0, 6)}...</span>
                    </p>
                    <button 
                        onClick={disconnectAuth}
                        className="flex items-center justify-center gap-1 text-[9px] text-red-500/50 hover:text-red-500 mx-auto transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Force Reset
                    </button>
                </div>
            )}
        </div>
      )}
    </CyberCard>
  );
}
