"use client";

import {
  useCurrentAccount,
  useSuiClientQuery,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CONTRACTS } from "../../../../config/contracts";
import toast from "react-hot-toast";

export default function EditNFTPage() {
  const params = useParams();
  const router = useRouter();
  const objectId = params.id as string;
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [nftName, setNftName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: object,
    isLoading: isLoadingObject,
    error,
  } = useSuiClientQuery(
    "getObject",
    {
      id: objectId,
      options: {
        showContent: true,
        showDisplay: true,
        showOwner: true,
      },
    },
    {
      enabled: !!objectId,
    }
  );

  // Load NFT data when object is loaded
  useEffect(() => {
    if (object?.data) {
      const content = object.data.content as {
        fields?: Record<string, unknown>;
      };
      const fields = content?.fields;

      if (fields) {
        setNftName((fields.name as string) || "");
        setImageUrl((fields.image_url as string) || "");
        setDescription((fields.description as string) || "");
      }
    }
  }, [object]);

  const handleUpdateNFT = async () => {
    if (!nftName.trim() || !imageUrl.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();

      // Helper function to convert string to BCS bytes
      const stringToBytes = (str: string) => {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        // BCS format for vector<u8>: length (ULEB128) + bytes
        const lengthBytes = [];
        let length = bytes.length;
        while (length >= 0x80) {
          lengthBytes.push((length & 0x7f) | 0x80);
          length >>= 7;
        }
        lengthBytes.push(length & 0x7f);
        return new Uint8Array([...lengthBytes, ...bytes]);
      };

      // Call the update_nft function
      tx.moveCall({
        target: `${CONTRACTS.NFT_MINT.PACKAGE_ID}::nft_mint::update_nft`,
        arguments: [
          tx.object(objectId), // The NFT to update
          tx.pure(stringToBytes(nftName.trim())), // new name
          tx.pure(stringToBytes(imageUrl.trim())), // new image_url
          tx.pure(stringToBytes(description.trim())), // new description
        ],
      });

      await signAndExecuteTransaction({ transaction: tx });
      toast.success("NFT updated successfully!");
      router.push(`/objects/${objectId}`);
    } catch (error) {
      console.error("Failed to update NFT:", error);
      toast.error(
        "Failed to update NFT. Make sure you are the creator of this NFT."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingObject) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="text-[#C0E6FF]">Loading NFT...</div>
      </div>
    );
  }

  if (error || !object?.data) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="bg-[#011829] rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-[#C0E6FF]">NFT not found or error loading NFT</p>
          <Link
            href="/objects"
            className="text-[#4DA2FF] hover:text-[#4DA2FF]/80 mt-4 inline-block"
          >
            ← Back to Objects
          </Link>
        </div>
      </div>
    );
  }

  const objectData = object.data;
  const content = objectData.content as { fields?: Record<string, unknown> };
  const fields = content?.fields;
  const isNFT =
    fields &&
    (fields.name || fields.image_url || fields.description || fields.creator);

  if (!isNFT) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="bg-[#011829] rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-[#C0E6FF]">This object is not an NFT</p>
          <Link
            href="/objects"
            className="text-[#4DA2FF] hover:text-[#4DA2FF]/80 mt-4 inline-block"
          >
            ← Back to Objects
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is the creator
  const isCreator = fields.creator === account?.address;

  if (!isCreator) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="bg-[#011829] rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-[#C0E6FF]">Only the creator can edit this NFT</p>
          <Link
            href={`/objects/${objectId}`}
            className="text-[#4DA2FF] hover:text-[#4DA2FF]/80 mt-4 inline-block"
          >
            ← Back to NFT
          </Link>
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
              href={`/objects/${objectId}`}
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              ← Back to NFT
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
            <h1 className="text-2xl font-semibold text-white mb-6">Edit NFT</h1>

            <div className="space-y-6">
              {/* NFT Form */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  NFT Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                      NFT Name *
                    </label>
                    <input
                      type="text"
                      value={nftName}
                      onChange={(e) => setNftName(e.target.value)}
                      placeholder="Enter NFT name..."
                      className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C0E6FF] text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter NFT description..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[#011829] border border-white/10 rounded-xl text-white placeholder-[#C0E6FF]/50 focus:border-[#4DA2FF] focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {nftName && imageUrl && (
                <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    NFT Preview
                  </h2>

                  <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                    <div className="flex items-start space-x-4">
                      <img
                        src={imageUrl}
                        alt={nftName}
                        className="w-24 h-24 rounded-lg object-cover border border-white/10"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23011829'/%3E%3Ctext x='48' y='48' text-anchor='middle' dy='.3em' fill='%23C0E6FF' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{nftName}</h3>
                        {description && (
                          <p className="text-[#C0E6FF]/70 text-sm mt-1">
                            {description}
                          </p>
                        )}
                        <p className="text-[#C0E6FF]/50 text-xs mt-2">
                          Creator: {account?.address?.slice(0, 8)}...
                          {account?.address?.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Update Button */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleUpdateNFT}
                    disabled={!nftName || !imageUrl || isLoading}
                    className="flex-1 px-6 py-3 bg-[#4DA2FF] text-white rounded-xl hover:bg-[#4DA2FF]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? "Updating..." : "Update NFT"}
                  </button>

                  <Link
                    href={`/objects/${objectId}`}
                    className="px-6 py-3 bg-[#011829] text-[#C0E6FF] rounded-xl hover:bg-[#011829]/80 transition-colors border border-white/10"
                  >
                    Cancel
                  </Link>
                </div>

                <p className="text-[#C0E6FF]/70 text-sm mt-3">
                  {!nftName || !imageUrl
                    ? "Please fill in the NFT name and image URL to update"
                    : "This will update your NFT metadata on the Sui blockchain"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
