"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Zap, 
  Menu, 
  X, 
  ChevronDown, 
  Wallet,
  Copy,
  ExternalLink,
  LogOut,
  Settings,
  User
} from "lucide-react";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useWallet } from "@lazorkit/wallet";

export function GlobalHeader() {
  const pathname = usePathname();
  const { isConnected, wallet, clearSession, saveSession } = useLazorContext();
  const { connect } = useWallet();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [balance] = useState("4.2069"); // Mock balance
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      console.error("Connection failed", e);
    }
  };

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
    { name: "Subscribe", href: "/subs" }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass-strong shadow-lg shadow-black/20" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" fill="currentColor" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-white tracking-tight">
                LAZOR<span className="text-gradient">PAY</span>
              </div>
              <div className="text-[10px] text-white/40 tracking-[0.2em] -mt-1">
                CHECKOUT SUITE
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "text-white" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 glass rounded-lg" />
                  )}
                  <span className="relative z-10">{item.name}</span>
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
                  className="flex items-center gap-3 glass hover:glass-strong px-4 py-2 rounded-xl transition-all group"
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="text-xs text-white/60">Balance</div>
                    <div className="text-sm font-bold text-white">{balance} SOL</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs font-mono text-white">
                        {wallet.smartWallet.slice(0, 4)}...{wallet.smartWallet.slice(-4)}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${walletMenuOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Wallet Dropdown */}
                {walletMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setWalletMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-72 glass-strong rounded-xl border border-white/20 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      
                      {/* Balance Section */}
                      <div className="p-4 border-b border-white/10">
                        <div className="text-xs text-white/60 mb-1">Total Balance</div>
                        <div className="text-2xl font-bold text-white mb-3">{balance} SOL</div>
                        <div className="text-xs text-white/40">≈ $145.20 USD</div>
                      </div>

                      {/* Address Section */}
                      <div className="p-4 border-b border-white/10">
                        <div className="text-xs text-white/60 mb-2">Wallet Address</div>
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                          <div className="text-xs font-mono text-white flex-1 truncate">
                            {wallet.smartWallet}
                          </div>
                          <button
                            onClick={handleCopy}
                            className="p-1.5 hover:bg-white/10 rounded transition-colors"
                          >
                            {copied ? (
                              <span className="text-emerald-500 text-xs font-bold">✓</span>
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-white/60" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
                          <ExternalLink className="w-4 h-4 text-white/60" />
                          <span className="text-sm text-white">View on Explorer</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
                          <Settings className="w-4 h-4 text-white/60" />
                          <span className="text-sm text-white">Settings</span>
                        </button>
                        <button 
                          onClick={clearSession}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 rounded-lg transition-colors text-left group"
                        >
                          <LogOut className="w-4 h-4 text-white/60 group-hover:text-red-500" />
                          <span className="text-sm text-white group-hover:text-red-500">Disconnect</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="btn-primary flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 glass rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 glass-strong">
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}