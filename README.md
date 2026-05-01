GhostPay: Confidential Institutional Payroll

Built for the iExec Vibe Coding Challenge
Confidential Bulk Payouts powered by iExec Nox and ChainGPT AI

Submission Video
[Submission Video (YouTube)](https://youtu.be/hVdVOANnKoM)

Live Demo / Repository
- GitHub: [Link to Repository]
- Network: Arbitrum Sepolia
- Protocol Layer: iExec Nox (Confidential Computing)
- AI Partner: ChainGPT

Overview

GhostPay is a privacy-first, institutional-grade payroll infrastructure designed to solve the public salary problem in Web3. While blockchain offers transparency, it lacks the financial privacy required for professional payroll. GhostPay leverages iExec Nox and the ERC-7984 (Confidential Token) standard to allow employers to distribute salaries in bulk while keeping recipient addresses and amounts completely hidden from the public ledger.

To enhance the institutional experience, GhostPay integrates a ChainGPT AI Assistant that provides real-time protocol insights and payroll optimization without ever compromising the underlying encrypted data.

The Problem: Public Payouts
In standard Web3 payroll (e.g., streaming or multisig transfers), every employee's salary and wallet address are visible on public explorers like Etherscan. This:
1. Exposes sensitive corporate financial data.
2. Compromises employee personal security and income privacy.
3. Blocks institutional adoption of decentralized payroll systems.

The GhostPay Solution

1. iExec Nox Protocol Integration
GhostPay utilizes the Nox Confidential Computing layer to process payments. 
- Confidential Tokens (ERC-7984): Standard assets (USDC) are wrapped into confidential equivalents (cUSDC).
- Encrypted Transfers: Payouts are executed via the distributeConfidentialPayroll function using encrypted data types (euint256).
- TEE Security: The actual decryption and distribution logic occur within Trusted Execution Environments (TEEs), ensuring no one, not even the validators or GhostPay developers, can see the plaintext values.

2. ChainGPT AI Analytics
We've integrated ChainGPT to act as a Confidential CFO. 
- Privacy-Preserving Insights: The AI indexes protocol events (sanitized of sensitive data) to provide employers with high-level analytics on volume, burn rates, and historical trends.
- Natural Language Interface: Employers can query their payroll health using the GhostPay Chat Assistant.

3. Professional Institutional UI
A vibe-coded dashboard built for speed and aesthetics:
- Shadow Mode: Instant UI masking for screen sharing or public demonstrations.
- Bulk Dispatch: CSV-style input for rapid, confidential global distributions.
- Cryptographic Identity: Secure Settings module accessible only after verifying on-chain identity.

Technical Architecture

Core Stack
- Frontend: Vite, React 18, TypeScript, Phosphor Icons.
- Smart Contracts: Solidity (0.8.24+), Hardhat.
- Confidentiality: iExec Nox SDK, ERC-7984 Wrapper.
- AI Engine: ChainGPT Web3-LLM API.
- Network: Arbitrum Sepolia.

Repository Structure
- /contracts: Solidity source code, Hardhat configuration, and deployment scripts.
- /frontend: The GhostPay professional dashboard (Vite/React).
- feedback.md: Our technical feedback on the iExec developer experience.

Installation and Setup

Prerequisites
- Node.js (v18+)
- Metamask (configured for Arbitrum Sepolia)
- ChainGPT API Key

1. Smart Contracts
cd contracts
npm install
Configure .env with PRIVATE_KEY and ARBITRUM_SEPOLIA_RPC
npx hardhat compile
npx hardhat run scripts/deploy.ts --network arbitrumSepolia

2. Frontend
cd frontend
npm install
Configure .env with VITE_GHOST_PAY_ADDRESS and VITE_CHAINGPT_API_KEY
npm run dev

Feedback
We've documented our journey building with iExec Nox in feedback.md. We highlight the strengths of the ERC-7984 standard and provide suggestions for local TEE simulation tools.

License
GhostPay is open-source software licensed under the MIT License.

