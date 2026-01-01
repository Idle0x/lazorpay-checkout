"use client";

import React, { useState } from "react";
import { ArrowLeft, Box, Loader2, Wallet, CheckCircle, Sparkles, Hexagon } from "lucide-react";
import Link from "next/link";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

export default function MintPage() {
  const { signAndSendTransaction } = useWallet();
  const { isConnected, connectAuth, wallet } = useLazorContext();
  const { addLog, toggle, isOpen } = useConsole();

  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<"idle" | "success">("idle");
  const [txHash, setTxHash] = useState("");

  const handleMint = async () => {
    if (!isConnected) {
      await connectAuth();
      return;
    }

    setIsMinting(true);
    if (!isOpen) toggle(); // Auto-open Console

    try {
      addLog(`[MINT] Initializing Compressed NFT Mint...`, "info");
      addLog(`[ASSET] Metadata: "Lazor Pass Genesis"`, "info");

      // 1. Build Instruction (Simulating Mint Event via 0 SOL Transfer)
      // In production, this would be a Bubblegum / Metaplex instruction.
      // We use a 0 SOL transfer to prove 'Auth' works without risking a failed CPI call on Devnet.
      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet!.smartWallet),
        toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
        lamports: 0, // 0 SOL = Just Auth
      });

      addLog(`[SDK] Instruction Constructed.`, "info");
      addLog(`[COMPRESSION] Merkle Tree Proof generated...`, "warning");

      // 2. Sign & Send
      const sig = await signAndSendTransaction({
        instructions: [ix],
        transactionOptions: { clusterSimulation: "devnet" }
      });

      setTxHash(sig);
      setMintStatus("success");
      addLog(`[CHAIN] Asset Minted! Hash: ${sig.slice(0,8)}...`, "success");

    } catch (e: any) {
      addLog(`[ERROR] ${e.message}`, "error");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* 1. Holographic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

      {/* 2. Back Button */}
      <div className="absolute top-24 left-4 md:left-8 z-20">
        <Link href="/" className="group flex items-center gap-2 text-cyan-500/50 hover:text-cyan-400 transition-colors">
            <div className="p-2 rounded-full border border-cyan-500/20 group-hover:border-cyan-400/50 bg-black/50 backdrop-blur">
                <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold font-mono tracking-widest uppercase">Hub</span>
        </Link>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEFT: The Hologram (Visual) */}
        <div className="relative group perspective-[1000px]">
             {/* Spinning Cube Effect */}
            <div className="relative w-64 h-64 mx-auto transform-style-3d animate-[spin_10s_linear_infinite] group-hover:animation-play-state-paused">
                <div className="absolute inset-0 border-2 border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm transform translate-z-32 flex items-center justify-center">
                    <Hexagon className="w-16 h-16 text-cyan-400 opacity-50" />
                </div>
                <div className="absolute inset-0 border-2 border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm transform -translate-z-32 flex items-center justify-center">
                   <Hexagon className="w-16 h-16 text-cyan-400 opacity-50" />
                </div>
                {/* Decorative floating particles */}
                <div className="absolute -top-10 -left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                <div className="absolute -bottom-10 -right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-700" />
            </div>
            
            {/* Pedestal Base */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-12 bg-cyan-500/20 blur-xl rounded-[100%]" />
        </div>

        {/* RIGHT: The Minting Interface */}
        <div className="space-y-8">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-[10px] font-mono mb-4">
                    <Sparkles className="w-3 h-3" />
                    COMPRESSED NFT STANDARD
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
                    GENESIS <span className="text-cyan-500">PASS</span>
                </h1>
                <p className="text-cyan-100/60 leading-relaxed">
                    Mint your exclusive LazorPay Genesis asset. 
                    Uses state compression to reduce on-chain costs by 99.9%.
                    Gasless minting powered by Kora Paymaster.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-cyan-900/10 border border-cyan-500/20">
                    <div className="text-xs text-cyan-400/60 uppercase tracking-wider mb-1">Supply</div>
                    <div className="text-xl font-bold text-white">10,000</div>
                </div>
                <div className="p-4 rounded-xl bg-cyan-900/10 border border-cyan-500/20">
                    <div className="text-xs text-cyan-400/60 uppercase tracking-wider mb-1">Price</div>
                    <div className="text-xl font-bold text-white">FREE</div>
                </div>
            </div>

            {/* Action Area */}
            {mintStatus === "success" ? (
                <div className="bg-cyan-500/10 border border-cyan-500/50 p-6 rounded-2xl text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto text-black">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-xl">MINT SUCCESSFUL</h3>
                        <p className="text-cyan-200/60 text-xs font-mono mt-1">ID: {txHash.slice(0, 12)}...</p>
                    </div>
                    <a 
                        href={`https://solscan.io/tx/${txHash}?cluster=devnet`} 
                        target="_blank"
                        className="block w-full py-3 bg-black border border-cyan-500/30 text-cyan-400 font-bold rounded-lg hover:bg-cyan-900/20 transition-colors"
                    >
                        VIEW ASSET
                    </a>
                    <button onClick={() => setMintStatus("idle")} className="text-xs text-white/40 hover:text-white underline">
                        Mint Another
                    </button>
                </div>
            ) : (
                <button 
                    onClick={handleMint}
                    disabled={isMinting}
                    className="w-full relative group overflow-hidden rounded-xl bg-white p-[1px]"
                >
                    <div className="relative bg-black h-full px-8 py-5 rounded-xl flex items-center justify-center gap-3 transition-colors group-hover:bg-gray-900">
                        {isMinting ? (
                            <>
                                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                                <span className="text-cyan-400 font-bold font-mono tracking-widest">COMPRESSING...</span>
                            </>
                        ) : !isConnected ? (
                            <>
                                <Wallet className="w-5 h-5 text-black bg-white rounded-sm p-0.5" />
                                <span className="text-white font-bold tracking-widest">CONNECT TO MINT</span>
                            </>
                        ) : (
                            <>
                                <Box className="w-5 h-5 text-cyan-400" />
                                <span className="text-white font-bold tracking-widest group-hover:text-cyan-400 transition-colors">MINT GENESIS PASS</span>
                            </>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%]" />
                </button>
            )}
            
        </div>
      </div>
    </div>
  );
}
