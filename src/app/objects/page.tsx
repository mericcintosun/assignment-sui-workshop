"use client";

import {
  useCurrentAccount,
  useSuiClientQuery,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Link from "next/link";
import { CONTRACTS } from "../../config/contracts";

export default function ObjectsPage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction, isPending } =
    useSignAndExecuteTransaction();

  const { data: ownedObjects, isLoading } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showContent: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!account?.address,
    }
  );

  // For now, let's show all objects and identify NFTs manually
  const allObjects = ownedObjects?.data || [];

  // Try to identify NFTs by checking if they have NFT-like fields
  const nfts = allObjects.filter((object) => {
    const content = object.data?.content as {
      fields?: Record<string, unknown>;
    };
    const fields = content?.fields;

    // Check if object has NFT-like fields
    const hasNFTFields =
      fields &&
      (fields.name || fields.image_url || fields.description || fields.creator);

    return hasNFTFields;
  });

  // Separate our contract NFTs from other NFTs
  const ourContractNFTs = nfts.filter((nft) => {
    const type = nft.data?.type;
    return type?.includes(CONTRACTS.NFT_MINT.PACKAGE_ID);
  });

  const otherNFTs = nfts.filter((nft) => {
    const type = nft.data?.type;
    return !type?.includes(CONTRACTS.NFT_MINT.PACKAGE_ID);
  });

  // Other objects are those without NFT-like fields
  const otherObjects = allObjects.filter((object) => {
    const content = object.data?.content as {
      fields?: Record<string, unknown>;
    };
    const fields = content?.fields;

    const hasNFTFields =
      fields &&
      (fields.name || fields.image_url || fields.description || fields.creator);

    return !hasNFTFields;
  });

  // Handle NFT deletion
  const handleDeleteNFT = async (nftId: string, nftName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${nftName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const tx = new Transaction();

      // Call the delete_nft function
      tx.moveCall({
        target: `${CONTRACTS.NFT_MINT.PACKAGE_ID}::nft_mint::delete_nft`,
        arguments: [
          tx.object(nftId), // The NFT to delete
        ],
      });

      await signAndExecuteTransaction({ transaction: tx });
      alert(`NFT "${nftName}" deleted successfully!`);

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete NFT:", error);
      alert("Failed to delete NFT. Make sure you are the creator of this NFT.");
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="bg-[#011829] rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-[#C0E6FF]">
            Please connect your wallet to view objects
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
          {/* NFTs Section */}
          <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
            <h1 className="text-2xl font-semibold text-white mb-4">
              My NFTs ({nfts.length})
            </h1>

            {isLoading ? (
              <div className="text-[#C0E6FF]">Loading NFTs...</div>
            ) : nfts.length > 0 ? (
              <div className="space-y-6">
                {/* Our Contract NFTs */}
                {ourContractNFTs.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">
                      My Minted NFTs ({ourContractNFTs.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ourContractNFTs.map((nft) => {
                        const content = nft.data?.content as {
                          fields?: Record<string, unknown>;
                        };
                        const name =
                          (content?.fields?.name as string) || "Unnamed NFT";
                        const imageUrl = content?.fields?.image_url || "";
                        const description = content?.fields?.description || "";
                        const creator = content?.fields?.creator || "";
                        const createdAt =
                          content?.fields?.created_at ||
                          content?.fields?.mint_timestamp ||
                          0;

                        return (
                          <div
                            key={nft.data?.objectId}
                            className="bg-[#030F1C] rounded-xl p-4 border border-white/5 hover:border-[#4DA2FF]/30 transition-colors"
                          >
                            {/* NFT Image */}
                            <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-[#011829] border border-white/10">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23011829'/%3E%3Ctext x='200' y='200' text-anchor='middle' dy='.3em' fill='%23C0E6FF' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-[#C0E6FF] text-sm">
                                    No Image
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* NFT Details */}
                            <div className="space-y-2">
                              <h3 className="text-white font-semibold text-lg truncate">
                                {name}
                              </h3>

                              {description && (
                                <p className="text-[#C0E6FF]/70 text-sm line-clamp-2">
                                  {description}
                                </p>
                              )}

                              <div className="text-[#C0E6FF]/60 text-xs space-y-1">
                                <p>
                                  Creator: {creator.slice(0, 8)}...
                                  {creator.slice(-6)}
                                </p>
                                <p>Created: Epoch {createdAt}</p>
                              </div>

                              <div className="flex space-x-2 mt-3">
                                <Link
                                  href={`/objects/${nft.data?.objectId}`}
                                  className="flex-1 text-center text-[#4DA2FF] text-sm hover:text-[#4DA2FF]/80 transition-colors"
                                >
                                  View Details →
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDeleteNFT(
                                      nft.data?.objectId || "",
                                      name
                                    )
                                  }
                                  disabled={isPending}
                                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {isPending ? "Deleting..." : "Delete"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Other NFTs */}
                {otherNFTs.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-4">
                      Other NFTs ({otherNFTs.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {otherNFTs.map((nft) => {
                        const content = nft.data?.content as {
                          fields?: Record<string, unknown>;
                        };
                        const name =
                          (content?.fields?.name as string) || "Unnamed NFT";
                        const imageUrl = content?.fields?.image_url || "";
                        const description = content?.fields?.description || "";
                        const creator = content?.fields?.creator || "";
                        const createdAt =
                          content?.fields?.created_at ||
                          content?.fields?.mint_timestamp ||
                          0;

                        return (
                          <div
                            key={nft.data?.objectId}
                            className="bg-[#030F1C] rounded-xl p-4 border border-white/5 hover:border-[#4DA2FF]/30 transition-colors"
                          >
                            {/* NFT Image */}
                            <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-[#011829] border border-white/10">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23011829'/%3E%3Ctext x='200' y='200' text-anchor='middle' dy='.3em' fill='%23C0E6FF' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-[#C0E6FF] text-sm">
                                    No Image
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* NFT Details */}
                            <div className="space-y-2">
                              <h3 className="text-white font-semibold text-lg truncate">
                                {name}
                              </h3>

                              {description && (
                                <p className="text-[#C0E6FF]/70 text-sm line-clamp-2">
                                  {description}
                                </p>
                              )}

                              <div className="text-[#C0E6FF]/60 text-xs space-y-1">
                                <p>
                                  Creator: {creator.slice(0, 8)}...
                                  {creator.slice(-6)}
                                </p>
                                <p>Created: Epoch {createdAt}</p>
                              </div>

                              <Link
                                href={`/objects/${nft.data?.objectId}`}
                                className="block mt-3 text-[#4DA2FF] text-sm hover:text-[#4DA2FF]/80 transition-colors"
                              >
                                View Details →
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#C0E6FF] mb-4">
                  No NFTs found. Mint your first NFT!
                </p>
                <Link
                  href="/mint"
                  className="inline-block px-6 py-3 bg-[#4DA2FF] text-white rounded-xl hover:bg-[#4DA2FF]/80 transition-colors"
                >
                  Mint NFT
                </Link>
              </div>
            )}
          </div>

          {/* Other Objects Section */}
          {otherObjects.length > 0 && (
            <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-semibold text-white mb-4">
                Other Objects ({otherObjects.length})
              </h2>

              <div className="grid gap-4">
                {otherObjects.map((object) => (
                  <Link
                    key={object.data?.objectId}
                    href={`/objects/${object.data?.objectId}`}
                    className="block bg-[#030F1C] rounded-xl p-4 border border-white/5 hover:border-[#4DA2FF]/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-2">
                          {object.data?.display?.data?.name || "Unnamed Object"}
                        </h3>
                        <p className="text-[#C0E6FF] text-sm font-mono break-all">
                          {object.data?.objectId}
                        </p>
                        {object.data?.display?.data?.description && (
                          <p className="text-[#C0E6FF]/70 text-sm mt-2">
                            {object.data.display.data.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-[#C0E6FF] text-sm">
                          Version: {object.data?.version}
                        </p>
                        <p className="text-[#C0E6FF]/70 text-xs mt-1">
                          Type: {object.data?.type}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
