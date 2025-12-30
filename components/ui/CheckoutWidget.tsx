"use client";

import React, { useState, useEffect } from "react";
import { CyberCard } from "./CyberCard";
import { ShieldCheck, Fingerprint, Lock, Loader2, CheckCircle, Minus, Plus, LogOut } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

export function CheckoutWidget() {
  const { connect, disconnect: sdkDisconnect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet, clearSession } = useLazorContext(); // Get clearSession
  const devConsole = useConsole();
  
  const [isGasless, setIsGasless] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [signature, setSignature] = useState("");
  const [quantity, setQuantity] = useState(1);

  const ITEM_PRICE = 0.05;

  // SAFETY 1: Force reset 'Processing' if it gets stuck for more than 15s
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isProcessing) {
      timer = setTimeout(() => {
        setIsProcessing(false);
        // Don't log error here, just silently reset UI to keep it responsive
      }, 15000); 
    }
    return () => clearTimeout(timer);
  }, [isProcessing]);

  const safeLog = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    try { if (devConsole?.addLog) devConsole.addLog(msg, type); } catch (e) {}
    console.log(`[${type}] ${msg}`);
  };

  // SAFETY 2: The "Nuke It" function to fix the Revisit Bug
  const handleDisconnect = async () => {
    try {
        await sdkDisconnect();
        clearSession(); // Wipe our local storage
        window.location.reload(); // Force refresh to clear any stale SDK state
    } catch (e) {
        console.error("Disconnect error", e);
        // Even if SDK fails, force clear local state
        clearSession();
        window.location.reload();
    }
  };

  const handleAction = async () => {
    setIsProcessing(true);
    
    try {
      if (!isConnected) {
        // --- LOGIN FLOW ---
        safeLog("[AUTH] Opening Secure Enclave...", "info");
        await connect();
        // NOTE: We do NOT run transaction here. We let the UI update to "Connected" first.
        safeLog("[AUTH] Connection Established. Ready to Buy.", "success");
      } else {
        // --- BUY FLOW ---
        if (!wallet) throw new Error("Wallet not found. Try disconnecting.");

        const totalCost = quantity * ITEM_PRICE;
        safeLog(`[TX] Preparing Transfer: ${totalCost.toFixed(2)} SOL`, "info");

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
        else safeLog("[GAS] User Smart Wallet paying fee...", "info");

        const sig = await signAndSendTransaction(payload);
        
        setSignature(sig);
        safeLog(`[CHAIN] Success! Tx: ${sig.slice(0,8)}...`, "success");
        setIsSuccess(true);
      }
    } catch (e: any) {
      console.error(e);
      safeLog(`[ERROR] ${e.message}`, "error");
      alert(`Action Failed: ${e.message}`);
    } finally {
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
            <button 
                onClick={() => { setIsSuccess(false); setSignature(""); }}
                className="text-cyber-muted underline text-xs mt-4"
            >
                Reset Demo
            </button>
        </CyberCard>
    )
  }

  return (
    <CyberCard className="space-y-6">
      {/* Toggle */}
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

      {/* Summary */}
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

      {/* Action Button */}
      <button
        onClick={handleAction}
        disabled={isProcessing}
        className={`w-full font-bold py-3 rounded transition-colors flex items-center justify-center gap-2 ${
            isProcessing ? "bg-gray-600 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
        ) : isConnected ? (
            <> <Fingerprint className="w-5 h-5" /> CONFIRM PAYMENT </>
        ) : (
            <> <Lock className="w-4 h-4" /> UNLOCK TO BUY </>
        )}
      </button>

      {/* Footer - The "Fix It" Section */}
      {isConnected && wallet && (
        <div className="flex items-center justify-between pt-2 border-t border-cyber-border/30">
            <div className="text-[10px] text-cyber-muted font-mono">
                User: <span className="text-neon-blue">{wallet.smartWallet.slice(0, 4)}...{wallet.smartWallet.slice(-4)}</span>
            </div>
            {/* SAFETY 3: The Disconnect Button */}
            <button 
                onClick={handleDisconnect}
                className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-400"
            >
                <LogOut className="w-3 h-3" /> DISCONNECT
            </button>
        </div>
      )}
    </CyberCard>
  );
}
