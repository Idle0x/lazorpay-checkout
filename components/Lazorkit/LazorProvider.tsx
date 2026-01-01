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
// This sits inside SDKProvider so it can access useWallet()
function LazorLogic({ children }: { children: ReactNode }) {
  const { connect, disconnect, wallet, isConnected, signAndSendTransaction } = useWallet();
  const [connection] = useState(() => new Connection(RPC_URL));

  // 1. ROBUST CONNECT
  const connectAuth = async () => {
    try {
      console.log("🔵 Initializing Passkey Auth...");
      // We assume feeMode 'paymaster' is the default desire for this demo
      const walletData = await connect({ feeMode: 'paymaster' });
      
      console.log("⚡ SDK Connection Success:", walletData);
    } catch (e: any) {
      console.error("🔴 Connection Failed:", e);
      alert(`Passkey Error: ${e.message}`);
    }
  };

  // 2. ROBUST DISCONNECT
  const disconnectAuth = async () => {
    await disconnect();
    localStorage.clear(); // Nuclear option for demo to ensure clean slate
    window.location.reload();
  };

  // 3. ROBUST SIGN & SEND
  const signAndSend = async (instructions: any[]) => {
    if (!wallet) throw new Error("Wallet not connected");

    console.log("🟡 Requesting Paymaster Sponsorship...");
    
    // The exact payload structure from your working snippet
    const payload = {
      instructions,
      transactionOptions: {
        feeToken: 'USDC', 
        computeUnitLimit: 500_000,
        clusterSimulation: 'devnet' as const // TypeScript cast
      }
    };

    const signature = await signAndSendTransaction(payload);
    console.log("🟢 Transaction Signed & Sent:", signature);
    return signature;
  };

  return (
    <LazorContext.Provider value={{ 
      isConnected, 
      // Safely mapping the wallet object
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

// --- MAIN EXPORTED PROVIDER ---
export function LazorProvider({ children }: { children: ReactNode }) {
  return (
    <SDKProvider 
      rpcUrl={RPC_URL}
      portalUrl={PORTAL_URL}
      // REMOVED: isDebug, configPaymaster (These caused the build fails)
      // The Web SDK infers paymaster config from the portal or defaults
    >
      <LazorLogic>{children}</LazorLogic>
    </SDKProvider>
  );
}

// --- HOOK EXPORT ---
export function useLazorContext() {
  const context = useContext(LazorContext);
  if (!context) throw new Error("useLazorContext must be used within LazorProvider");
  return context;
}
