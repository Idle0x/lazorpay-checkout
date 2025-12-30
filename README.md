# ⚡ LazorPay Checkout

> The "Invisible Wallet" experience for Solana.
> A drop-in, production-ready checkout component powered by **LazorKit v2**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-live-green.svg)
![Stack](https://img.shields.io/badge/stack-Next.js_14-black.svg)

## 🌟 The Concept
LazorPay proves that crypto onboarding doesn't have to be painful. By integrating **LazorKit's Passkey SDK**, we turn a standard checkout flow into a 1-click biometric experience.

**No Seed Phrases. No Extensions. Just FaceID.**

### ✨ Key Features
* **Biometric Auth:** Uses WebAuthn (Secure Enclave) for instant login.
* **Gasless Toggling:** A UI switch to demonstrate Sponsored vs. User-Paid transactions.
* **Manual Session Persistence:** Custom hook logic to keep users logged in across refreshes.
* **X-Ray Console:** A built-in "Dev Mode" terminal that visualizes the SDK logic in real-time.
* **Atomic Transactions:** Optimized instruction size to prevent "Transaction Too Large" errors.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* A modern browser with WebAuthn support (Chrome, Safari, Edge).
* **HTTPS Environment** (Required for Passkeys).

### Installation

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/lazorpay-checkout.git](https://github.com/YOUR_USERNAME/lazorpay-checkout.git)
    cd lazorpay-checkout
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Dev Server**
    ```bash
    npm run dev
    ```
    *Note: If running locally, ensure you are using `https://localhost` via a proxy or `mkcert`. If using GitHub Codespaces, HTTPS is automatic.*

4.  **Open the App**
    Visit the URL provided in your terminal (usually `http://localhost:3000`).

---

## 🛠️ Configuration

The app is pre-configured for **Solana Devnet**.
Configuration lives in `lib/constants.ts`:

```typescript
export const APP_CONFIG = {
  CLUSTER: "devnet",
  RPC_URL: "[https://api.devnet.solana.com](https://api.devnet.solana.com)",
  PORTAL_URL: "[https://portal.lazor.sh](https://portal.lazor.sh)",
  PAYMASTER_URL: "[https://kora.devnet.lazorkit.com](https://kora.devnet.lazorkit.com)",
};
```

---

## 📚 Documentation & Tutorials

We have included two detailed guides to help you integrate these features into your own app:

1.  **[Integration Guide](/docs/integration-guide.md)** - How to add the LazorProvider and Checkout Widget.
2.  **[Gasless Setup](/docs/gasless-setup.md)** - How to configure the Paymaster for sponsored fees.

---

## 🐛 Troubleshooting

| Error | Solution |
| :--- | :--- |
| **Login Failed / Not Allowed** | Ensure you are on **HTTPS**. Passkeys do not work on HTTP (except localhost in some browsers). |
| **Transaction Too Large** | We use atomic transfer instructions. Avoid adding large Memo data to transactions. |
| **Insufficient Funds** | If testing without Gasless mode, use the built-in "Faucet" link in the widget to fund your Smart Wallet. |

---

*Built for the Superteam Vietnam LazorKit Bounty.*
