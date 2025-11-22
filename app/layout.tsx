import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NavBar } from "@/components/NavBar";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress console errors from browser extensions
              const originalError = console.error;
              console.error = function(...args) {
                const message = args.join(' ');
                // Filter out Chrome extension errors
                if (message.includes('chrome.runtime.sendMessage') || 
                    message.includes('Extension ID') ||
                    message.includes('inpage.js')) {
                  return;
                }
                originalError.apply(console, args);
              };
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
