"use client";

import React, { useState, useEffect } from "react";
import { CyberCard } from "./CyberCard";
import { ShieldCheck, Fingerprint, Lock, Loader2, CheckCircle, Minus, Plus, RefreshCw } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

export function CheckoutWidget() {
  const { connect, signAndSendTransaction } = useWallet();
  // Get the new refreshSession function
  const { isConnected, wallet, refreshSession } = useLazorContext();
  const devConsole = useConsole();
  
  const [isGasless, setIsGasless] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [signature, setSignature] = useState("");

  const ITEM_PRICE = 0.05;

  // --- AGGRESSIVE POLLING FIX ---
  // While processing, check for the wallet every 500ms.
  // This saves us if the browser "wakes up" after the auth tab closes.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing && !isConnected) {
      interval = setInterval(() => {
        console.log("🔍 Polling for wallet...");
        refreshSession(); 
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isProcessing, isConnected, refreshSession]);

  // Stop spinner immediately if connected
  useEffect(() => {
    if (isConnected && wallet) {
      setIsProcessing(false);
    }
  }, [isConnected, wallet]);

  const safeLog = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    try { if (devConsole?.addLog) devConsole.addLog(msg, type); } catch (e) {}
  };

  const handleAction = async () => {
    setIsProcessing(true);

    try {
      if (!isConnected) {
        safeLog("[AUTH] Requesting Passkey...", "info");
        await connect();
        // Force an immediate check after the promise returns
        refreshSession();
      } else {
        if (!wallet) throw new Error("Wallet not found");

        const totalCost = quantity * ITEM_PRICE;
        safeLog(`[TX] Building Transaction...`, "info");

        const ix = SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.smartWallet),
          toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
          lamports: Math.floor(totalCost * LAMPORTS_PER_SOL),
        });

        const payload = {
            instructions: [ix],
            transactionOptions: { clusterSimulation: "devnet" as const }
        };

        if (isGasless) safeLog("[PAYMASTER] Requesting Sponsorship...", "warning");

        const sig = await signAndSendTransaction(payload);
        setSignature(sig);
        safeLog(`[CHAIN] Success!`, "success");
        setIsSuccess(true);
        setIsProcessing(false);
      }
    } catch (e: any) {
      console.error(e);
      // Don't log "Already connected" as an error, just handle it
      if (e.message?.includes("already connected")) {
          refreshSession();
          return;
      }
      safeLog(`[ERROR] ${e.message}`, "error");
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
        <CyberCard className="space-y-6 text-center py-8">
            <div className="mx-auto w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white">PAYMENT COMPLETE</h2>
            <button onClick={() => { setIsSuccess(false); setSignature(""); }} className="text-cyber-muted underline text-xs mt-4">Reset Demo</button>
        </CyberCard>
    )
  }

  return (
    <CyberCard className="space-y-6">
      <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-cyber-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-5 h-5 ${isGasless ? "text-neon-pink" : "text-cyber-muted"}`} />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Gasless Mode</span>
            <span className="text-[10px] text-cyber-muted">Sponsor pays fees</span>
          </div>
        </div>
        <button
          onClick={() => setIsGasless(!isGasless)}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            isGasless ? "bg-neon-pink/20 border-neon-pink" : "bg-cyber-gray border-cyber-border"
          } border`}
        >
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            isGasless ? "translate-x-6 bg-neon-pink" : "translate-x-0"
          }`} />
        </button>
      </div>

      <div className="space-y-4 border-t border-cyber-border/50 py-4">
        <div className="flex items-center justify-between">
            <span className="text-cyber-muted text-sm">Quantity</span>
            <div className="flex items-center gap-3 bg-black border border-cyber-border rounded px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white"><Minus className="w-3 h-3" /></button>
                <span className="text-white font-mono text-sm w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-white"><Plus className="w-3 h-3" /></button>
            </div>
        </div>
        <div className="flex justify-between text-white font-bold pt-2">
          <span>Total</span>
          <span>{(ITEM_PRICE * quantity).toFixed(2)} SOL</span>
        </div>
      </div>

      <button
        onClick={handleAction}
        disabled={isProcessing}
        className={`w-full font-bold py-3 rounded transition-all flex items-center justify-center gap-2 ${
            isProcessing ? "bg-cyber-gray text-cyber-muted cursor-not-allowed" : 
            isConnected ? "bg-neon-green text-black hover:bg-green-400" : 
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

      {isConnected && wallet && (
        <div className="flex flex-col items-center gap-2">
            <div className="text-center text-[10px] text-cyber-muted font-mono">
                Connected: <span className="text-neon-blue">{wallet.smartWallet.slice(0, 6)}...</span>
            </div>
            <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="flex items-center gap-1 text-[9px] text-neon-red opacity-50 hover:opacity-100"
            >
                <RefreshCw className="w-3 h-3" /> Force Reset
            </button>
        </div>
      )}
    </CyberCard>
  );
}
