"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Send, 
  User, 
  Check, 
  Loader2, 
  ArrowRight, 
  ShieldCheck,
  Code2,
  Fingerprint
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function SendPage() {
  // State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [isValidHandle, setIsValidHandle] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { connect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet } = useLazorContext();

  // --- LOGIC: RESOLVE HANDLE ---
  useEffect(() => {
    if (recipient.startsWith("@") && recipient.length > 3) {
      setIsResolving(true);
      // Simulate API lookup
      const timer = setTimeout(() => {
        setIsResolving(false);
        setIsValidHandle(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setIsValidHandle(false);
    }
  }, [recipient]);

  // --- LOGIC: EXECUTE TX ---
  const handleSend = async () => {
    setProcessing(true);
    try {
      if (!isConnected) {
        await connect();
        await new Promise(r => setTimeout(r, 1000));
      }
      
      // Simulate Relayer Delay
      await new Promise(r => setTimeout(r, 2000));
      setStep(3); // Success
      
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className={`absolute top-12 left-0 right-0 text-center transition-all duration-500 ${step === 3 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="inline-flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase tracking-widest mb-4">
          <Link href="/" className="hover:text-white transition-colors">HUB</Link> / SEND
        </div>
      </div>

      {/* 2. THE GLASS CREDIT CARD (Main Stage) */}
      <div className="relative w-full max-w-xl aspect-[1.586/1]">
        
        {/* Background Glow */}
        <div className={`absolute -inset-1 rounded-3xl blur-2xl transition-all duration-1000 ${isValidHandle ? 'bg-emerald-500/20' : 'bg-cyan-500/10'}`} />

        <div className="relative w-full h-full glass-strong rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          
          {/* Top Bar: Tech Specs */}
          <div className="p-6 flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold tracking-widest text-white/40">P2P RELAYER</span>
            </div>
            {/* Tech Reveal Badge */}
            <div className="group relative">
               <div className="cursor-help flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider">
                  <ShieldCheck className="w-3 h-3" /> GASLESS
               </div>
               {/* Hover Popup */}
               <div className="absolute right-0 top-full mt-4 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="glass p-4 rounded-xl border-l-4 border-emerald-500 bg-black">
                     <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                        <Code2 className="w-3 h-3" /> RELAYER LOGIC
                     </div>
                     <p className="text-[10px] text-zinc-400 leading-relaxed">
                        The protocol pays the SOL fees. You only sign the intent.
                        <br/><br/>
                        <span className="font-mono text-white">feePayer = relayerKeypair;</span>
                     </p>
                  </div>
               </div>
            </div>
          </div>

          {/* MIDDLE: THE INPUTS */}
          <div className="flex-1 flex flex-col justify-center px-8 relative">
            
            {/* STEP 1: RECIPIENT */}
            {step === 1 && (
              <div className="animate-in fade-in zoom-in duration-500 space-y-4">
                <label className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase block text-center">
                  Recipient Handle
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="@username"
                    className="input-hero text-5xl md:text-6xl"
                    autoFocus
                  />
                  {/* Resolution Indicator */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    {isResolving && <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />}
                    {isValidHandle && !isResolving && <Check className="w-8 h-8 text-emerald-400" />}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: AMOUNT */}
            {step === 2 && (
               <div className="animate-in fade-in zoom-in duration-500 space-y-4">
                 <button onClick={() => setStep(1)} className="absolute top-0 left-8 text-xs text-zinc-500 hover:text-white flex items-center gap-1">
                    ← BACK
                 </button>
                 <label className="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase block text-center">
                   Amount (USDC)
                 </label>
                 <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl text-zinc-600 font-bold">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="input-hero w-auto max-w-[80%]"
                      autoFocus
                    />
                 </div>
               </div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 3 && (
               <div className="text-center animate-in zoom-in duration-500 space-y-6">
                  <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                     <Check className="w-12 h-12 text-emerald-400" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black text-white mb-2">SENT {amount} USDC</h2>
                     <p className="text-zinc-500 text-sm">To <span className="text-white">{recipient}</span> • Gas: <span className="text-emerald-400">$0.00</span></p>
                  </div>
                  <button onClick={() => { setStep(1); setRecipient(""); setAmount(""); }} className="text-xs font-bold text-zinc-500 hover:text-white tracking-widest border-b border-transparent hover:border-white transition-all">
                     SEND ANOTHER
                  </button>
               </div>
            )}

          </div>

          {/* BOTTOM: THE ACTION BUTTON */}
          {step !== 3 && (
            <button
               onClick={() => {
                  if (step === 1 && isValidHandle) setStep(2);
                  if (step === 2 && amount) handleSend();
               }}
               disabled={step === 1 && !isValidHandle || processing}
               className={`h-24 w-full flex items-center justify-center gap-3 text-xl font-bold tracking-widest transition-all duration-500
                  ${(step === 1 && !isValidHandle) ? 'bg-zinc-900/50 text-zinc-600 cursor-not-allowed' : 'bg-white text-black hover:bg-emerald-400 hover:text-white'}
               `}
            >
               {processing ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
               ) : (
                  <>
                     {step === 1 ? "NEXT" : (isConnected ? "CONFIRM" : "CONNECT & SEND")}
                     {step === 1 ? <ArrowRight className="w-6 h-6" /> : <Fingerprint className="w-6 h-6" />}
                  </>
               )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
