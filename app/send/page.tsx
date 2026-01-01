"use client";

import React, { useState } from "react";
import { Send, Wallet, Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function SendPage() {
  const { signAndSendTransaction } = useWallet();
  const { isConnected, connectAuth, wallet } = useLazorContext();
  const { addLog, toggle, isOpen } = useConsole();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");

  const handleSend = async () => {
    if (!isConnected) {
      await connectAuth();
      return;
    }

    // Basic Validation
    try {
      new PublicKey(recipient);
    } catch {
      addLog("Invalid Recipient Address", "error");
      if (!isOpen) toggle();
      return;
    }

    setIsProcessing(true);
    setStatus("idle");
    if (!isOpen) toggle();

    try {
      addLog(`[SEND] Initiating P2P Transfer`, "info");
      addLog(`[SEND] To: ${recipient}`, "info");
      addLog(`[SEND] Amount: ${amount} SOL`, "info");

      // 1. Build Instruction
      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet!.smartWallet),
        toPubkey: new PublicKey(recipient),
        lamports: Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL),
      });

      addLog(`[SDK] Transaction Built.`, "info");
      addLog(`[PAYMASTER] Optimizing Fees...`, "warning");

      // 2. Sign & Send
      const sig = await signAndSendTransaction({
        instructions: [ix],
        transactionOptions: { clusterSimulation: "devnet" }
      });

      setTxHash(sig);
      setStatus("success");
      addLog(`[CHAIN] Transfer Successful!`, "success");

    } catch (e: any) {
      addLog(`[ERROR] ${e.message}`, "error");
      setStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      
      {/* Background Ambience */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <div className="absolute top-24 left-4 md:left-8 z-20">
        <Link href="/" className="group flex items-center gap-2 text-cyber-muted hover:text-white transition-colors">
            <div className="p-2 rounded-full border border-cyber-border group-hover:border-neon-blue/50 bg-black">
                <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold font-mono tracking-widest uppercase">Hub</span>
        </Link>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="glass-strong border-t border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neon-blue/20 text-neon-blue mb-4 border border-neon-blue/50">
                <Send className="w-8 h-8 ml-1" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Instant Transfer</h1>
            <p className="text-cyber-muted mt-2">Send SOL gaslessly to any address.</p>
          </div>

          <div className="space-y-6">
            
            {/* Recipient Input */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-cyber-muted uppercase tracking-wider ml-1">Recipient Address</label>
                <input 
                    type="text" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter Solana Address..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-neon-blue transition-colors"
                />
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-cyber-muted uppercase tracking-wider ml-1">Amount (SOL)</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-xl focus:outline-none focus:border-neon-blue transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold bg-white/10 px-2 py-1 rounded text-white">
                        SOL
                    </div>
                </div>
            </div>

            {/* Status Feedback */}
            {status === "success" && (
                <div className="bg-neon-green/10 border border-neon-green/30 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                    <div className="flex-1">
                        <p className="text-neon-green font-bold text-sm">Transfer Complete</p>
                        <a href={`https://solscan.io/tx/${txHash}?cluster=devnet`} target="_blank" className="text-xs text-white/60 hover:text-white underline">View Receipt</a>
                    </div>
                </div>
            )}

            {status === "error" && (
                <div className="bg-neon-red/10 border border-neon-red/30 p-4 rounded-xl flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-neon-red" />
                    <p className="text-neon-red font-bold text-sm">Transfer Failed. Check Console.</p>
                </div>
            )}

            {/* Action Button */}
            <button 
              onClick={handleSend}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-neon-blue to-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> SENDING...
                </>
              ) : !isConnected ? (
                <>
                  <Wallet className="w-5 h-5" /> CONNECT PASSKEY
                </>
              ) : (
                "SEND NOW"
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
