"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Sparkles, Check, Loader2 } from "lucide-react";
import { CyberCard } from "@/components/ui/CyberCard";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useConsole } from "@/components/ui/DevConsole";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL, TransactionInstruction } from "@solana/web3.js";
import { APP_CONFIG } from "@/lib/constants";

export default function MintPage() {
  const { connect, signAndSendTransaction } = useWallet();
  const { isConnected, wallet, saveSession } = useLazorContext();
  const { addLog } = useConsole();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      // Create local preview URL
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
      addLog(`[SYSTEM] File Selected: ${selected.name} (${(selected.size/1024).toFixed(1)}KB)`, "info");
    }
  };

  // 2. The Mint Logic
  const handleMint = async () => {
    if (!isConnected) {
        const data = await connect();
        if (data?.smartWallet) saveSession({ ...data, passkeyPubkey: "", walletDevice: "web" });
        return;
    }

    if (!file || !name) return alert("Please select a file and name your NFT.");

    // Step A: Simulate Upload
    setIsUploading(true);
    addLog("[STORAGE] Uploading asset to IPFS...", "info");
    await new Promise(r => setTimeout(r, 1500)); // Fake 1.5s upload
    setIsUploading(false);
    addLog("[STORAGE] Asset Pinned. CID: QmYx...7t2", "success");

    // Step B: Mint on Chain
    setIsMinting(true);
    try {
        if (!wallet) return;
        addLog("[TX] Minting Compressed NFT...", "info");

        // Mock Mint Fee (Protocol Fee)
        const feeIx = SystemProgram.transfer({
            fromPubkey: new PublicKey(wallet.smartWallet),
            toPubkey: new PublicKey(APP_CONFIG.MERCHANT_ADDRESS),
            lamports: 0.001 * LAMPORTS_PER_SOL,
        });

        // The "Proof" of Mint (Memo)
        const mintIx = new TransactionInstruction({
            keys: [],
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcQb"),
            data: Buffer.from(`MINT_NFT: ${name} | DESC: ${desc} | IPFS: QmMockHash`, "utf-8"),
        });

        const payload = {
            instructions: [feeIx, mintIx],
            transactionOptions: { clusterSimulation: "devnet" as const }
        };

        const sig = await signAndSendTransaction(payload);
        addLog(`[CHAIN] Minted! TX: ${sig.slice(0,8)}...`, "success");
        setIsMinting(false);
        setIsSuccess(true);

    } catch (e: any) {
        console.error(e);
        addLog(`[ERROR] ${e.message}`, "error");
        setIsMinting(false);
    }
  };

  if (isSuccess) {
    return (
        <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="relative mx-auto w-64 aspect-square rounded-2xl overflow-hidden border-2 border-neon-blue shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                {preview && <img src={preview} alt="Minted" className="w-full h-full object-cover" />}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur p-4">
                    <h3 className="text-white font-bold text-lg">{name}</h3>
                    <div className="flex items-center justify-center gap-1 text-neon-blue text-xs font-mono mt-1">
                        <Check className="w-3 h-3" /> ON-CHAIN VERIFIED
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Artifact Minted Successfully</h2>
            <button onClick={() => { setIsSuccess(false); setFile(null); setPreview(null); setName(""); }} className="text-cyber-muted hover:text-white underline">
                Mint Another
            </button>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* LEFT: Uploader */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neon-blue" /> Create Artifact
        </h2>
        
        <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 relative overflow-hidden group ${
                preview ? "border-neon-blue/50 bg-black" : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
            }`}
        >
            <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
            />
            
            {preview ? (
                <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                        Replace Image
                    </div>
                </>
            ) : (
                <>
                    <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-cyber-muted" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-white font-bold">Click to Upload</p>
                        <p className="text-xs text-cyber-muted">JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                </>
            )}
        </div>
      </div>

      {/* RIGHT: Details & Action */}
      <div className="space-y-6">
        <CyberCard className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs text-cyber-muted font-mono uppercase">Artifact Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cyber Punk #2077"
                    className="w-full bg-black/50 p-3 rounded-xl border border-white/10 outline-none text-white focus:border-neon-blue transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs text-cyber-muted font-mono uppercase">Description</label>
                <textarea 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Tell the story behind this piece..."
                    className="w-full bg-black/50 p-3 rounded-xl border border-white/10 outline-none text-white h-32 resize-none focus:border-neon-blue transition-colors"
                />
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-cyber-muted">Mint Fee</span>
                    <span className="text-white">0.001 SOL</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-cyber-muted">Network Cost</span>
                    <span className="text-neon-green font-bold">SPONSORED (Gasless)</span>
                </div>
            </div>

            <button
                onClick={handleMint}
                disabled={isUploading || isMinting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    (isUploading || isMinting)
                    ? "bg-cyber-gray text-cyber-muted cursor-wait" 
                    : "bg-neon-blue text-black hover:bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                }`}
            >
                {isUploading ? (
                    <> <Loader2 className="w-5 h-5 animate-spin" /> Uploading to IPFS... </>
                ) : isMinting ? (
                    <> <Loader2 className="w-5 h-5 animate-spin" /> Minting... </>
                ) : isConnected ? (
                    <> <Sparkles className="w-5 h-5" /> Mint Artifact </>
                ) : (
                    <> Connect Wallet to Mint </>
                )}
            </button>
        </CyberCard>
      </div>
    </div>
  );
}
