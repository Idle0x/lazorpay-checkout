"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowDownUp, 
  Settings, 
  RefreshCcw, 
  Zap, 
  Code2,
  Wallet,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

export default function SwapPage() {
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState("");
  const [isSwapping, setIsSwapping] = useState(false); // UI state for the flip animation
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Token State
  const [fromToken, setFromToken] = useState({ sym: "SOL", color: "text-cyan-400" });
  const [toToken, setToToken] = useState({ sym: "USDC", color: "text-purple-400" });

  const { connect } = useWallet();
  const { isConnected } = useLazorContext();

  // Simulate Live Quoting
  useEffect(() => {
    if (!amount) {
      setQuote("");
      return;
    }
    // Simulate calculation delay
    const timer = setTimeout(() => {
      const val = parseFloat(amount) * 145.20; // Fake SOL price
      setQuote(val.toFixed(2));
    }, 200);
    return () => clearTimeout(timer);
  }, [amount]);

  const handleFlip = () => {
    setIsSwapping(true);
    setTimeout(() => {
      // Swap Logic
      setFromToken(toToken);
      setToToken(fromToken);
      setAmount(quote);
      setIsSwapping(false);
    }, 300);
  };

  const executeSwap = async () => {
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

  return (
    <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="text-center space-y-4 mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold font-mono uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">HUB</Link> / DEFI SWAP
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter flex items-center gap-4 justify-center">
          ATOMIC SWAP <Zap className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" />
        </h1>
      </div>

      {/* 2. THE REACTOR (Main Interface) */}
      <div className="relative w-full max-w-xl">
        
        {/* Tech Reveal Sidebar (Desktop) */}
        <div className="hidden xl:block absolute -right-72 top-20 w-64 animate-in fade-in slide-in-from-left duration-700 delay-200">
           <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">
                 JIT Liquidity <Code2 className="w-3 h-3" />
              </div>
              <pre className="text-[10px] font-mono text-zinc-400">
{`// 1 Signature, 2 Transfers
const ix = await jupiter.swap({
  route: bestRoute,
  userPublicKey: wallet.key
});`}
              </pre>
           </div>
        </div>

        {/* Success Overlay */}
        {success ? (
           <div className="glass-strong rounded-[3rem] p-12 min-h-[500px] flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
                 <CheckCircle className="w-12 h-12 text-emerald-400" />
              </div>
              <h2 className="text-4xl font-black text-white mb-2">SWAP COMPLETE</h2>
              <p className="text-zinc-400 text-lg mb-8">
                 Exchanged <span className="text-white font-bold">{amount} {fromToken.sym}</span> for <span className="text-white font-bold">{quote} {toToken.sym}</span>
              </p>
              <button 
                onClick={() => { setSuccess(false); setAmount(""); }}
                className="btn-zinc"
              >
                New Trade
              </button>
           </div>
        ) : (
           <div className="relative space-y-4">
              
              {/* TOP CONTAINER (FROM) */}
              <div className={`glass-strong rounded-[2.5rem] p-8 transition-all duration-500 transform ${isSwapping ? 'translate-y-40 opacity-50 scale-90' : 'translate-y-0 opacity-100'}`}>
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Selling</span>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Balance: 4.20</span>
                 </div>
                 
                 <div className="flex items-center justify-between gap-4">
                    <input 
                       type="number"
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       placeholder="0.00"
                       className="w-full bg-transparent text-6xl font-black text-white outline-none placeholder-zinc-700"
                    />
                    <div className={`text-4xl font-black ${fromToken.color} px-4 py-2 rounded-xl bg-white/5 border border-white/10`}>
                       {fromToken.sym}
                    </div>
                 </div>
              </div>

              {/* LIGHTNING SWITCH BUTTON */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                 <button 
                    onClick={handleFlip}
                    className="w-16 h-16 rounded-full bg-black border-4 border-zinc-800 flex items-center justify-center hover:scale-110 hover:border-cyan-400 transition-all duration-300 shadow-xl group"
                 >
                    <ArrowDownUp className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-500" />
                 </button>
              </div>

              {/* BOTTOM CONTAINER (TO) */}
              <div className={`glass-strong rounded-[2.5rem] p-8 bg-black/40 transition-all duration-500 transform ${isSwapping ? '-translate-y-40 opacity-50 scale-90' : 'translate-y-0 opacity-100'}`}>
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Buying</span>
                    {amount && <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1"><Zap className="w-3 h-3" /> Best Price</span>}
                 </div>
                 
                 <div className="flex items-center justify-between gap-4">
                    <div className="w-full text-6xl font-black text-zinc-300 truncate">
                       {quote || "0.00"}
                    </div>
                    <div className={`text-4xl font-black ${toToken.color} px-4 py-2 rounded-xl bg-white/5 border border-white/10`}>
                       {toToken.sym}
                    </div>
                 </div>
              </div>

              {/* ACTION BUTTON */}
              <button 
                 onClick={executeSwap}
                 disabled={processing}
                 className="w-full py-6 mt-4 rounded-3xl bg-white text-black text-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                 {processing ? (
                    <><Loader2 className="w-8 h-8 animate-spin" /> CONFIRMING</>
                 ) : (
                    <>{isConnected ? "SWAP ASSETS" : "CONNECT WALLET"}</>
                 )}
              </button>

           </div>
        )}

      </div>
    </div>
  );
}
