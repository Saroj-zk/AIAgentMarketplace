# OpenAgent Marketplace: Technical Architecture Overview

This document provides an in-depth explanation of the "Web2.5 Hybrid" architecture used for the OpenAgent Marketplace, bridging traditional web performance with blockchain ownership.

---

## 1. Core Blockchain Standard: ERC-721
We utilize the **ERC-721 (NFT)** standard for the marketplace.
- **Why?** Each AI Agent is a unique digital asset with its own code, parameters, and history. 
- **The Link:** Every agent in the database is indexed by its **Token ID**. This ID is the "foreign key" that connects your Supabase database record to the blockchain entry.

---

## 2. The Hybrid Data Flow
The platform operates on two layers:

### Layer 1: Web2 (Supabase / Node.js)
- **Speed & Storage:** Handles large data like images, JSON configuration, and the agent's actual source code.
- **Filtering:** Powers the "Marketplace" search and category filters.
- **Ease of Access:** Provides the user interface (UI) and fast page loads.

### Layer 2: Web3 (Thirdweb / Blockchain)
- **Ownership:** Acts as the immutable source of truth for who owns which `tokenId`.
- **Payments:** Manages the secure transfer of ETH from buyer to seller.
- **Trust:** Ensures that the "Atomic Swap" (Money for Ownership) is guaranteed by code, not promises.

---

## 3. The Purchase "Bridge"
*Question: I paid in Web3 (ETH), how does the Web2 (Database) know to give me the code?*

### Step 1: The Transaction
The Buyer calls the `buyAgent(tokenId)` function on the Smart Contract via Thirdweb.

### Step 2: The On-Chain Event
Once the transaction is confirmed, the Smart Contract emits an **Event**:
`emit AgentPurchased(tokenId, buyerAddress, price);`

### Step 3: The Listener (The Bridge)
We implement a **Backend Listener** (Node.js) or a **Webhook**. This is a service that watches the blockchain logs. When it sees the `AgentPurchased` event for Token #101:
1. It validates the transaction hash.
2. It sends a secure request to the Supabase Database.
3. It updates the record: `UPDATE agents SET current_owner = '0xBuyerAddress' WHERE id = 101`.

### Step 4: The Unlock
The next time the buyer visits their Dashboard, the UI queries Supabase. Seeing that the `current_owner` matches the connected wallet, the UI reveals the **"Download Source Code"** button.

---

## 4. Security Concept: The "Wallet Wall"
To ensure only the buyer can download the agent code:
1. **Private Storage:** Files are stored in a private Supabase bucket.
2. **Signed URLs:** When the user clicks "Download," the backend verifies the ownership one last time and generates a temporary **Signed URL** (valid for 60 seconds).
3. **Download:** The user gains access to the code without the files ever being public on the internet.

---

## 5. Learning Checklist
To master this implementation, focus on these areas:

- [ ] **Solidity Events**: How to broadcast signals from the blockchain to the web.
- [ ] **Supabase Row Level Security (RLS)**: Restricting data access based on wallet address.
- [ ] **Thirdweb Webhooks**: Automating database updates after successful transactions.
- [ ] **Atomic Swaps**: The design pattern where money and assets change hands in a single step.

---

*This document serves as the technical blueprint for the OpenAgent development roadmap.*
