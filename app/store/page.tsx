"use client";

import React, { useState } from "react";
import { CheckoutWidget } from "@/components/ui/CheckoutWidget";
import { 
  Package, 
  Star, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Cpu
} from "lucide-react";

export default function StorePage() {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const productImages = [
    { id: 0, color: "from-emerald-500 to-emerald-600", icon: Zap },
    { id: 1, color: "from-blue-500 to-blue-600", icon: Cpu },
    { id: 2, color: "from-purple-500 to-purple-600", icon: ShieldCheck }
  ];

  const features = [
    { icon: Zap, text: "Instant Delivery" },
    { icon: ShieldCheck, text: "Lifetime Warranty" },
    { icon: Package, text: "Free Shipping" },
    { icon: TrendingUp, text: "24/7 Support" }
  ];

  const reviews = [
    { name: "Alex Chen", rating: 5, text: "The zero-latency transmission is mind blowing." },
    { name: "Sarah Kim", rating: 5, text: "Finally, a BCI that actually works. Worth every penny." }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-8 animate-in fade-in slide-in-from-left duration-500">
          <span className="hover:text-white cursor-pointer transition-colors">HUB</span>
          <span>/</span>
          <span className="text-white">STORE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Product Visuals */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            
            {/* Main Image Stage */}
            <div className="relative aspect-square rounded-[2rem] overflow-hidden glass-strong group border-white/10">
              
              {/* Dynamic Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${productImages[selectedImage].color} opacity-20 transition-all duration-700`} />
              
              {/* Floating Effects */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
              
              {/* Product Hero Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse-glow" />
                  <Zap className="relative w-48 h-48 text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] transform transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>

              {/* Status Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="glass px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-emerald-400 flex items-center gap-1.5 backdrop-blur-xl border-emerald-500/20">
                  <Star className="w-3 h-3 fill-emerald-400" />
                  BESTSELLER
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.id)}
                  className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedImage === img.id 
                      ? 'ring-2 ring-emerald-500 scale-95' 
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${img.color} opacity-20`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img.icon className="w-8 h-8 text-white/80" />
                  </div>
                </button>
              ))}
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <div 
                  key={i}
                  className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-white/80 font-bold uppercase tracking-wide">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details & Checkout */}
          <div className="space-y-10 animate-in fade-in slide-in-from-right duration-700 delay-200">
            
            {/* Header Info */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                    Neural Link <span className="text-emerald-400">v2.0</span>
                  </h1>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-white/40 font-mono">284 VERIFIED REVIEWS</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">0.05 SOL</div>
                  <div className="text-xs text-emerald-400 font-bold tracking-wide">IN STOCK</div>
                </div>
              </div>

              <p className="text-lg text-white/60 leading-relaxed font-light">
                Experience zero-latency thought transmission. Now featuring enhanced bandwidth and 
                seamless integration with Solana Pay for instant, gasless settlement.
              </p>

              {/* Specs Box */}
              <div className="glass rounded-2xl p-6 space-y-4 border-l-4 border-l-emerald-500">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Technical Specifications
                </h3>
                <div className="space-y-2">
                  {[
                    'Brain-Computer Interface (BCI) v2.0',
                    'Latency: < 4ms (neural-to-cloud)',
                    '24h Battery Life (Wireless Charging)',
                    'Solana Pay Native Integration'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CHECKOUT WIDGET INJECTION */}
            <div className="relative">
              {/* Decorative glow behind widget */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[2rem] blur-xl opacity-50" />
              <div className="relative">
                <CheckoutWidget />
              </div>
            </div>

            {/* Reviews Preview */}
            <div className="space-y-4 border-t border-white/10 pt-8">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Feedback</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((review, i) => (
                  <div key={i} className="glass rounded-xl p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{review.name}</span>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-white/50 italic">"{review.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
