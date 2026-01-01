"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// We import the real SDK provider
import { LazorkitProvider as SDKProvider, useWallet } from "@lazorkit/wallet";
import { APP_CONFIG, STORAGE_KEYS } from "@/lib/constants";

// Define the shape of our context
interface LazorContextType {
  wallet: { smartWallet: string; credentialId: string } | null;
  isConnected: boolean;
  isLoading: boolean;
  connectAuth: () => Promise<void>;
  disconnectAuth: () => Promise<void>;
}

const LazorContext = createContext<LazorContextType | undefined>(undefined);

// Internal component to handle hooks inside the SDK Provider
function LazorAuthLogic({ children }: { children: React.ReactNode }) {
  // Get methods from the REAL SDK
  const { connect, disconnect, wallet: sdkWallet } = useWallet();
  
  const [localWallet, setLocalWallet] = useState<{ smartWallet: string; credentialId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Load Session on Mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.WALLET_INFO);
    if (stored) {
      setLocalWallet(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  // 2. Sync SDK state to Local State (Safety Net)
  useEffect(() => {
    if (sdkWallet && sdkWallet.smartWallet) {
      const walletData = {
        smartWallet: sdkWallet.smartWallet,
        credentialId: sdkWallet.credentialId,
      };
      setLocalWallet(walletData);
      localStorage.setItem(STORAGE_KEYS.WALLET_INFO, JSON.stringify(walletData));
    }
  }, [sdkWallet]);

  // 3. Wrapper Actions
  const connectAuth = async () => {
    try {
      // Per docs: trigger connection with paymaster preference
      await connect({ feeMode: 'paymaster' });
    } catch (e) {
      console.error("Auth failed:", e);
      throw e;
    }
  };

  const disconnectAuth = async () => {
    await disconnect();
    setLocalWallet(null);
    localStorage.removeItem(STORAGE_KEYS.WALLET_INFO);
  };

  return (
    <LazorContext.Provider
      value={{
        wallet: localWallet,
        isConnected: !!localWallet,
        isLoading,
        connectAuth,
        disconnectAuth,
      }}
    >
      {children}
    </LazorContext.Provider>
  );
}

// The Main Provider Wrapper
export function LazorProvider({ children }: { children: React.ReactNode }) {
  return (
    <SDKProvider
      rpcUrl={APP_CONFIG.RPC_URL}
      portalUrl={APP_CONFIG.PORTAL_URL}
      paymasterConfig={{
        paymasterUrl: APP_CONFIG.PAYMASTER_URL,
      }}
    >
      <LazorAuthLogic>{children}</LazorAuthLogic>
    </SDKProvider>
  );
}

export function useLazorContext() {
  const context = useContext(LazorContext);
  if (!context) throw new Error("useLazorContext must be used within LazorProvider");
  return context;
}
