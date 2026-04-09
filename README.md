# GhostPay ✨ - Confidential Web3 Payroll

GhostPay is a privacy-preserving payroll and treasury management platform built for DAOs and Web3 Enterprises. 

By leveraging **iExec Nox (Confidential Computing)** and **ChainGPT (AI)**, GhostPay allows employers to stream salaries to their employees without exposing individual balances or transaction amounts to the public blockchain.

## 🚀 Features

- **Confidential Transfers**: Powered by iExec Nox (ERC-7984), ensuring salary data is only visible to the sender and recipient.
- **Multi-Token Treasury**: Supports wrapping arbitrary ERC-20 tokens (like USDC) into confidential tokens.
- **AI HR Assistant**: Integrated ChainGPT AI allows employees to query their balances, request advances, and generate pay stubs through a natural language interface.
- **Dual-Dashboard UX**: Specialized views for Employers (Treasury management) and Employees (Confidential balance & claims).

## 🛠 Tech Stack

- **Privacy Layer**: [iExec Nox Protocol](https://docs.iex.ec/nox-protocol/getting-started/welcome)
- **AI Infrastructure**: [ChainGPT Web3 LLM](https://chaingpt.org)
- **Blockchain**: Arbitrum Sepolia
- **Frontend**: React, Vite, TypeScript, Ethers.js
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin

## 📁 Project Structure

- `/contracts`: Hardhat project containing `GhostPay.sol` and the Nox integration.
- `/frontend`: Vite-powered React application with a premium Dark Mode UI.

## ⚙️ Installation & Usage

### 1. Smart Contracts
```bash
cd contracts
npm install
npx hardhat compile
```

### 2. Frontend
```bash
cd frontend
npm install
# Add your ChainGPT API Key to .env as VITE_CHAINGPT_API_KEY
npm run dev
```

## 📄 License
This project is licensed under the Apache-2.0 License.
