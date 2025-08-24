"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/bcs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TxButton } from "../../components/TxButton";
import { CONTRACTS } from "../../config/contracts";

// Mock guestbook messages (will be replaced with real blockchain data)
const MOCK_MESSAGES = [
  {
    id: "1",
    author: "0x1234...5678",
    content: "Amazing project! Love the Sui ecosystem 🚀",
    timestamp: Date.now() - 3600000,
  },
  {
    id: "2",
    author: "0xabcd...efgh",
    content: "This is exactly what I was looking for! Great work! 👏",
    timestamp: Date.now() - 7200000,
  },
  {
    id: "3",
    author: "0x9876...5432",
    content: "Can't wait to see more features! Keep building! 💪",
    timestamp: Date.now() - 10800000,
  },
  {
    id: "4",
    author: "0xfedc...ba98",
    content: "The UI is so clean and intuitive. Well done! ✨",
    timestamp: Date.now() - 14400000,
  },
];

export default function GuestbookPage() {
  const account = useCurrentAccount();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const createAddMessageTransaction = () => {
    // Validate inputs
    if (!message.trim()) {
      throw new Error("Message is required");
    }
    if (message.length > 100) {
      throw new Error("Message must be 100 characters or less");
    }

    console.log("Adding message:", message.trim());
    console.log("Network:", process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet");
    console.log("Guestbook Object ID:", CONTRACTS.GUESTBOOK.GUESTBOOK_OBJECT);

    const tx = new Transaction();

    // Serialize the message using BCS
    const serializedMessage = bcs
      .vector(bcs.u8())
      .serialize(new TextEncoder().encode(message.trim()));

    console.log("Serialized message:", serializedMessage.toHex());

    // Call the add_message function from the deployed Move module
    tx.moveCall({
      target: `${CONTRACTS.GUESTBOOK.PACKAGE_ID}::guestbook::add_message`,
      arguments: [
        tx.object(CONTRACTS.GUESTBOOK.GUESTBOOK_OBJECT), // Guestbook object
        tx.object(CONTRACTS.GUESTBOOK.GUESTBOOK_MANAGER_OBJECT), // GuestbookManager capability
        tx.pure(serializedMessage.toBytes()), // message as vector<u8>
      ],
    });

    return tx;
  };

  const handleMessageSuccess = () => {
    // Add message to local state
    const newMessage = {
      id: Date.now().toString(),
      author: `${account?.address.slice(0, 6)}...${account?.address.slice(-4)}`,
      content: message.trim(),
      timestamp: Date.now(),
    };

    setMessages([newMessage, ...messages]);
    setMessage("");

    // Show success message
    alert("Message added successfully to the guestbook!");
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
            Please connect your wallet to sign the guestbook
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
              📖 On-Chain Guestbook
            </h1>

            <div className="space-y-6">
              {/* Add Message */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Leave a Message
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                      Your Message (max 100 characters)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your thoughts about this project..."
                      maxLength={100}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[#C0E6FF]/50 text-xs">
                        Messages are stored permanently on the Sui blockchain
                      </p>
                      <p className="text-[#C0E6FF]/50 text-xs">
                        {message.length}/100
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <TxButton
                      onExecute={createAddMessageTransaction}
                      onSuccess={handleMessageSuccess}
                      disabled={!message.trim()}
                      className="flex-1"
                    >
                      Sign Guestbook
                    </TxButton>
                  </div>

                  <p className="text-[#C0E6FF]/70 text-sm">
                    {!message.trim()
                      ? "Write a message to sign the guestbook"
                      : "This will permanently store your message on the Sui blockchain"}
                  </p>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Guestbook Messages ({messages.length})
                </h2>

                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-[#011829] rounded-lg p-4 border border-white/5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white mb-2">{msg.content}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-[#C0E6FF] font-mono">
                              {msg.author}
                            </span>
                            <span className="text-[#C0E6FF]/50">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                        <div className="text-[#4DA2FF] text-2xl ml-4">✍️</div>
                      </div>
                    </div>
                  ))}
                </div>

                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[#C0E6FF]/50">
                      No messages yet. Be the first to sign!
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
