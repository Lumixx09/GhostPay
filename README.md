![GhostPay Header](/frontend/public/ghostpay_header.png)

# GhostPay Protocol 👻✨
**The Leading Confidential Bulk Payroll Protocol on Arbitrum Sepolia**

GhostPay is a privacy-first, institutional-grade payroll dApp built for the **iExec Vibe Coding Challenge**. It leverages the power of **iExec Nox Confidential Computing** to enable businesses to distribute mass salaries with total privacy and cryptographic security on **Arbitrum Sepolia**.

---

## 📽️ The Video Demo
> [!IMPORTANT]
> [Watch our 4-minute deep dive here](https://youtube.com/GHOSTPAY_DEMO_LINK) (Coming Soon for final submission)

## 🌌 The Problem
In traditional Web3 payroll, wallet addresses and amounts are visible on public explorers. This leaks sensitive corporate data and personal financial information.

## 💎 The GhostPay Solution
GhostPay solves the privacy gap using **End-to-End Encryption** via iExec Nox.
- **Confidential Bulk Distributions**: Employers execute mass payrolls in a single encrypted batch.
- **Identity Protection**: Only the employer and the specific employee know the distribution amount.
- **Zero-Mock Intelligence**: A live, event-driven ledger synchronized with Arbitrum Sepolia.

---

## 🚀 Key Features
### 1. Pro-Grade Confidential Dashboard
A high-density financial workspace featuring a 3-column "Deep Space" grid, live protocol metrics, and an integrated AI assistant.

### 2. Live Blockchain Event Indexing
GhostPay uses a serverless indexing engine to pull real-time on-chain history, providing verifiable proof of payroll without a centralized database.

### 3. GhostPay AI Analyst
An integrated AI engine (powered by ChainGPT) that has read-access to your protocol history, providing real-time data analysis and payroll optimization insights.

### 4. NX-Vault Security
Powered by **iExec Nox**, ensuring that salary data moves through secure enclaves, keeping it invisible to third parties and the network itself.

---

## 🛠️ Technical Architecture
- **Layer 2**: Arbitrum Sepolia (Ultra-low gas, high speed).
- **Privacy Layer**: iExec Nox (Confidential ERC-7984 standard).
- **Frontend**: React 18 + Vite (High-performance UI).
- **Intelligence**: ChainGPT API integrated with live on-chain context.
- **Styling**: Vanilla CSS Design System (Custom Glassmorphism).

---

## 📦 Getting Started

### Prerequisites
- Node.js v18+
- MetaMask (Connected to Arbitrum Sepolia)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Lumixx09/GhostPay.git
   ```
2. Setup Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Setup Contracts:
   ```bash
   cd contracts
   npm install
   npx hardhat compile
   ```

### Configuration
Create a `.env` in the `frontend` directory:
```env
VITE_GHOST_PAY_ADDRESS=0xyour_contract_address
VITE_CHAINGPT_API_KEY=your_key
```

---

## 👻 Our Vision
We believe privacy is a human right, especially in the workspace. GhostPay aims to become the standard for confidential distributions in the growing decentralized economy.

Built with 💜 for the iExec Vibe Hackathon.
