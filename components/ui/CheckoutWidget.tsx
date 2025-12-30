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
  // 1. GET THE REAL SDK STATE
  // We destructure these values so we can "listen" to them
  const { 
    connect, 
    signAndSendTransaction, 
    smartWallet, 
    credentialId, 
    passkeyPubkey 
  } = useWallet();

  const { isConnected, wallet, saveSession } = useLazorContext();
  const { addLog, isOpen, toggle } = useConsole();
  
  const [isGasless, setIsGasless] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [signature, setSignature] = useState("");

  const ITEM_PRICE = 0.05;

  // 2. THE SYNC FIX (Critical)
  // As soon as 'smartWallet' becomes available from the SDK, save it and unlock the UI.
  useEffect(() => {
    if (smartWallet && !wallet) {
      console.log("⚡ SDK Auth Detected! Syncing to App State...");
      
      saveSession({
        credentialId: credentialId || "",
        passkeyPubkey: passkeyPubkey || "",
        smartWallet: smartWallet,
        walletDevice: "web"
      });
      
      // Stop the spinner because we are now connected
      setIsProcessing(false);
      addLog("[SUCCESS] Authenticated via LazorKit", "success");
    }
  }, [smartWallet, wallet, credentialId, passkeyPubkey, saveSession, addLog]);

  // 3. FAUCET HELPER
  const handleFaucet = () => {
    window.open("https://faucet.solana.com/", "_blank");
    addLog("[SYSTEM] Opening Solana Faucet", "info");
  };

  // 4. MAIN ACTION
  const handleAction = async () => {
    setIsProcessing(true);
    // Auto-open console so you see what's happening
    if (!isOpen) toggle();

    try {
      // SCENARIO A: LOG IN
      if (!isConnected) {
        addLog("[AUTH] Requesting Biometric Auth...", "info");
        await connect();
        // The useEffect above handles the rest!
      } 
      // SCENARIO B: PAY
      else {
        if (!wallet) throw new Error("Wallet not found");

        const totalCost = quantity * ITEM_PRICE;
        addLog(`[TX] Building Transfer: ${totalCost.toFixed(2)} SOL`, "info");

        // Create the transfer instruction
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
            addLog("[PAYMASTER] Requesting Sponsorship...", "warning");
        } else {
            addLog("[GAS] User Smart Wallet paying fee...", "info");
        }

        const sig = await signAndSendTransaction(payload);
        
        console.log("Signature:", sig);
        setSignature(sig);
        addLog(`[CHAIN] Transaction Confirmed!`, "success");
        setIsSuccess(true);
        setIsProcessing(false);
      }
    } catch (e: any) {
      console.error(e);
      const msg = e.message || "Unknown Error";
      
      // Smart Error Handling
      if (msg.includes("User rejected")) {
          addLog("[ERROR] User cancelled login", "warning");
      } else if (msg.includes("0x1")) {
          addLog("[ERROR] Insufficient Funds. Use Faucet.", "error");
      } else {
          addLog(`[ERROR] ${msg}`, "error");
      }
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
        <CyberCard className="space-y-6 text-center py-8">
            <div className="mx-auto w-16 h-16 bg-neon-green rounded-full flex items-center justify-center mb-4 border border-neon-green">
                <CheckCircle className="w-8 h-8 text-black" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white tracking-widest">PAYMENT COMPLETE</h2>
                <p className="text-cyber-muted text-xs font-mono mt-1">ID: {signature.slice(0, 8)}...</p>
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

            <button 
                onClick={() => { setIsSuccess(false); setSignature(""); }}
                className="text-cyber-muted hover:text-white underline text-xs mt-4"
            >
                Make Another Purchase
            </button>
        </CyberCard>
    )
  }

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
             addLog(`[CONFIG] Gas Mode: ${!isGasless ? "SPONSORED" : "USER_PAID"}`, "info");
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
      <div className="space-y-4 border-t border-cyber-border/50 py-4">
        <div className="flex items-center justify-between">
            <span className="text-cyber-muted text-sm">Quantity</span>
            <div className="flex items-center gap-3 bg-black border border-cyber-border rounded px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white"><Minus className="w-3 h-3" /></button>
                <span className="text-white font-mono text-sm w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-white"><Plus className="w-3 h-3" /></button>
            </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className={isGasless ? "text-neon-pink" : "text-cyber-muted"}>Network Fee</span>
          <span className={isGasless ? "text-neon-pink font-bold" : "text-cyber-text"}>
            {isGasless ? "0.00 SOL" : "~0.000005 SOL"}
          </span>
        </div>
        <div className="flex justify-between text-white font-bold pt-2 border-t border-cyber-border/30">
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
      {isConnected ? (
        <div className="space-y-2">
            {wallet && (
                <div className="text-center text-[10px] text-cyber-muted font-mono">
                    Connected: <span className="text-neon-blue">{wallet.smartWallet.slice(0, 6)}...</span>
                </div>
            )}
            <button 
                onClick={handleFaucet}
                className="w-full flex items-center justify-center gap-2 text-[10px] text-cyber-muted hover:text-neon-blue py-1"
            >
                <Droplets className="w-3 h-3" />
                <span>Need Devnet SOL? Open Faucet</span>
            </button>
            <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="flex items-center justify-center gap-1 text-[9px] text-neon-red opacity-50 hover:opacity-100 mx-auto"
            >
                <RefreshCw className="w-3 h-3" /> Force Reset
            </button>
        </div>
      ) : null}
    </CyberCard>
  );
}
