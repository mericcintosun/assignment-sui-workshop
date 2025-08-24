"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/bcs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CONTRACTS } from "../../config/contracts";
import { useEnokiSponsor } from "../../lib/useEnokiSponsor";
import { ExplorerButton } from "../../components/ExplorerButton";
import toast from "react-hot-toast";

// Mock tip jar data (will be replaced with real blockchain data)
const MOCK_TIP_JAR = {
  owner: "0x1234567890abcdef",
  totalTips: 50000000, // 50 SUI in micros
  tipCount: 12,
  recentTips: [
    {
      id: "1",
      tipper: "0xabcd...efgh",
      amount: 5000000, // 5 SUI
      message: "Amazing work! Keep building! 🚀",
      timestamp: Date.now() - 3600000,
    },
    {
      id: "2",
      tipper: "0x9876...5432",
      amount: 3000000, // 3 SUI
      message: "Love this project! 💙",
      timestamp: Date.now() - 7200000,
    },
    {
      id: "3",
      tipper: "0xfedc...ba98",
      amount: 2000000, // 2 SUI
      message: "Great job on the UI! ✨",
      timestamp: Date.now() - 10800000,
    },
  ],
};

export default function TipJarPage() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const sponsorAndExecute = useEnokiSponsor();
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [totalTips, setTotalTips] = useState(MOCK_TIP_JAR.totalTips);
  const [tipCount, setTipCount] = useState(MOCK_TIP_JAR.tipCount);
  const [isSending, setIsSending] = useState(false);
  const [lastDigest, setLastDigest] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState<any[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState<string>("");
  const [isLoadingCoins, setIsLoadingCoins] = useState(false);

  // Fetch user's SUI coins
  useEffect(() => {
    if (account?.address) {
      fetchUserCoins();
    }
  }, [account?.address]);

  const fetchUserCoins = async () => {
    if (!account?.address) return;

    setIsLoadingCoins(true);
    try {
      const coins = await suiClient.getCoins({
        owner: account.address,
        coinType: "0x2::sui::SUI",
      });

      // Filter coins with sufficient balance (at least 0.1 SUI)
      const validCoins = coins.data.filter(
        (coin) => parseInt(coin.balance) >= 100000 // 0.1 SUI in micros
      );

      setUserCoins(validCoins);

      // Auto-select the first coin with highest balance
      if (validCoins.length > 0) {
        const highestBalanceCoin = validCoins.reduce((prev, current) =>
          parseInt(prev.balance) > parseInt(current.balance) ? prev : current
        );
        setSelectedCoinId(highestBalanceCoin.coinObjectId);
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
      toast.error("Failed to fetch your SUI coins");
    } finally {
      setIsLoadingCoins(false);
    }
  };

  const handleSendTip = async () => {
    // Validate inputs
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      toast.error("Please enter a valid tip amount");
      return;
    }

    if (!selectedCoinId) {
      toast.error("Please select a SUI coin to use for the tip");
      return;
    }

    const tipAmountMicros = parseFloat(tipAmount) * 1000000; // Convert to micros

    // Check if selected coin has sufficient balance
    const selectedCoin = userCoins.find(
      (coin) => coin.coinObjectId === selectedCoinId
    );
    if (!selectedCoin || parseInt(selectedCoin.balance) < tipAmountMicros) {
      toast.error("Selected coin doesn't have sufficient balance for this tip");
      return;
    }

    console.log("Sending tip:", {
      amount: tipAmount,
      message: tipMessage.trim() || "",
      coinId: selectedCoinId,
    });

    setIsSending(true);

    try {
      const tx = new Transaction();

      // Serialize the message using BCS
      const serializedMessage = bcs
        .vector(bcs.u8())
        .serialize(new TextEncoder().encode(tipMessage.trim() || ""));

      console.log("Serialized message:", serializedMessage.toHex());

      // Split coins from the selected user coin (NOT from gas)
      const [tipCoin] = tx.splitCoins(tx.object(selectedCoinId), [
        tipAmountMicros,
      ]);

      // Call the send_tip function from the deployed Move module
      tx.moveCall({
        target: `${CONTRACTS.TIP_JAR.PACKAGE_ID}::tipjar::send_tip`,
        arguments: [
          tx.object(CONTRACTS.TIP_JAR.TIP_JAR_OBJECT), // TipJar object
          tipCoin, // Payment coin
          tx.pure(serializedMessage.toBytes()), // message as vector<u8>
        ],
      });

      // Execute with Enoki sponsorship
      const digest = await sponsorAndExecute(tx, {
        network: "testnet",
        allowedMoveCallTargets: [
          `${CONTRACTS.TIP_JAR.PACKAGE_ID}::tipjar::send_tip`,
        ],
      });

      console.log("Tip sent successfully! Digest:", digest);

      // Store digest for explorer button
      setLastDigest(digest);

      // Update local state
      setTotalTips(totalTips + tipAmountMicros);
      setTipCount(tipCount + 1);

      // Refresh coins to get updated balances
      await fetchUserCoins();

      // Clear form
      setTipAmount("");
      setTipMessage("");

      // Show success message
      toast.success(
        `Tip of ${tipAmount} SUI sent successfully! Check the explorer button below to view your transaction.`
      );
    } catch (error: any) {
      console.error("Send tip error:", error);
      toast.error(error?.message || "Failed to send tip");
    } finally {
      setIsSending(false);
    }
  };

  const formatSUI = (micros: number) => {
    return (micros / 1000000).toFixed(2);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="bg-[#011829] rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-[#C0E6FF]">
            Please connect your wallet to send tips
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
              💰 Tip Jar
            </h1>

            <div className="space-y-6">
              {/* Tip Jar Status */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Tip Jar Status
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                    <p className="text-[#C0E6FF] text-sm">
                      Total Tips Received
                    </p>
                    <p className="text-white text-2xl font-bold">
                      {formatSUI(totalTips)} SUI
                    </p>
                  </div>

                  <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                    <p className="text-[#C0E6FF] text-sm">Number of Tips</p>
                    <p className="text-white text-2xl font-bold">{tipCount}</p>
                  </div>

                  <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                    <p className="text-[#C0E6FF] text-sm">Owner</p>
                    <p className="text-white text-sm font-mono break-all">
                      {MOCK_TIP_JAR.owner}
                    </p>
                  </div>
                </div>
              </div>

              {/* Send Tip */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Send a Tip
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                        Tip Amount (SUI)
                      </label>
                      <input
                        type="number"
                        value={tipAmount}
                        onChange={(e) => setTipAmount(e.target.value)}
                        placeholder="0.1"
                        min="0.001"
                        step="0.001"
                        className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                        Message (optional)
                      </label>
                      <input
                        type="text"
                        value={tipMessage}
                        onChange={(e) => setTipMessage(e.target.value)}
                        placeholder="Leave a nice message..."
                        maxLength={100}
                        className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Coin Selection */}
                  <div>
                    <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                      Select SUI Coin
                    </label>
                    {isLoadingCoins ? (
                      <div className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-[#C0E6FF]/50">
                        Loading your SUI coins...
                      </div>
                    ) : userCoins.length === 0 ? (
                      <div className="w-full px-4 py-3 bg-[#011829] border border-red-500/20 rounded-xl text-red-400">
                        No SUI coins found. You need at least 0.1 SUI to send a
                        tip.
                      </div>
                    ) : (
                      <select
                        value={selectedCoinId}
                        onChange={(e) => setSelectedCoinId(e.target.value)}
                        className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white focus:border-[#4DA2FF] focus:outline-none transition-colors"
                      >
                        {userCoins.map((coin) => (
                          <option
                            key={coin.coinObjectId}
                            value={coin.coinObjectId}
                          >
                            {formatSUI(parseInt(coin.balance))} SUI (ID:{" "}
                            {coin.coinObjectId.slice(0, 8)}...)
                          </option>
                        ))}
                      </select>
                    )}
                    {selectedCoinId && (
                      <p className="text-[#C0E6FF]/70 text-xs mt-1">
                        Selected coin balance:{" "}
                        {formatSUI(
                          parseInt(
                            userCoins.find(
                              (c) => c.coinObjectId === selectedCoinId
                            )?.balance || "0"
                          )
                        )}{" "}
                        SUI
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSendTip}
                      disabled={
                        !tipAmount ||
                        parseFloat(tipAmount) <= 0 ||
                        isSending ||
                        !selectedCoinId ||
                        userCoins.length === 0
                      }
                      className="flex-1 px-6 py-3 bg-[#4DA2FF] text-white rounded-xl hover:bg-[#4DA2FF]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSending
                        ? "Sending..."
                        : `Send ${
                            tipAmount ? `${tipAmount} SUI` : "Tip"
                          } (Gasless)`}
                    </button>
                  </div>

                  {/* Explorer Button */}
                  {lastDigest && (
                    <div className="mt-4 p-4 bg-[#4DA2FF]/10 border border-[#4DA2FF] rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">
                            ✅ Tip Sent Successfully!
                          </p>
                          <p className="text-[#C0E6FF] text-sm">
                            Tip sent with gasless sponsorship
                          </p>
                        </div>
                        <ExplorerButton
                          digest={lastDigest}
                          network="testnet"
                          className="ml-4"
                        >
                          View Tip Transaction
                        </ExplorerButton>
                      </div>
                    </div>
                  )}

                  <p className="text-[#C0E6FF]/70 text-sm">
                    {!tipAmount || parseFloat(tipAmount) <= 0
                      ? "Enter a tip amount to send"
                      : !selectedCoinId
                      ? "Select a SUI coin to use for the tip"
                      : `This will send ${tipAmount} SUI from your selected coin to the tip jar owner (gas fees sponsored by Enoki)`}
                  </p>
                </div>
              </div>

              {/* Recent Tips */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Recent Tips
                </h2>

                <div className="space-y-4">
                  {MOCK_TIP_JAR.recentTips.map((tip) => (
                    <div
                      key={tip.id}
                      className="bg-[#011829] rounded-lg p-4 border border-white/5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-[#4DA2FF] font-bold">
                              {formatSUI(tip.amount)} SUI
                            </span>
                            <span className="text-[#C0E6FF]/50 text-sm">
                              from {tip.tipper}
                            </span>
                          </div>
                          {tip.message && (
                            <p className="text-white text-sm mb-2">
                              "{tip.message}"
                            </p>
                          )}
                          <p className="text-[#C0E6FF]/50 text-xs">
                            {formatTime(tip.timestamp)}
                          </p>
                        </div>
                        <div className="text-[#4DA2FF] text-2xl ml-4">💝</div>
                      </div>
                    </div>
                  ))}
                </div>

                {MOCK_TIP_JAR.recentTips.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[#C0E6FF]/50">
                      No tips yet. Be the first to tip!
                    </p>
                  </div>
                )}
              </div>

              {/* Connected Account */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Connected Account
                </h2>
                <p className="text-[#C0E6FF] text-sm font-mono break-all">
                  {account.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
