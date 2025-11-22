# NeetChat - Project Sync File

**Last Updated:** November 22, 2025  
**Project:** NeetChat - Sovereign Cross-Chain Chat  
**Repository:** https://github.com/felirami/neetchat  
**Status:** Active Development for ETHGlobal Hackathon

---

## 📋 Project Overview

NeetChat is a mobile-first XMTP-based group chat application with:
- **XMTP Messaging**: Decentralized messaging using XMTP protocol
- **WalletConnect Integration**: Primary wallet connector for mobile-first experience
- **Self Protocol**: Zero-knowledge identity verification
- **Pyth Network**: Real-time price feeds
- **DeFi Actions**: Tips, swaps, and clear signing
- **PostgreSQL Backend**: User profiles, contacts, groups, and file storage

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14.2.5 (App Router), React 18.3.1, TypeScript
- **Styling**: TailwindCSS
- **Wallet**: Wagmi v2.7.0, Viem v2.7.0
- **Messaging**: XMTP JS SDK v13.0.4
- **Database**: PostgreSQL 14 (local), Drizzle ORM
- **Deployment**: Local development setup

### Project Structure
```
neetchat/
├── app/
│   ├── layout.tsx          # Root layout with error suppression
│   ├── page.tsx             # Home page
│   ├── chat/
│   │   └── page.tsx         # Chat interface
│   ├── providers.tsx        # Wagmi & React Query providers
│   ├── error-boundary.tsx   # Error boundary component
│   └── api/                 # API routes
│       ├── profile/
│       ├── contacts/
│       ├── groups/
│       ├── files/
│       └── init-db/
├── components/
│   ├── WalletConnect.tsx    # Wallet connection UI
│   ├── XMTPStatus.tsx      # XMTP initialization status
│   ├── ChatList.tsx        # Conversation list
│   ├── MessageView.tsx     # Message display & input
│   ├── NavBar.tsx          # Responsive navigation
│   ├── MiniAppPanel.tsx    # DeFi actions panel
│   ├── SelfVerification.tsx # Identity verification
│   ├── PriceDisplay.tsx    # Pyth price feeds
│   ├── TipAction.tsx       # Tip payment component
│   ├── ClearSignPreview.tsx # Transaction preview
│   ├── ActionModal.tsx     # Modal wrapper
│   └── ENSInput.tsx        # ENS name input
├── hooks/
│   ├── useXMTP.ts          # XMTP client hook
│   └── useENS.ts           # ENS resolution hook
├── lib/
│   ├── db.ts               # PostgreSQL connection & schema
│   ├── ens.ts              # ENS utilities
│   └── xmtp.ts             # XMTP utilities
├── contracts/
│   ├── IdentityGate.sol    # Smart contract for room gating
│   └── Tips.sol            # Tip payment contract
└── scripts/
    └── init-db.ts          # Database initialization script
```

---

## ✅ Completed Features

### 1. Core Infrastructure
- [x] Next.js project scaffolded with TypeScript & TailwindCSS
- [x] Wagmi wallet connection setup (Base network)
- [x] WalletConnect integration (primary connector for mobile)
- [x] Responsive navigation bar with hamburger menu
- [x] Error boundary implementation
- [x] Browser extension error suppression

### 2. XMTP Messaging
- [x] XMTP client initialization hook (`useXMTP`)
- [x] Client caching to prevent re-initialization
- [x] User-triggered initialization (prevents repeated signatures)
- [x] Message streaming with proper cleanup
- [x] Conversation list display
- [x] Message view with avatars and timestamps
- [x] Duplicate message prevention
- [x] Error handling for message sending
- [x] ENS name resolution for conversations
- [x] `canMessage` check before starting conversations
- [x] Periodic conversation refresh (30s)

### 3. WalletConnect Integration
- [x] WalletConnect as primary connector
- [x] Mobile-first UI prioritization
- [x] QR code modal support
- [x] Project ID configuration
- [x] Works with all wagmi connectors (fallback support)

### 4. Database Backend
- [x] PostgreSQL local setup
- [x] Database schema (profiles, contacts, groups, files)
- [x] Drizzle ORM integration
- [x] API routes for CRUD operations
- [x] Database initialization script
- [x] Connection pooling configuration

### 5. UI/UX Improvements
- [x] Modern gradient design
- [x] Responsive mobile navigation
- [x] Loading states
- [x] Error messages
- [x] ENS name display
- [x] Message bubbles with avatars
- [x] Smooth scrolling

### 6. Bug Fixes
- [x] Fixed repeated wallet signing requests
- [x] Fixed SSR hydration mismatches
- [x] Fixed Chrome extension console errors
- [x] Fixed message stream cleanup (memory leaks)
- [x] Fixed WalletConnect provider access
- [x] Fixed XMTP initialization with WalletConnect
- [x] Fixed TypeScript null checks

---

## 🔧 Configuration Files

### `.env.local`
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neetchat
DB_USER=felirami
DB_PASSWORD=

# WalletConnect Project ID (Required for mobile wallet support)
# Get your free project ID at: https://cloud.reown.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=7154a31a007d2b483bb1fd66712a4e88
```

### Database Setup
- **PostgreSQL Version**: 14 (via Homebrew)
- **Database Name**: `neetchat`
- **User**: `felirami` (macOS user)
- **Tables**: `profiles`, `contacts`, `groups`, `files`

### WalletConnect Setup
- **Project ID**: Configured in `.env.local`
- **Provider**: Reown Cloud (formerly WalletConnect Cloud)
- **Setup Guide**: See `WALLETCONNECT_SETUP.md`

---

## 🐛 Known Issues & Solutions

### 1. XMTP V2 Deprecation Warning
- **Issue**: Console shows "XMTP V2 is no longer available"
- **Status**: Non-critical, app works with V3
- **Solution**: Using XMTP JS SDK v13.0.4 (latest)

### 2. Hardhat Config Error
- **Issue**: Build shows "Cannot find module 'hardhat/config'"
- **Status**: Non-critical, doesn't affect runtime
- **Solution**: Can be ignored or remove hardhat references

### 3. Package Version Mismatch
- **Issue**: `normalizeChainId` export error
- **Status**: Fixed by adding explicit `@wagmi/core` dependency
- **Solution**: Added `@wagmi/core@^2.7.0` to package.json

---

## 📝 Important Code Patterns

### XMTP Initialization (WalletConnect Compatible)
```typescript
// hooks/useXMTP.ts
const { data: walletClient } = useWalletClient();

// Create EIP-1193 provider adapter from WalletClient
const eip1193Provider = {
  request: async (args: { method: string; params?: any[] }) => {
    if (args.method === "eth_accounts" || args.method === "eth_requestAccounts") {
      return walletClient.account ? [walletClient.account.address] : [];
    }
    if (args.method === "eth_chainId") {
      return `0x${walletClient.chain.id.toString(16)}`;
    }
    return await walletClient.request(args as any);
  },
  on: () => {},
  removeListener: () => {},
};

const provider = new ethers.BrowserProvider(eip1193Provider as any);
const signer = await provider.getSigner();
const xmtpClient = await Client.create(signer, { env: "production" });
```

### Message Streaming with Cleanup
```typescript
useEffect(() => {
  if (!conversation) return;
  
  let streamController: AbortController | null = null;
  let isMounted = true;

  async function setupStream() {
    if (!conversation) return;
    streamController = new AbortController();
    const stream = await conversation.streamMessages();
    
    for await (const message of stream) {
      if (streamController.signal.aborted || !isMounted) break;
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    }
  }

  setupStream();
  return () => {
    isMounted = false;
    if (streamController) streamController.abort();
  };
}, [conversation]);
```

### WalletConnect Configuration
```typescript
// app/providers.tsx
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const config = createConfig({
  chains: [base],
  connectors: [
    ...(projectId ? [
      walletConnect({
        projectId,
        metadata: {
          name: "NeetChat",
          description: "Sovereign Cross-Chain Chat",
          url: typeof window !== "undefined" ? window.location.origin : "https://neetchat.xyz",
          icons: [],
        },
        showQrModal: true,
      }),
    ] : []),
    injected(),
    metaMask(),
  ],
  transports: { [base.id]: http() },
  ssr: true,
});
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/felirami/neetchat.git
cd neetchat

# Install dependencies
npm install

# Set up PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb neetchat

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings

# Initialize database
npm run db:init

# Start dev server
npm run dev
```

### Database Initialization
```bash
# Via script
npm run db:init

# Via API endpoint
curl -X POST http://localhost:3000/api/init-db
```

---

## 📚 Key Dependencies

```json
{
  "wagmi": "^2.7.0",
  "@wagmi/core": "^2.7.0",
  "@wagmi/connectors": "^2.0.0",
  "viem": "^2.7.0",
  "@xmtp/xmtp-js": "^13.0.4",
  "ethers": "^6.13.0",
  "@tanstack/react-query": "^5.51.0",
  "drizzle-orm": "^0.29.0",
  "drizzle-kit": "^0.20.0",
  "pg": "^8.11.3",
  "next": "^14.2.5",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

---

## 🔄 Recent Changes

### Latest Commits
1. **fix: improve XMTPStatus component with walletClient check**
   - Added walletClient availability check
   - Improved error messages

2. **fix: use wagmi walletClient for XMTP initialization (WalletConnect support)**
   - Replaced window.ethereum with useWalletClient
   - Created EIP-1193 provider adapter
   - Enables XMTP with WalletConnect

3. **fix: simplify WalletConnect connector filtering logic**
   - Removed unnecessary filtering
   - Connectors automatically filtered by wagmi

4. **fix: improve XMTP message streaming and error handling**
   - Fixed stream cleanup with AbortController
   - Added duplicate message prevention
   - Added error handling for sending

5. **feat: add WalletConnect as primary connector for mobile-first app**
   - Added WalletConnect connector
   - Prioritized for mobile-first UX
   - Added setup documentation

---

## 🎯 Next Steps / TODO

### High Priority
- [ ] Test XMTP initialization with WalletConnect on mobile
- [ ] Implement group chat creation
- [ ] Add message reactions
- [ ] Add read receipts
- [ ] Implement file attachments

### Medium Priority
- [ ] Full Self Protocol SDK integration
- [ ] Pyth Entropy randomness game
- [ ] XMTP Agent SDK integration (bot)
- [ ] Message pagination
- [ ] Search functionality

### Low Priority
- [ ] Push notifications setup
- [ ] Performance optimizations
- [ ] Additional content types
- [ ] Multi-chain support

---

## 📖 Documentation Files

- `WALLETCONNECT_SETUP.md` - WalletConnect configuration guide
- `DATABASE.md` - Database setup and schema documentation
- `SETUP.md` - Comprehensive setup guide
- `ARCHITECTURE.md` - Architecture overview
- `chatfi_project.md` - Original project idea
- `xmtp-chat-architecture.md` - XMTP architecture reference

---

## 🔍 Troubleshooting

### XMTP Not Initializing
- **Check**: Wallet is connected
- **Check**: WalletClient is available (`useWalletClient`)
- **Check**: Browser console for errors
- **Solution**: Click "Enable XMTP" button and approve signature

### Database Connection Issues
- **Check**: PostgreSQL is running (`brew services list`)
- **Check**: Database exists (`psql -l | grep neetchat`)
- **Check**: User permissions (`psql -d neetchat -c "SELECT current_user;"`)
- **Solution**: Update DB_USER in `.env.local` to your macOS username

### Build Errors
- **Check**: Node modules are installed (`npm install`)
- **Check**: Package versions match (`npm list wagmi @wagmi/core`)
- **Solution**: Clear cache and reinstall (`rm -rf node_modules package-lock.json && npm install`)

### WalletConnect Not Showing
- **Check**: Project ID is set in `.env.local`
- **Check**: Server is restarted after env changes
- **Solution**: Restart dev server after adding Project ID

---

## 📞 Important Notes

1. **Mobile-First**: App is designed for mobile wallets via WalletConnect
2. **XMTP Registration**: Users must enable XMTP by signing a message (one-time)
3. **Database**: Currently using local PostgreSQL, needs migration for production
4. **Environment**: Uses Base network (can be changed in `providers.tsx`)
5. **Error Suppression**: Browser extension errors are suppressed in `layout.tsx`

---

## 🎨 UI/UX Features

- **Responsive Design**: Mobile hamburger menu, desktop sidebar
- **Gradient Themes**: Blue-purple gradient throughout
- **Loading States**: Spinners and status indicators
- **Error Handling**: User-friendly error messages
- **ENS Support**: Shows ENS names instead of addresses when available
- **Real-time Updates**: Auto-refreshing conversations and messages

---

## 🔐 Security Considerations

- **Wallet Signatures**: Required for XMTP initialization (one-time)
- **Error Handling**: User rejections are handled gracefully
- **Client Caching**: Prevents repeated initialization requests
- **Stream Cleanup**: Prevents memory leaks
- **Input Validation**: ENS names and addresses validated

---

## 📊 Current Status

- ✅ **Core Messaging**: Working
- ✅ **Wallet Connection**: Working (WalletConnect + fallbacks)
- ✅ **XMTP Integration**: Working (with WalletConnect support)
- ✅ **Database**: Working (local PostgreSQL)
- ✅ **UI/UX**: Responsive and modern
- ⚠️ **Group Chats**: Not yet implemented
- ⚠️ **DeFi Actions**: UI ready, needs contract integration
- ⚠️ **Self Protocol**: Placeholder UI, needs SDK integration

---

## 🚨 Critical Fixes Applied

1. **WalletConnect Provider Access**: Fixed XMTP initialization to use wagmi's WalletClient instead of window.ethereum
2. **Message Streaming**: Fixed memory leaks with proper AbortController cleanup
3. **Duplicate Messages**: Added ID checking to prevent duplicates
4. **SSR Hydration**: Added suppressHydrationWarning and error filtering
5. **Package Versions**: Fixed wagmi/core version mismatch

---

**End of Sync File**

*This file should be updated whenever significant changes are made to keep all agents/devs in sync.*

