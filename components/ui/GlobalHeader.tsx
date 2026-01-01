"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, Menu, X, ChevronDown, Wallet, Copy, ExternalLink, LogOut, User
} from "lucide-react";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider"; // IMPORT OUR NEW HOOK

export function GlobalHeader() {
  const pathname = usePathname();
  // USE REAL AUTH FUNCTIONS
  const { isConnected, wallet, connectAuth, disconnectAuth } = useLazorContext();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

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
    { name: "Mint", href: "/mint" },
    { name: "Trade", href: "/trade" },
    { name: "Subs", href: "/subs" } // Added Subs
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-lg shadow-black/40 py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                <Zap className="w-6 h-6 text-white" fill="currentColor" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-white tracking-tight leading-none">
                LAZOR<span className="text-emerald-400">PAY</span>
              </div>
              <div className="text-[9px] text-white/40 tracking-[0.3em] font-mono mt-1">
                HUB // V2
              </div>
            </div>
          </Link>

          {/* Nav Pills */}
          <nav className="hidden lg:flex items-center bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive ? "text-black bg-white shadow-inner font-bold" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            
            {/* Wallet Section */}
            {isConnected && wallet ? (
              <div className="relative">
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="flex items-center gap-3 glass hover:glass-strong px-4 py-2 rounded-xl transition-all group border-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <div className="text-[10px] text-emerald-400 font-bold tracking-wide">CONNECTED</div>
                    <div className="text-xs font-mono text-white/80">
                      {wallet.smartWallet.slice(0, 4)}...{wallet.smartWallet.slice(-4)}
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${walletMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {walletMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setWalletMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-72 glass-strong rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2 space-y-1">
                        <div className="px-3 py-2">
                            <div className="text-[10px] text-white/40 uppercase tracking-wider font-bold mb-2">Smart Wallet</div>
                            <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
                                <span className="text-xs font-mono text-white/80 truncate w-32">{wallet.smartWallet}</span>
                                <button onClick={handleCopy} className="text-white/60 hover:text-white transition-colors">
                                    {copied ? <span className="text-emerald-400 text-xs">Copied</span> : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                        </div>

                        <button onClick={() => window.open(`https://solscan.io/account/${wallet.smartWallet}?cluster=devnet`, '_blank')} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left group">
                          <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white" />
                          <span className="text-sm text-white/80 group-hover:text-white">View on Solscan</span>
                        </button>
                        
                        <div className="h-px bg-white/10 my-1" />
                        
                        <button onClick={disconnectAuth} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg transition-colors text-left group">
                          <LogOut className="w-4 h-4 text-white/60 group-hover:text-red-500" />
                          <span className="text-sm text-white/80 group-hover:text-red-500">Disconnect</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={connectAuth}
                className="btn-primary flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline font-bold">Connect Passkey</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 glass rounded-xl text-white/80 hover:text-white">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass-strong border-t border-white/10 animate-in slide-in-from-top-4 duration-300">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  pathname === item.href ? "bg-white text-black font-bold" : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
