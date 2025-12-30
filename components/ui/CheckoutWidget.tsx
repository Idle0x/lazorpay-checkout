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
  // 1. Get the REAL internal state from the SDK
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
  const MAX_QUANTITY = 10;

  // ============================================
  // SDK State -> LocalStorage
  // ============================================
  useEffect(() => {
    // If the SDK has a wallet address, but our App Context doesn't know it yet...
    if (smartWallet && !wallet) {
      console.log("🔄 [SYNC] SDK wallet detected, saving to localStorage...");
      
      // ...Force save it immediately.
      saveSession({
        credentialId: credentialId || "",
        passkeyPubkey: passkeyPubkey || "",
        smartWallet: smartWallet,
        walletDevice: "web"
      });
      
      addLog("[SUCCESS] Passkey Verified via Secure Enclave", "success");
      setIsProcessing(false); // Stop the spinner
    }
  }, [smartWallet, wallet, credentialId, passkeyPubkey, saveSession, addLog]);

  // ============================================
  // FAUCET HELPER
  // ============================================
  const handleFaucet = () => {
    window.open("https://faucet.solana.com/", "_blank");
    addLog("[SYSTEM] Opening External Faucet...", "info");
  };

  // ============================================
  // MAIN BUY HANDLER
  // ============================================
  const handleBuy = async () => {
    setIsProcessing(true);
    // Auto-open console for the "Wow" factor
    if (!isOpen) toggle();

    try {
      // ========== SCENARIO A: LOGIN ==========
      if (!isConnected) {
        addLog("[AUTH] Biometric Challenge Initiated...", "info");
        
        await connect();
        
        // No need to do anything else here. 
        // The useEffect above will catch the change in 'smartWallet'
        // and update the UI automatically.
        
      } 
      // ========== SCENARIO B: TRANSACTION ==========
      else {
        if (!wallet) throw new Error("Wallet not found");

        const totalCost = quantity * ITEM_PRICE;
        addLog(`[TX] Initializing Transfer: ${totalCost.toFixed(2)} SOL`, "info");

        // 1. Build the Transfer Instruction
        const ix = SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.smartWallet),
          toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
          lamports: Math.floor(totalCost * LAMPORTS_PER_SOL),
        });

        addLog(`[INSTRUCTION] SystemProgram.transfer constructed`, "info");

        const payload = {
          instructions: [ix],
          transactionOptions: {
            clusterSimulation: "devnet" as const
          }
        };

        if (isGasless) {
          addLog("[PAYMASTER] Requesting Sponsorship from Kora...", "warning");
        } else {
          addLog("[GAS] User Smart Wallet paying network fee...", "info");
        }

        // 2. Send it
        const sig = await signAndSendTransaction(payload);
        
        console.log("✅ Transaction Signature:", sig);
        setSignature(sig);
        addLog(`[CHAIN] Transaction Confirmed!`, "success");
        setIsSuccess(true);
        setIsProcessing(false);
      }
    } catch (e: any) {
      console.error("❌ Error:", e);
      
      const msg = e.message?.toLowerCase() || "";
      
      // Handle common errors nicely
      if (msg.includes("user rejected") || msg.includes("user denied")) {
        addLog("[ERROR] User Declined Authentication", "error");
      } else if (msg.includes("insufficient") || msg.includes("0x1")) {
        addLog("[ERROR] Insufficient Funds", "error");
        addLog("[HINT] Get devnet SOL from the faucet below", "warning");
      } else if (msg.includes("already connected")) {
        // If SDK thinks we are connected but UI is confused, force a reload
        window.location.reload(); 
      } else {
        addLog(`[ERROR] ${e.message || "Unknown Error"}`, "error");
      }
      
      setIsProcessing(false);
    }
  };

  // ============================================
  // SUCCESS SCREEN
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

        <button 
          onClick={() => { setIsSuccess(false); setSignature(""); }}
          className="text-cyber-muted hover:text-white underline text-xs mt-4"
        >
          Make Another Purchase
        </button>
      </CyberCard>
    );
  }

  // ============================================
  // MAIN UI
  // ============================================
  return (
    <CyberCard className="space-y-6">
      {/* Gasless Toggle */}
      <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-cyber-border">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-5 h-5 ${isGasless ? "text-neon-pink" : "text-cyber-muted"}`} />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-cyber-text">Gasless Mode</span>
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
            isGasless ? "translate-x-6 bg-neon-pink shadow-[0_0_10px_#EC4899]" : "translate-x-0"
          }`} />
        </button>
      </div>

      {/* Summary */}
      <div className="space-y-4 border-t border-b border-cyber-border/50 py-4">
        <div className="flex items-center justify-between">
          <span className="text-cyber-muted text-sm">Quantity</span>
          <div className="flex items-center gap-3 bg-black border border-cyber-border rounded px-2 py-1">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-cyber-muted hover:text-white"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-white font-mono text-sm w-4 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
              disabled={quantity >= MAX_QUANTITY}
              className={`${quantity >= MAX_QUANTITY ? "opacity-50 cursor-not-allowed" : "text-cyber-muted hover:text-white"}`}
            >
              <Plus className="w-3 h-3" />
            </button>
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
        onClick={handleBuy}
        disabled={isProcessing}
        className={`w-full group relative overflow-hidden rounded bg-cyber-text p-[1px] focus:outline-none focus:ring-2 focus:ring-neon-green/50 ${
             isProcessing ? "opacity-70 cursor-wait" : ""
        }`}
      >
        <div className="relative flex items-center justify-center gap-2 bg-black h-full py-3 px-4 rounded-[3px] group-hover:bg-gray-900 transition-colors">
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 text-neon-blue animate-spin" />
              <span className="text-neon-blue font-bold font-mono tracking-wider">PROCESSING...</span>
            </>
          ) : isConnected ? (
            <>
              <Fingerprint className="w-5 h-5 text-neon-green" />
              <span className="text-neon-green font-bold font-mono tracking-wider">CONFIRM PAYMENT</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-cyber-text" />
              <span className="text-white font-bold font-mono tracking-wider">UNLOCK TO BUY</span>
            </>
          )}
          <div className="absolute inset-0 bg-neon-green/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </div>
      </button>

      {/* Footer Tools */}
      {isConnected && (
        <div className="space-y-2">
            {/* Faucet Link */}
            <button 
            onClick={handleFaucet}
            className="w-full flex items-center justify-center gap-2 text-[10px] text-cyber-muted hover:text-neon-blue transition-colors py-1"
            >
            <Droplets className="w-3 h-3" />
            <span>Need Devnet SOL? Open Faucet</span>
            </button>

            {/* Reset Tool */}
            {wallet && (
                <div className="text-center">
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
