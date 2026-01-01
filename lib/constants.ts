import { Cluster } from "@solana/web3.js";

export const APP_CONFIG = {
  CLUSTER: "devnet" as Cluster,
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  // The official Devnet Paymaster from your research
  PAYMASTER_URL: "https://kora.devnet.lazorkit.com", 
  // Your Devnet Wallet to receive the funds
  MERCHANT_ADDRESS: "FvyYz9tqnCmG4XYrRKFG4fCrsUwK7T3KJsd97MFWGSiy",
};

export const STORAGE_KEYS = {
  WALLET_INFO: "lazor_wallet_info",
};
