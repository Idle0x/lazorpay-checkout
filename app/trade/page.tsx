"use client";

import React, { useState, useEffect } from "react";
// FIX: Added 'Fingerprint' to the imports below
import { ArrowLeft, Activity, Lock, Unlock, Zap, TrendingUp, TrendingDown, RefreshCw, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

// Mock Chart Data Component
const ChartLine = ({ color }: { color: string }) => (
  <div className="flex items-end gap-1 h-12">
    {[...Array(20)].map((_, i) => (
      <div 
        key={i} 
        className={`w-1 rounded-t-sm ${color}`}
        style={{ height: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.5 }} 
      />
    ))}
  </div>
);

export default function TradePage() {
  const { signAndSendTransaction } = useWallet();
  const { isConnected, connectAuth, wallet } = useLazorContext();
  const { addLog, toggle, isOpen } = useConsole();

  const [sessionActive, setSessionActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [price, setPrice] = useState(145.20);

  // Simulate Live Price Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(p => p + (Math.random() - 0.5) * 0.5);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // 1. Activate Session (The Setup)
  const activateSession = async () => {
    if (!isConnected) {
      await connectAuth();
      return;
    }
    
    setIsProcessing(true);
    if (!isOpen) toggle();

    try {
      addLog(`[SESSION] Initializing Ephemeral Keypair...`, "info");
      addLog(`[AUTH] Requesting 1-Hour Session Delegation`, "warning");

      // Simulating Session Init via a 0 SOL auth transaction
      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet!.smartWallet),
        toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
        lamports: 0, 
      });

      const sig = await signAndSendTransaction({
        instructions: [ix],
        transactionOptions: { clusterSimulation: "devnet" }
      });

      addLog(`[CHAIN] Session Anchor Confirmed! Hash: ${sig.slice(0,8)}...`, "success");
      setSessionActive(true);

    } catch (e: any) {
      addLog(`[ERROR] ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. The Trade (Fast Execution)
  const executeTrade = async (side: 'buy' | 'sell') => {
    if (!sessionActive) return;

    setIsProcessing(true);
    addLog(`[TRADE] Executing ${side.toUpperCase()} Order @ ${price.toFixed(2)}`, "info");
    addLog(`[SESSION] Signing with Session Key (No Popup)...`, "success"); // Narrative

    try {
      // Real transaction to prove it works
      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet!.smartWallet),
        toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
        lamports: 1000, // Tiny amount
      });

      const sig = await signAndSendTransaction({
        instructions: [ix],
        transactionOptions: { clusterSimulation: "devnet" }
      });

      addLog(`[CHAIN] Order Filled! Hash: ${sig.slice(0,8)}...`, "success");

    } catch (e: any) {
      addLog(`[ERROR] ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-2 md:p-6 flex flex-col relative overflow-hidden font-mono">
      
      {/* 1. Header & Back */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <Link href="/" className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-widest uppercase">EXIT TERMINAL</span>
        </Link>
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-neon-green" : "bg-red-500"} animate-pulse`} />
            <span className="text-xs text-zinc-500">{isConnected ? "NET_ACTIVE" : "NET_OFFLINE"}</span>
        </div>
      </div>

      {/* 2. Main Terminal Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10 max-w-7xl mx-auto w-full">
        
        {/* LEFT: Chart & Info (8 Cols) */}
        <div className="lg:col-span-8 grid grid-rows-[auto_1fr] gap-4">
            {/* Ticker Tape */}
            <div className="bg-[#0A0A0A] border border-zinc-800 rounded-lg p-6 flex items-center justify-between">
                <div>
                    <h2 className="text-zinc-500 text-xs uppercase tracking-widest mb-1">SOL / USDC</h2>
                    <div className="text-5xl font-black tracking-tighter flex items-center gap-4">
                        {price.toFixed(2)}
                        <span className="text-lg font-bold text-neon-green flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" /> +2.4%
                        </span>
                    </div>
                </div>
                <Activity className="w-12 h-12 text-zinc-800" />
            </div>

            {/* The Chart Area */}
            <div className="bg-[#0A0A0A] border border-zinc-800 rounded-lg p-6 relative flex flex-col justify-end overflow-hidden group">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
                
                <div className="relative z-10 flex justify-between items-end h-64 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ChartLine color="bg-neon-green" />
                    <ChartLine color="bg-neon-red" />
                    <ChartLine color="bg-neon-green" />
                    <ChartLine color="bg-neon-green" />
                    <ChartLine color="bg-blue-500" />
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                    <span className="px-2 py-1 bg-zinc-900 rounded text-[10px] text-zinc-500">1H</span>
                    <span className="px-2 py-1 bg-zinc-800 text-white rounded text-[10px]">1D</span>
                    <span className="px-2 py-1 bg-zinc-900 rounded text-[10px] text-zinc-500">1W</span>
                </div>
            </div>
        </div>

        {/* RIGHT: Order Entry (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0A0A0A] border border-zinc-800 rounded-lg p-6 flex flex-col">
            
            <div className="mb-8 pb-8 border-b border-zinc-800">
                <h3 className="text-zinc-400 font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-neon-yellow" /> SESSION STATUS
                </h3>
                
                {sessionActive ? (
                    <div className="bg-neon-green/10 border border-neon-green/30 p-4 rounded-lg text-center animate-in fade-in">
                        <Unlock className="w-6 h-6 text-neon-green mx-auto mb-2" />
                        <div className="text-neon-green font-bold text-sm">SESSION ACTIVE</div>
                        <div className="text-zinc-500 text-[10px] mt-1">Trades auto-signed via Session Key</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-zinc-900/50 p-4 rounded-lg text-center border border-dashed border-zinc-700">
                            <Lock className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
                            <div className="text-zinc-400 text-xs">Session Locked</div>
                        </div>
                        <button 
                            onClick={activateSession}
                            disabled={isProcessing}
                            className="w-full py-3 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                            INITIALIZE SESSION
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-2">
                    <span>ORDER TYPE: MARKET</span>
                    <span>BAL: 14.2 SOL</span>
                </div>

                {/* BUY BUTTON */}
                <button 
                    onClick={() => executeTrade('buy')}
                    disabled={!sessionActive || isProcessing}
                    className="flex-1 bg-neon-green/10 border border-neon-green/50 hover:bg-neon-green/20 text-neon-green font-black text-2xl rounded flex items-center justify-center gap-4 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    <TrendingUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                    BUY
                </button>

                {/* SELL BUTTON */}
                <button 
                    onClick={() => executeTrade('sell')}
                    disabled={!sessionActive || isProcessing}
                    className="flex-1 bg-neon-red/10 border border-neon-red/50 hover:bg-neon-red/20 text-neon-red font-black text-2xl rounded flex items-center justify-center gap-4 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                    <TrendingDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                    SELL
                </button>
            </div>

        </div>
      </div>
    </div>
  );
}
