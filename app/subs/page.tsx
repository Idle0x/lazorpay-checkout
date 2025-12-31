"use client";

import React, { useState } from "react";
import { Check, Zap, Shield, Globe, Loader2 } from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL, TransactionInstruction } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

function PricingCard({ title, price, features, recommended, onSelect, loading }: any) {
    return (
        <div className={`relative p-6 rounded-2xl border flex flex-col transition-all ${
            recommended 
            ? "bg-white/10 border-neon-blue shadow-2xl shadow-neon-blue/10 scale-105 z-10" 
            : "bg-black/40 border-white/10 hover:border-white/20"
        }`}>
            {recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-blue text-black text-[10px] font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                </div>
            )}
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <div className="mb-6">
                <span className="text-3xl font-bold text-white">{price}</span>
                <span className="text-cyber-muted text-sm">/mo</span>
            </div>
            <div className="space-y-3 mb-8 flex-1">
                {features.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-cyber-muted">
                        <Check className="w-4 h-4 text-neon-green shrink-0" /> {f}
                    </div>
                ))}
            </div>
            <button
                onClick={onSelect}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                    recommended 
                    ? "bg-neon-blue text-white hover:bg-blue-600" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : "Choose Plan"}
            </button>
        </div>
    )
}

export default function SubsPage() {
  const { connect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet, saveSession } = useLazorContext();
  const { addLog } = useConsole();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleSubscribe = async (id: string, name: string, price: number) => {
    setProcessingId(id);
    try {
        if (!isConnected) {
            const data = await connect();
            if (data?.smartWallet) saveSession({ ...data, passkeyPubkey: "", walletDevice: "web" });
            // Don't continue, let them click again after login
            setProcessingId(null);
            return;
        }

        if (!wallet) return;
        addLog(`[SUB] Initiating Plan: ${name}`, "info");

        // 1. Initial Payment
        const payIx = SystemProgram.transfer({
            fromPubkey: new PublicKey(wallet.smartWallet),
            toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
            lamports: Math.floor(price * LAMPORTS_PER_SOL),
        });

        // 2. Subscription Metadata (Memo)
        const subIx = new TransactionInstruction({
            keys: [],
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
            data: Buffer.from(`SUBSCRIBE: ${name} | RECURRING: MONTHLY`, "utf-8"),
        });

        const payload = {
            instructions: [payIx, subIx],
            transactionOptions: { clusterSimulation: "devnet" as const }
        };

        const sig = await signAndSendTransaction(payload);
        addLog(`[CHAIN] Subscription Active! ID: ${sig.slice(0,8)}...`, "success");
        alert(`Welcome to ${name}!`);
        
    } catch (e: any) {
        addLog(`[ERROR] ${e.message}`, "error");
    } finally {
        setProcessingId(null);
    }
  };

  return (
    <div className="py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="text-4xl font-black text-white">Simple Pricing</h1>
            <p className="text-cyber-muted">
                Demonstrating recurring billing logic on Solana. <br/>
                Approve once, delegate future payments.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PricingCard 
                title="Starter" 
                price="0.05 SOL" 
                features={["5 Projects", "Basic Analytics", "Community Support"]}
                loading={processingId === "starter"}
                onSelect={() => handleSubscribe("starter", "Starter Plan", 0.05)}
            />
            <PricingCard 
                title="Pro" 
                price="0.1 SOL" 
                recommended={true}
                features={["Unlimited Projects", "Advanced Analytics", "Priority Support", "Gasless Txns"]}
                loading={processingId === "pro"}
                onSelect={() => handleSubscribe("pro", "Pro Plan", 0.1)}
            />
            <PricingCard 
                title="Enterprise" 
                price="0.5 SOL" 
                features={["Custom Contracts", "SLA", "Dedicated Account Manager", "Audit Logs"]}
                loading={processingId === "ent"}
                onSelect={() => handleSubscribe("ent", "Enterprise Plan", 0.5)}
            />
        </div>
    </div>
  );
}
