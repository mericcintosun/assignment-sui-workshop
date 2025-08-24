"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/bcs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { TxButton } from "../../components/TxButton";
import { CONTRACTS } from "../../config/contracts";

// Mock voting data (will be replaced with real blockchain data)
const MOCK_PROPOSALS = [
  {
    id: "1",
    title: "Add NFT Marketplace Feature",
    description:
      "Should we add a marketplace where users can buy and sell NFTs?",
    options: ["Yes", "No", "Maybe"],
    totalVotes: 42,
    createdAt: Date.now() - 86400000, // 1 day ago
    optionCounts: [25, 12, 5],
  },
  {
    id: "2",
    title: "Implement DAO Governance",
    description:
      "Should we implement decentralized governance for the platform?",
    options: ["Yes", "No"],
    totalVotes: 18,
    createdAt: Date.now() - 172800000, // 2 days ago
    optionCounts: [15, 3],
  },
  {
    id: "3",
    title: "Add DeFi Features",
    description: "Should we add DeFi features like staking and yield farming?",
    options: ["Yes", "No", "Later"],
    totalVotes: 31,
    createdAt: Date.now() - 259200000, // 3 days ago
    optionCounts: [20, 8, 3],
  },
];

export default function VotingPage() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    options: ["", ""],
  });
  const [realProposals, setRealProposals] = useState<
    Array<{ id: string; data: unknown }>
  >([]);
  const [realResults, setRealResults] = useState<
    Array<{ id: string; data: unknown }>
  >([]);
  const [useRealTransactions, setUseRealTransactions] = useState(false);

  // Fetch real proposals from blockchain
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // For now, we'll use a simpler approach to fetch objects
        // In a real implementation, you would use suiClient.getDynamicFields() or similar
        // to find all Proposal and VotingResults objects

        console.log("Fetching proposals from blockchain...");

        // TODO: Implement proper object fetching
        // This is a placeholder for now since we need to implement proper object discovery
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    if (account) {
      fetchProposals();
    }
  }, [account, suiClient]);

  const createVoteTransaction = () => {
    if (!selectedProposal || selectedOption === null) {
      throw new Error("Please select a proposal and option to vote");
    }

    console.log(
      "Creating vote transaction for proposal:",
      selectedProposal,
      "option:",
      selectedOption
    );

    if (useRealTransactions) {
      return createRealVoteTransaction();
    }

    // For now, we'll use a reliable test transaction: split coins and transfer to self
    const tx = new Transaction();

    // Reliable test transaction: split coins and transfer to self
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1)]); // 1 mist
    tx.transferObjects([coin], tx.pure.address(account?.address || ""));

    return tx;
  };

  const createProposalTransaction = () => {
    // Validate inputs
    if (!newProposal.title.trim()) {
      throw new Error("Proposal title is required");
    }
    if (!newProposal.description.trim()) {
      throw new Error("Proposal description is required");
    }
    if (newProposal.options.length < 2) {
      throw new Error("At least 2 options are required");
    }
    if (newProposal.options.some((opt) => !opt.trim())) {
      throw new Error("All options must have content");
    }

    console.log("Creating proposal with:", {
      title: newProposal.title.trim(),
      description: newProposal.description.trim(),
      options: newProposal.options.map((opt) => opt.trim()),
    });

    if (useRealTransactions) {
      return createRealProposalTransaction();
    }

    // For now, create a reliable test transaction to verify Sui Wallet connection
    // This will be replaced with actual proposal creation once we confirm transactions work
    const tx = new Transaction();

    // Reliable test transaction: split coins and transfer to self
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1)]); // 1 mist
    tx.transferObjects([coin], tx.pure.address(account?.address || ""));

    return tx;
  };

  // Real voting transaction (commented out for now)
  const createRealVoteTransaction = () => {
    if (!selectedProposal || selectedOption === null) {
      throw new Error("Please select a proposal and option to vote");
    }

    const tx = new Transaction();

    // Call the cast_vote function from the deployed Move module
    // Note: This requires actual Proposal and VotingResults objects from the blockchain
    tx.moveCall({
      target: `${CONTRACTS.VOTING.PACKAGE_ID}::voting::cast_vote`,
      arguments: [
        tx.object("PROPOSAL_OBJECT_ID"), // Replace with actual proposal object ID
        tx.object("VOTING_RESULTS_OBJECT_ID"), // Replace with actual results object ID
        tx.pure.u64(selectedOption), // option_index as u64
      ],
    });

    return tx;
  };

  // Real proposal creation transaction (commented out for now)
  const createRealProposalTransaction = () => {
    // Validate inputs
    if (!newProposal.title.trim()) {
      throw new Error("Proposal title is required");
    }
    if (!newProposal.description.trim()) {
      throw new Error("Proposal description is required");
    }
    if (newProposal.options.length < 2) {
      throw new Error("At least 2 options are required");
    }
    if (newProposal.options.some((opt) => !opt.trim())) {
      throw new Error("All options must have content");
    }

    console.log("Creating proposal with:", {
      title: newProposal.title.trim(),
      description: newProposal.description.trim(),
      options: newProposal.options.map((opt) => opt.trim()),
    });

    const tx = new Transaction();

    // Proper BCS encoding for vector<u8> and vector<vector<u8>>
    const enc = new TextEncoder();
    const titleBytes = enc.encode(newProposal.title.trim());
    const descBytes = enc.encode(newProposal.description.trim());
    const optionsBytes = newProposal.options.map((o) =>
      Array.from(enc.encode(o.trim()))
    );

    console.log("Serialized data:", {
      titleBytes: Array.from(titleBytes),
      descriptionBytes: Array.from(descBytes),
      optionsBytes: optionsBytes,
    });

    // Call the create_proposal function from the deployed Move module
    tx.moveCall({
      target: `${CONTRACTS.VOTING.PACKAGE_ID}::voting::create_proposal`,
      arguments: [
        tx.object(CONTRACTS.VOTING.PROPOSAL_CREATOR_OBJECT), // ProposalCreator capability
        tx.pure(bcs.vector(bcs.u8()).serialize(titleBytes)), // title as vector<u8>
        tx.pure(bcs.vector(bcs.u8()).serialize(descBytes)), // description as vector<u8>
        tx.pure(bcs.vector(bcs.vector(bcs.u8())).serialize(optionsBytes)), // options as vector<vector<u8>>
      ],
    });

    return tx;
  };

  const handleVoteSuccess = () => {
    // Update local state
    if (selectedProposal && selectedOption !== null) {
      const proposalIndex = proposals.findIndex(
        (p) => p.id === selectedProposal
      );
      if (proposalIndex !== -1) {
        const updatedProposals = [...proposals];
        updatedProposals[proposalIndex].totalVotes += 1;
        updatedProposals[proposalIndex].optionCounts[selectedOption] += 1;
        setProposals(updatedProposals);
      }
    }

    // Clear selection
    setSelectedProposal(null);
    setSelectedOption(null);

    // Show success message
    alert("Vote cast successfully!");
  };

  const handleProposalSuccess = () => {
    // Add new proposal to local state
    const newProposalObj = {
      id: Date.now().toString(),
      title: newProposal.title.trim(),
      description: newProposal.description.trim(),
      options: newProposal.options.map((opt) => opt.trim()),
      totalVotes: 0,
      createdAt: Date.now(),
      optionCounts: new Array(newProposal.options.length).fill(0),
    };

    setProposals([newProposalObj, ...proposals]);

    // Clear form
    setNewProposal({
      title: "",
      description: "",
      options: ["", ""],
    });
    setShowCreateForm(false);

    // Show success message
    alert("Proposal created successfully!");
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

  const addOption = () => {
    setNewProposal({
      ...newProposal,
      options: [...newProposal.options, ""],
    });
  };

  const removeOption = (index: number) => {
    if (newProposal.options.length > 2) {
      const updatedOptions = newProposal.options.filter((_, i) => i !== index);
      setNewProposal({
        ...newProposal,
        options: updatedOptions,
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newProposal.options];
    updatedOptions[index] = value;
    setNewProposal({
      ...newProposal,
      options: updatedOptions,
    });
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="bg-[#011829] rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-[#C0E6FF]">
            Please connect your wallet to participate in voting
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
              🗳️ On-Chain Voting
            </h1>

            <div className="space-y-6">
              {/* Test Transaction */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  🔧 Test Transaction
                </h2>
                <p className="text-[#C0E6FF]/70 text-sm mb-4">
                  Test your wallet connection with a simple transaction
                </p>
                <TxButton
                  onExecute={() => {
                    const tx = new Transaction();
                    // Create a reliable test transaction: split coins and transfer to self
                    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1)]); // 1 mist
                    tx.transferObjects(
                      [coin],
                      tx.pure.address(account?.address || "")
                    );
                    return tx;
                  }}
                  onSuccess={() =>
                    alert(
                      "Test transaction successful! Wallet connection is working."
                    )
                  }
                  className="w-full"
                >
                  Test Wallet Connection (Split & Transfer)
                </TxButton>

                <TxButton
                  onExecute={() => {
                    const tx = new Transaction();
                    // Alternative test with proper type arguments
                    tx.moveCall({
                      target: "0x2::coin::zero",
                      typeArguments: ["0x2::sui::SUI"],
                      arguments: [],
                    });
                    return tx;
                  }}
                  onSuccess={() =>
                    alert("Coin zero test successful! Move calls are working.")
                  }
                  className="w-full"
                >
                  Test Coin Zero (with type args)
                </TxButton>

                <TxButton
                  onExecute={() => {
                    const tx = new Transaction();
                    // Create a transaction that does nothing (empty transaction)
                    return tx;
                  }}
                  onSuccess={() =>
                    alert(
                      "Empty transaction successful! Basic wallet connection is working."
                    )
                  }
                  className="w-full"
                >
                  Test Empty Transaction
                </TxButton>
              </div>

              {/* Transaction Mode Toggle */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  ⚙️ Transaction Mode
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#C0E6FF] font-medium">
                      {useRealTransactions
                        ? "Real Move Contracts"
                        : "Test Transactions"}
                    </p>
                    <p className="text-[#C0E6FF]/70 text-sm">
                      {useRealTransactions
                        ? "Using actual Move contract calls"
                        : "Using simple test transactions"}
                    </p>
                  </div>
                  <button
                    onClick={() => setUseRealTransactions(!useRealTransactions)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useRealTransactions ? "bg-[#4DA2FF]" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useRealTransactions ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {useRealTransactions && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ Real contract mode: Make sure contracts are deployed
                      and you have sufficient SUI for gas fees.
                    </p>
                  </div>
                )}
              </div>

              {/* Create Proposal */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">
                    Create New Proposal
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-4 py-2 bg-[#4DA2FF] text-white rounded-lg hover:bg-[#4DA2FF]/80 transition-colors"
                  >
                    {showCreateForm ? "Cancel" : "Create Proposal"}
                  </button>
                </div>

                {showCreateForm && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                        Proposal Title
                      </label>
                      <input
                        type="text"
                        value={newProposal.title}
                        onChange={(e) =>
                          setNewProposal({
                            ...newProposal,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter proposal title..."
                        className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={newProposal.description}
                        onChange={(e) =>
                          setNewProposal({
                            ...newProposal,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe your proposal..."
                        rows={3}
                        className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                        Voting Options
                      </label>
                      <div className="space-y-2">
                        {newProposal.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateOption(index, e.target.value)
                              }
                              placeholder={`Option ${index + 1}`}
                              className="flex-1 px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors"
                            />
                            {newProposal.options.length > 2 && (
                              <button
                                onClick={() => removeOption(index)}
                                className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={addOption}
                          className="px-4 py-2 bg-[#011829] text-[#C0E6FF] rounded-lg hover:bg-[#011829]/80 transition-colors border border-white/10"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>

                    <TxButton
                      onExecute={createProposalTransaction}
                      onSuccess={handleProposalSuccess}
                      disabled={
                        !newProposal.title.trim() ||
                        !newProposal.description.trim() ||
                        newProposal.options.some((opt) => !opt.trim())
                      }
                      className="w-full"
                    >
                      Create Proposal
                    </TxButton>
                  </div>
                )}
              </div>

              {/* Active Proposals */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Active Proposals ({proposals.length})
                </h2>

                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="bg-[#011829] rounded-lg p-4 border border-white/5"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-white font-medium text-lg">
                            {proposal.title}
                          </h3>
                          <p className="text-[#C0E6FF]/70 text-sm mt-1">
                            {proposal.description}
                          </p>
                          <p className="text-[#C0E6FF]/50 text-xs mt-2">
                            Created {formatTime(proposal.createdAt)} •{" "}
                            {proposal.totalVotes} votes
                          </p>
                        </div>

                        {/* Voting Options */}
                        <div className="space-y-2">
                          {proposal.options.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="radio"
                                name={`proposal-${proposal.id}`}
                                id={`option-${proposal.id}-${index}`}
                                checked={
                                  selectedProposal === proposal.id &&
                                  selectedOption === index
                                }
                                onChange={() => {
                                  setSelectedProposal(proposal.id);
                                  setSelectedOption(index);
                                }}
                                className="text-[#4DA2FF] focus:ring-[#4DA2FF]"
                              />
                              <label
                                htmlFor={`option-${proposal.id}-${index}`}
                                className="flex-1 text-[#C0E6FF] cursor-pointer"
                              >
                                {option}
                              </label>
                              <span className="text-[#C0E6FF]/50 text-sm">
                                {proposal.optionCounts[index]} votes
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Vote Button */}
                        <div className="flex justify-end">
                          <TxButton
                            onExecute={createVoteTransaction}
                            onSuccess={handleVoteSuccess}
                            disabled={
                              selectedProposal !== proposal.id ||
                              selectedOption === null
                            }
                            className="px-6 py-2"
                          >
                            Vote
                          </TxButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {proposals.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-[#C0E6FF]/50">
                      No active proposals. Create the first one!
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
                <div className="mt-4 space-y-2">
                  <p className="text-[#C0E6FF]/70 text-sm">
                    Network: {process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet"}
                  </p>
                  <p className="text-[#C0E6FF]/70 text-sm">
                    Package ID: {CONTRACTS.VOTING.PACKAGE_ID}
                  </p>
                  <p className="text-[#C0E6FF]/70 text-sm">
                    Creator Object: {CONTRACTS.VOTING.PROPOSAL_CREATOR_OBJECT}
                  </p>
                  <p className="text-[#C0E6FF]/70 text-sm">
                    Wallet: Sui Wallet
                  </p>
                  <p className="text-[#C0E6FF]/70 text-sm">
                    Account Status: {account ? "Connected" : "Not Connected"}
                  </p>
                </div>
              </div>

              {/* Debug Information */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  🔧 Debug Information
                </h2>
                <div className="space-y-2 text-[#C0E6FF]/70 text-sm">
                  <p>Environment: {process.env.NODE_ENV}</p>
                  <p>
                    Network: {process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet"}
                  </p>
                  <p>Account Connected: {account ? "Yes" : "No"}</p>
                  <p>Account Address: {account?.address || "None"}</p>
                  <p>Public Key: {account?.publicKey || "None"}</p>
                  <p>Chains: {account?.chains?.join(", ") || "None"}</p>
                  <p>
                    Wallet Status:{" "}
                    {account ? "✅ Connected" : "❌ Not Connected"}
                  </p>
                  <p>
                    Network Status:{" "}
                    {process.env.NEXT_PUBLIC_SUI_NETWORK === "testnet"
                      ? "✅ Testnet"
                      : "⚠️ Check Network"}
                  </p>
                  <p>Expected Network: testnet</p>
                  <p>
                    Current Network:{" "}
                    {process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet"}
                  </p>
                  <p>Account Balance: Check Sui Wallet for balance</p>
                  <p>Gas Fees: Required for transactions</p>
                </div>
                {!account && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                      ⚠️ Wallet not connected. Please connect your Sui Wallet
                      first.
                    </p>
                  </div>
                )}
                {account && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 text-sm">
                      ✅ Wallet connected: {account.address.substring(0, 8)}...
                      {account.address.substring(account.address.length - 8)}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      Refresh Page
                    </button>
                    <button
                      onClick={() => {
                        // Clear wallet connection and reload
                        localStorage.clear();
                        sessionStorage.clear();
                        window.location.reload();
                      }}
                      className="mt-2 ml-2 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Reset Wallet Connection
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
