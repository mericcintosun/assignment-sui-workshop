"use client";

import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/bcs";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CONTRACTS } from "../../config/contracts";
import { useEnokiSponsor } from "../../lib/useEnokiSponsor";

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
  const sponsorAndExecute = useEnokiSponsor();
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    options: ["", ""],
  });

  // Gerçek object ID'leri saklamak için state - UI ID'den chain ID'ye eşleme
  const [chainPairs, setChainPairs] = useState<
    Array<{ uiId: string; proposalId: string; resultsId: string }>
  >([]);

  // Basit ID doğrulayıcı
  const isObjId = (s: string) =>
    typeof s === "string" && /^0x[0-9a-f]+$/i.test(s);

  // Transaction sonucundan Proposal & VotingResults ID'lerini çek
  async function extractVotingIds(client: any, final: any) {
    let oc = final.objectChanges;
    if (!oc) {
      const tx = await client.getTransactionBlock({
        digest: final.digest,
        options: { showObjectChanges: true },
      });
      oc = tx.objectChanges;
    }
    const created = (oc ?? []).filter((c: any) => c.type === "created");
    const prop = created.find((c: any) =>
      c.objectType?.endsWith("::voting::Proposal")
    );
    const res = created.find((c: any) =>
      c.objectType?.endsWith("::voting::VotingResults")
    );
    return {
      proposalId: prop?.objectId as string | undefined,
      resultsId: res?.objectId as string | undefined,
    };
  }

  // ID çiftini hatırla
  function rememberPair(uiId: string, proposalId: string, resultsId: string) {
    const next = [
      { uiId, proposalId, resultsId },
      ...chainPairs.filter((p) => p.uiId !== uiId),
    ];
    setChainPairs(next);
    localStorage.setItem("voting:pairs", JSON.stringify(next));
  }

  // Sayfa yüklendiğinde localStorage'dan ID'leri yükle
  useEffect(() => {
    const raw = localStorage.getItem("voting:pairs");
    if (raw) {
      try {
        const pairs = JSON.parse(raw);
        setChainPairs(pairs);
      } catch (e) {
        console.error("Failed to parse saved voting pairs:", e);
      }
    }
  }, []);

  // Fetch real proposals from blockchain
  useEffect(() => {
    const fetchProposals = async () => {
      try {
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

  const handleVote = async () => {
    if (!selectedProposal || selectedOption === null) {
      alert("Please select a proposal and option to vote");
      return;
    }

    console.log(
      "Creating vote transaction for proposal:",
      selectedProposal,
      "option:",
      selectedOption
    );

    // UI id → chain id eşlemesi
    const pair = chainPairs.find((p) => p.uiId === selectedProposal);
    if (!pair) {
      alert("No real object IDs found. Create a proposal first or load IDs.");
      return;
    }

    // Doğrulama
    if (!isObjId(pair.proposalId) || !isObjId(pair.resultsId)) {
      alert(`Invalid object ids:\nproposal=${pair.proposalId}\nresults=${pair.resultsId}`);
      return;
    }

    setIsVoting(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${CONTRACTS.VOTING.PACKAGE_ID}::voting::cast_vote`,
        arguments: [
          tx.object(pair.proposalId), // ✅ gerçek Proposal ID
          tx.object(pair.resultsId), // ✅ gerçek VotingResults ID
          tx.pure.u64(selectedOption),
        ],
      });

      // Execute with Enoki sponsorship
      const digest = await sponsorAndExecute(tx, {
        network: "testnet",
        allowedMoveCallTargets: [`${CONTRACTS.VOTING.PACKAGE_ID}::voting::cast_vote`],
      });

      console.log("Vote cast successfully! Digest:", digest);

      // Update local state
      const proposalIndex = proposals.findIndex(
        (p) => p.id === selectedProposal
      );
      if (proposalIndex !== -1) {
        const updatedProposals = [...proposals];
        updatedProposals[proposalIndex].totalVotes += 1;
        updatedProposals[proposalIndex].optionCounts[selectedOption] += 1;
        setProposals(updatedProposals);
      }

      // Clear selection
      setSelectedProposal(null);
      setSelectedOption(null);

      // Show success message
      alert("Vote cast successfully!");
    } catch (error: any) {
      console.error("Vote error:", error);
      alert(error?.message || "Failed to cast vote");
    } finally {
      setIsVoting(false);
    }
  };

  const handleCreateProposal = async () => {
    // Validate inputs
    if (!newProposal.title.trim()) {
      alert("Proposal title is required");
      return;
    }
    if (!newProposal.description.trim()) {
      alert("Proposal description is required");
      return;
    }
    if (newProposal.options.length < 2) {
      alert("At least 2 options are required");
      return;
    }
    if (newProposal.options.some((opt) => !opt.trim())) {
      alert("All options must have content");
      return;
    }

    console.log("Creating proposal with:", {
      title: newProposal.title.trim(),
      description: newProposal.description.trim(),
      options: newProposal.options.map((opt) => opt.trim()),
    });

    setIsCreating(true);

    try {
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

      // Execute with Enoki sponsorship
      const digest = await sponsorAndExecute(tx, {
        network: "testnet",
        allowedMoveCallTargets: [`${CONTRACTS.VOTING.PACKAGE_ID}::voting::create_proposal`],
      });

      console.log("Proposal created successfully! Digest:", digest);

      // Gerçek object ID'lerini çıkar
      const ids = await extractVotingIds(suiClient, { digest });
      if (
        !ids.proposalId ||
        !ids.resultsId ||
        !isObjId(ids.proposalId) ||
        !isObjId(ids.resultsId)
      ) {
        alert(
          "Could not detect created object IDs. Open console and check objectChanges/effects."
        );
        console.log("Transaction result:", { digest });
        return;
      }

      // UI'da gösterdiğin yeni proposal'ın "ui id"si
      const uiId = Date.now().toString();

      // ID'leri hatırla
      rememberPair(uiId, ids.proposalId, ids.resultsId);

      // Add new proposal to local state
      const newProposalObj = {
        id: uiId, // UI ID'yi kullan
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

      // Show success message with object IDs
      alert(
        `✅ Proposal created successfully!\nProposalID: ${ids.proposalId}\nResultsID: ${ids.resultsId}`
      );
    } catch (error: any) {
      console.error("Create proposal error:", error);
      alert(error?.message || "Failed to create proposal");
    } finally {
      setIsCreating(false);
    }
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

                    <button
                      onClick={handleCreateProposal}
                      disabled={
                        !newProposal.title.trim() ||
                        !newProposal.description.trim() ||
                        newProposal.options.some((opt) => !opt.trim()) ||
                        isCreating
                      }
                      className="w-full px-6 py-3 bg-[#4DA2FF] text-white rounded-xl hover:bg-[#4DA2FF]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCreating ? "Creating..." : "Create Proposal (Gasless)"}
                    </button>
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
                          <button
                            onClick={handleVote}
                            disabled={
                              selectedProposal !== proposal.id ||
                              selectedOption === null ||
                              isVoting
                            }
                            className="px-6 py-2 bg-[#4DA2FF] text-white rounded-lg hover:bg-[#4DA2FF]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {isVoting ? "Voting..." : "Vote (Gasless)"}
                          </button>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
