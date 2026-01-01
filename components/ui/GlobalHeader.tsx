"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, Menu, X, ChevronDown, User, ExternalLink, LogOut, Copy 
} from "lucide-react";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";

export function GlobalHeader() {
  const pathname = usePathname();
  const { isConnected, wallet, connectAuth, disconnectAuth } = useLazorContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = () => {
    if (wallet?.smartWallet) {
      navigator.clipboard.writeText(wallet.smartWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navItems = [
    { name: "Hub", href: "/" },
    { name: "Store", href: "/store" },
    { name: "Swap", href: "/swap" },
    { name: "Send", href: "/send" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-neon-green to-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">
                LAZOR<span className="text-neon-green">PAY</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Wallet */}
          <div className="flex items-center gap-3">
            {isConnected && wallet ? (
              <div className="relative">
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-inner">
                      <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-mono text-white/90 hidden sm:block">
                    {wallet.smartWallet.slice(0, 4)}...{wallet.smartWallet.slice(-4)}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${walletMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {walletMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setWalletMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-[#111] rounded-xl border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-3 bg-white/5 rounded-lg mb-2">
                            <div className="text-[10px] text-white/40 uppercase font-bold mb-1">Smart Wallet</div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-white truncate w-32">{wallet.smartWallet}</span>
                                <button onClick={handleCopy} className="text-white/40 hover:text-white">
                                    {copied ? <span className="text-neon-green text-[10px]">COPIED</span> : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                        </div>
                        <button onClick={disconnectAuth} className="w-full flex items-center gap-2 p-2 hover:bg-red-500/10 text-red-400 rounded-lg text-xs font-bold transition-colors">
                            <LogOut className="w-3 h-3" /> DISCONNECT
                        </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={connectAuth}
                className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:scale-105 transition-transform"
              >
                CONNECT PASSKEY
              </button>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-white/80 hover:text-white">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 p-4 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-bold text-white/60 hover:bg-white/5 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
        </div>
      )}
    </header>
  );
}
