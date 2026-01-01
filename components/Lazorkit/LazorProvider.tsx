"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
// We only import the Provider and hook. We will be very careful with the hook.
import { LazorkitProvider as SDKProvider, useWallet } from "@lazorkit/wallet";
import { Connection } from "@solana/web3.js";

// --- CONFIGURATION ---
const RPC_URL = "https://api.devnet.solana.com";
const PORTAL_URL = "https://portal.lazor.sh";

// --- TYPES ---
interface WalletData {
  smartWallet: string;
  credentialId: string;
  passkeyPubkey?: any;
}

interface LazorContextType {
  isConnected: boolean;
  wallet: WalletData | null;
  connection: Connection;
  signAndSend: (instructions: any[]) => Promise<string>;
  connectAuth: () => Promise<void>;
  disconnectAuth: () => Promise<void>;
}

const LazorContext = createContext<LazorContextType | undefined>(undefined);

// --- INNER LOGIC COMPONENT ---
function LazorLogic({ children }: { children: ReactNode }) {
  // 🚨 CRITICAL FIX: Only destructure METHODS. Never destructure state properties eagerly.
  const { connect, disconnect, signAndSendTransaction } = useWallet();
  
  // We mirror the wallet state locally to avoid hydration mismatches
  const [localWallet, setLocalWallet] = useState<WalletData | null>(null);
  
  const connection = useMemo(() => new Connection(RPC_URL), []);

  // 1. SAFE CONNECT
  const connectAuth = async () => {
    try {
      console.log("🔵 Initializing Passkey Auth...");
      
      // We assume the SDK connect() returns the wallet info object.
      // We do NOT rely on the hook's state updating automatically during this render cycle.
      const walletInfo = await connect({ feeMode: 'paymaster' });
      
      if (walletInfo && walletInfo.smartWallet) {
        console.log("✅ Auth Success:", walletInfo);
        setLocalWallet({
          smartWallet: walletInfo.smartWallet,
          credentialId: walletInfo.credentialId,
          passkeyPubkey: walletInfo.passkeyPubkey
        });
      }
    } catch (e: any) {
      console.error("🔴 Connection Failed:", e);
      if (!e.message?.includes("cancelled")) {
        alert(`Passkey Error: ${e.message}`);
      }
    }
  };

  // 2. SAFE DISCONNECT
  const disconnectAuth = async () => {
    try {
      await disconnect();
      setLocalWallet(null);
      
      // Safe storage clearing
      if (typeof window !== 'undefined') {
        localStorage.removeItem("lazor_wallet_info");
        window.location.reload();
      }
    } catch (e) {
      console.error("Disconnect error:", e);
    }
  };

  // 3. SAFE SIGN & SEND
  const signAndSend = async (instructions: any[]) => {
    if (!localWallet) throw new Error("Wallet not connected");

    console.log("🟡 Requesting Paymaster Sponsorship...");
    
    const payload = {
      instructions,
      transactionOptions: {
        feeToken: 'USDC', 
        computeUnitLimit: 500_000,
        clusterSimulation: 'devnet' as const
      }
    };

    const signature = await signAndSendTransaction(payload);
    console.log("🟢 Transaction Signed & Sent:", signature);
    return signature;
  };

  // 4. AUTO-RECONNECT (Optional/Safe)
  // We can try to silently connect on mount if we trust the SDK's cache,
  // but for this demo, let's keep it manual to be 100% crash-proof.
  // If you want persistence, we can add it later.

  const contextValue = useMemo(() => ({
    isConnected: !!localWallet, 
    wallet: localWallet,
    connection,
    signAndSend,
    connectAuth,
    disconnectAuth
  }), [localWallet, connection]);

  return (
    <LazorContext.Provider value={contextValue}>
      {children}
    </LazorContext.Provider>
  );
}

// --- MAIN PROVIDER WRAPPER ---
export function LazorProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  return (
    <SDKProvider 
      rpcUrl={RPC_URL}
      portalUrl={PORTAL_URL}
    >
      <LazorLogic>{children}</LazorLogic>
    </SDKProvider>
  );
}

export function useLazorContext() {
  const context = useContext(LazorContext);
  if (!context) throw new Error("useLazorContext must be used within LazorProvider");
  return context;
}
