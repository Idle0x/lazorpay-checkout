"use client";

import Link from "next/link";
import { 
  ShoppingBag, ArrowLeftRight, Send, Image as ImageIcon, 
  TrendingUp, CreditCard, Fingerprint, Code2, ArrowRight 
} from "lucide-react";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

// The "Stone & Sand" Pill Component
function PillModule({ title, desc, icon: Icon, href, align, index }: any) {
  const isLeft = align === 'left';
  // Even index = Stone (#dcdff0), Odd index = Sand (#ccccb1)
  const pillColor = index % 2 === 0 ? 'bg-[#dcdff0]' : 'bg-[#ccccb1]';
  const hoverColor = index % 2 === 0 ? 'hover:bg-[#c4c7d9]' : 'hover:bg-[#b8b89f]';

  return (
    <div className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <Link 
        href={href}
        className={`group relative w-full md:w-[70%] ${pillColor} ${hoverColor} rounded-full p-8 md:p-12 flex flex-col items-center justify-center text-center transition-all duration-500 hover:scale-[1.02] shadow-2xl`}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-black/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-8 h-8 text-black" />
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-black tracking-tighter mb-2">
              {title}
            </h3>
            <p className="text-lg text-black/60 max-w-md mx-auto leading-relaxed font-medium">
              {desc}
            </p>
          </div>
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

export default function HubPage() {
  const { connectAuth, isConnected } = useLazorContext();

  const modules = [
    { title: "Virtual Store", desc: "Interactive e-commerce showcase.", icon: ShoppingBag, href: "/store" },
    { title: "DeFi Swap", desc: "Atomic token swaps.", icon: ArrowLeftRight, href: "/swap" },
    { title: "P2P Transfer", desc: "Instant payments.", icon: Send, href: "/send" },
    { title: "NFT Mint", desc: "Compressed state compression.", icon: ImageIcon, href: "/mint" },
    { title: "Pro Trading", desc: "High-frequency terminal.", icon: TrendingUp, href: "/trade" },
    { title: "Subscriptions", desc: "Recurring billing authorization.", icon: CreditCard, href: "/subs" },
  ];

  return (
    <div className="min-h-screen py-32 px-4 overflow-hidden relative bg-black">
      <div className="max-w-5xl mx-auto space-y-32 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2 rounded-full border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
            <span className="text-xs font-bold tracking-[0.2em] text-white">LAZORPAY V2</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none">
            LAZOR<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-cyan-500 to-purple-500">PAY</span>
          </h1>
        </div>

        {/* Modules List */}
        <div className="space-y-12">
          {modules.map((mod, i) => (
            <PillModule key={i} {...mod} index={i} align={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>

        {/* Connect Button */}
        <div className="flex justify-center pt-20 pb-10">
            <button 
              onClick={connectAuth}
              disabled={isConnected}
              className="relative bg-white text-black px-12 py-6 text-2xl font-bold rounded-full flex items-center gap-4 hover:scale-105 transition-transform"
            >
              <Fingerprint className="w-8 h-8" />
              {isConnected ? "SESSION ACTIVE" : "CONNECT PASSKEY"}
            </button>
        </div>
      </div>
    </div>
  );
}
