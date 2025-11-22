import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NavBar } from "@/components/NavBar";
import { ErrorBoundary } from "./error-boundary";

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
              const originalWarn = console.warn;
              
              console.error = function(...args) {
                const message = args.join(' ');
                // Filter out Chrome extension errors
                if (message.includes('chrome.runtime.sendMessage') || 
                    message.includes('Extension ID') ||
                    message.includes('inpage.js') ||
                    message.includes('chrome-extension://')) {
                  return;
                }
                originalError.apply(console, args);
              };
              
              // Suppress unhandled promise rejections from extensions
              window.addEventListener('unhandledrejection', function(event) {
                const message = event.reason?.message || event.reason?.toString() || '';
                if (message.includes('chrome.runtime.sendMessage') || 
                    message.includes('Extension ID') ||
                    message.includes('chrome-extension://')) {
                  event.preventDefault();
                  return;
                }
              });
              
              // Suppress errors from extensions
              window.addEventListener('error', function(event) {
                const message = event.message || '';
                if (message.includes('chrome.runtime.sendMessage') || 
                    message.includes('Extension ID') ||
                    message.includes('chrome-extension://')) {
                  event.preventDefault();
                  return;
                }
              });
            `,
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
