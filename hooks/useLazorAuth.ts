"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

export interface WalletInfo {
  credentialId: string;
  passkeyPubkey: string;
  smartWallet: string;
  walletDevice: string;
}

export function useLazorAuth() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The function that actually looks into the storage
  const checkStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WALLET_INFO);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Only update state if it's actually different to prevent loops
        setWallet((prev) => {
          if (prev?.smartWallet !== parsed.smartWallet) {
            console.log("⚡ [LazorAuth] Wallet Found:", parsed.smartWallet);
            return parsed;
          }
          return prev;
        });
      }
    } catch (e) {
      console.error("Failed to load session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Check on mount
  useEffect(() => {
    checkStorage();
  }, [checkStorage]);

  // 2. NEW: Listen for storage changes (Sync across tabs/windows)
  useEffect(() => {
    const handleStorageChange = () => checkStorage();
    window.addEventListener("storage", handleStorageChange);
    // Also listen for our custom event (see below)
    window.addEventListener("lazor_wallet_update", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("lazor_wallet_update", handleStorageChange);
    };
  }, [checkStorage]);

  // 3. Save session & notify everyone
  const saveSession = useCallback((data: WalletInfo) => {
    setWallet(data);
    localStorage.setItem(STORAGE_KEYS.WALLET_INFO, JSON.stringify(data));
    // Dispatch a custom event so the current window updates immediately
    window.dispatchEvent(new Event("lazor_wallet_update"));
    console.log("🔒 [LazorAuth] Session Saved");
  }, []);

  // 4. Clear session
  const clearSession = useCallback(() => {
    setWallet(null);
    localStorage.removeItem(STORAGE_KEYS.WALLET_INFO);
    window.dispatchEvent(new Event("lazor_wallet_update"));
    console.log("🚫 [LazorAuth] Session Cleared");
  }, []);

  return {
    wallet,
    isConnected: !!wallet,
    isLoading,
    saveSession,
    clearSession,
    refreshSession: checkStorage, // EXPOSE THIS!
  };
}
