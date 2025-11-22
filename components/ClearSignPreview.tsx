"use client";

import { ReactNode } from "react";

export interface TransactionPreview {
  action: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  network: string;
  gasEstimate?: string;
  description: string;
}

interface ClearSignPreviewProps {
  preview: TransactionPreview;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClearSignPreview({
  preview,
  onConfirm,
  onCancel,
  isLoading = false,
}: ClearSignPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Transaction Preview</h3>
        <p className="text-sm text-blue-800">{preview.description}</p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Action:</span>
          <span className="font-medium">{preview.action}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">From:</span>
          <span className="font-mono text-sm">
            {preview.from.slice(0, 6)}...{preview.from.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">To:</span>
          <span className="font-mono text-sm">
            {preview.to.slice(0, 6)}...{preview.to.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">
            {preview.amount} {preview.token}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Network:</span>
          <span className="font-medium">{preview.network}</span>
        </div>
        {preview.gasEstimate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Estimated Gas:</span>
            <span className="font-medium">{preview.gasEstimate}</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200 flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Signing..." : "Sign Transaction"}
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Please review this transaction carefully before signing. This is what you will be signing on your Ledger device.
      </div>
    </div>
  );
}

// Helper function to create transaction previews
export function createTipPreview(
  from: string,
  to: string,
  amount: string,
  token: string = "USDC"
): TransactionPreview {
  return {
    action: "Send Tip",
    from,
    to,
    amount,
    token,
    network: "Base",
    description: `You are sending ${amount} ${token} as a tip to ${to.slice(0, 6)}...${to.slice(-4)}`,
  };
}

export function createSwapPreview(
  from: string,
  amountIn: string,
  tokenIn: string,
  amountOut: string,
  tokenOut: string
): TransactionPreview {
  return {
    action: "Token Swap",
    from,
    to: "Swap Contract",
    amount: `${amountIn} ${tokenIn} → ${amountOut} ${tokenOut}`,
    token: tokenOut,
    network: "Base",
    description: `You are swapping ${amountIn} ${tokenIn} for approximately ${amountOut} ${tokenOut}`,
  };
}

