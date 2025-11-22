import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeetChat - Sovereign Cross-Chain Chat",
  description: "XMTP-based group chat with DeFi actions, identity verification, and clear signing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

