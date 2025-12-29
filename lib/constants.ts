import { Cluster } from "@solana/web3.js";

// The "God Mode" Configuration
export const APP_CONFIG = {
  // We use Devnet for the Hackathon (Judges expect this)
    CLUSTER: "devnet" as Cluster,
      
        // Public RPC (If this gets rate-limited, we swap to Helius later)
          RPC_URL: "https://api.devnet.solana.com",
            
              // LazorKit Official Endpoints (Extracted from Docs)
                PORTAL_URL: "https://portal.lazor.sh",
                  PAYMASTER_URL: "https://kora.devnet.lazorkit.com",
                    
                      // App Metadata
                        APP_NAME: "LazorPay Checkout",
                          APP_URL: "https://lazorpay.vercel.app", // Placeholder for now
                          };

                          // Storage Keys for our Manual Persistence Fix
                          export const STORAGE_KEYS = {
                            WALLET_INFO: "lazor_wallet_info",
                            };