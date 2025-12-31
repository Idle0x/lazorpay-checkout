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
  Fingerprint
} from "lucide-react";
import { useWallet } from "@lazorkit/wallet";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

// --- COMPONENTS ---

// 1. The "Platinum Pill" Module
// Updated: Uses 'pill-platinum' class (White bg, Black text)
function PillModule({ title, desc, icon: Icon, href, align, index }: any) {
  const isLeft = align === 'left';
  
  return (
    <div className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <Link 
        href={href}
        className="group relative w-full md:w-[70%] pill-platinum p-8 md:p-10 flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="relative z-10 space-y-3">
          {/* Icon Badge - Dark Grey to contrast with Platinum */}
          <div className="mx-auto w-14 h-14 rounded-full bg-zinc-900/10 flex items-center justify-center mb-2">
            <Icon className="w-6 h-6 text-zinc-900 group-hover:scale-110 transition-transform" />
          </div>

          {/* Typography - FORCED BLACK via CSS, but enforced here just in case */}
          <div>
            <h3 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter mb-2">
              {title}
            </h3>
            <p className="text-base md:text-lg text-zinc-600 font-medium max-w-md mx-auto leading-relaxed">
              {desc}
            </p>
          </div>

          {/* Action Hint */}
          <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="inline-flex items-center gap-2 text-zinc-900 text-xs font-bold tracking-[0.2em] uppercase">
              Launch <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
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
      desc: "E-commerce flow with floating 3D product cards.",
      icon: ShoppingBag,
      href: "/store"
    },
    {
      title: "DeFi Swap",
      desc: "Atomic token swaps with zero-latency feedback.",
      icon: ArrowLeftRight,
      href: "/swap"
    },
    {
      title: "P2P Transfer",
      desc: "Instant payments with social identity resolution.",
      icon: Send,
      href: "/send"
    },
    {
      title: "NFT Mint",
      desc: "Holographic pedestal for compressed NFT minting.",
      icon: ImageIcon,
      href: "/mint"
    },
    {
      title: "Pro Trading",
      desc: "Simplified terminal with instant buy/sell execution.",
      icon: TrendingUp,
      href: "/trade"
    },
    {
      title: "Subscriptions",
      desc: "Recurring billing authorization logic.",
      icon: CreditCard,
      href: "/subs"
    }
  ];

  return (
    <div className="min-h-screen py-24 px-4 overflow-hidden relative bg-[#09090b]">
      
      <div className="max-w-5xl mx-auto space-y-24 relative z-10">
        
        {/* 1. HERO HEADER - Clean White Text on Dark Background */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-white">V2.0 ONLINE</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none">
            LAZOR<span className="text-zinc-500">PAY</span>
          </h1>
          
          <p className="text-xl text-zinc-400 font-light tracking-wide max-w-2xl mx-auto">
            THE PLATINUM SUITE FOR SOLANA
          </p>
        </div>

        {/* 2. THE ZIG-ZAG MODULES (Platinum Pills) */}
        <div className="space-y-8 md:space-y-12">
          {modules.map((mod, i) => (
            <PillModule 
              key={i}
              {...mod}
              index={i}
              align={i % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>

        {/* 3. THE REACTOR CORE (Clean White Button) */}
        <div className="flex justify-center pt-16 pb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
            
            <button 
              onClick={handleConnect}
              disabled={isConnected}
              className="relative btn-primary flex items-center gap-4 hover:scale-105 transition-transform"
            >
              <Fingerprint className="w-6 h-6" />
              {isConnected ? "SESSION ACTIVE" : "CONNECT PASSKEY"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
