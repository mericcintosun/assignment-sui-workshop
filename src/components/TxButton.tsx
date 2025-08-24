"use client";

import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import toast from "react-hot-toast";

type ExecResult = any;

interface TxButtonProps {
  onExecute: () => Transaction;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSuccess?: (res: ExecResult) => void; // <— sonucu geri ver
}

export function TxButton({
  onExecute,
  children,
  className = "",
  disabled = false,
  onSuccess,
}: TxButtonProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const account = useCurrentAccount();
  const client = useSuiClient();

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        requestType: "WaitForLocalExecution",
        options: {
          showRawEffects: true,
          showEffects: true, // <-- effects'i de iste
          showObjectChanges: true, // <-- objectChanges'i iste
        },
      }),
  });

  const handleClick = async () => {
    if (disabled || isExecuting) return;
    if (!account) {
      toast.error("Please connect your Sui Wallet first");
      return;
    }
    setIsExecuting(true);

    try {
      const tx = onExecute();

      // Preflight (simülasyon)
      const sim = await client.devInspectTransactionBlock({
        sender: account.address,
        transactionBlock: tx,
      });
      if (sim.error) throw new Error(`Preflight failed: ${sim.error}`);

      // İmzala + çalıştır
      const result = await signAndExecute({
        transaction: tx,
        chain: "sui:testnet",
      });

      // Kesin sonucu (effects ya da digest ile) al
      const final = result?.effects
        ? result
        : await client.waitForTransaction({
            digest: result.digest,
            options: { showEffects: true, showObjectChanges: true },
          });

      const ok = final.effects?.status.status === "success";
      if (!ok) {
        throw new Error(
          `Transaction failed: ${
            final.effects?.status.error ?? "Unknown failure"
          }`
        );
      }

      onSuccess?.(final); // <-- üst bileşene tam sonucu ver
    } catch (err: any) {
      toast.error(err?.message || "Transaction failed");
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isExecuting}
      className={`px-6 py-3 bg-[#4DA2FF] text-white rounded-xl hover:bg-[#4DA2FF]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isExecuting ? "Executing..." : children}
    </button>
  );
}
