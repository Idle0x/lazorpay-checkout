"use client";

import React, { useState } from "react";
import { ArrowDown, Settings, Info, RefreshCw, Wallet } from "lucide-react";
import { CyberCard } from "@/components/ui/CyberCard";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

export default function SwapPage() {
  const { connect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet, refreshSession, saveSession } = useLazorContext();
  const { addLog } = useConsole(); // We'll re-use the console for logs!

  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("1.0");

  const handleSwap = async () => {
    setIsProcessing(true);
    try {
      if (!isConnected) {
        addLog("[AUTH] Requesting Access...", "info");
        const data = await connect();
        if (data?.smartWallet) {
           saveSession({ ...data, passkeyPubkey: "", walletDevice: "web" });
           addLog("[SUCCESS] Connected for Swap", "success");
        }
      } else {
        if (!wallet) return;
        addLog(`[SWAP] Swapping ${amount} SOL for USDC...`, "info");
        
        // MOCK: In a real app, this would be a Jupiter Swap Instruction
        // For the DEMO, we send a self-transfer with a memo to simulate activity
        const ix = SystemProgram.transfer({
            fromPubkey: new PublicKey(wallet.smartWallet),
            toPubkey: new PublicKey(wallet.smartWallet), // Self-transfer (safe mock)
            lamports: 0, 
        });

        addLog("[PAYMASTER] Gas Fees Sponsored by Protocol", "success");
        
        const payload = {
            instructions: [ix],
            transactionOptions: { clusterSimulation: "devnet" as const }
        };

        const sig = await signAndSendTransaction(payload);
        addLog(`[CHAIN] Swap Confirmed! TX: ${sig.slice(0,8)}...`, "success");
        setIsProcessing(false);
        alert("Swap Successful! (Demo Transaction)");
      }
    } catch (e: any) {
        console.error(e);
        addLog(`[ERROR] ${e.message}`, "error");
        setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold text-white">Swap</h2>
        <div className="flex gap-2 text-cyber-muted">
            <RefreshCw className="w-4 h-4 hover:text-white cursor-pointer" />
            <Settings className="w-4 h-4 hover:text-white cursor-pointer" />
        </div>
      </div>

      <CyberCard className="space-y-1 relative overflow-visible">
        
        {/* INPUT: From */}
        <div className="bg-black/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between mb-2">
                <span className="text-xs text-cyber-muted font-mono">Paying</span>
                <span className="text-xs text-cyber-muted font-mono flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> {isConnected ? "4.20 SOL" : "--"}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-3xl font-bold text-white placeholder-white/20 outline-none w-1/2"
                />
                <div className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                    <span className="font-bold text-sm">SOL</span>
                </div>
            </div>
            <div className="text-xs text-cyber-muted mt-2">≈ $145.20 USD</div>
        </div>

        {/* ARROW */}
        <div className="relative h-2 z-10">
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-8 h-8 bg-cyber-gray border-4 border-black rounded-full flex items-center justify-center">
                <ArrowDown className="w-4 h-4 text-cyber-muted" />
            </div>
        </div>

        {/* OUTPUT: To */}
        <div className="bg-black/50 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between mb-2">
                <span className="text-xs text-cyber-muted font-mono">Receiving</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{(parseFloat(amount || "0") * 145.2).toFixed(2)}</div>
                <div className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-full border border-white/10">
                    <div className="w-5 h-5 rounded-full bg-blue-400" />
                    <span className="font-bold text-sm">USDC</span>
                </div>
            </div>
            <div className="text-xs text-cyber-muted mt-2">1 SOL ≈ 145.20 USDC</div>
        </div>

        {/* INFO: The Gasless Flex */}
        <div className="mt-4 bg-neon-green/5 border border-neon-green/20 rounded-lg p-3 flex items-start gap-3">
            <Info className="w-4 h-4 text-neon-green shrink-0 mt-0.5" />
            <div className="space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="text-cyber-muted">Network Cost</span>
                    <span className="text-cyber-muted line-through">$0.002</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                    <span className="text-neon-green">LazorPay Sponsor</span>
                    <span className="text-neon-green">FREE</span>
                </div>
            </div>
        </div>

        {/* ACTION BUTTON */}
        <button
            onClick={handleSwap}
            disabled={isProcessing}
            className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all ${
                isProcessing 
                ? "bg-cyber-gray text-cyber-muted" 
                : "bg-neon-green text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            }`}
        >
            {isProcessing ? "Confirming..." : isConnected ? "Confirm Swap" : "Connect Wallet"}
        </button>

      </CyberCard>
    </div>
  );
}
