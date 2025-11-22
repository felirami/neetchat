"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";

export function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/chat", label: "Chat", icon: "💬" },
  ];

  const canGoBack = pathname !== "/";

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NeetChat
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {canGoBack && (
              <button
                onClick={() => router.back()}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                ← Back
              </button>
            )}

            {isConnected && address && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-mono text-gray-700">
                  {address.slice(0, 4)}...{address.slice(-4)}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {canGoBack && (
              <button
                onClick={() => {
                  router.back();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">←</span>
                Go Back
              </button>
            )}

            {isConnected && address && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-500">Connected</p>
                    <p className="text-sm font-mono font-semibold text-gray-800">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

