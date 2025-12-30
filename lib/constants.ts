import { Cluster } from "@solana/web3.js";

export const APP_CONFIG = {
  CLUSTER: "devnet" as Cluster,
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER_URL: "https://kora.devnet.lazorkit.com",
  // A valid Solana Devnet Public Key (randomly generated)
  MERCHANT_ADDRESS: "H7a2tqQ9Q5xJ9Q5xJ9Q5xJ9Q5xJ9Q5xJ9Q5xJ9Q5xJ9", 
  APP_NAME: "LazorPay Checkout",
  APP_URL: "https://lazorpay.vercel.app",
};

export const STORAGE_KEYS = {
  WALLET_INFO: "lazor_wallet_info",
};
