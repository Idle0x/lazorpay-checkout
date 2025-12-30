"use client";

import React, { createContext, useContext } from "react";
import { LazorkitProvider as SDKProvider } from "@lazorkit/wallet";
import { APP_CONFIG } from "@/lib/constants";
import { useLazorAuth, WalletInfo } from "@/hooks/useLazorAuth";

interface LazorContextType {
  wallet: WalletInfo | null;
  isConnected: boolean;
  isLoading: boolean;
  saveSession: (data: WalletInfo) => void;
  clearSession: () => void;
  refreshSession: () => void; // ADDED THIS
}

const LazorContext = createContext<LazorContextType | undefined>(undefined);

export function LazorProvider({ children }: { children: React.ReactNode }) {
  const auth = useLazorAuth();

  return (
    <SDKProvider
      rpcUrl={APP_CONFIG.RPC_URL}
      portalUrl={APP_CONFIG.PORTAL_URL}
      paymasterConfig={{
        paymasterUrl: APP_CONFIG.PAYMASTER_URL,
      }}
    >
      <LazorContext.Provider value={auth}>
        {children}
      </LazorContext.Provider>
    </SDKProvider>
  );
}

export function useLazorContext() {
  const context = useContext(LazorContext);
  if (context === undefined) {
    throw new Error("useLazorContext must be used within a LazorProvider");
  }
  return context;
}
