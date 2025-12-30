"use client";

import React, { useState, useEffect } from "react";
import { CyberCard } from "./CyberCard";
import { ShieldCheck, Fingerprint, Lock, Loader2, CheckCircle, Minus, Plus, RefreshCw, ExternalLink, Droplets, Bell } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

// --- TOAST COMPONENT (Mini Notification) ---
function Toast({ message, type, show }: { message: string, type: "success" | "error" | "info", show: boolean }) {
  if (!show) return null;
  const colors = {
    success: "border-neon-green text-neon-green bg-neon-green/10",
    error: "border-neon-red text-neon-red bg-neon-red/10",
    info: "border-neon-blue text-neon-blue bg-neon-blue/10"
  };
  return (
    <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full border ${colors[type]} backdrop-blur-md shadow-xl text-xs font-mono font-bold tracking-wider animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2`}>
      <Bell className="w-3 h-3" />
      {message}
    </div>
  );
}

export function CheckoutWidget() {
  const { connect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet, saveSession, refreshSession } = useLazorContext();
  const devConsole = useConsole();
  
  const [isGasless, setIsGasless] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [signature, setSignature] = useState("");
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "info" as "success" | "error" | "info" });

  const ITEM_PRICE = 0.05;
  const MAX_QUANTITY = 10;

  // --- SAFETY NET ---
  useEffect(() => {
    if (isConnected && wallet) setIsProcessing(false);
  }, [isConnected, wallet]);

  // Helper to show visual toast AND log to console
  const notify = (msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    try { if (devConsole?.addLog) devConsole.addLog(msg, type); } catch (e) {}
  };

  const handleFaucet = () => {
    window.open("https://faucet.solana.com/", "_blank");
    notify("Opening Faucet...", "info");
  };

  const handleAction = async () => {
    setIsProcessing(true);

    try {
      // ============================================
      // SCENARIO A: LOGIN (Cookbook Style)
      // ============================================
      if (!isConnected) {
        notify("Requesting Biometric Access...", "info");
        
        // 1. Capture the Promise (The "Winner" Logic)
        const walletData = await connect();
        
        console.log("⚡ SDK RETURNED:", walletData);

        if (walletData && walletData.smartWallet) {
           saveSession({
               credentialId: walletData.credentialId,
               passkeyPubkey: walletData.passkeyPubkey ? JSON.stringify(walletData.passkeyPubkey) : "", 
               smartWallet: walletData.smartWallet,
               walletDevice: walletData.walletDevice || "web"
           });
           notify("Access Granted. Welcome.", "success");
        } else {
           // Fallback if SDK returns null but still connects
           refreshSession();
        }

      } 
      // ============================================
      // SCENARIO B: TRANSACTION
      // ============================================
      else {
        if (!wallet) throw new Error("Wallet not found");

        const totalCost = quantity * ITEM_PRICE;
        notify(`Processing Payment: ${totalCost.toFixed(2)} SOL`, "info");

        // 1. Build Instruction
        const ix = SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.smartWallet),
          toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
          lamports: Math.floor(totalCost * LAMPORTS_PER_SOL),
        });

        const payload = {
            instructions: [ix],
            transactionOptions: { clusterSimulation: "devnet" as const }
        };

        if (isGasless) notify("Applying Gas Sponsorship...", "info");

        // 2. Sign & Send
        const sig = await signAndSendTransaction(payload);
        
        setSignature(sig);
        notify("Payment Confirmed!", "success");
        setIsSuccess(true);
        setIsProcessing(false);
      }
    } catch (e: any) {
      console.error(e);
      const msg = e.message?.toLowerCase() || "";
      
      if (msg.includes("already connected")) {
          refreshSession();
          return;
      }
      
      notify(e.message || "Operation Failed", "error");
      setIsProcessing(false);
    }
  };

  // ============================================
  // SUCCESS UI
  // ============================================
  if (isSuccess) {
    return (
        <CyberCard className="space-y-6 text-center py-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-neon-green/5 animate-pulse" />
            
            <div className="relative z-10 mx-auto w-20 h-20 bg-black rounded-full flex items-center justify-center mb-4 border-2 border-neon-green shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-10 h-10 text-neon-green" />
            </div>
            
            <div className="relative z-10 space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">PAYMENT COMPLETE</h2>
                <p className="text-cyber-muted text-xs font-mono">TRANSACTION ID</p>
                <div className="bg-black/50 p-2 rounded border border-cyber-border/50 mx-8 font-mono text-[10px] text-neon-blue truncate">
                    {signature}
                </div>
            </div>
            
            <a 
                href={`https://solscan.io/tx/${signature}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 flex items-center justify-center gap-2 text-black font-bold bg-neon-blue hover:bg-blue-400 transition-colors p-3 rounded mx-4"
            >
                <ExternalLink className="w-4 h-4" />
                <span>VIEW RECEIPT</span>
            </a>

            <button onClick={() => { setIsSuccess(false); setSignature(""); }} className="relative z-10 text-cyber-muted hover:text-white underline text-xs mt-4">
                Make Another Purchase
            </button>
        </CyberCard>
    )
  }

  // ============================================
  // MAIN UI
  // ============================================
  return (
    <CyberCard className="space-y-6 relative">
      {/* TOAST NOTIFICATION */}
      <Toast message={toast.message} type={toast.type} show={toast.show} />

      {/* Header */}
      <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-cyber-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-5 h-5 ${isGasless ? "text-neon-pink" : "text-cyber-muted"}`} />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Gasless Mode</span>
            <span className="text-[10px] text-cyber-muted">Sponsor pays fees</span>
          </div>
        </div>
        <button
          onClick={() => {
            setIsGasless(!isGasless);
            notify(`Gas Mode: ${!isGasless ? "SPONSORED" : "USER_PAID"}`, "info");
          }}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            isGasless ? "bg-neon-pink/20 border-neon-pink" : "bg-cyber-gray border-cyber-border"
          } border`}
        >
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            isGasless ? "translate-x-6 bg-neon-pink shadow-[0_0_10px_#EC4899]" : "translate-x-0"
          }`} />
        </button>
      </div>

      {/* Summary */}
      <div className="space-y-4 border-t border-b border-cyber-border/50 py-4">
        <div className="flex items-center justify-between">
            <span className="text-cyber-muted text-sm">Quantity</span>
            <div className="flex items-center gap-3 bg-black border border-cyber-border rounded px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white hover:text-neon-blue transition-colors"><Minus className="w-3 h-3" /></button>
                <span className="text-white font-mono text-sm w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))} className="text-white hover:text-neon-blue transition-colors"><Plus className="w-3 h-3" /></button>
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
        className={`w-full font-bold py-4 rounded transition-all flex items-center justify-center gap-2 relative overflow-hidden group ${
            isProcessing ? "bg-cyber-gray text-cyber-muted cursor-not-allowed" : 
            isConnected ? "bg-neon-green text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : 
            "bg-white text-black hover:bg-gray-200"
        }`}
      >
        <div className="relative z-10 flex items-center gap-2">
            {isProcessing ? (
                <> <Loader2 className="w-5 h-5 animate-spin" /> PROCESSING... </>
            ) : isConnected ? (
                <> <Fingerprint className="w-5 h-5" /> CONFIRM PAYMENT </>
            ) : (
                <> <Lock className="w-4 h-4" /> UNLOCK TO BUY </>
            )}
        </div>
        {/* Shine Effect */}
        {!isProcessing && (
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        )}
      </button>

      {/* Footer */}
      {isConnected && (
        <div className="space-y-3 pt-2">
            <button 
                onClick={handleFaucet}
                className="w-full flex items-center justify-center gap-2 text-[10px] text-cyber-muted hover:text-neon-blue transition-colors py-1 border border-transparent hover:border-cyber-border rounded"
            >
                <Droplets className="w-3 h-3" />
                <span>Need Devnet SOL? Open Faucet</span>
            </button>
            
            {wallet && (
                <div className="text-center border-t border-cyber-border/30 pt-3">
                    <p className="text-[10px] text-cyber-muted font-mono mb-1">
                        CONNECTED: <span className="text-neon-blue">{wallet.smartWallet.slice(0, 6)}...{wallet.smartWallet.slice(-4)}</span>
                    </p>
                    <button 
                        onClick={() => { localStorage.clear(); window.location.reload(); }}
                        className="flex items-center justify-center gap-1 text-[9px] text-neon-red/50 hover:text-neon-red mx-auto transition-colors"
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
