# ChatFi — Sovereign Cross-Chain Chat for ETHGlobal Buenos Aires 2025

- **Event:** ETHGlobal Buenos Aires 2025  
- **Dates:** 21–23 November 2025  
- **Hacker:** Luis Felipe “felirami” Ramirez (`@felirami`)  
- **Location:** Buenos Aires, Argentina  

## 1. One-liner

**ChatFi is a sovereign, XMTP-based group chat where users can talk, verify identity, and safely trigger simple DeFi actions (tips, swaps, randomness mini-games) with clear signing and cross-chain support.**

Focus: a **usable XMTP mini-app** for group chats, built in ~30 hours, with clean UX and realistic integrations.

---

## 2. Problem & Why Now

### Problem

- Web3 chats are fragmented: identity, DeFi and messaging live in separate apps.
- Users don’t trust transactions triggered from chat because signing is opaque.
- Most DeFi UX is complicated and not designed for “friends in a group chat” use cases (splitting bills, tipping, quick swaps, fun games).

### Why now

- XMTP mini-apps and Agent SDK make it possible to embed rich experiences **inside chat**.
- ETHGlobal Buenos Aires 2025 has several sponsors (XMTP, Self, Ledger, Pyth, etc.) that align naturally with a **secure, feature-rich chat app**.

---

## 3. Solution Overview

**ChatFi** is an XMTP-native group-chat mini-app with:

1. **XMTP group chat mini-app**
   - Wallet-based login (e.g. Base / EVM).
   - Group chat view using XMTP.
   - Mini-app UI surfaced inside the chat context (actions show up as messages / cards).

2. **Identity-aware rooms (Self Protocol)**
   - Use Self on-chain SDK for zero-knowledge proofs (age, country, uniqueness).
   - Gate special rooms (e.g. “Verified Humans Only”, “18+ DeFi Lounge”).
   - Show a simple badge for verified users.

3. **Safe actions with Ledger clear signing**
   - When a user triggers a DeFi action from chat (tip, simple swap), ChatFi:
     - Builds a **human-readable transaction description** (ERC-7730 style).
     - Uses Ledger tooling (Device Management Kit / clear sign descriptors) so the user sees exactly what they’re signing on their Ledger device.

4. **Light DeFi helpers (Pyth, optional swap)**
   - Pull real-time prices with **Pyth pull oracles** to show users what a swap/tip is worth in USD.
   - Optional stretch: integrate a very simple swap flow (via 1inch or Uniswap) exposed as a mini-card in chat (no crazy custom contracts).

5. **Fun randomness mini-game (Pyth Entropy, stretch)**
   - Use Pyth Entropy to generate random numbers.
   - Provide a simple “dice roll / lottery” mini-game for the group.
   - Results are posted back into chat.

---

## 4. Target Prize Tracks

### Primary (must hit)

1. **XMTP**
   - *Best Mini-app in a Group Chat*
   - *Best Use of the Agent SDK* (if we add an assistant bot: summariser, balance helper, reminder bot, etc.)
   - Core requirement: usable mini-app inside XMTP group chat.

2. **Self Protocol**
   - *Best Self on-chain SDK Integration*  
   - Use Self for ZK identity proofs (age / country / sybil resistance) and gate rooms.

### Secondary (nice if time allows)

3. **Ledger**
   - *Clear signing & hardware integration*  
   - Provide ERC-7730-style human-readable summaries for actions, integrate Ledger where possible.

4. **Pyth Network**
   - *Most Innovative Use of Pyth Pull Price Feeds*  
   - *Best Use of Pyth Entropy* (if we implement the mini-game and GitHub PR requirement).

5. **(Optional / Stretch)**  
   - A small, focused DeFi/swap integration (1inch / Uniswap) exposed through chat cards. Only if time really allows.

---

## 5. Scope for 30 Hours

### MVP (must-have)

1. **XMTP group chat + mini-app shell**
   - Wallet connect (EVM, ideally Base).
   - List of conversations and messages.
   - Mini-app panel/button that triggers ChatFi actions.
   - Basic Agent bot (e.g. simple slash commands or helper messages).

2. **Self Protocol integration**
   - User can connect Self, generate a proof (e.g. “adult” or “unique human”).
   - Contract or simple on-chain verification logic that checks Self proof.
   - Chat room gating: only verified users can access / unlock certain ChatFi actions or rooms.

3. **Price display via Pyth pull oracles**
   - Fetch price from Hermes → push on-chain → consume price on-chain.
   - Show current token / pair price in the UI as part of swap / tip helper.

4. **Clear signing UX**
   - Define a small set of actions (e.g. “tip friend 1 USDC”, “swap 10 USDC to token X”).
   - For each action, build a human-readable transaction preview in the UI.
   - Map this to Ledger’s clear signing / descriptor structure as much as is realistically possible in time.

### Stretch Features

5. **Simple tip / payment flow**
   - On-chain function for sending tips between users in the chat.
   - Triggered via mini-app UI, logged as a message (e.g. “felirami tipped 1 USDC to 0x123…”).

6. **Randomness mini-game (Pyth Entropy)**
   - Consume Pyth Entropy random numbers in a contract.
   - Expose a “Roll” action in the mini-app.
   - Post result to chat, optionally distribute tiny rewards.

7. **Agent enhancements**
   - Agent summarises last 50 messages.
   - Agent fetches price on demand using Pyth and posts back.

---

## 6. High-Level Architecture

### Frontend

- **Framework:** Next.js or Vite + React
- **Libraries:**
  - XMTP JS SDK
  - wagmi / viem / ethers
  - TailwindCSS + shadcn/ui

### Backend / On-chain

- Minimal backend
- EVM contracts:
  - IdentityGate
  - PythPriceConsumer
  - EntropyGame (stretch)
  - Tips (optional)

---

## 7. GitHub Workflow

- Public repo
- Small, frequent commits:
  - chore: scaffold app
  - feat: xmtp connect
  - feat: self protocol verification
  - feat: pyth price feed integration
  - feat: ledger clear sign ui
  - docs: add architecture

---

## 8. Milestones (30 Hours)

### 0–6h: XMTP foundation
### 6–12h: Mini-app shell + agent
### 12–18h: Self Protocol integration
### 18–24h: Pyth + clear signing UX
### 24–30h: Polish + stretch features

---

## 9. Task Backlog (for Cursor Agents)

1. Scaffold project  
2. Wallet connect  
3. XMTP integration  
4. Message UI  
5. Mini-app UI  
6. XMTP Agent  
7. Self Protocol  
8. IdentityGate contract  
9. Pyth pull oracle  
10. Clear signing UI  
11. Tip flow (optional)  
12. Entropy game  
13. Polish  
14. Docs

---

## 10. Success Criteria

- Working XMTP mini-app  
- Self identity gating  
- Pyth price integration  
- Clear signing previews  
- Public GitHub with frequent commits  
- Strong demo  
