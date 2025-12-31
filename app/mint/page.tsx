"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { 
  Image as ImageIcon, 
  UploadCloud, 
  Zap, 
  CheckCircle, 
  Loader2, 
  Code2, 
  Box,
  Layers
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

export default function MintPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Minting Stages: idle -> uploading -> compressing -> minting -> success
  const [status, setStatus] = useState<'idle' | 'uploading' | 'compressing' | 'minting' | 'success'>('idle');
  
  const { connect } = useWallet();
  const { isConnected } = useLazorContext();

  // --- FILE HANDLING ---
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // --- MINT SIMULATION ---
  const handleMint = async () => {
    if (!isConnected) {
        await connect();
        return;
    }
    
    setStatus('uploading');
    await new Promise(r => setTimeout(r, 1500)); // Upload to Arweave
    
    setStatus('compressing');
    await new Promise(r => setTimeout(r, 1500)); // Merkle Tree Hash
    
    setStatus('minting');
    await new Promise(r => setTimeout(r, 2000)); // Solana Tx
    
    setStatus('success');
  };

  return (
    <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 1. HEADER */}
      <div className="text-center space-y-4 mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-bold font-mono uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition-colors">HUB</Link> / NFT MINT
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter flex items-center gap-4 justify-center">
          HOLOGRAPHIC MINT
        </h1>
      </div>

      {/* 2. THE PEDESTAL (Main Stage) */}
      <div className="relative w-full max-w-2xl">
        
        {/* Tech Reveal Sidebar (Desktop) */}
        <div className="hidden xl:block absolute -right-64 top-20 w-60 animate-in fade-in slide-in-from-left duration-700 delay-500">
           <div className="glass p-5 rounded-2xl border-l-4 border-pink-500">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold mb-2 uppercase tracking-wider">
                 State Compression <Layers className="w-3 h-3" />
              </div>
              <pre className="text-[10px] font-mono text-zinc-400">
{`// Cost: 0.000005 SOL
const cNFT = await mint({
  tree: "MERKLE_TREE",
  metadata: arweaveUri
});`}
              </pre>
           </div>
        </div>

        {/* Success State */}
        {status === 'success' ? (
           <div className="glass-strong rounded-[3rem] p-12 min-h-[600px] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <div className="relative w-64 h-64 mb-8">
                  {/* Glowing Ring */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
                  <img src={preview!} alt="Minted" className="relative w-full h-full object-cover rounded-2xl border-2 border-white/20 shadow-2xl" />
                  <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-black rounded-full flex items-center justify-center border-4 border-zinc-900">
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
              </div>
              <h2 className="text-4xl font-black text-white mb-2">MINTED!</h2>
              <p className="text-zinc-400 text-lg mb-8">
                 Asset compressed and verified on Solana.
              </p>
              <button 
                onClick={() => { setStatus('idle'); setFile(null); setPreview(null); }}
                className="btn-zinc"
              >
                Mint Another
              </button>
           </div>
        ) : (
           <div className="relative">
              
              {/* DROPZONE / PREVIEW AREA */}
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  glass-strong rounded-[3rem] p-8 min-h-[500px] flex flex-col items-center justify-center text-center border-2 border-dashed transition-all duration-300
                  ${isDragging ? 'border-pink-500 bg-pink-500/10 scale-[1.02]' : 'border-white/10 hover:border-white/20'}
                `}
              >
                 {preview ? (
                    // PREVIEW MODE
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                       <div className="relative w-72 h-72 group cursor-pointer" onClick={() => { setFile(null); setPreview(null); }}>
                          {/* Holographic Scan Effect */}
                          {status !== 'idle' && (
                             <div className="absolute inset-0 z-20 border-b-2 border-pink-500 bg-gradient-to-b from-transparent to-pink-500/20 animate-[scan_2s_ease-in-out_infinite]" />
                          )}
                          
                          <img src={preview} alt="Upload" className="w-full h-full object-cover rounded-3xl shadow-2xl" />
                          
                          {/* Remove Overlay */}
                          {status === 'idle' && (
                             <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-bold uppercase tracking-widest">Replace Image</span>
                             </div>
                          )}
                       </div>
                       
                       {/* Status Text */}
                       <div className="mt-8 space-y-2">
                          <div className="text-pink-400 font-mono text-sm uppercase tracking-widest">
                             {status === 'idle' ? 'Ready to Mint' : status === 'uploading' ? 'Uploading to Arweave...' : status === 'compressing' ? 'Hashing Merkle Tree...' : 'Finalizing Transaction...'}
                          </div>
                          <div className="text-zinc-500 text-xs">
                             {file?.name} ({(file!.size / 1024 / 1024).toFixed(2)} MB)
                          </div>
                       </div>
                    </div>
                 ) : (
                    // UPLOAD MODE
                    <div className="space-y-6">
                       <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 animate-float">
                          <UploadCloud className="w-12 h-12 text-zinc-400" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold text-white mb-2">DRAG ARTIFACT HERE</h3>
                          <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                             Supports JPG, PNG, GIF. Max 50MB.
                          </p>
                       </div>
                       <label className="btn-zinc inline-block cursor-pointer !py-3 !px-8 !text-sm">
                          BROWSE FILES
                          <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
                       </label>
                    </div>
                 )}
              </div>

              {/* ACTION BUTTON */}
              {preview && (
                 <button 
                    onClick={handleMint}
                    disabled={status !== 'idle'}
                    className={`
                       w-full py-8 mt-6 rounded-[2rem] text-3xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-4
                       ${status !== 'idle' ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02] active:scale-95'}
                    `}
                 >
                    {status !== 'idle' ? (
                       <><Loader2 className="w-8 h-8 animate-spin" /> PROCESSING</>
                    ) : (
                       <>{isConnected ? "MINT ASSET" : "CONNECT WALLET"}</>
                    )}
                 </button>
              )}

           </div>
        )}

      </div>
    </div>
  );
}
