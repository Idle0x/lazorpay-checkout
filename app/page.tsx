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
  CheckCircle,
  ArrowRight
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
      className="group relative glass hover:glass-strong rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${color}`} />
      
      {/* Glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl ${color.includes('emerald') ? 'bg-emerald-500' : color.includes('blue') ? 'bg-blue-500' : color.includes('pink') ? 'bg-pink-500' : color.includes('yellow') ? 'bg-yellow-500' : color.includes('purple') ? 'bg-purple-500' : 'bg-cyan-500'}`} />

      <div className="relative p-8 h-full flex flex-col">
        {/* Icon Container */}
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-all">
            {title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Action hint */}
        <div className="flex items-center gap-2 text-white/40 group-hover:text-white/80 transition-colors mt-6">
          <span className="text-xs font-semibold tracking-wider">EXPLORE</span>
          <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
        </div>

        {/* Hover border effect */}
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-2xl transition-all duration-300" />
      </div>
    </Link>
  );
}

export default function HubPage() {
  const features = [
    {
      icon: Zap,
      title: "Instant Settlement",
      desc: "Transactions confirmed in under 400ms"
    },
    {
      icon: Shield,
      title: "Gasless Payments",
      desc: "Protocol sponsors all network fees"
    },
    {
      icon: Sparkles,
      title: "Passkey Auth",
      desc: "Biometric security, no seed phrases"
    }
  ];

  const stats = [
    { value: "0.4s", label: "Avg. Confirmation" },
    { value: "$0.00", label: "User Gas Fees" },
    { value: "99.9%", label: "Uptime" },
    { value: "6", label: "Live Modules" }
  ];

  return (
    <div className="space-y-24 py-12">
      
      {/* Hero Section */}
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
        
        <div className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full animate-in fade-in slide-in-from-top duration-500">
            <div className="status-dot online" />
            <span className="text-xs font-semibold text-white/80">V2.0 LIVE ON DEVNET</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: '200ms' }}>
            LAZOR<span className="text-gradient">PAY</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: '400ms' }}>
            The production-ready checkout suite for Solana. Experience the speed of <span className="text-white font-semibold">Passkeys</span> and the magic of <span className="text-white font-semibold">Gasless Transactions</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: '600ms' }}>
            <Link 
              href="/store"
              className="btn-primary text-lg"
            >
              Try Demo
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <a 
              href="https://github.com/yourusername/lazorpay" 
              target="_blank"
              className="glass hover:glass-strong px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              View Docs
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className="glass rounded-2xl p-6 text-center hover:glass-strong transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom duration-500"
            style={{ animationDelay: `${800 + i * 100}ms` }}
          >
            <div className="text-3xl md:text-4xl font-black text-gradient mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-white/60">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Built for Production
          </h2>
          <p className="text-white/60 text-lg">
            Enterprise-grade infrastructure meets developer-friendly APIs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="glass rounded-2xl p-8 hover:glass-strong transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${1200 + i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60 text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modules Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Explore Modules
          </h2>
          <p className="text-white/60 text-lg">
            Six real-world use cases, one unified experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: '1500ms' }}>
          <ModuleCard 
            title="Virtual Store"
            desc="E-commerce checkout with instant settlement and cart simulation."
            icon={ShoppingBag}
            href="/store"
            color="from-emerald-500 to-emerald-600"
            delay={0}
          />

          <ModuleCard 
            title="DeFi Swap"
            desc="Zero-fee token swaps without holding SOL for gas."
            icon={ArrowLeftRight}
            href="/swap"
            color="from-blue-500 to-blue-600"
            delay={100}
          />

          <ModuleCard 
            title="P2P Transfer"
            desc="Send money instantly with memo support."
            icon={Send}
            href="/send"
            color="from-yellow-500 to-yellow-600"
            delay={200}
          />

          <ModuleCard 
            title="NFT Creator"
            desc="Upload and mint compressed NFTs on-chain."
            icon={ImageIcon}
            href="/mint"
            color="from-pink-500 to-pink-600"
            delay={300}
          />

          <ModuleCard 
            title="Instant Trade"
            desc="Simplified CEX interface with one-click execution."
            icon={TrendingUp}
            href="/trade"
            color="from-purple-500 to-purple-600"
            delay={400}
          />

          <ModuleCard 
            title="Subscriptions"
            desc="Recurring billing with smart wallet delegation."
            icon={CreditCard}
            href="/subs"
            color="from-cyan-500 to-cyan-600"
            delay={500}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-[100px]" />
        <div className="relative glass-strong rounded-3xl p-12 max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">
            Ready to Build?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Join developers building the future of payments on Solana. Get started in minutes with our comprehensive SDK.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/store" className="btn-primary text-lg">
              Start Building
              <Sparkles className="w-5 h-5 ml-2 inline" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}