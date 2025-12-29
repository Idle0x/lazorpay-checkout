"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/lib/constants";

// The shape of the wallet data we get from LazorKit
export interface WalletInfo {
  credentialId: string;
    passkeyPubkey: string;
      smartWallet: string; // The Solana Address
        walletDevice: string;
        }

        export function useLazorAuth() {
          const [wallet, setWallet] = useState<WalletInfo | null>(null);
            const [isLoading, setIsLoading] = useState(true);

              // 1. THE FIX: Load session from LocalStorage on mount
                useEffect(() => {
                    const loadSession = () => {
                          try {
                                  const stored = localStorage.getItem(STORAGE_KEYS.WALLET_INFO);
                                          if (stored) {
                                                    const parsed = JSON.parse(stored);
                                                              setWallet(parsed);
                                                                        console.log("⚡ [LazorAuth] Session Restored:", parsed.smartWallet);
                                                                                }
                                                                                      } catch (e) {
                                                                                              console.error("Failed to load session", e);
                                                                                                    } finally {
                                                                                                            setIsLoading(false);
                                                                                                                  }
                                                                                                                      };

                                                                                                                          loadSession();
                                                                                                                            }, []);

                                                                                                                              // 2. Save session (Call this after successful login)
                                                                                                                                const saveSession = useCallback((data: WalletInfo) => {
                                                                                                                                    setWallet(data);
                                                                                                                                        localStorage.setItem(STORAGE_KEYS.WALLET_INFO, JSON.stringify(data));
                                                                                                                                            console.log("🔒 [LazorAuth] Session Saved");
                                                                                                                                              }, []);

                                                                                                                                                // 3. Clear session (Logout)
                                                                                                                                                  const clearSession = useCallback(() => {
                                                                                                                                                      setWallet(null);
                                                                                                                                                          localStorage.removeItem(STORAGE_KEYS.WALLET_INFO);
                                                                                                                                                              console.log("🚫 [LazorAuth] Session Cleared");
                                                                                                                                                                }, []);

                                                                                                                                                                  return {
                                                                                                                                                                      wallet,
                                                                                                                                                                          isConnected: !!wallet,
                                                                                                                                                                              isLoading,
                                                                                                                                                                                  saveSession,
                                                                                                                                                                                      clearSession,
                                                                                                                                                                                        };
                                                                                                                                                                                        }