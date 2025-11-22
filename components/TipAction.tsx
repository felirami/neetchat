"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ActionModal } from "./ActionModal";
import { ClearSignPreview, createTipPreview } from "./ClearSignPreview";
import { usePythPrice, PYTH_PRICE_IDS } from "@/hooks/usePythPrice";

interface TipActionProps {
  recipientAddress?: string;
  onClose: () => void;
}

export function TipAction({ recipientAddress = "", onClose }: TipActionProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<"USDC" | "ETH">("USDC");
  const [showPreview, setShowPreview] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  
  const { priceData } = usePythPrice(
    token === "ETH" ? PYTH_PRICE_IDS.ETH : PYTH_PRICE_IDS.USDC,
    token
  );

  const usdValue = priceData
    ? (parseFloat(amount) * parseFloat(priceData.price)).toFixed(2)
    : "0.00";

  const handlePreview = () => {
    if (!address || !recipientAddress || !amount) return;
    setShowPreview(true);
  };

  const handleSign = async () => {
    if (!address || !recipientAddress) return;
    
    setIsSigning(true);
    try {
      // TODO: Implement actual transaction signing
      // This would use wagmi's useWriteContract or similar
      console.log("Signing tip transaction:", {
        from: address,
        to: recipientAddress,
        amount,
        token,
      });
      
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      alert("Tip sent successfully!");
      onClose();
    } catch (err) {
      console.error("Transaction error:", err);
      alert("Transaction failed");
    } finally {
      setIsSigning(false);
    }
  };

  const preview = address && recipientAddress && amount
    ? createTipPreview(address, recipientAddress, amount, token)
    : null;

  return (
    <ActionModal isOpen={true} onClose={onClose} title="Send Tip">
      {!showPreview ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Recipient</label>
            <input
              type="text"
              value={recipientAddress}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Token</label>
            <select
              value={token}
              onChange={(e) => setToken(e.target.value as "USDC" | "ETH")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
          {amount && priceData && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                ≈ ${usdValue} USD
              </div>
            </div>
          )}
          <button
            onClick={handlePreview}
            disabled={!amount || !recipientAddress}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Preview Transaction
          </button>
        </div>
      ) : preview ? (
        <ClearSignPreview
          preview={preview}
          onConfirm={handleSign}
          onCancel={() => setShowPreview(false)}
          isLoading={isSigning}
        />
      ) : null}
    </ActionModal>
  );
}

