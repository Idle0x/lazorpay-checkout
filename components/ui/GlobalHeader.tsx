"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutGrid, ShoppingBag, ArrowLeftRight, Image as ImageIcon, Wallet, LogOut } from "lucide-react";
import { useLazorContext } from "@/components/Lazorkit/LazorProvider";
import { useWallet } from "@lazorkit/wallet";

export function GlobalHeader() {
  const pathname = usePathname();
  const { isConnected, wallet, refreshSession, saveSession, clearSession } = useLazorContext();
  const { connect } = useWallet();

  // Handle Login Logic Globally
  const handleConnect = async () => {
    try {
      const data = await connect();
      if (data && data.smartWallet) {
        saveSession({
          credentialId: data.credentialId || "",
          passkeyPubkey: data.passkeyPubkey ? JSON.stringify(data.passkeyPubkey) : "",
          smartWallet: data.smartWallet,
          walletDevice: data.walletDevice || "web"
        });
      }
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const navItems = [
    { name: "Hub", href: "/", icon: LayoutGrid },
    { name: "Store", href: "/store", icon: ShoppingBag },
    { name: "Swap", href: "/swap", icon: ArrowLeftRight },
    { name: "Mint", href: "/mint", icon: ImageIcon },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-neon-green/10 rounded-lg flex items-center justify-center border border-neon-green/30 group-hover:border-neon-green transition-colors">
          <Zap className="w-5 h-5 text-neon-green" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white tracking-wider text-sm leading-tight">LAZOR<span className="text-neon-blue">PAY</span></span>
          <span className="text-[9px] text-cyber-muted tracking-[0.2em]">HUB</span>
        </div>
      </Link>

      {/* Navigation (Desktop) */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono transition-all ${
                isActive 
                  ? "bg-white/10 text-white border border-white/20" 
                  : "text-cyber-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3 h-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Wallet Actions */}
      <div className="flex items-center gap-3">
        {isConnected && wallet ? (
          <div className="flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-cyber-muted font-mono">SMART WALLET</div>
              <div className="text-xs text-neon-blue font-bold font-mono">
                {wallet.smartWallet.slice(0, 4)}...{wallet.smartWallet.slice(-4)}
              </div>
            </div>
            <button 
              onClick={clearSession}
              className="p-2 hover:bg-red-500/10 hover:text-red-500 text-cyber-muted rounded transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded text-xs font-bold hover:bg-neon-green transition-colors"
          >
            <Wallet className="w-3 h-3" />
            CONNECT PASSKEY
          </button>
        )}
      </div>
    </header>
  );
}
