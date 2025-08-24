"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Droplets,
  Coins,
  CheckCircle,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { CONTRACTS } from "../../config/contracts";
import { useEnokiSponsor } from "../../lib/useEnokiSponsor";
import { ExplorerButton } from "../../components/ExplorerButton";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

export default function FaucetPage() {
  const account = useCurrentAccount();
  const sponsorAndExecute = useEnokiSponsor();
  const [hasClaimed, setHasClaimed] = useState(false);
  const [faucetBalance, setFaucetBalance] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [claimAmount, setClaimAmount] = useState(10000000); // 10 SUI in micros
  const [isClaiming, setIsClaiming] = useState(false);
  const [lastDigest, setLastDigest] = useState<string | null>(null);

  const handleClaimTokens = async () => {
    // Validate that user hasn't claimed before
    if (hasClaimed) {
      toast.error("You have already claimed tokens from this faucet");
      return;
    }

    setIsClaiming(true);

    try {
      const tx = new Transaction();

      // Call the claim_tokens function from the deployed Move module
      tx.moveCall({
        target: `${CONTRACTS.FAUCET.PACKAGE_ID}::faucet::claim_tokens`,
        arguments: [
          tx.object(CONTRACTS.FAUCET.FAUCET_OBJECT), // Faucet object
        ],
      });

      // Execute with Enoki sponsorship (devnet for faucet)
      const digest = await sponsorAndExecute(tx, {
        network: "devnet",
        chain: "sui:devnet",
        allowedMoveCallTargets: [
          `${CONTRACTS.FAUCET.PACKAGE_ID}::faucet::claim_tokens`,
        ],
      });

      console.log("Tokens claimed successfully! Digest:", digest);

      // Store digest for explorer button
      setLastDigest(digest);

      // Update local state
      setHasClaimed(true);
      setFaucetBalance(faucetBalance - claimAmount);
      setTotalClaims(totalClaims + 1);

      // Show success message
      toast.success(
        "Tokens claimed successfully! Check your wallet for the 10 SUI tokens. Check the explorer button below to view your transaction."
      );
    } catch (error: unknown) {
      console.error("Claim error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to claim tokens";
      toast.error(errorMessage);
    } finally {
      setIsClaiming(false);
    }
  };

  const formatSUI = (micros: number) => {
    return (micros / 1000000).toFixed(2);
  };

  // TODO: Add real-time data fetching from blockchain
  // This would involve querying the faucet object for current balance and claims
  // For now, using mock data but with real transaction functionality

  if (!account) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card p-8 text-center">
          <p className="text-muted-foreground">
            Please connect your wallet to claim tokens
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="card p-6">
            <h1 className="text-2xl font-semibold text-foreground mb-6 flex items-center space-x-2">
              <Droplets className="w-6 h-6 text-primary" />
              <span>SUI Token Faucet</span>
            </h1>

            <div className="space-y-6">
              {/* Faucet Status */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Faucet Status
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card p-4">
                    <p className="text-muted-foreground text-sm">
                      Available Balance
                    </p>
                    <p className="text-foreground text-2xl font-bold">
                      {formatSUI(faucetBalance)} SUI
                    </p>
                  </div>

                  <div className="card p-4">
                    <p className="text-muted-foreground text-sm">
                      Claim Amount
                    </p>
                    <p className="text-foreground text-2xl font-bold">
                      {formatSUI(claimAmount)} SUI
                    </p>
                  </div>

                  <div className="card p-4">
                    <p className="text-muted-foreground text-sm">
                      Total Claims
                    </p>
                    <p className="text-foreground text-2xl font-bold">
                      {totalClaims}
                    </p>
                  </div>
                </div>
              </div>

              {/* Claim Tokens */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Claim Your Tokens
                </h2>

                <div className="space-y-4">
                  {hasClaimed ? (
                    <div className="bg-primary/10 border border-primary rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-primary" />
                        <div>
                          <p className="text-foreground font-medium">
                            Tokens Claimed!
                          </p>
                          <p className="text-muted-foreground text-sm">
                            You've successfully claimed {formatSUI(claimAmount)}{" "}
                            SUI tokens.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="card p-4">
                        <div className="flex items-center space-x-3">
                          <Coins className="w-6 h-6 text-primary" />
                          <div>
                            <p className="text-foreground font-medium">
                              Ready to Claim
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Get {formatSUI(claimAmount)} SUI tokens for
                              testing
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleClaimTokens}
                          disabled={faucetBalance < claimAmount || isClaiming}
                          className="btn-primary flex-1"
                        >
                          {isClaiming
                            ? "Claiming..."
                            : `Claim ${formatSUI(claimAmount)} SUI (Gasless)`}
                        </button>
                      </div>

                      {/* Explorer Button */}
                      {lastDigest && (
                        <div className="mt-4 p-4 bg-primary/10 border border-primary rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-foreground font-medium">
                                <CheckCircle className="w-5 h-5 inline mr-2 text-primary" />
                                Tokens Claimed Successfully!
                              </p>
                              <p className="text-muted-foreground text-sm">
                                10 SUI claimed with gasless sponsorship
                              </p>
                            </div>
                            <ExplorerButton
                              digest={lastDigest}
                              network="devnet"
                              className="ml-4"
                            >
                              View Claim Transaction
                            </ExplorerButton>
                          </div>
                        </div>
                      )}

                      <p className="text-muted-foreground text-sm">
                        {faucetBalance < claimAmount
                          ? "Faucet is empty. Please wait for refill."
                          : "This will send 10 SUI tokens to your wallet for testing purposes (gas fees sponsored by Enoki)"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Notes */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span>Important Notes</span>
                </h2>

                <div className="space-y-3 text-muted-foreground text-sm">
                  <div className="flex items-start space-x-3">
                    <span className="text-primary">•</span>
                    <p>This faucet is for testing purposes only</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-primary">•</span>
                    <p>Each wallet can only claim once</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-primary">•</span>
                    <p>Tokens are sent to your connected wallet address</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-primary">•</span>
                    <p>
                      Use these tokens for testing transactions and interactions
                    </p>
                  </div>
                </div>
              </div>

              {/* Connected Account */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Connected Account
                </h2>
                <p className="text-muted-foreground text-sm font-mono break-all">
                  {account.address}
                </p>
                {hasClaimed && (
                  <p className="text-primary text-sm mt-2 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>This address has already claimed tokens</span>
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
