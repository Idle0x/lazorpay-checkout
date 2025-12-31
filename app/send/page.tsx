"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Send, 
  ArrowRight, 
  CheckCircle, 
  Loader2, 
  AtSign, 
  User,
  ShieldCheck,
  Code2,
  Wallet,
  Search
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

export default function SendPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  
  // Resolution State
  const [isResolved, setIsResolved] = useState(false);
  const [inputType, setInputType] = useState<"username" | "address" | null>(null);
  
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { connect } = useWallet();
  const { isConnected } = useLazorContext();

  // Smart Input Detection Logic
  useEffect(() => {
    if (!recipient) {
      setIsResolved(false);
      setInputType(null);
      return;
    }

    // Heuristic: Solana addresses are usually 32-44 chars. Usernames are shorter.
    if (recipient.length > 25) {
      setInputType("address");
      setIsResolved(true); // Instant "valid" for addresses
    } else if (recipient.length > 2) {
      setInputType("username");
      // Simulate API lookup delay for usernames
      const timer = setTimeout(() => setIsResolved(true), 600);
      return () => clearTimeout(timer);
    } else {
      setIsResolved(false);
      setInputType(null);
    }
  }, [recipient]);

  const handleSend = async () => {
    setProcessing(true);
    try {
      if (!isConnected) await connect();
      await new Promise(r => setTimeout(r, 2000));
      setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setStep(1);
    setRecipient("");
    setAmount("");
    setSuccess(false);
    setIsResolved(false);
    setInputType(null);
  };

  return (
    <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className={`text-center space-y-4 mb-12 transition-all duration-500 ${step > 1 ? 'opacity-50 scale-90' : 'opacity-100'}`}>
        <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold font-mono uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">HUB</Link> / P2P TRANSFER
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
          INSTANT SEND
        </h1>
      </div>

      {/* 2. THE GLASS MONOLITH */}
      <div className="relative w-full max-w-2xl">
        
        {/* Floating Tech Reveal (Desktop) */}
        <div className="hidden lg:block absolute -right-64 top-0 w-56 animate-in fade-in slide-in-from-left duration-700 delay-500">
           <div className="glass p-5 rounded-2xl border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">
                 Gasless Relayer <ShieldCheck className="w-3 h-3" />
              </div>
              <pre className="text-[10px] font-mono text-zinc-400">
{`// Protocol pays fees
const tx = await relay.send({
  feePayer: "PRO_PAYMASTER",
  tx: signedTx
});`}
              </pre>
           </div>
        </div>

        <div className="glass-strong rounded-[3rem] p-8 md:p-12 min-h-[500px] flex flex-col justify-between shadow-2xl relative overflow-hidden bg-black/40">
          
          {/* Background Ambient Glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none transition-opacity duration-500 ${step === 3 ? 'opacity-0' : 'opacity-100'}`} />
          
          {/* SUCCESS STATE */}
          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
              <div className="w-32 h-32 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-16 h-16 text-emerald-400" />
              </div>
              <div className="text-center">
                <h2 className="text-4xl font-black text-white mb-2">SENT!</h2>
                <div className="text-xl text-zinc-400 flex items-center justify-center gap-2">
                  {amount} SOL to 
                  <span className="text-white font-bold flex items-center gap-1">
                    {inputType === 'username' ? '@' : ''}
                    {recipient.length > 10 ? recipient.slice(0, 4) + '...' + recipient.slice(-4) : recipient}
                  </span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                   <ShieldCheck className="w-3 h-3" /> Gas Fees Sponsored
                </div>
              </div>
              <button onClick={reset} className="btn-zinc w-full mt-8">
                Send Another
              </button>
            </div>
          ) : (
            <>
              {/* STEP INDICATOR */}
              <div className="flex justify-between items-center mb-12 relative z-10">
                 <div className="flex gap-2">
                    {[1, 2, 3].map((s) => (
                       <div key={s} className={`h-2 rounded-full transition-all duration-500 ${s <= step ? 'w-12 bg-white' : 'w-4 bg-white/20'}`} />
                    ))}
                 </div>
                 <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {step === 1 ? 'RECIPIENT' : step === 2 ? 'AMOUNT' : 'CONFIRM'}
                 </div>
              </div>

              {/* INPUT AREA */}
              <div className="flex-1 flex flex-col justify-center relative z-10">
                
                {/* STEP 1: RECIPIENT */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <label className="text-center block text-zinc-500 text-sm font-bold uppercase tracking-widest">
                      Username or Address
                    </label>
                    <div className="relative">
                       {/* Dynamic Icon based on input type */}
                       <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-colors ${isResolved ? 'text-emerald-400' : 'text-zinc-600'}`}>
                          {inputType === 'address' ? <Wallet className="w-6 h-6" /> : inputType === 'username' ? <AtSign className="w-6 h-6" /> : <Search className="w-6 h-6" />}
                       </div>
                       
                       <input 
                         type="text" 
                         value={recipient}
                         onChange={(e) => setRecipient(e.target.value)}
                         placeholder="e.g. alex or 8x2...9z"
                         className={`input-hero pl-16 !text-left ${recipient.length > 25 ? '!text-2xl md:!text-4xl' : ''}`} // Shrink font for long addresses
                         autoFocus
                       />
                       
                       {/* Resolution Badge */}
                       {isResolved && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 animate-in fade-in duration-300">
                             {inputType === 'address' ? <Wallet className="w-4 h-4" /> : <User className="w-4 h-4" />}
                             <span className="text-xs font-bold uppercase tracking-wide">
                                {inputType === 'address' ? 'Wallet Detected' : 'Resolved'}
                             </span>
                          </div>
                       )}
                    </div>
                  </div>
                )}

                {/* STEP 2: AMOUNT */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                    <label className="text-center block text-zinc-500 text-sm font-bold uppercase tracking-widest">How much?</label>
                    <div className="relative flex items-center justify-center">
                       <input 
                         type="number" 
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         placeholder="0.00"
                         className="input-hero"
                         autoFocus
                       />
                       <span className="text-4xl font-bold text-zinc-600 ml-2">SOL</span>
                    </div>
                  </div>
                )}

                {/* STEP 3: CONFIRM */}
                {step === 3 && (
                   <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500 text-center">
                      <div className="space-y-2">
                         <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Sending</div>
                         <div className="text-6xl font-black text-white">{amount} <span className="text-zinc-600">SOL</span></div>
                      </div>
                      <div className="w-full h-px bg-white/10" />
                      <div className="space-y-2">
                         <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest">To</div>
                         <div className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2 break-all px-4">
                            {inputType === 'username' && <span className="text-emerald-400">@</span>}
                            {recipient}
                         </div>
                      </div>
                   </div>
                )}

              </div>

              {/* ACTION FOOTER */}
              <div className="mt-12 relative z-10">
                {step < 3 ? (
                  <button 
                    onClick={() => {
                        if ((step === 1 && recipient) || (step === 2 && amount)) {
                            setStep(prev => prev + 1 as any);
                        }
                    }}
                    className="w-full h-20 rounded-2xl glass hover:bg-white/10 flex items-center justify-between px-8 group transition-all"
                  >
                    <span className="text-xl font-bold text-white">CONTINUE</span>
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                       <ArrowRight className="w-6 h-6" />
                    </div>
                  </button>
                ) : (
                  <button 
                    onClick={handleSend}
                    disabled={processing}
                    className="w-full py-6 rounded-2xl bg-white text-black text-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                     {processing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8" />}
                     {processing ? "RELAYING..." : "SEND NOW"}
                  </button>
                )}
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
