# GhostPay Protocol

> Confidential Bulk Payroll Infrastructure on Arbitrum Sepolia
> Built for the iExec Vibe Coding Challenge

GhostPay is a privacy-centric, institutional-grade payroll dApp powered by the
**iExec Nox** confidential computing layer and the **ERC-7984** confidential
token standard. Employers wrap a standard ERC-20, batch-distribute encrypted
salaries to employees, and reclaim plaintext tokens through the protocol's
two-step unwrap flow — all while keeping per-employee amounts hidden on the
public ledger.

## Problem statement

In standard on-chain payroll, every recipient address and payment amount sits
in plain view on Etherscan. That breaks corporate confidentiality, exposes
employee compensation, and is the single biggest blocker for institutional
adoption of decentralized payroll.

## The GhostPay solution

End-to-end encryption via iExec Nox: only the employer and the specific
employee can see individual amounts. Everything else — totals, batch sizes,
and the existence of payments — remains verifiable on-chain through events,
without ever leaking the underlying numbers.

## Core features

1. **Confidential dashboard** — high-density employer workspace with live
   protocol metrics and an integrated AI analyst.
2. **Event-driven indexing** — the frontend tails Arbitrum Sepolia for the
   contract's `PayrollDistributed` and `SalaryClaimRequested` events in real
   time. No centralized database.
3. **ChainGPT analyst** — an AI assistant with read access to the live event
   stream answers questions about payroll patterns and protocol activity.
4. **Two-step unwrap** — employees unwrap confidential balances back to the
   underlying ERC-20 via the canonical ERC-7984 wrapper flow.

## Technical architecture

### iExec Nox integration

`GhostPay.sol` inherits from `ERC20ToERC7984Wrapper` (from
`@iexec-nox/nox-confidential-contracts`). Encrypted inputs arrive on-chain as
`externalEuint256[]` accompanied by a single `inputProof` (an EIP-712
signature attesting to the encryption session). The contract converts each
external handle to an internal `euint256` via `Nox.fromExternal` before
performing a confidential transfer, so plaintext amounts are never seen
on-chain.

The frontend uses `@iexec-nox/handle` (the Nox JS SDK) to perform the
client-side encryption that produces those handles in the first place.

### Why two events?

- `PayrollDistributed(employer, employeeCount)` — fires once per batch. The
  count is public; per-employee splits are not.
- `SalaryClaimRequested(employee, unwrapRequestId)` — fires when an employee
  starts an unwrap. The actual decrypted amount only becomes known to the
  contract after `finalizeUnwrap`, at which point the canonical ERC-20
  `Transfer` event records the visible payout.

### ChainGPT integration

The frontend feeds a sanitised summary of recent on-chain events into the
ChainGPT `general_assistant` model to power the in-app analyst. See
`SECURITY` below — the ChainGPT key is currently embedded in the bundle and
should be moved to a backend proxy before any non-hackathon deployment.

### Frontend

- React 19 + Vite 8 + TypeScript
- Vanilla CSS (custom design system, no utility framework)
- Ethers.js v6 for chain interactions
- `@iexec-nox/handle` for confidential input encryption

## Repository layout

```
.
├── contracts/             # Hardhat project (Solidity 0.8.28)
│   ├── contracts/
│   │   ├── GhostPay.sol   # Confidential payroll wrapper
│   │   └── MockERC20.sol  # Test USDC with public faucet
│   ├── scripts/deploy.ts  # Deploys both contracts and writes deployments.json
│   └── test/GhostPay.ts   # Hardhat tests
└── frontend/              # Vite + React app
    └── src/
        ├── App.tsx
        ├── components/ChatAssistant.tsx
        ├── hooks/useGhostPay.ts
        └── services/chainGPT.ts
```

## Installation and configuration

### 1. Contracts

```bash
cd contracts
npm install
cp .env.example .env
# Fill in PRIVATE_KEY at minimum
npm run compile
npm run test
npm run deploy:arbitrum-sepolia
```

The deploy script writes `contracts/deployments.json` and prints the addresses
you need for the frontend `.env`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Paste the addresses printed by the deploy script
# and your ChainGPT API key
npm run dev
```

Open http://localhost:5173 and connect a wallet on Arbitrum Sepolia.

### 3. End-to-end demo

1. Use the **`MockERC20.faucet()`** call (or the in-app button if added) to
   mint test mUSDC to the employer wallet.
2. From the dashboard, **wrap** mUSDC into confidential cUSDC.
3. Paste a list of `address, amount` pairs and click **Execute Confidential
   Payout**. The frontend encrypts every amount via the Nox SDK before the
   transaction is sent.
4. Switch to an employee wallet, switch the view toggle to **Employee**, and
   click **Withdraw Funds** to start the two-step unwrap.

## Security

- The ChainGPT API key currently ships inside the Vite bundle
  (`VITE_CHAINGPT_API_KEY`). For production, proxy ChainGPT calls through
  your own backend so the key stays server-side.
- The MockERC20 has an unrestricted public `mint`. It's a hackathon faucet
  contract; do not reuse it for anything that holds value.
- The `GhostPay` contract uses OpenZeppelin's `Ownable` rather than
  `Ownable2Step`. For a real deployment, prefer `Ownable2Step` so a
  fat-fingered ownership transfer can't permanently lock the protocol.

## License

Apache-2.0 (see contract SPDX headers).

## Acknowledgements

- iExec — for the Nox protocol and Vibe Coding Challenge.
- ChainGPT — for the Web3 AI infrastructure powering the in-app analyst.
- OpenZeppelin — for the audited ERC-20 and access-control building blocks.
