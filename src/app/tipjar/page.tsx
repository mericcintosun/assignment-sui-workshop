"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/bcs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TxButton } from "../../components/TxButton";
import { CONTRACTS } from "../../config/contracts";

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
  const [tipAmount, setTipAmount] = useState("");
  const [tipMessage, setTipMessage] = useState("");
  const [totalTips, setTotalTips] = useState(MOCK_TIP_JAR.totalTips);
  const [tipCount, setTipCount] = useState(MOCK_TIP_JAR.tipCount);

  const createTipTransaction = () => {
    // Validate inputs
    if (!tipAmount || parseFloat(tipAmount) <= 0) {
      throw new Error("Please enter a valid tip amount");
    }

    const tipAmountMicros = parseFloat(tipAmount) * 1000000; // Convert to micros

    console.log("Sending tip:", {
      amount: tipAmount,
      message: tipMessage.trim() || "",
    });

    const tx = new Transaction();

    // Serialize the message using BCS
    const serializedMessage = bcs
      .vector(bcs.u8())
      .serialize(new TextEncoder().encode(tipMessage.trim() || ""));

    console.log("Serialized message:", serializedMessage.toHex());

    // Split coins from gas for the tip
    const [tipCoin] = tx.splitCoins(tx.gas, [tipAmountMicros]);

    // Call the send_tip function from the deployed Move module
    tx.moveCall({
      target: `${CONTRACTS.TIP_JAR.PACKAGE_ID}::tipjar::send_tip`,
      arguments: [
        tx.object(CONTRACTS.TIP_JAR.TIP_JAR_OBJECT), // TipJar object
        tipCoin, // Payment coin
        tx.pure(serializedMessage.toBytes()), // message as vector<u8>
      ],
    });

    return tx;
  };

  const handleTipSuccess = () => {
    // Update local state
    const amount = parseFloat(tipAmount) * 1000000; // Convert to micros
    setTotalTips(totalTips + amount);
    setTipCount(tipCount + 1);

    // Add to recent tips
    const newTip = {
      id: Date.now().toString(),
      tipper: `${account?.address.slice(0, 6)}...${account?.address.slice(-4)}`,
      amount,
      message: tipMessage.trim() || "",
      timestamp: Date.now(),
    };

    // Clear form
    setTipAmount("");
    setTipMessage("");

    // Show success message
    alert(`Tip of ${tipAmount} SUI sent successfully!`);
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

                  <div className="flex items-center space-x-4">
                    <TxButton
                      onExecute={createTipTransaction}
                      onSuccess={handleTipSuccess}
                      disabled={!tipAmount || parseFloat(tipAmount) <= 0}
                      className="flex-1"
                    >
                      Send {tipAmount ? `${tipAmount} SUI` : "Tip"}
                    </TxButton>
                  </div>

                  <p className="text-[#C0E6FF]/70 text-sm">
                    {!tipAmount || parseFloat(tipAmount) <= 0
                      ? "Enter a tip amount to send"
                      : `This will send ${tipAmount} SUI to the tip jar owner`}
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
