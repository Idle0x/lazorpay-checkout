"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { LazorkitProvider as SDKProvider, useWallet } from "@lazorkit/wallet";
import { Connection } from "@solana/web3.js";

// --- CONFIGURATION ---
const RPC_URL = "https://api.devnet.solana.com";
// const PAYMASTER_URL = "https://kora.devnet.lazorkit.com"; // Standard
const PORTAL_URL = "https://portal.lazor.sh";

// --- CONTEXT DEFINITIONS ---
interface LazorContextType {
  isConnected: boolean;
  wallet: { smartWallet: string } | null;
  connection: Connection;
  signAndSend: (instructions: any[]) => Promise<string>;
  connectAuth: () => Promise<void>;
  disconnectAuth: () => Promise<void>;
}

const LazorContext = createContext<LazorContextType | undefined>(undefined);

// --- INNER COMPONENT (Accesses SDK Hooks) ---
function LazorLogic({ children }: { children: ReactNode }) {
  const { connect, disconnect, wallet, isConnected, signAndSendTransaction } = useWallet();
  const [connection] = useState(() => new Connection(RPC_URL));

  // 1. Handle Connect
  const connectAuth = async () => {
    try {
      console.log("🔵 Initializing Passkey Auth...");
      await connect({ feeMode: 'paymaster' }); // Enable Gasless by default
    } catch (e) {
      console.error("🔴 Connection Failed:", e);
      alert("Passkey connection failed. Ensure you are on HTTPS or Localhost.");
    }
  };

  // 2. Handle Disconnect
  const disconnectAuth = async () => {
    await disconnect();
    // Optional: Clear local storage if needed
    localStorage.removeItem("lazor_session"); 
  };

  // 3. Wrapper for Transactions (The "Magic" Function)
  const signAndSend = async (instructions: any[]) => {
    if (!wallet) throw new Error("Wallet not connected");

    console.log("🟡 Requesting Paymaster Sponsorship...");
    
    // The Core SDK Call
    const signature = await signAndSendTransaction({
      instructions,
      transactionOptions: {
        feeToken: 'USDC', // Requesting fee sponsorship (simulated on Devnet)
        computeUnitLimit: 500_000,
        clusterSimulation: 'devnet'
      }
    });

    console.log("🟢 Transaction Signed & Sent:", signature);
    return signature;
  };

  return (
    <LazorContext.Provider value={{ 
      isConnected, 
      wallet: wallet ? { smartWallet: wallet.smartWallet } : null,
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
  return (
    <SDKProvider 
      rpcUrl={RPC_URL}
      portalUrl={PORTAL_URL}
      // FIX: The Web SDK uses 'paymaster' or simply configures it internally via the portal
      // Removing explicit paymaster config props that cause type errors on the web version
      // The 'feeMode: paymaster' in connect() handles the logic
      isDebug={true} 
    >
      <LazorLogic>{children}</LazorLogic>
    </SDKProvider>
  );
}

// --- CUSTOM HOOK ---
export function useLazorContext() {
  const context = useContext(LazorContext);
  if (!context) throw new Error("useLazorContext must be used within LazorProvider");
  return context;
}
