"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Filter out browser extension errors
    if (
      error.message?.includes("chrome.runtime.sendMessage") ||
      error.message?.includes("Extension ID") ||
      error.stack?.includes("chrome-extension://")
    ) {
      return { hasError: false }; // Don't show error for extension issues
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Filter out browser extension errors
    if (
      error.message?.includes("chrome.runtime.sendMessage") ||
      error.message?.includes("Extension ID") ||
      error.stack?.includes("chrome-extension://")
    ) {
      console.warn("Browser extension error suppressed:", error.message);
      return; // Don't log extension errors
    }
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

