"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Clock, 
  Shield, 
  Activity, 
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

// Simulated Price Feed
const usePriceFeed = () => {
  const [price, setPrice] = useState(145.20);
  const [trend, setTrend] = useState<'up' | 'down'>('up');

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.5;
      setPrice(p => {
        const newPrice = p + change;
        setTrend(newPrice > p ? 'up' : 'down');
        return newPrice;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { price, trend };
};

export default function TradePage() {
  const { price, trend } = usePriceFeed();
  const [amount, setAmount] = useState("");
  const [side, setSide] = useState<'buy' | 'sell' | null>(null); // 'buy' | 'sell'
  const [sessionActive, setSessionActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', msg: string} | null>(null);

  const { connect } = useWallet();
  const { isConnected } = useLazorContext();

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const toggleSession = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate Session Sign
    setSessionActive(!sessionActive);
    setProcessing(false);
  };

  const executeTrade = async (tradeSide: 'buy' | 'sell') => {
    if (!amount) return;
    
    setSide(tradeSide);
    setProcessing(true);

    // If session is active, trade is INSTANT (200ms). If not, standard delay (2000ms).
    const delay = sessionActive ? 200 : 2000;
    
    await new Promise(r => setTimeout(r, delay));
    
    setNotification({
      type: 'success',
      msg: `${tradeSide.toUpperCase()} Order Filled @ ${price.toFixed(2)}`
    });
    setProcessing(false);
    setAmount("");
    setSide(null);
  };

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden flex flex-col">
      
      {/* 1. HEADER & TICKER */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full mb-12 gap-8">
        
        {/* Breadcrumb & Title */}
        <div className="text-center md:text-left space-y-2">
           <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold font-mono uppercase tracking-widest">
             <Link href="/" className="hover:text-white transition-colors">HUB</Link> / PRO TERMINAL
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center gap-4">
             SOL / USDC
           </h1>
        </div>

        {/* Live Ticker */}
        <div className={`
           glass-strong px-8 py-4 rounded-2xl flex items-center gap-6 border-l-4 transition-colors duration-500
           ${trend === 'up' ? 'border-emerald-500 bg-emerald-500/5' : 'border-red-500 bg-red-500/5'}
        `}>
           <div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Mark Price</div>
              <div className={`text-4xl font-black font-mono flex items-center gap-2 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                 ${price.toFixed(2)}
                 {trend === 'up' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
           </div>
           <div className="h-10 w-px bg-white/10" />
           <div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">24h Vol</div>
              <div className="text-xl font-bold text-white">$4.2B</div>
           </div>
        </div>

        {/* Session Toggle */}
        <button 
           onClick={toggleSession}
           disabled={processing}
           className={`
              relative group flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300
              ${sessionActive 
                 ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' 
                 : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'
              }
           `}
        >
           {sessionActive ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
           <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5">
                 {sessionActive ? 'TURBO MODE' : 'STANDARD MODE'}
              </div>
              <div className="text-xs font-bold text-white">
                 {sessionActive ? 'Session Active' : 'Enable Session'}
              </div>
           </div>
           
           {/* Tech Reveal Tooltip */}
           <div className="absolute top-full right-0 mt-4 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              <div className="glass p-4 rounded-xl border-l-4 border-yellow-500">
                 <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold mb-2 uppercase tracking-wider">
                    Session Keys <Zap className="w-3 h-3" />
                 </div>
                 <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Delegates a temporary sub-key to sign trades automatically for 1 hour. No wallet popups.
                 </p>
              </div>
           </div>
        </button>

      </div>

      {/* 2. THE SPLIT TERMINAL */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-10">
        
        {/* BUY PANEL (Left) */}
        <div className="relative group">
           <div className="absolute inset-0 bg-emerald-500/5 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative h-full glass-strong rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between border-emerald-500/20 hover:border-emerald-500/50 transition-colors">
              
              <div>
                 <div className="text-emerald-400 font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Long / Buy
                 </div>
                 <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent text-7xl font-black text-white outline-none placeholder-emerald-500/20"
                 />
                 <div className="text-xl text-zinc-500 font-bold mt-2">SOL</div>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between text-sm font-mono text-zinc-400">
                    <span>Avail: 145 USDC</span>
                    <span>Est: {(parseFloat(amount || "0") / price).toFixed(4)} SOL</span>
                 </div>
                 <button 
                    onClick={() => executeTrade('buy')}
                    disabled={processing}
                    className="w-full py-8 rounded-2xl bg-emerald-500 text-black text-3xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                 >
                    {processing && side === 'buy' ? 'FILLING...' : 'BUY SOL'}
                 </button>
              </div>

           </div>
        </div>

        {/* SELL PANEL (Right) */}
        <div className="relative group">
           <div className="absolute inset-0 bg-red-500/5 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative h-full glass-strong rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between border-red-500/20 hover:border-red-500/50 transition-colors">
              
              <div>
                 <div className="text-red-400 font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" /> Short / Sell
                 </div>
                 <input 
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent text-7xl font-black text-white outline-none placeholder-red-500/20"
                 />
                 <div className="text-xl text-zinc-500 font-bold mt-2">SOL</div>
              </div>

              <div className="space-y-6">
                 <div className="flex justify-between text-sm font-mono text-zinc-400">
                    <span>Avail: 4.20 SOL</span>
                    <span>Est: ${(parseFloat(amount || "0") * price).toFixed(2)} USDC</span>
                 </div>
                 <button 
                    onClick={() => executeTrade('sell')}
                    disabled={processing}
                    className="w-full py-8 rounded-2xl bg-red-500 text-white text-3xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-500/20"
                 >
                    {processing && side === 'sell' ? 'FILLING...' : 'SELL SOL'}
                 </button>
              </div>

           </div>
        </div>

      </div>

      {/* NOTIFICATION TOAST */}
      {notification && (
         <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="glass-strong px-6 py-4 rounded-full flex items-center gap-4 border border-white/20 shadow-2xl bg-black/80 backdrop-blur-xl">
               {notification.type === 'success' ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <AlertCircle className="w-6 h-6 text-red-400" />}
               <span className="text-lg font-bold text-white">{notification.msg}</span>
               {sessionActive && (
                  <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded uppercase tracking-wider">
                     <Zap className="w-3 h-3 inline mr-1" /> Turbo
                  </span>
               )}
            </div>
         </div>
      )}

    </div>
  );
}
