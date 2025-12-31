"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ShoppingBag, 
  ArrowLeftRight, 
  Image as ImageIcon, 
  Send, 
  TrendingUp, 
  CreditCard,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Activity
} from "lucide-react";

interface ModuleCardProps {
  title: string;
  desc: string;
  icon: any;
  href: string;
  color: string;
  delay: number;
}

function ModuleCard({ title, desc, icon: Icon, href, color, delay }: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative glass hover:glass-strong rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 flex flex-col min-h-[280px]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated gradient background (subtle) */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${color}`} />
      
      {/* Glow effect blob */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl rounded-full ${color.includes('emerald') ? 'bg-emerald-500' : color.includes('blue') ? 'bg-blue-500' : 'bg-purple-500'}`} />

      <div className="relative p-8 h-full flex flex-col z-10">
        {/* Icon */}
        <div className="mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
            {title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed font-medium">
            {desc}
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors mt-8 pt-6 border-t border-white/5 group-hover:border-white/10">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Launch App</span>
          <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        </div>
      </div>
    </Link>
  );
}

export default function HubPage() {
  const stats = [
    { value: "0.4s", label: "LATENCY", icon: Zap },
    { value: "$0.00", label: "GAS FEES", icon: Shield },
    { value: "100%", label: "UPTIME", icon: Activity },
  ];

  return (
    <div className="min-h-screen py-20 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 space-y-24">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-8 max-w-5xl mx-auto px-4">
          
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 glass-strong px-4 py-1.5 rounded-full animate-in fade-in slide-in-from-top duration-700 backdrop-blur-md border border-emerald-500/20">
            <div className="status-dot online" />
            <span className="text-[10px] font-bold tracking-widest text-emerald-400">SYSTEM ONLINE // V2.0</span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white animate-in fade-in slide-in-from-bottom duration-1000">
              LAZOR<span className="text-gradient">PAY</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom duration-1000 delay-100">
              The production-ready checkout suite for Solana. <br />
              <span className="text-white font-medium">Passkey Auth</span> meets <span className="text-white font-medium">Gasless Transactions</span>.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-white/5 transition-colors group">
                <stat.icon className="w-4 h-4 text-white/40 mb-2 group-hover:text-emerald-400 transition-colors" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] font-bold text-white/40 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-1000 delay-300 pt-4">
            <Link href="/store" className="btn-primary shadow-lg shadow-emerald-500/20">
              Start Demo <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>
            <a 
              href="https://github.com/lazor-kit/lazor-kit" 
              target="_blank"
              className="glass px-8 py-3 rounded-xl font-bold text-white hover:bg-white/10 transition-all hover:scale-105"
            >
              Documentation
            </a>
          </div>
        </div>

        {/* MODULES GRID */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" /> 
              Active Modules
            </h2>
            <div className="text-xs font-mono text-white/40">6/6 OPERATIONAL</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard 
              title="Virtual Store"
              desc="E-commerce checkout flow with product details, cart simulation, and instant settlement."
              icon={ShoppingBag}
              href="/store"
              color="from-emerald-500 to-emerald-600"
              delay={0}
            />

            <ModuleCard 
              title="DeFi Swap"
              desc="Zero-fee token swaps. Trade SOL for USDC instantly without holding SOL for gas."
              icon={ArrowLeftRight}
              href="/swap"
              color="from-blue-500 to-blue-600"
              delay={100}
            />

            <ModuleCard 
              title="P2P Transfer"
              desc="Send money like a text message. Attach memos and transact with passkey speed."
              icon={Send}
              href="/send"
              color="from-yellow-500 to-yellow-600"
              delay={200}
            />

            <ModuleCard 
              title="NFT Creator"
              desc="Upload assets and mint compressed NFTs on-chain directly from your browser."
              icon={ImageIcon}
              href="/mint"
              color="from-pink-500 to-pink-600"
              delay={300}
            />

            <ModuleCard 
              title="Instant Trade"
              desc="Simplified CEX interface. Simulate live market orders with one-click execution."
              icon={TrendingUp}
              href="/trade"
              color="from-purple-500 to-purple-600"
              delay={400}
            />

            <ModuleCard 
              title="Subscriptions"
              desc="SaaS pricing demo. Setup recurring billing plans with smart wallet delegation."
              icon={CreditCard}
              href="/subs"
              color="from-cyan-500 to-cyan-600"
              delay={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
