# NeetChat - Sovereign Cross-Chain Chat

**NeetChat** is a sovereign, XMTP-based group chat where users can talk, verify identity, and safely trigger simple DeFi actions (tips, swaps, randomness mini-games) with clear signing and cross-chain support.

Built for **ETHGlobal Buenos Aires 2025** (21–23 November 2025).

## 🎯 One-liner

**NeetChat is a sovereign, XMTP-based group chat where users can talk, verify identity, and safely trigger simple DeFi actions (tips, swaps, randomness mini-games) with clear signing and cross-chain support.**

## 🚀 Features

### Core Features (MVP)

- ✅ **XMTP Group Chat** - Wallet-based login with Base/EVM support
- ✅ **Mini-app UI** - Action panel for DeFi operations
- 🔄 **Self Protocol Integration** - Identity verification with ZK proofs
- 🔄 **Pyth Price Feeds** - Real-time token prices
- 🔄 **Clear Signing UX** - Human-readable transaction previews
- 🔄 **Ledger Integration** - Hardware wallet support

### Stretch Features

- 🔄 **Tip/Payment Flow** - On-chain tips between users
- 🔄 **Pyth Entropy Game** - Randomness mini-games
- 🔄 **XMTP Agent Bot** - Helper bot with slash commands

## 🏗️ Architecture

### Frontend

- **Framework:** Next.js 14 with App Router
- **Libraries:**
  - XMTP JS SDK (`@xmtp/xmtp-js`)
  - wagmi / viem for wallet interactions
  - TailwindCSS for styling
  - TypeScript

### Backend / On-chain

- EVM contracts (Base network):
  - `IdentityGate` - Room gating with Self Protocol
  - `PythPriceConsumer` - Price feed consumer
  - `EntropyGame` - Randomness game (stretch)
  - `Tips` - Tip/payment contract (optional)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## 🎯 Prize Tracks

### Primary Targets

1. **XMTP**
   - Best Mini-app in a Group Chat
   - Best Use of the Agent SDK

2. **Self Protocol**
   - Best Self on-chain SDK Integration

### Secondary Targets

3. **Ledger** - Clear signing & hardware integration
4. **Pyth Network** - Most Innovative Use of Pyth Pull Price Feeds / Best Use of Pyth Entropy

## 📝 Development

### Project Structure

```
neetchat/
├── app/              # Next.js app router pages
├── components/       # React components
├── hooks/           # Custom React hooks
├── contracts/       # Smart contracts
└── public/          # Static assets
```

### Commit Strategy

Small, frequent commits following conventional commits:
- `chore:` - Project setup, config changes
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates

## 👤 Author

**Luis Felipe "felirami" Ramirez** (`@felirami`)

## 📄 License

MIT

