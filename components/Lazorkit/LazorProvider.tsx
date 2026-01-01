"use client";

import React, { useState, useEffect } from "react";
import { CyberCard } from "./CyberCard";
import { ShieldCheck, Fingerprint, Lock, Loader2, CheckCircle, Minus, Plus, RefreshCw, ExternalLink, Droplets } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

export function CheckoutWidget() {
  // 1. We ONLY take the methods the SDK actually exposes
  const { connect, signAndSendTransaction } = useWallet();
  
  // 2. We use our Context for state management
  const { isConnected, wallet, saveSession, refreshSession } = useLazorContext();
  const devConsole = useConsole();
  
  const [isGasless, setIsGasless] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [signature, setSignature] = useState("");

  const ITEM_PRICE = 0.05;
  const MAX_QUANTITY = 10;

  // --- SAFETY NET ---
  // If the context updates (e.g. from a reload), stop spinning
  useEffect(() => {
    if (isConnected && wallet) {
      setIsProcessing(false);
    }
  }, [isConnected, wallet]);

  const safeLog = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    try { if (devConsole?.addLog) devConsole.addLog(msg, type); } catch (e) {}
  };

  const handleFaucet = () => {
    window.open("https://faucet.solana.com/", "_blank");
    safeLog("[SYSTEM] Opening External Faucet...", "info");
  };

  const handleAction = async () => {
    setIsProcessing(true);

    try {
      // ============================================
      // SCENARIO A: LOGIN
      // ============================================
      if (!isConnected) {
        safeLog("[AUTH] Biometric Challenge Initiated...", "info");
        
        // 🔥 THE FIX based on your Docs
        // connect() returns Promise<WalletInfo>. We must capture it here.
        const walletData = await connect();
        
        console.log("⚡ SDK RETURNED DATA:", walletData);

        if (walletData && walletData.smartWallet) {
           // We immediately save this to our app state
           saveSession({
               credentialId: walletData.credentialId,
               passkeyPubkey: walletData.passkeyPubkey ? JSON.stringify(walletData.passkeyPubkey) : "", 
               // Note: PasskeyPubkey might be an array or string depending on version, 
               // keeping it safe for localstorage
               smartWallet: walletData.smartWallet,
               walletDevice: walletData.walletDevice || "web"
           });
           
           safeLog("[SUCCESS] Authenticated & Synced!", "success");
           // isProcessing will auto-false due to the useEffect above
        } else {
           throw new Error("Login succeeded but no wallet data returned");
        }

      } 
      // ============================================
      // SCENARIO B: TRANSACTION
      // ============================================
      else {
        if (!wallet) throw new Error("Wallet not found");

        const totalCost = quantity * ITEM_PRICE;
        safeLog(`[TX] Building Transaction...`, "info");

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

        if (isGasless) {
             safeLog("[PAYMASTER] Requesting Sponsorship...", "warning");
        } else {
             safeLog("[GAS] User Smart Wallet paying fees...", "info");
        }

        // 2. Sign & Send
        // Telegram logs say signAndSendTransaction is the correct method now
        const sig = await signAndSendTransaction(payload);
        
        setSignature(sig);
        safeLog(`[CHAIN] Success!`, "success");
        setIsSuccess(true);
        setIsProcessing(false);
      }
    } catch (e: any) {
      console.error(e);
      
      const msg = e.message?.toLowerCase() || "";
      
      if (msg.includes("already connected")) {
          // If SDK thinks we are connected, try to refresh our session
          refreshSession();
          return;
      }
      
      safeLog(`[ERROR] ${e.message}`, "error");
      setIsProcessing(false);
    }
  };

  // ============================================
  // SUCCESS UI
  // ============================================
  if (isSuccess) {
    return (
        <CyberCard className="space-y-6 text-center py-8">
            <div className="mx-auto w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mb-4 border border-neon-green">
                <CheckCircle className="w-8 h-8 text-neon-green" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white tracking-widest">PAYMENT COMPLETE</h2>
                <p className="text-cyber-muted text-xs font-mono mt-1">ID: {signature.slice(0, 16)}...</p>
            </div>
            
            <a 
                href={`https://solscan.io/tx/${signature}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 text-neon-blue hover:text-white transition-colors border border-cyber-border p-3 rounded bg-black/50"
            >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-bold">VIEW ON SOLSCAN</span>
            </a>

            <button onClick={() => { setIsSuccess(false); setSignature(""); }} className="text-cyber-muted underline text-xs mt-4">Make Another Purchase</button>
        </CyberCard>
    )
  }

  // ============================================
  // MAIN UI
  // ============================================
  return (
    <CyberCard className="space-y-6">
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
            safeLog(`[CONFIG] Gas Mode: ${!isGasless ? "SPONSORED" : "USER_PAID"}`, "info");
          }}
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
      <div className="space-y-4 border-t border-b border-cyber-border/50 py-4">
        <div className="flex items-center justify-between">
            <span className="text-cyber-muted text-sm">Quantity</span>
            <div className="flex items-center gap-3 bg-black border border-cyber-border rounded px-2 py-1">
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

      {/* Footer */}
      {isConnected && (
        <div className="space-y-2">
            <button 
                onClick={handleFaucet}
                className="w-full flex items-center justify-center gap-2 text-[10px] text-cyber-muted hover:text-neon-blue transition-colors py-1"
            >
                <Droplets className="w-3 h-3" />
                <span>Need Devnet SOL? Open Faucet</span>
            </button>
            
            {wallet && (
                <div className="text-center">
                    <p className="text-[10px] text-cyber-muted font-mono mb-1">
                        CONNECTED: <span className="text-neon-blue">{wallet.smartWallet.slice(0, 6)}...</span>
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