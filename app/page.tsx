"use client";

import Link from "next/link";
import { 
  ShoppingBag, 
  ArrowLeftRight, 
  Image as ImageIcon, 
  Send, 
  TrendingUp, 
  CreditCard,
  ArrowRight,
  Fingerprint,
  Code2
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

// --- COMPONENTS ---

// 1. The New "Stone & Sand" Pill Module
function PillModule({ title, desc, icon: Icon, href, align, index }: any) {
  const isLeft = align === 'left';
  // Logic: Even index = Stone Color, Odd index = Sand Color
  const pillColor = index % 2 === 0 ? 'bg-[#dcdff0]' : 'bg-[#ccccb1]';
  const hoverColor = index % 2 === 0 ? 'hover:bg-[#c4c7d9]' : 'hover:bg-[#b8b89f]';
  
  return (
    <div className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <Link 
        href={href}
        className={`group relative w-full md:w-[70%] ${pillColor} ${hoverColor} rounded-full p-8 md:p-12 flex flex-col items-center justify-center text-center transition-all duration-500 hover:scale-[1.02] hover:-rotate-1 shadow-2xl`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="relative z-10 space-y-4">
          {/* Icon Badge - Dark background for contrast */}
          <div className="mx-auto w-16 h-16 rounded-full bg-black/5 border border-black/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-8 h-8 text-black" />
          </div>

          {/* Typography - BLACK TEXT */}
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">
              {title}
            </h3>
            <p className="text-lg text-black/60 max-w-md mx-auto leading-relaxed font-medium">
              {desc}
            </p>
          </div>

          {/* Action Hint - Dark Arrow */}
          <div className="pt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="inline-flex items-center gap-2 text-black text-sm font-bold tracking-[0.2em] uppercase">
              Launch Module <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// 2. The Tech Reveal Code Snippet (Kept as requested)
function TechReveal() {
  return (
    <div className="hidden md:block absolute right-[-20px] top-1/2 -translate-y-1/2 translate-x-full pl-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
      <div className="glass p-4 rounded-xl border-l-4 border-emerald-500">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">
          <Code2 className="w-3 h-3" /> LazorKit SDK
        </div>
        <pre className="text-[10px] font-mono text-white/70">
{`await connect({
  passkey: true,
  chain: "solana"
});`}
        </pre>
      </div>
    </div>
  );
}

export default function HubPage() {
  const { connect } = useWallet();
  const { isConnected, wallet, saveSession } = useLazorContext();

  const handleConnect = async () => {
    try {
      const data = await connect();
      if (data?.smartWallet) {
        saveSession({
          credentialId: data.credentialId || "",
          passkeyPubkey: data.passkeyPubkey ? JSON.stringify(data.passkeyPubkey) : "",
          smartWallet: data.smartWallet,
          walletDevice: data.walletDevice || "web"
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const modules = [
    {
      title: "Virtual Store",
      desc: "Interactive e-commerce showcase featuring one-click checkout.",
      icon: ShoppingBag,
      href: "/store"
    },
    {
      title: "DeFi Swap",
      desc: "Atomic token swaps with zero-latency visual feedback.",
      icon: ArrowLeftRight,
      href: "/swap"
    },
    {
      title: "P2P Transfer",
      desc: "Instant payments with social-layer identity resolution.",
      icon: Send,
      href: "/send"
    },
    {
      title: "NFT Mint",
      desc: "Drag-and-drop creation tool with compressed state compression.",
      icon: ImageIcon,
      href: "/mint"
    },
    {
      title: "Pro Trading",
      desc: "High-frequency terminal interface with session key delegation.",
      icon: TrendingUp,
      href: "/trade"
    },
    {
      title: "Subscriptions",
      desc: "Recurring billing authorization logic for SaaS models.",
      icon: CreditCard,
      href: "/subs"
    }
  ];

  return (
    <div className="min-h-screen py-32 px-4 overflow-hidden relative">
      
      {/* 1. HERO HEADER (Unchanged Logic, just removed blue glows) */}
      <div className="max-w-5xl mx-auto space-y-32 relative z-10">
        
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center gap-3 glass px-6 py-2 rounded-full border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-[0.2em] text-white">V2.0 ONLINE</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none text-glow">
            LAZOR<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#dcdff0]">PAY</span>
          </h1>
          
          <p className="text-xl text-white/50 font-light tracking-wide max-w-2xl mx-auto">
            THE PRODUCTION SUITE FOR SOLANA
          </p>
        </div>

        {/* 2. THE ZIG-ZAG MODULES (Now Stone & Sand) */}
        <div className="space-y-12">
          {modules.map((mod, i) => (
            <PillModule 
              key={i}
              {...mod}
              index={i}
              align={i % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>

        {/* 3. THE REACTOR CORE (Green Connect Button - Unchanged) */}
        <div className="flex justify-center pt-20 pb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            
            <button 
              onClick={handleConnect}
              disabled={isConnected}
              className="relative btn-primary px-12 py-6 text-2xl rounded-full flex items-center gap-4 hover:scale-105 transition-transform"
            >
              <Fingerprint className="w-8 h-8" />
              {isConnected ? "SESSION ACTIVE" : "CONNECT PASSKEY"}
            </button>

            {/* Educational Hover Side-Panel */}
            <TechReveal />
          </div>
        </div>

      </div>
    </div>
  );
}
