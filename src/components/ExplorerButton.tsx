"use client";

import { useState } from "react";

interface ExplorerButtonProps {
  digest: string;
  network?: "testnet" | "devnet" | "mainnet";
  className?: string;
  children?: React.ReactNode;
}

export function ExplorerButton({
  digest,
  network = "testnet",
  className = "",
  children,
}: ExplorerButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const getExplorerUrl = () => {
    const baseUrl = "https://suiexplorer.com/txblock";
    return `${baseUrl}?network=${network}&digest=${digest}`;
  };

  const handleViewExplorer = () => {
    window.open(getExplorerUrl(), "_blank");
  };

  const handleCopyDigest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(digest);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy digest:", err);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={handleViewExplorer}
        className="px-4 py-2 bg-[#4DA2FF] text-white rounded-lg hover:bg-[#4DA2FF]/80 transition-colors flex items-center space-x-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
        <span>{children || "View Explorer"}</span>
      </button>

      <button
        onClick={handleCopyDigest}
        className="px-3 py-2 bg-[#011829] text-[#C0E6FF] rounded-lg hover:bg-[#011829]/80 transition-colors border border-white/10 flex items-center space-x-2"
        title="Copy transaction digest"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs">{isCopied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
}
