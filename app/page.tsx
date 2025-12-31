"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeftRight, Image as ImageIcon, CreditCard, ChevronRight } from "lucide-react";

// Module Card Component
function ModuleCard({ title, desc, icon: Icon, href, color }: any) {
  return (
    <Link 
      href={href}
      className="group relative overflow-hidden bg-cyber-gray border border-white/5 hover:border-white/20 rounded-xl p-6 transition-all hover:-translate-y-1"
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="space-y-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-black/50 border border-white/10 ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-cyber-muted leading-relaxed">{desc}</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono mt-6 text-white/50 group-hover:text-white transition-colors">
          OPEN MODULE <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}

export default function HubPage() {
  return (
    <div className="space-y-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50">
          LAZOR<span className="text-neon-blue">PAY</span> HUB
        </h1>
        <p className="text-cyber-muted text-lg">
          The ultimate checkout suite for Solana. <br/>
          One passkey. Infinite possibilities.
        </p>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Module 1: Store */}
        <ModuleCard 
          title="Virtual Store"
          desc="E-commerce checkout flow with cart simulation and instant settlement."
          icon={ShoppingBag}
          href="/store"
          color="text-neon-green"
        />

        {/* Module 2: Swap (Coming Soon) */}
        <ModuleCard 
          title="DeFi Swap"
          desc="Gasless token swaps. Trade SOL/USDC without holding SOL for fees."
          icon={ArrowLeftRight}
          href="/swap"
          color="text-neon-pink"
        />

        {/* Module 3: Mint (Coming Soon) */}
        <ModuleCard 
          title="NFT Creator"
          desc="Upload and mint compressed NFTs directly from your browser."
          icon={ImageIcon}
          href="/mint"
          color="text-neon-blue"
        />

        {/* Module 4: Subscriptions (Coming Soon) */}
        <ModuleCard 
          title="Subscriptions"
          desc="Recurring billing logic powered by smart wallet delegation."
          icon={CreditCard}
          href="/subs" // We'll build this later
          color="text-yellow-400"
        />

      </div>
    </div>
  );
}
