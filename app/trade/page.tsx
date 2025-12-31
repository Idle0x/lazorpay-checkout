"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowDownUp, Wallet, Clock, CheckCircle, Loader2 } from "lucide-react";
import { CyberCard } from "@/components/ui/CyberCard";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function TradePage() {
  const { connect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet, saveSession } = useLazorContext();
  const { addLog } = useConsole();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amount, setAmount] = useState("100"); // USD amount
  const [btcPrice, setBtcPrice] = useState(96420.50);

  // Simulate Live Price Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setBtcPrice(prev => prev + (Math.random() - 0.5) * 50);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const btcAmount = (parseFloat(amount) / btcPrice).toFixed(6);

  const handleTrade = async () => {
    setIsProcessing(true);
    try {
      if (!isConnected) {
        const data = await connect();
        if (data?.smartWallet) saveSession({ ...data, passkeyPubkey: "", walletDevice: "web" });
      } else {
        if (!wallet) return;
        addLog(`[TRADE] Buying ${btcAmount} BTC for $${amount} USDC`, "info");
        
        // Mock Trade Transaction (Self-Transfer to simulate activity)
        const ix = SystemProgram.transfer({
            fromPubkey: new PublicKey(wallet.smartWallet),
            toPubkey: new PublicKey(wallet.smartWallet), 
            lamports: 0,
        });

        const payload = {
            instructions: [ix],
            transactionOptions: { clusterSimulation: "devnet" as const }
        };

        const sig = await signAndSendTransaction(payload);
        addLog(`[CHAIN] Order Filled! TX: ${sig.slice(0,8)}...`, "success");
        setIsSuccess(true);
        setIsProcessing(false);
      }
    } catch (e: any) {
        addLog(`[ERROR] ${e.message}`, "error");
        setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
        <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="mx-auto w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mb-4 border border-neon-green">
                <CheckCircle className="w-10 h-10 text-neon-green" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">Order Executed</h2>
                <p className="text-cyber-muted mt-2">You bought <span className="text-white font-bold">{btcAmount} BTC</span></p>
            </div>
            <button onClick={() => setIsSuccess(false)} className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200">
                Place New Order
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Chart Header */}
      <div className="mb-6 space-y-1">
        <div className="flex items-center gap-2 text-cyber-muted text-xs font-mono uppercase">
            <TrendingUp className="w-4 h-4 text-neon-green" /> BTC / USD
        </div>
        <div className="text-4xl font-bold text-white font-mono">
            ${btcPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </div>
        <div className="text-neon-green text-sm font-bold flex items-center gap-1">
            +2.4% <span className="text-cyber-muted font-normal">Past 24h</span>
        </div>
      </div>

      <CyberCard className="space-y-6">
        
        {/* Input Area */}
        <div className="space-y-4">
            <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                    <label className="text-xs text-cyber-muted font-bold block mb-1">SPEND</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent text-2xl font-bold text-white outline-none w-32"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <div className="w-5 h-5 rounded-full bg-blue-500" />
                    <span className="font-bold text-sm">USDC</span>
                </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
                <div className="bg-cyber-gray border border-white/10 p-2 rounded-full">
                    <ArrowDownUp className="w-4 h-4 text-white" />
                </div>
            </div>

            <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                <div>
                    <label className="text-xs text-cyber-muted font-bold block mb-1">RECEIVE</label>
                    <div className="text-2xl font-bold text-white">{btcAmount}</div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                    <div className="w-5 h-5 rounded-full bg-orange-500" />
                    <span className="font-bold text-sm">BTC</span>
                </div>
            </div>
        </div>

        {/* Action Button */}
        <button
            onClick={handleTrade}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isProcessing 
                ? "bg-cyber-gray text-cyber-muted" 
                : "bg-neon-green text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            }`}
        >
            {isProcessing ? (
                <> <Loader2 className="w-5 h-5 animate-spin" /> Placing Order... </>
            ) : isConnected ? (
                <> Buy Bitcoin Now </>
            ) : (
                <> <Wallet className="w-5 h-5" /> Connect to Trade </>
            )}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-[10px] text-cyber-muted">
            <Clock className="w-3 h-3" /> Instant Settlement • 0% Fees
        </div>

      </CyberCard>
    </div>
  );
}
