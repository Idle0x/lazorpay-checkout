# 🔌 Integration Guide: Adding LazorPay to Your App

This guide explains how to integrate the **LazorKit v2 SDK** into a Next.js application, using the exact patterns from LazorPay.

## Step 1: The Provider Wrap
LazorKit requires a context provider to manage state. We wrap this in our own `LazorProvider` to handle **Session Persistence**.

**File:** `components/Lazorkit/LazorProvider.tsx`

```typescript
// 1. Import the SDK Provider (Note the lowercase 'k')
import { LazorkitProvider } from "@lazorkit/wallet";

export function LazorProvider({ children }) {
  return (
    <LazorkitProvider
      rpcUrl="[https://api.devnet.solana.com](https://api.devnet.solana.com)"
      portalUrl="[https://portal.lazor.sh](https://portal.lazor.sh)"
      paymasterConfig={{
        paymasterUrl: "[https://kora.devnet.lazorkit.com](https://kora.devnet.lazorkit.com)",
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

## Step 2: The Connect Hook
Inside any component, use the `useWallet` hook to trigger the biometric login.

```typescript
import { useWallet } from "@lazorkit/wallet";

export function LoginButton() {
  const { connect } = useWallet();

  const handleLogin = async () => {
    try {
      // This triggers the FaceID / TouchID modal
      await connect(); 
      console.log("Logged in!");
    } catch (e) {
      console.error("Auth failed", e);
    }
  };

  return <button onClick={handleLogin}>Connect with Passkey</button>;
}
```

## Step 3: Session Persistence
LazorKit does not persist sessions by default. To fix this, we use a `useEffect` hook to check `localStorage` on mount:

```typescript
useEffect(() => {
  const stored = localStorage.getItem("lazor_wallet_info");
  if (stored) {
    setWallet(JSON.parse(stored));
  }
}, []);
```
