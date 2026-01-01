"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LazorkitProvider as SDKProvider, useWallet } from "@lazorkit/wallet";
import { Connection } from "@solana/web3.js";

// --- CONFIGURATION ---
const RPC_URL = "https://api.devnet.solana.com";
const PORTAL_URL = "https://portal.lazor.sh";

// --- CONTEXT DEFINITIONS ---
interface LazorContextType {
  isConnected: boolean;
  wallet: { smartWallet: string; credentialId: string } | null;
  connection: Connection;
  signAndSend: (instructions: any[]) => Promise<string>;
  connectAuth: () => Promise<void>;
  disconnectAuth: () => Promise<void>;
}

const LazorContext = createContext<LazorContextType | undefined>(undefined);

// --- INNER LOGIC COMPONENT ---
function LazorLogic({ children }: { children: ReactNode }) {
  const { connect, disconnect, wallet, isConnected, signAndSendTransaction } = useWallet();
  const [connection] = useState(() => new Connection(RPC_URL));

  const connectAuth = async () => {
    try {
      console.log("🔵 Initializing Passkey Auth...");
      await connect({ feeMode: 'paymaster' });
    } catch (e: any) {
      console.error("🔴 Connection Failed:", e);
      alert(`Passkey Error: ${e.message}`);
    }
  };

  const disconnectAuth = async () => {
    await disconnect();
    localStorage.clear(); 
    window.location.reload();
  };

  const signAndSend = async (instructions: any[]) => {
    if (!wallet) throw new Error("Wallet not connected");

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

  return (
    <LazorContext.Provider value={{ 
      isConnected, 
      wallet: wallet ? { 
        smartWallet: wallet.smartWallet,
        credentialId: wallet.credentialId 
      } : null,
      connection,
      signAndSend,
      connectAuth,
      disconnectAuth
    }}>
      {children}
    </LazorContext.Provider>
  );
}

// --- MAIN PROVIDER WRAPPER ---
export function LazorProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // FIX: Only render the SDK on the client to prevent SSR crashes
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a clean loader or null while waiting for client hydration
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
