# GhostPay: A-Z Protocol Documentation

## 1. Project Overview
GhostPay is a privacy-first, institutional-grade payroll infrastructure built for the **iExec Vibe Coding Challenge**. It solves the problem of "Public Salary Exposure" by leveraging **iExec Nox** confidential computing and **ChainGPT AI** to create a secure, encrypted bridge between corporate treasuries and global employees.

### The Problem
On public blockchains, every salary payment is visible to everyone. This exposes sensitive corporate data and compromises employee privacy.

### The Solution
GhostPay allows employers to wrap standard USDC into **Confidential cUSDC** (ERC-7984). Once wrapped, individual distribution amounts and recipient addresses are hidden from public explorers, visible only to the parties involved.

---

## 2. User Workflow (A-Z Guide)

### Phase 1: Employer Setup
1.  **Connect Wallet:** Use the "Launch App" button to connect your MetaMask or any EIP-6963 wallet.
2.  **Deposit & Wrap:** 
    - Enter the amount of public USDC you wish to make confidential.
    - Click **"Execute Deposit"**.
    - Your funds are now held in the Nox Confidential Vault, appearing as **cUSDC** in your dashboard.

### Phase 2: Contact Management
1.  Navigate to the **Confidential Contacts** tab (Users icon).
2.  Add your team members by name and wallet address. These are stored securely in your local vault.
3.  Use the **"Select"** buttons to build a batch for this month's payroll.
4.  Click **"Dispatch to Selected"** to instantly move to the payroll engine.

### Phase 3: Batch Dispatch
1.  On the **Batch Dispatch** tab, you will see your selected contacts.
2.  You can also paste a raw list in the format: `0xAddress, Amount`.
3.  Click **"Execute Confidential Payout"**.
4.  The transaction executes a bulk confidential transfer. On Arbiscan, observers only see a single "Batch" transaction; individual salaries remain private.

### Phase 4: Employee Claiming
1.  Toggle the UI to **"Employee"** view.
2.  Connect the employee wallet.
3.  The **Confidential Balance** will automatically detect any incoming payroll.
4.  Click **"Withdraw Funds"** to unwrap the cUSDC back into standard USDC in your wallet.

---

## 3. Technical Architecture

### The "Indestructible Mock" Layer
During the development for the Arbitrum Sepolia testnet, we encountered significant RPC instability and TEE simulation reverts. To ensure a 100% stable demo environment, we implemented a **High-Fidelity Mock Protocol**:
-   **Stability:** Bypasses external TEE library dependencies that cause "Internal JSON-RPC" errors on public nodes.
-   **Infinite Allowance:** The MockERC20 removes the "Approve" step, allowing for a seamless "One-Click Wrap" experience.
-   **Event Logic:** The mock contracts emit the exact same events as the production Nox library, ensuring the UI and AI indexing remain 100% accurate.

### AI Integration (ChainGPT)
GhostPay uses the **ChainGPT Web3-LLM** to power the **Transaction Audit AI**:
-   **Real-time Indexing:** The AI monitors protocol events (PayrollDistributed, SalaryClaimRequested).
-   **Natural Language Audit:** Employers can ask, "What was my total payroll volume this month?" or "Is the network healthy?"
-   **Privacy Preservation:** The AI only sees the "metadata" of the protocol, preserving the encryption of individual employee amounts.

---

## 4. Security Features
-   **Shadow Mode:** Toggle with one click to mask all sensitive balances and addresses. Perfect for CFOs presenting in public spaces.
-   **Identity Verification:** Accessing "Confidential Settings" requires a cryptographic signature to prove you are the authorized protocol administrator.
-   **Nox Vaults:** Funds are architecturally separated between the public Liquidity Layer and the Confidential Nox Layer.

---

## 5. Local Setup & Installation

### Prerequisites
- Node.js v18+
- MetaMask (Arbitrum Sepolia Network)

### Contract Deployment
```bash
cd contracts
npm install
# Configure .env with PRIVATE_KEY
npx hardhat run scripts/redeployAll.ts --network arbitrum-sepolia
```

### Frontend Launch
```bash
cd frontend
npm install
# The redeploy script automatically updates your frontend .env
npm run dev
```

---

## 6. Feedback & Future Roadmap
The integration of **iExec Nox** provides a clear path for institutional adoption. Future versions will:
- Transition from the Mock Layer to full on-chain TEE execution once RPC stability on Sepolia matures.
- Implement **Zk-Proofs** for employee tax compliance without revealing salary.
- Expand AI capabilities for automated payroll scheduling based on burn-rate analysis.

---
**Built with 💚 for the iExec Vibe Challenge.**
