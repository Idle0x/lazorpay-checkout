"use client";

import React, { useState, useEffect } from "react";
import { ArrowDown, RefreshCw, Settings, Wallet, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

export default function SwapPage() {
  const { signAndSendTransaction } = useWallet();
  const { isConnected, connectAuth, wallet } = useLazorContext();
  const { addLog, toggle, isOpen } = useConsole();

  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState("");

  // Mock Exchange Rate: 1 SOL = 150 USDC (Devnet Simulation)
  useEffect(() => {
    const val = parseFloat(fromAmount);
    if (!isNaN(val)) {
      setToAmount((val * 150).toFixed(2));
    } else {
      setToAmount("");
    }
  }, [fromAmount]);

  const handleSwap = async () => {
    if (!isConnected) {
      await connectAuth();
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    setIsProcessing(true);
    if (!isOpen) toggle(); // Open X-Ray Console

    try {
      addLog(`[SWAP] Calculating route: SOL -> USDC`, "info");
      addLog(`[SWAP] Input: ${fromAmount} SOL`, "info");
      
      // 1. Build Transaction (Simulating Swap via Transfer to LP)
      // In a real mainnet app, this would be a Jupiter Aggregator instruction.
      // For this Devnet demo, we transfer to the "Merchant" (The Pool) to prove auth works.
      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet!.smartWallet),
        toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
        lamports: Math.floor(parseFloat(fromAmount) * LAMPORTS_PER_SOL),
      });

      addLog(`[SDK] Constructing Transaction...`, "info");
      addLog(`[PAYMASTER] Requesting Gas Sponsorship...`, "warning");

      // 2. Execute via LazorKit
      const sig = await signAndSendTransaction({
        instructions: [ix],
        transactionOptions: { clusterSimulation: "devnet" }
      });

      setTxHash(sig);
      addLog(`[CHAIN] Swap Executed! Hash: ${sig.slice(0,8)}...`, "success");

    } catch (e: any) {
      addLog(`[ERROR] ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Back Button */}
      <div className="absolute top-24 left-4 md:left-8 z-20">
        <Link href="/" className="group flex items-center gap-2 text-cyber-muted hover:text-white transition-colors">
            <div className="p-2 rounded-full border border-cyber-border group-hover:border-neon-purple/50 bg-black">
                <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold font-mono tracking-widest uppercase">Hub</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-white tracking-tight">Atomic Swap</h1>
            <button className="p-2 hover:bg-white/5 rounded-full text-cyber-muted hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Input Field (SOL) */}
          <div className="bg-black/50 rounded-2xl p-4 border border-white/5 hover:border-neon-purple/50 transition-colors group">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-cyber-muted font-bold tracking-wider">PAY</span>
              <span className="text-xs text-cyber-muted">Balance: --</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input 
                type="number" 
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="bg-transparent text-3xl font-mono text-white placeholder-white/20 outline-none w-full"
              />
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full shrink-0">
                <div className="w-5 h-5 rounded-full bg-black border border-white/20" />
                <span className="font-bold text-sm">SOL</span>
              </div>
            </div>
          </div>

          {/* Switcher */}
          <div className="relative h-8 flex items-center justify-center -my-2 z-10">
            <div className="bg-[#111] border border-white/10 p-2 rounded-full shadow-lg">
              <ArrowDown className="w-4 h-4 text-neon-purple" />
            </div>
          </div>

          {/* Output Field (USDC) */}
          <div className="bg-black/50 rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-cyber-muted font-bold tracking-wider">RECEIVE (EST.)</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <input 
                type="text" 
                readOnly
                value={toAmount}
                placeholder="0.00"
                className="bg-transparent text-3xl font-mono text-neon-purple placeholder-white/20 outline-none w-full"
              />
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-500 border border-white/20" />
                <span className="font-bold text-sm">USDC</span>
              </div>
            </div>
          </div>

          {/* Rate Info */}
          <div className="flex items-center justify-between px-2 py-4 text-xs text-cyber-muted">
            <div className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              <span>1 SOL ≈ 150.00 USDC</span>
            </div>
            <div className="flex items-center gap-1 text-neon-green">
              <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span>Low Gas (Sponsored)</span>
            </div>
          </div>

          {/* Action Button */}
          {txHash ? (
             <a 
               href={`https://solscan.io/tx/${txHash}?cluster=devnet`} 
               target="_blank"
               className="w-full bg-neon-green text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-400 transition-colors"
             >
               VIEW ON EXPLORER
             </a>
          ) : (
            <button 
              onClick={handleSwap}
              disabled={isProcessing}
              className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> SWAPPING...
                </>
              ) : !isConnected ? (
                <>
                  <Wallet className="w-5 h-5" /> CONNECT PASSKEY
                </>
              ) : (
                "CONFIRM SWAP"
              )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
