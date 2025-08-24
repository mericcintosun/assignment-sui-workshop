"use client";

import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface TxButtonProps {
  onExecute: () => Transaction;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSuccess?: () => void;
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
        requestType: "WaitForLocalExecution", // wait for local execution to complete
        options: {
          // dApp Kit feedback için rawEffects önerilir
          showRawEffects: true,
          // bizim kontrolümüz için okunabilir effects'i de iste
          showEffects: true,
          showObjectChanges: true,
        },
      }),
  });

  const handleClick = async () => {
    if (disabled || isExecuting) return;

    // Check if wallet is connected
    if (!account) {
      alert("Please connect your Sui Wallet first");
      return;
    }

    setIsExecuting(true);
    try {
      console.log("Wallet connected:", account.address);
      console.log("Creating transaction...");
      const transaction = onExecute();
      console.log("Transaction created:", transaction);
      console.log("Transaction details:", {
        hasObject: !!transaction.object,
        hasPure: !!transaction.pure,
        hasMoveCall: !!transaction.moveCall,
        hasTransferObjects: !!transaction.transferObjects,
      });

      console.log("Signing and executing transaction with Sui Wallet...");

      try {
        // Preflight test to catch errors before sending to wallet
        console.log("Running preflight test...");
        const sim = await client.devInspectTransactionBlock({
          sender: account.address,
          transactionBlock: transaction,
        });
        console.log("Preflight result:", {
          status: sim.effects?.status,
          error: sim.error,
          events: sim.events,
        });

        if (sim.error) {
          throw new Error(`Preflight failed: ${sim.error}`);
        }

        const result = await signAndExecute({
          transaction,
          chain: "sui:testnet",
        });

        console.log("Transaction result:", result);
        console.log("Result type:", typeof result);
        console.log("Result keys:", result ? Object.keys(result) : "undefined");
        console.log("Transaction digest:", result?.digest);

        // 3) effects yoksa, digest üzerinden kesin sonucu bekle
        const final = result.effects
          ? result
          : await client.waitForTransaction({
              digest: result.digest,
              options: { showEffects: true },
            });

        const ok = final.effects?.status.status === "success";
        if (!ok) {
          const msg = final.effects?.status.error || "Unknown failure";
          throw new Error(`Transaction failed: ${msg}`);
        }

        console.log("Transaction successful, calling onSuccess callback");
        if (onSuccess) {
          onSuccess();
        }
      } catch (txError: any) {
        console.error("Transaction execution error:", txError);

        // Check if it's a user rejection
        if (
          txError.message?.includes("User rejected") ||
          txError.message?.includes("cancelled")
        ) {
          throw new Error("Transaction was cancelled by user");
        }

        // Check if it's a wallet connection issue
        if (
          txError.message?.includes("undefined") ||
          txError.message?.includes("not responded")
        ) {
          throw new Error(
            "Sui Wallet did not respond. Please check if the transaction was approved in your wallet."
          );
        }

        throw txError;
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      console.error("Error details:", {
        name: (error as any)?.name,
        message: (error as any)?.message,
        stack: (error as any)?.stack,
        cause: (error as any)?.cause,
      });

      // Show user-friendly error message
      let errorMessage =
        "Transaction failed. Please check your wallet and try again.";

      if (error instanceof Error) {
        if (
          error.message.includes("wallet") ||
          error.message.includes("sign")
        ) {
          errorMessage =
            "Wallet connection issue. Please ensure Sui Wallet is connected and try again.";
        } else if (
          error.message.includes("insufficient") ||
          error.message.includes("balance")
        ) {
          errorMessage =
            "Insufficient balance. Please ensure you have enough SUI for gas fees.";
        } else if (
          error.message.includes("user rejected") ||
          error.message.includes("cancelled")
        ) {
          errorMessage = "Transaction was cancelled by user.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("connection")
        ) {
          errorMessage =
            "Network connection issue. Please check your internet connection.";
        } else if (error.message.includes("undefined")) {
          errorMessage =
            "Wallet connection issue. Please refresh the page and reconnect your wallet.";
        } else {
          errorMessage = `Transaction failed: ${error.message}`;
        }
      }

      alert(errorMessage);
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
