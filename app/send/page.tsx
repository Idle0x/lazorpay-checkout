"use client";

import React, { useState } from "react";
import { Send, User, MessageSquare, Wallet, History, ArrowRight } from "lucide-react";
import { CyberCard } from "@/components/ui/CyberCard";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL, TransactionInstruction } from "@solana/web3.js";

export default function SendPage() {
  const { connect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet, saveSession } = useLazorContext();
  const { addLog } = useConsole();

  const [isProcessing, setIsProcessing] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const handleSend = async () => {
    setIsProcessing(true);
    try {
      if (!isConnected) {
        addLog("[AUTH] Requesting Biometric Access...", "info");
        const data = await connect();
        if (data?.smartWallet) {
           saveSession({ ...data, passkeyPubkey: "", walletDevice: "web" });
        }
      } else {
        if (!wallet) return;
        if (!recipient || !amount) throw new Error("Please enter a recipient and amount");

        addLog(`[TX] Sending ${amount} SOL to ${recipient.slice(0,6)}...`, "info");
        
        // 1. Transfer Instruction
        const transferIx = SystemProgram.transfer({
            fromPubkey: new PublicKey(wallet.smartWallet),
            toPubkey: new PublicKey(recipient), 
            lamports: Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL),
        });

        // 2. Memo Instruction (The "Social" aspect)
        const memoIx = new TransactionInstruction({
            keys: [],
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
            data: Buffer.from(memo || "Sent via LazorPay", "utf-8"),
        });

        const payload = {
            instructions: [transferIx, memoIx],
            transactionOptions: { clusterSimulation: "devnet" as const }
        };

        const sig = await signAndSendTransaction(payload);
        addLog(`[CHAIN] Sent! ID: ${sig.slice(0,8)}...`, "success");
        setIsProcessing(false);
        setAmount("");
        setMemo("");
        alert(`Successfully sent ${amount} SOL!`);
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
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-bold text-white">Send Money</h2>
            <p className="text-cyber-muted text-xs">Instant. Gasless. Global.</p>
        </div>
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <Send className="w-5 h-5 text-neon-blue" />
        </div>
      </div>

      <CyberCard className="space-y-6">
        
        {/* RECIPIENT INPUT */}
        <div className="space-y-2">
            <label className="text-xs text-cyber-muted font-mono uppercase">Recipient</label>
            <div className="flex items-center gap-3 bg-black/50 p-3 rounded-xl border border-white/10 focus-within:border-neon-blue transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
                <input 
                    type="text" 
                    placeholder="Solana Address or @username"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-transparent w-full outline-none text-white text-sm font-mono placeholder-white/20"
                />
            </div>
            {/* Quick Contacts Mock */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['Alice', 'Bob', 'Kora'].map(name => (
                    <button key={name} onClick={() => setRecipient("GjK...3x1")} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[10px] text-cyber-muted hover:bg-white/10 hover:text-white transition-colors border border-white/5">
                        <History className="w-3 h-3" /> {name}
                    </button>
                ))}
            </div>
        </div>

        {/* AMOUNT INPUT */}
        <div className="space-y-2">
            <label className="text-xs text-cyber-muted font-mono uppercase">Amount</label>
            <div className="relative">
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-5xl font-bold text-white placeholder-white/10 outline-none py-2"
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center gap-2">
                    <span className="text-sm font-bold text-white/50">SOL</span>
                    <button className="text-[10px] text-neon-blue hover:underline">MAX</button>
                </div>
            </div>
        </div>

        {/* MEMO INPUT */}
        <div className="space-y-2">
            <label className="text-xs text-cyber-muted font-mono uppercase">Note</label>
            <div className="flex items-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                <MessageSquare className="w-4 h-4 text-white/30" />
                <input 
                    type="text" 
                    placeholder="What's this for?"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="bg-transparent w-full outline-none text-sm text-white placeholder-white/20"
                />
            </div>
        </div>

        {/* SEND BUTTON */}
        <button
            onClick={handleSend}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isProcessing 
                ? "bg-cyber-gray text-cyber-muted" 
                : "bg-white text-black hover:bg-neon-blue hover:text-white shadow-lg shadow-neon-blue/20"
            }`}
        >
            {isProcessing ? "Sending..." : isConnected ? (
                <>Send Now <ArrowRight className="w-5 h-5" /></>
            ) : (
                <> <Wallet className="w-5 h-5" /> Connect to Send </>
            )}
        </button>

      </CyberCard>
    </div>
  );
}
