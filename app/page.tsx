"use client";

import Link from "next/link";
import { 
  ShoppingBag, 
  ArrowLeftRight, 
  Image as ImageIcon, 
  Send, 
  ChevronRight, 
  Zap, 
  TrendingUp, 
  CreditCard 
} from "lucide-react";

// Module Card Component
function ModuleCard({ title, desc, icon: Icon, href, color }: any) {
  return (
    <Link 
      href={href}
      className="group relative overflow-hidden bg-cyber-gray border border-white/5 hover:border-white/20 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 flex flex-col"
    >
      {/* Background Icon Watermark */}
      <div className={`absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color} transform rotate-12 group-hover:rotate-0 transition-transform duration-700`}>
        <Icon className="w-40 h-40" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
        <div className="space-y-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-black/50 border border-white/10 ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-cyber-muted leading-relaxed max-w-[95%]">{desc}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-white/40 group-hover:text-white transition-colors">
          OPEN MODULE <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

export default function HubPage() {
  return (
    <div className="space-y-16 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-neon-blue/20 blur-[100px] -z-10 rounded-full opacity-50" />
        
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-neon-green mb-4">
          <Zap className="w-3 h-3 fill-neon-green" />
          V2.0 LIVE ON DEVNET
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
          LAZOR<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green">PAY</span> HUB
        </h1>
        <p className="text-cyber-muted text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          The production-ready checkout suite for Solana. <br/>
          Experience the speed of <strong>Passkeys</strong> and the magic of <strong>Gasless Transactions</strong> across 6 real-world use cases.
        </p>
      </div>

      {/* The Grid (2 Columns on Tablet, 3 on Large Screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Store */}
        <ModuleCard 
          title="Virtual Store"
          desc="E-commerce checkout flow with product details, cart simulation, and instant settlement."
          icon={ShoppingBag}
          href="/store"
          color="text-neon-green"
        />

        {/* 2. Swap */}
        <ModuleCard 
          title="DeFi Swap"
          desc="Zero-fee token swaps. Trade SOL for USDC instantly without holding SOL for gas."
          icon={ArrowLeftRight}
          href="/swap"
          color="text-neon-pink"
        />

        {/* 3. Send */}
        <ModuleCard 
          title="P2P Transfer"
          desc="Send money like a text message. Attach memos and transact with passkey speed."
          icon={Send}
          href="/send"
          color="text-yellow-400"
        />

        {/* 4. Mint */}
        <ModuleCard 
          title="NFT Creator"
          desc="Upload assets and mint compressed NFTs on-chain directly from your browser."
          icon={ImageIcon}
          href="/mint"
          color="text-neon-blue"
        />

        {/* 5. Trade */}
        <ModuleCard 
          title="Instant Trade"
          desc="Simplified CEX interface. Simulate live market orders with one-click execution."
          icon={TrendingUp} 
          href="/trade"
          color="text-emerald-400"
        />

        {/* 6. Subscription */}
        <ModuleCard 
          title="Subscriptions"
          desc="SaaS pricing demo. Setup recurring billing plans with smart wallet delegation."
          icon={CreditCard}
          href="/subs"
          color="text-purple-400"
        />

      </div>
    </div>
  );
}
