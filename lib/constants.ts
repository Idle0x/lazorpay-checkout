import { Cluster } from "@solana/web3.js";

// The "God Mode" Configuration
export const APP_CONFIG = {
  // We use Devnet for the Hackathon
  CLUSTER: "devnet" as Cluster,
  
  // Public RPC 
  RPC_URL: "https://api.devnet.solana.com",
  
  // LazorKit Official Endpoints
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER_URL: "https://kora.devnet.lazorkit.com",
  
  MERCHANT_ADDRESS: "FvyYz9tqnCmG4XYrRKFG4fCrsUwK7T3KJsd97MFWGSiy",
  
  // App Metadata
  APP_NAME: "LazorPay Checkout",
  APP_URL: "https://lazorpay.vercel.app",
};

export const STORAGE_KEYS = {
  WALLET_INFO: "lazor_wallet_info",
};
