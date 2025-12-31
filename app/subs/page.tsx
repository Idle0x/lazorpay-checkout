"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  Zap, 
  Shield, 
  Globe, 
  CreditCard,
  Code2,
  Loader2,
  Infinity
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

// --- PLANS DATA ---
const PLANS = [
  {
    id: "starter",
    name: "STARTER",
    price: 5,
    features: ["1,000 tx/mo", "Basic Analytics", "Community Support"],
    color: "bg-white/5 border-white/10", // Basic Glass
    accent: "text-zinc-400",
    icon: Globe
  },
  {
    id: "pro",
    name: "PRO",
    price: 25,
    features: ["Unlimited tx", "Priority Relayer", "Gasless for Users", "24/7 Support"],
    color: "bg-gradient-to-b from-indigo-900/50 to-purple-900/50 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)]", // Holographic
    accent: "text-indigo-400",
    icon: Zap,
    popular: true
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: 99,
    features: ["Dedicated Nodes", "Custom Contracts", "SLA Guarantee", "Audit Reports"],
    color: "bg-zinc-900 border-yellow-500/20", // Obsidian
    accent: "text-yellow-500",
    icon: Shield
  }
];

export default function SubsPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  
  const { connect } = useWallet();
  const { isConnected } = useLazorContext();

  const handleSubscribe = async (planId: string) => {
    if (!isConnected) {
      await connect();
      return;
    }
    
    setProcessingId(planId);
    // Simulate Allowance Approval
    await new Promise(r => setTimeout(r, 2000));
    setActiveSub(planId);
    setProcessingId(null);
  };

  return (
    <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="text-center space-y-6 mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold font-mono uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">HUB</Link> / RECURRING
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
          SAAS ENGINE
        </h1>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center p-1 rounded-full bg-white/5 border border-white/10">
           <button 
             onClick={() => setBilling('monthly')}
             className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${billing === 'monthly' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
           >
             Monthly
           </button>
           <button 
             onClick={() => setBilling('yearly')}
             className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${billing === 'yearly' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
           >
             Yearly <span className="text-[9px] text-emerald-500 ml-1">-20%</span>
           </button>
        </div>
      </div>

      {/* 2. THE MONOLITHS */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
         
         {/* Tech Reveal (Desktop Float) */}
         <div className="hidden xl:block absolute -right-48 top-0 w-56 animate-in fade-in slide-in-from-left duration-700 delay-500 pointer-events-none">
           <div className="glass p-5 rounded-2xl border-l-4 border-indigo-500">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-2 uppercase tracking-wider">
                 Auto-Approve <Infinity className="w-3 h-3" />
              </div>
              <pre className="text-[10px] font-mono text-zinc-400">
{`// Auth once, pay forever
await wallet.approve({
  spender: "NETFLIX_DAO",
  limit: "25 SOL/mo"
});`}
              </pre>
           </div>
        </div>

        {PLANS.map((plan) => {
          const isProcessing = processingId === plan.id;
          const isActive = activeSub === plan.id;
          const finalPrice = billing === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price;

          return (
            <div 
              key={plan.id}
              className={`
                relative group rounded-[2.5rem] p-8 md:p-10 border transition-all duration-500 ease-out
                ${plan.color}
                ${plan.popular ? 'scale-105 z-20 lg:-mt-12 shadow-2xl' : 'hover:scale-[1.02]'}
                hover:-translate-y-4
              `}
            >
               {/* Popular Badge */}
               {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/50">
                     Most Popular
                  </div>
               )}

               <div className="space-y-8">
                  {/* Icon & Name */}
                  <div className="flex items-center justify-between">
                     <plan.icon className={`w-8 h-8 ${plan.accent}`} />
                     <h3 className={`text-xl font-black tracking-widest ${plan.accent}`}>{plan.name}</h3>
                  </div>

                  {/* Price */}
                  <div>
                     <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white">${finalPrice}</span>
                        <span className="text-zinc-500 font-bold">/mo</span>
                     </div>
                     <p className="text-xs text-zinc-500 mt-2">Billed {billing}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4">
                     {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                           <Check className={`w-4 h-4 ${plan.accent}`} />
                           {feat}
                        </li>
                     ))}
                  </ul>

                  {/* Action Button */}
                  <button 
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing || isActive}
                    className={`
                      w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all
                      ${isActive 
                        ? 'bg-emerald-500 text-white cursor-default' 
                        : 'bg-white text-black hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {isProcessing ? (
                       <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Authorizing...
                       </div>
                    ) : isActive ? (
                       <div className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" /> Active Plan
                       </div>
                    ) : (
                       <div className="flex items-center justify-center gap-2">
                          {isConnected ? "Auto-Pay" : "Connect"}
                       </div>
                    )}
                  </button>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
