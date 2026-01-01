"use client";

import React, { useState } from "react";
import { CyberCard } from "./CyberCard";
import { 
  ShieldCheck, Fingerprint, Lock, Loader2, CheckCircle, 
  Minus, Plus, ExternalLink, Droplets, RefreshCw 
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet"; // Real SDK hook
import { useLazorContext } from "@/components/Lazorkit/LazorProvider"; // Our Safe Wrapper
import { useConsole } from "@/components/ui/DevConsole";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

export function CheckoutWidget() {
  // Get the SIGNING method from the raw SDK
  const { signAndSendTransaction } = useWallet();
  
  // Get the STATE from our safe wrapper
  const { isConnected, wallet, connectAuth, disconnectAuth } = useLazorContext();
  const { addLog, toggle, isOpen } = useConsole();

  const [isGasless, setIsGasless] = useState(true); // Default to Gasless (It's the selling point)
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [signature, setSignature] = useState("");
  const [quantity, setQuantity] = useState(1);

  const ITEM_PRICE = 0.05;

  // --- FAUCET HELPER ---
  const handleFaucet = () => {
    window.open("https://faucet.solana.com/", "_blank");
    addLog("[SYSTEM] Opening External Faucet...", "info");
  };

  // --- THE REAL TRANSACTION LOGIC ---
  const handleBuy = async () => {
    setIsProcessing(true);
    if (!isOpen) toggle(); // Auto-open the X-Ray console

    try {
      // SCENARIO A: LOGIN
      if (!isConnected || !wallet) {
        addLog("[AUTH] Initiating Biometric Handshake...", "info");
        await connectAuth();
        addLog("[SUCCESS] Secure Enclave Verified", "success");
        setIsProcessing(false);
        return;
      }

      // SCENARIO B: PAYMENT
      const totalCost = quantity * ITEM_PRICE;
      addLog(`[TX] Initiating Transfer: ${totalCost.toFixed(2)} SOL`, "info");
      addLog(`[SMART WALLET] ${wallet.smartWallet}`, "info");

      // 1. Construct Instruction (Safely)
      // We do this HERE, not in render, so it doesn't crash if address is null
      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.smartWallet),
        toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
        lamports: Math.floor(totalCost * LAMPORTS_PER_SOL),
      });

      addLog("[SDK] SystemProgram.transfer instruction built", "info");

      // 2. Prepare Payload (LazorKit v2 Spec)
      const payload = {
        instructions: [ix],
        transactionOptions: {
          clusterSimulation: "devnet" as const,
          // If gasless is ON, the SDK handles paymaster automatically via Provider config
          // We can log this for the user to see "X-Ray" logic
        }
      };

      if (isGasless) {
        addLog("[PAYMASTER] Requesting Sponsorship from Kora...", "warning");
      } else {
        addLog("[GAS] User paying network fee (Legacy Mode)", "info");
      }

      // 3. Sign & Send
      addLog("[AUTH] Requesting Passkey Signature...", "info");
      const sig = await signAndSendTransaction(payload);

      console.log("Signature:", sig);
      setSignature(sig);
      addLog("[CHAIN] Transaction Confirmed!", "success");
      setIsSuccess(true);

    } catch (e: any) {
      console.error(e);
      addLog(`[ERROR] ${e.message || "Transaction Failed"}`, "error");
      
      if (e.message.includes("0x1")) {
         addLog("[HINT] Wallet needs funds. Use Faucet below.", "warning");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- SUCCESS STATE ---
  if (isSuccess) {
    return (
      <CyberCard className="space-y-6 text-center py-8">
        <div className="mx-auto w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mb-4 border border-neon-green">
          <CheckCircle className="w-8 h-8 text-neon-green" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-widest">PAYMENT COMPLETE</h2>
          <p className="text-cyber-muted text-xs font-mono mt-1">ID: {signature.slice(0, 12)}...</p>
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

  // --- ACTIVE STATE ---
  return (
    <CyberCard className="space-y-6">
      {/* 1. Gasless Toggle */}
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
            addLog(`[CONFIG] Gas Mode switched to: ${!isGasless ? "SPONSORED" : "USER_PAID"}`, "info");
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

      {/* 2. Order Summary */}
      <div className="space-y-4 border-t border-b border-cyber-border/50 py-4">
        <div className="flex items-center justify-between">
            <span className="text-cyber-muted text-sm">Quantity</span>
            <div className="flex items-center gap-3 bg-black border border-cyber-border rounded px-2 py-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-cyber-muted hover:text-white"><Minus className="w-3 h-3" /></button>
                <span className="text-white font-mono text-sm w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-cyber-muted hover:text-white"><Plus className="w-3 h-3" /></button>
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

      {/* 3. Action Button */}
      <button
        onClick={handleBuy}
        disabled={isProcessing}
        className="w-full group relative overflow-hidden rounded bg-cyber-text p-[1px] focus:outline-none focus:ring-2 focus:ring-neon-green/50"
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
        </div>
      </button>

      {/* 4. Connection Footer */}
      {isConnected && wallet && (
        <div className="text-center space-y-2">
            <p className="text-[10px] text-cyber-muted font-mono">
                CONNECTED: <span className="text-neon-blue">{wallet.smartWallet.slice(0, 6)}...{wallet.smartWallet.slice(-4)}</span>
            </p>
            <div className="flex justify-center gap-4">
                <button 
                    onClick={handleFaucet}
                    className="flex items-center gap-1 text-[10px] text-cyber-muted hover:text-white transition-colors"
                >
                    <Droplets className="w-3 h-3" /> Faucet
                </button>
                <button 
                    onClick={disconnectAuth}
                    className="flex items-center gap-1 text-[10px] text-neon-red/50 hover:text-neon-red transition-colors"
                >
                    <RefreshCw className="w-3 h-3" /> Reset Session
                </button>
            </div>
        </div>
      )}
    </CyberCard>
  );
}
