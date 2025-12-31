# ⛽ How to Setup Gasless Transactions (Paymaster)

LazorPay demonstrates how to toggle between "User Paid" and "Sponsored" transactions dynamically. Here is how the Logic works.

## 1. Defining the Paymaster
In your Provider configuration, you must define the `paymasterConfig`.

```typescript
<LazorkitProvider
  // ... other config
  paymasterConfig={{
    paymasterUrl: "[https://kora.devnet.lazorkit.com](https://kora.devnet.lazorkit.com)", 
    // You can also add 'apiKey' here for mainnet
  }}
>
```

## 2. Constructing the Transaction
When sending a transaction, the `signAndSendTransaction` method accepts an options object.

* **To Enable Gasless:** Do nothing! If the Provider has a paymaster URL, the SDK attempts to sponsor by default.
* **To Disable Gasless (User Pays):** You would typically override the configuration or simply not provide a Paymaster URL in the provider.

In LazorPay, we visualize this logic:

```typescript
const payload = {
    instructions: [transferInstruction],
    transactionOptions: {
        clusterSimulation: "devnet"
    }
};

// The SDK handles the heavy lifting.
// It sends the transaction to the Kora Paymaster, 
// which verifies the policy and signs the transaction as the fee payer.
const signature = await signAndSendTransaction(payload);
```

## 3. Limits & Best Practices
* **Byte Limit:** Sponsored transactions are slightly larger due to the extra signature. Keep your instructions atomic (under 1232 bytes).
* **Devnet vs Mainnet:** The Kora devnet paymaster is open. For Mainnet, you will need an API Key from the LazorKit team.





----




# ⛽ How to Setup Gasless Transactions

LazorPay demonstrates how to eliminate gas fees for your users using the **Kora Paymaster**.

## 1. Configuration
In your `LazorkitProvider`, simply providing the `configPaymaster` prop enables sponsorship globally.

```typescript
configPaymaster={{
  paymasterUrl: "[https://kora.devnet.lazorkit.com](https://kora.devnet.lazorkit.com)", 
}}
```

## 2. Sending a Transaction
When you send a transaction, the SDK automatically routes it through the Relayer if the Paymaster is configured.

```typescript
const { signAndSendTransaction } = useWallet();

const handleTx = async () => {
  const payload = {
    instructions: [/* your instructions */],
    transactionOptions: {
      clusterSimulation: "devnet"
    }
  };

  // 1. SDK sends TX to Kora Paymaster
  // 2. Paymaster verifies and signs as "Fee Payer"
  // 3. User approves with Biometrics
  const signature = await signAndSendTransaction(payload);
};
```

## 3. Limits & Best Practices
* **Atomic Transactions:** Keep your instruction size small (under 1232 bytes). Sponsored transactions are slightly larger due to the extra signature.
* **Devnet vs Mainnet:** The URL above is for Devnet. For Mainnet, you will need an API Key from the LazorKit team.

