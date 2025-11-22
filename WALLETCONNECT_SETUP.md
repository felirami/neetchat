# WalletConnect Setup Guide

## Why WalletConnect?

NeetChat is a **mobile-first** app, and WalletConnect enables users to connect their mobile wallets (like MetaMask Mobile, Trust Wallet, Rainbow, etc.) by scanning a QR code.

## Get Your WalletConnect Project ID

1. Go to [Reown Cloud](https://cloud.reown.com/) (formerly WalletConnect Cloud)
2. Sign in or create a free account
3. Click "Create New Project"
4. Enter project details:
   - **Name:** NeetChat
   - **Homepage URL:** `https://neetchat.xyz` (or your domain)
   - **Allowed Domains:** Add your domains (localhost for dev)
5. Copy your **Project ID** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

## Configure in NeetChat

1. Open `.env.local` file
2. Replace `your_project_id_here` with your actual Project ID:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
3. Restart your dev server: `npm run dev`

## How It Works

- **Desktop:** Users see a QR code to scan with their mobile wallet
- **Mobile:** Users can connect directly with their mobile wallet app
- **Browser Extensions:** Still supported as fallback (MetaMask, Coinbase Wallet, etc.)

## Testing

1. Start the app: `npm run dev`
2. Click "Connect Wallet"
3. Select "WalletConnect" (should be first option)
4. Scan QR code with your mobile wallet app
5. Approve connection on your phone

## Troubleshooting

- **QR code not showing:** Make sure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly
- **Connection fails:** Check that your domain is added to allowed domains in Reown Cloud
- **For localhost:** Add `localhost` and `127.0.0.1` to allowed domains

