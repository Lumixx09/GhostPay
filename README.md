GHOSTPAY PROTOCOL
Confidential Bulk Payroll Infrastructure on Arbitrum Sepolia

GhostPay is a privacy-centric, institutional-grade payroll application developed for the iExec Vibe Coding Challenge. The protocol utilizes iExec Nox Confidential Computing to facilitate mass salary distributions with complete privacy and cryptographic security on the Arbitrum Sepolia network.

PROBLEM STATEMENT
In standard blockchain payroll implementations, recipient addresses and payment amounts are visible on public explorers. This lack of privacy exposes sensitive corporate financial data and personal income information, creating a significant barrier to institutional adoption of decentralized payroll systems.

THE GHOSTPAY SOLUTION
GhostPay addresses the privacy requirements of modern enterprises by implementing end to end encryption via the iExec Nox protocol. This ensures that only the employer and the specific employee are aware of the individual distribution amounts. The system maintains a live, event-driven ledger that remains synchronized with the blockchain while preserving user confidentiality.

CORE FEATURES

1. Professional Confidential Dashboard
The application provides a high-density financial workspace with live protocol metrics and an integrated analytical assistant.

2. Blockchain Event Indexing
GhostPay incorporates a serverless indexing engine that retrieves on-chain history in real time. This provides verifiable proof of payroll execution without reliance on a centralized database.

3. Artificial Intelligence Analyst
An integrated analysis engine powered by ChainGPT has read access to protocol history, providing data analysis and payroll optimization insights to the employer.

4. Secure Vault Infrastructure
The protocol is powered by iExec Nox, ensuring that salary data is processed through secure enclaves, making it invisible to third parties and the underlying network.

TECHNICAL ARCHITECTURE

The technical foundation of GhostPay is built upon a multi-layered stack designed for maximum privacy and performance. The system operates on the Arbitrum Sepolia Layer 2 network to ensure high throughput and minimal transaction costs.

iExec Nox Protocol Integration
The core privacy logic is implemented through the iExec Nox confidential computing layer. GhostPay utilizes the ERC-7984 standard, which extends traditional ERC-20 tokens with confidentiality features. The smart contract inherits from the ERC20ToERC7984Wrapper, allowing users to deposit standard assets and receive their confidential equivalents.

Payroll distributions are executed via the distributeConfidentialPayroll function. This function processes transfers using the euint256 data type, a specialized encrypted handle supported by the Nox protocol. This ensures that the specific amounts being transferred to employees are never decrypted on the public ledger. Instead, they are processed within Trusted Execution Environments (TEE), where the actual values are only visible to the authorized participants.

ChainGPT Artificial Intelligence Integration
The analytical layer of GhostPay is powered by ChainGPT, providing the employer with real-time insights into protocol volume and historical trends. The frontend application actively indexes the Arbitrum Sepolia network for specific protocol events, including PayrollDistributed and SalaryClaimed.

These events are processed and sanitized into a structured history. When a user interacts with the GhostAssistant, this live protocol data is fed into the ChainGPT large language model as context. This allows the AI to answer complex questions regarding total distribution volume, recipient counts, and historical payroll patterns without the need for a centralized database, maintaining the decentralized and private nature of the protocol.

Infrastructure and Styling
The frontend is developed using React 18 and Vite for optimal performance. The user interface utilizes a custom design system built with vanilla CSS to achieve a premium, institutional aesthetic without the overhead of external utility frameworks.

INSTALLATION AND CONFIGURATION

1. Clone the repository from the provided source.
2. Navigate to the frontend directory, install dependencies via npm, and launch the development server.
3. Navigate to the contracts directory, install dependencies, and compile the smart contracts using Hardhat.
4. Configure the environment variables in both directories, including the private keys, RPC endpoints, and the ChainGPT API key.

VISION
The GhostPay team believes that privacy is a fundamental requirement for the decentralized economy. Our objective is to establish GhostPay as the industry standard for confidential distributions in the workspace.

[User to add links here]
