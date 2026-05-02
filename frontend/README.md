# 👻 GhostPay Frontend
**The Confidential Institutional Payroll Dashboard**

Built with Vite, React, and TypeScript for the iExec Vibe Coding Challenge.

## ✨ Features
- **Confidential Dashboard**: Real-time protocol metrics synced from Arbitrum Sepolia.
- **Bulk Dispatch Engine**: High-performance parser for mass confidential payouts.
- **Shadow Mode**: Instant UI obfuscation for secure presentations.
- **AI Analyst**: Integrated ChainGPT assistant for on-chain data insights.
- **Secure Vaults**: Local contact management and session-based identity verification.

## 🛠️ Tech Stack
- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Web3**: [Ethers.js](https://docs.ethers.org/v6/)
- **Styling**: Vanilla CSS (CSS Modules) with glassmorphism and dynamic animations.

## 🚀 Getting Started

### 1. Environment Configuration
Create a `.env` file in this directory based on `.env.example`:
```env
VITE_GHOST_PAY_ADDRESS=0x... # Deployed GhostPay contract address
VITE_CHAINGPT_API_KEY=your_api_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Privacy & Security
The frontend communicates directly with the iExec Nox protocol on Arbitrum Sepolia. All sensitive transaction data is encrypted before being sent to the RPC, ensuring that individual salary amounts are never exposed in the browser's networking tab in plaintext.

