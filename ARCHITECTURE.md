# NeetChat Architecture

## Overview

NeetChat is a Next.js-based application that integrates XMTP messaging with DeFi actions, identity verification, and price feeds.

## Project Structure

```
neetchat/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── chat/               # Chat page route
│   │   └── page.tsx        # Main chat interface
│   ├── providers.tsx       # Wagmi & React Query providers
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── WalletConnect.tsx   # Wallet connection UI
│   ├── ChatList.tsx        # Conversation list
│   ├── MessageView.tsx     # Message display & input
│   ├── MiniAppPanel.tsx    # Action panel
│   ├── ActionModal.tsx     # Modal wrapper
│   ├── SelfVerification.tsx # Identity verification UI
│   ├── PriceDisplay.tsx    # Pyth price display
│   ├── ClearSignPreview.tsx # Transaction preview
│   └── TipAction.tsx       # Tip sending UI
├── hooks/                  # Custom React hooks
│   ├── useXMTP.ts          # XMTP client hook
│   ├── useSelfProtocol.ts  # Self Protocol integration
│   └── usePythPrice.ts     # Pyth price feed hook
├── contracts/              # Smart contracts
│   ├── IdentityGate.sol    # Room gating contract
│   ├── Tips.sol            # Tip/payment contract
│   ├── hardhat.config.ts   # Hardhat configuration
│   └── package.json        # Contract dependencies
└── README.md               # Project documentation

```

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **wagmi** - Ethereum wallet interactions
- **viem** - Ethereum utilities
- **@xmtp/xmtp-js** - XMTP messaging SDK
- **ethers.js** - Ethereum library

### Smart Contracts
- **Solidity 0.8.20** - Smart contract language
- **Hardhat** - Development environment

## Key Features

### 1. XMTP Messaging
- Wallet-based authentication
- Conversation list and message view
- Real-time message streaming

### 2. Identity Verification (Self Protocol)
- ZK proof generation (placeholder)
- User verification status
- Room gating support

### 3. Price Feeds (Pyth Network)
- Pull oracle integration
- Real-time token prices
- Multiple token support (ETH, BTC, USDC, USDT)

### 4. Clear Signing
- Human-readable transaction previews
- ERC-7730 style descriptions
- Ledger-ready format

### 5. DeFi Actions
- Tip sending (ETH & ERC20)
- Price checking
- Transaction previews

## Data Flow

1. **Wallet Connection**: User connects wallet via wagmi
2. **XMTP Initialization**: XMTP client created with wallet signer
3. **Messaging**: Messages sent/received via XMTP SDK
4. **DeFi Actions**: Actions trigger transaction previews → user signs → on-chain execution
5. **Identity**: Self Protocol proofs verified → stored on-chain → used for gating

## Smart Contracts

### IdentityGate
- Stores user verification status
- Manages room access requirements
- Checks proof types for room access

### Tips
- Handles ETH and ERC20 token tips
- Emits events for tip tracking
- Simple transfer logic

## Integration Points

- **XMTP**: Production network, wallet signer
- **Pyth**: Hermes API for price feeds
- **Self Protocol**: SDK integration (placeholder)
- **Base Network**: Primary deployment target

## Future Enhancements

- XMTP Agent SDK integration
- Pyth Entropy randomness games
- Swap integration (1inch/Uniswap)
- Group chat support
- Message encryption
- On-chain verification of Self proofs

