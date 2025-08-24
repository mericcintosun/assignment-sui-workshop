"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TxButton } from "../../components/TxButton";
import { CONTRACTS } from "../../config/contracts";

export default function FaucetPage() {
  const account = useCurrentAccount();
  const [hasClaimed, setHasClaimed] = useState(false);
  const [faucetBalance, setFaucetBalance] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [claimAmount, setClaimAmount] = useState(10000000); // 10 SUI in micros

  const createClaimTransaction = () => {
    // Validate that user hasn't claimed before
    if (hasClaimed) {
      throw new Error("You have already claimed tokens from this faucet");
    }

    const tx = new Transaction();

    // Call the claim_tokens function from the deployed Move module
    tx.moveCall({
      target: `${CONTRACTS.FAUCET.PACKAGE_ID}::faucet::claim_tokens`,
      arguments: [
        tx.object(CONTRACTS.FAUCET.FAUCET_OBJECT), // Faucet object
      ],
    });

    return tx;
  };

  const handleClaimSuccess = () => {
    // Update local state
    setHasClaimed(true);
    setFaucetBalance(faucetBalance - claimAmount);
    setTotalClaims(totalClaims + 1);

    // Show success message
    alert(
      "Tokens claimed successfully! Check your wallet for the 10 SUI tokens."
    );
  };

  const formatSUI = (micros: number) => {
    return (micros / 1000000).toFixed(2);
  };

  // TODO: Add real-time data fetching from blockchain
  // This would involve querying the faucet object for current balance and claims
  // For now, using mock data but with real transaction functionality

  if (!account) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="bg-[#011829] rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-[#C0E6FF]">
            Please connect your wallet to claim tokens
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030F1C]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#011829]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
            <h1 className="text-2xl font-semibold text-white mb-6">
              🚰 SUI Token Faucet
            </h1>

            <div className="space-y-6">
              {/* Faucet Status */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Faucet Status
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                    <p className="text-[#C0E6FF] text-sm">Available Balance</p>
                    <p className="text-white text-2xl font-bold">
                      {formatSUI(faucetBalance)} SUI
                    </p>
                  </div>

                  <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                    <p className="text-[#C0E6FF] text-sm">Claim Amount</p>
                    <p className="text-white text-2xl font-bold">
                      {formatSUI(claimAmount)} SUI
                    </p>
                  </div>

                  <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                    <p className="text-[#C0E6FF] text-sm">Total Claims</p>
                    <p className="text-white text-2xl font-bold">
                      {totalClaims}
                    </p>
                  </div>
                </div>
              </div>

              {/* Claim Tokens */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Claim Your Tokens
                </h2>

                <div className="space-y-4">
                  {hasClaimed ? (
                    <div className="bg-[#4DA2FF]/10 border border-[#4DA2FF] rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-[#4DA2FF] text-2xl">✅</div>
                        <div>
                          <p className="text-white font-medium">
                            Tokens Claimed!
                          </p>
                          <p className="text-[#C0E6FF] text-sm">
                            You've successfully claimed {formatSUI(claimAmount)}{" "}
                            SUI tokens.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="text-[#4DA2FF] text-2xl">💰</div>
                          <div>
                            <p className="text-white font-medium">
                              Ready to Claim
                            </p>
                            <p className="text-[#C0E6FF] text-sm">
                              Get {formatSUI(claimAmount)} SUI tokens for
                              testing
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <TxButton
                          onExecute={createClaimTransaction}
                          onSuccess={handleClaimSuccess}
                          disabled={faucetBalance < claimAmount}
                          className="flex-1"
                        >
                          Claim {formatSUI(claimAmount)} SUI
                        </TxButton>
                      </div>

                      <p className="text-[#C0E6FF]/70 text-sm">
                        {faucetBalance < claimAmount
                          ? "Faucet is empty. Please wait for refill."
                          : "This will send 10 SUI tokens to your wallet for testing purposes"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  ⚠️ Important Notes
                </h2>

                <div className="space-y-3 text-[#C0E6FF] text-sm">
                  <div className="flex items-start space-x-3">
                    <span className="text-[#4DA2FF]">•</span>
                    <p>This faucet is for testing purposes only</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-[#4DA2FF]">•</span>
                    <p>Each wallet can only claim once</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-[#4DA2FF]">•</span>
                    <p>Tokens are sent to your connected wallet address</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-[#4DA2FF]">•</span>
                    <p>
                      Use these tokens for testing transactions and interactions
                    </p>
                  </div>
                </div>
              </div>

              {/* Connected Account */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Connected Account
                </h2>
                <p className="text-[#C0E6FF] text-sm font-mono break-all">
                  {account.address}
                </p>
                {hasClaimed && (
                  <p className="text-[#4DA2FF] text-sm mt-2">
                    ✅ This address has already claimed tokens
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
