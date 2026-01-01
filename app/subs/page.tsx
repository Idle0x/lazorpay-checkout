"use client";

import React, { useState } from "react";
import { ArrowLeft, Check, CreditCard, Zap, Shield, Loader2, Crown } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

const PLANS = [
  {
    id: "basic",
    name: "CITIZEN",
    price: "0.5 SOL",
    period: "/ month",
    features: ["Basic Access", "Public Nodes", "Standard Support"],
    color: "border-white/10",
    glow: "group-hover:shadow-white/10",
    icon: Shield
  },
  {
    id: "pro",
    name: "OPERATIVE",
    price: "2.0 SOL",
    period: "/ month",
    features: ["Priority Access", "Private RPC", "24/7 Uplink", "Auto-Sign"],
    color: "border-neon-blue/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    popular: true,
    icon: Zap
  },
  {
    id: "corp",
    name: "SYNDICATE",
    price: "10.0 SOL",
    period: "/ month",
    features: ["Root Access", "Dedicated Subnet", "Custom Protocols", "Audit Logs"],
    color: "border-neon-purple/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    icon: Crown
  }
];

export default function SubsPage() {
  const { signAndSendTransaction } = useWallet();
  const { isConnected, connectAuth, wallet } = useLazorContext();
  const { addLog, toggle, isOpen } = useConsole();

  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (!isConnected) {
      await connectAuth();
      return;
    }

    setLoadingId(plan.id);
    if (!isOpen) toggle();

    try {
      addLog(`[SUBS] Initiating Recurring Protocol: ${plan.name}`, "info");
      addLog(`[POLICY] Authorizing Pull: ${plan.price} ${plan.period}`, "warning");

      // 1. Build Transaction
      // Simulates authorizing a Subscription Contract
      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet!.smartWallet),
        toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
        lamports: 0, // Zero-value auth txn
      });

      addLog(`[SDK] Building Delegate Authority Instruction...`, "info");

      // 2. Sign & Send
      const sig = await signAndSendTransaction({
        instructions: [ix],
        transactionOptions: { clusterSimulation: "devnet" }
      });

      addLog(`[CHAIN] Subscription Active! Hash: ${sig.slice(0,8)}...`, "success");
      setActivePlan(plan.id);

    } catch (e: any) {
      addLog(`[ERROR] ${e.message}`, "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12 flex flex-col relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mb-16">
        <Link href="/" className="inline-flex items-center gap-2 text-cyber-muted hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold font-mono uppercase tracking-widest">Back to Hub</span>
        </Link>
        
        <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 mb-6 border border-white/10">
                <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">RECURRING <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ACCESS</span></h1>
            <p className="text-cyber-muted max-w-xl mx-auto text-lg">
                Authorize automated payments via LazorKit Smart Accounts. 
                Zero friction. Total control.
            </p>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {PLANS.map((plan) => {
            const isActive = activePlan === plan.id;
            const isProcessing = loadingId === plan.id;
            
            return (
                <div 
                    key={plan.id}
                    className={`
                        relative bg-[#0a0a0a] border rounded-3xl p-8 transition-all duration-300 group hover:-translate-y-2
                        ${plan.color} ${plan.glow} ${isActive ? 'ring-2 ring-neon-green border-neon-green bg-green-900/10' : ''}
                    `}
                >
                    {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-blue text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                            Most Popular
                        </div>
                    )}

                    <div className="mb-8">
                        <plan.icon className={`w-10 h-10 mb-6 ${isActive ? 'text-neon-green' : 'text-white/50'}`} />
                        <h3 className="text-lg font-bold tracking-widest text-cyber-muted mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">{plan.price}</span>
                            <span className="text-sm text-cyber-muted">{plan.period}</span>
                        </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                <Check className="w-4 h-4 text-white" />
                                {feat}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={isProcessing || isActive}
                        className={`
                            w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                            ${isActive 
                                ? 'bg-neon-green text-black cursor-default' 
                                : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02] active:scale-95'
                            }
                        `}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> AUTHORIZING...
                            </>
                        ) : isActive ? (
                            <>
                                <Check className="w-5 h-5" /> ACTIVE PLAN
                            </>
                        ) : !isConnected ? (
                            "CONNECT WALLET"
                        ) : (
                            "SUBSCRIBE NOW"
                        )}
                    </button>
                </div>
            );
        })}
      </div>

    </div>
  );
}
