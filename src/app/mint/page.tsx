"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONTRACTS } from "../../config/contracts";
import { useEnokiSponsor } from "../../lib/useEnokiSponsor";
import { ExplorerButton } from "../../components/ExplorerButton";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Palette, Image, FileText, Sparkles, Eye, AlertCircle, User } from "lucide-react";

export default function MintPage() {
  const account = useCurrentAccount();
  const router = useRouter();
  const sponsorAndExecute = useEnokiSponsor();
  const [nftName, setNftName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [lastDigest, setLastDigest] = useState<string | null>(null);

  const handleMintNFT = async () => {
    // Validate inputs
    if (!nftName.trim()) {
      toast.error("NFT name is required");
      return;
    }
    if (!imageUrl.trim()) {
      toast.error("Image URL is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    setIsMinting(true);

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

      // Call the mint_nft function from the deployed Move module
      tx.moveCall({
        target: `${CONTRACTS.NFT_MINT.PACKAGE_ID}::nft_mint::mint_nft`,
        arguments: [
          tx.object(CONTRACTS.NFT_MINT.NFT_MINTER_OBJECT), // NFTMinter capability
          tx.pure(stringToBytes(nftName.trim())), // name as bytes
          tx.pure(stringToBytes(imageUrl.trim())), // image_url as bytes
          tx.pure(stringToBytes(description.trim())), // description as bytes
        ],
      });

      // Execute with Enoki sponsorship
      const digest = await sponsorAndExecute(tx, {
        network: "testnet",
        allowedMoveCallTargets: [
          `${CONTRACTS.NFT_MINT.PACKAGE_ID}::nft_mint::mint_nft`,
        ],
      });

      console.log("NFT minted successfully! Digest:", digest);

      // Store digest for explorer button
      setLastDigest(digest);

      // Clear form
      setNftName("");
      setImageUrl("");
      setDescription("");

      // Show success message
      toast.success(
        "NFT minted successfully! Check the explorer button below to view your transaction."
      );
    } catch (error: any) {
      console.error("Mint error:", error);
      toast.error(error?.message || "Failed to mint NFT");
    } finally {
      setIsMinting(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card text-center">
          <p className="text-muted-foreground">
            Please connect your wallet to mint NFTs
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
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-semibold text-foreground">
                Mint Your First NFT
              </h1>
            </div>

            <div className="space-y-6">
              {/* NFT Form */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">
                  NFT Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-muted-foreground text-sm font-medium mb-2 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>NFT Name</span>
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
                    <label className="block text-muted-foreground text-sm font-medium mb-2 flex items-center space-x-2">
                      <Image className="w-4 h-4" />
                      <span>Image URL</span>
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
                    <label className="block text-muted-foreground text-sm font-medium mb-2 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Description</span>
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
                <div className="card">
                  <div className="flex items-center space-x-3 mb-4">
                    <Eye className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      NFT Preview
                    </h2>
                  </div>

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
                          Creator: {account.address.slice(0, 8)}...
                          {account.address.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mint Button */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Mint NFT
                  </h2>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleMintNFT}
                    disabled={!nftName || !imageUrl || isMinting}
                    className="flex-1 px-6 py-3 bg-[#4DA2FF] text-white rounded-xl hover:bg-[#4DA2FF]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isMinting ? "Minting..." : "Mint NFT (Gasless)"}
                  </button>

                  <Link
                    href="/objects"
                    className="px-6 py-3 bg-[#011829] text-[#C0E6FF] rounded-xl hover:bg-[#011829]/80 transition-colors border border-white/10"
                  >
                    View My NFTs
                  </Link>
                </div>

                {/* Explorer Button */}
                {lastDigest && (
                  <div className="mt-4 p-4 bg-[#4DA2FF]/10 border border-[#4DA2FF] rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">
                          ✅ NFT Minted Successfully!
                        </p>
                        <p className="text-[#C0E6FF] text-sm">
                          Transaction completed with gasless sponsorship
                        </p>
                      </div>
                      <ExplorerButton
                        digest={lastDigest}
                        network="testnet"
                        className="ml-4"
                      >
                        View NFT Transaction
                      </ExplorerButton>
                    </div>
                  </div>
                )}

                <p className="text-[#C0E6FF]/70 text-sm mt-3">
                  {!nftName || !imageUrl
                    ? "Please fill in the NFT name and image URL to mint"
                    : "This will create a new NFT on the Sui blockchain (gas fees sponsored by Enoki)"}
                </p>
              </div>

              {/* Instructions */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    How to Mint
                  </h2>
                </div>

                <div className="space-y-3 text-[#C0E6FF] text-sm">
                  <p>1. Fill in the NFT details above</p>
                  <p>2. Make sure your image URL is publicly accessible</p>
                  <p>3. Click "Mint NFT" to create your NFT on Sui</p>
                  <p>4. View your NFTs in the Objects page</p>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Troubleshooting
                  </h2>
                </div>

                <div className="space-y-3 text-[#C0E6FF] text-sm">
                  <p>
                    <strong>Wallet Extension Errors:</strong> If you see
                    chrome-extension errors, try:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Disable other wallet extensions temporarily</li>
                    <li>Refresh the page</li>
                    <li>Use a different browser</li>
                  </ul>
                  <p>
                    <strong>Transaction Fails:</strong> Make sure you have
                    enough SUI for gas fees
                  </p>
                  <p>
                    <strong>BCS Encoding Errors:</strong> If you see
                    "InvalidBCSBytes" errors, the app now properly encodes
                    strings for the Move module
                  </p>
                  <p>
                    <strong>Image Not Loading:</strong> Use a publicly
                    accessible image URL (HTTPS)
                  </p>
                </div>
              </div>

              {/* Connected Account */}
              <div className="card">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Connected Account
                  </h2>
                </div>
                <p className="text-[#C0E6FF] text-sm font-mono break-all">
                  {account.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
