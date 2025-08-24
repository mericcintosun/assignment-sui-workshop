"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import {
  useCurrentAccount,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import Link from "next/link";

export default function HomePage() {
  const account = useCurrentAccount();
  const network = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";

  const { data: ownedObjects } = useSuiClientQuery(
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

  return (
    <div className="min-h-screen bg-[#030F1C]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#011829]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-[#4DA2FF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🎨</span>
            </div>
            <h1 className="text-xl font-semibold text-white">
              Sui NFT Minting
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-[#C0E6FF] text-sm">
              Network: {network}
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#011829]">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex space-x-6">
            <Link
              href="/"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/objects"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Objects
            </Link>
            <Link
              href="/tx"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Transactions
            </Link>
            <Link
              href="/mint"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Mint NFT
            </Link>
            <Link
              href="/voting"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Voting
            </Link>
            <Link
              href="/guestbook"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Guestbook
            </Link>
            <Link
              href="/faucet"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Faucet
            </Link>
            <Link
              href="/tipjar"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Tip Jar
            </Link>
            <Link
              href="/settings"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Connected Account Info */}
          {account ? (
            <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">
                Connected Account
              </h2>
              <div className="bg-[#030F1C] rounded-xl p-4 border border-white/5">
                <p className="text-[#C0E6FF] text-sm font-mono break-all">
                  {account.address}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-[#011829] rounded-2xl p-6 border border-white/5 text-center">
              <p className="text-[#C0E6FF]">
                Please connect your wallet to get started
              </p>
            </div>
          )}

          {/* My NFTs */}
          {account && (
            <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">My NFTs</h2>
              {ownedObjects?.data && ownedObjects.data.length > 0 ? (
                <div className="bg-[#030F1C] rounded-xl p-4 border border-white/5">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {ownedObjects.data.slice(0, 6).map((object) => (
                      <div
                        key={object.data?.objectId}
                        className="bg-[#011829] rounded-lg p-4 border border-white/5"
                      >
                        <h3 className="text-white font-medium mb-2">
                          {object.data?.display?.data?.name || "Unnamed NFT"}
                        </h3>
                        <p className="text-[#C0E6FF] text-xs font-mono break-all mb-2">
                          {object.data?.objectId}
                        </p>
                        {object.data?.display?.data?.description && (
                          <p className="text-[#C0E6FF]/70 text-xs">
                            {object.data.display.data.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#030F1C] rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-[#C0E6FF] mb-4">
                    No NFTs found. Mint your first NFT!
                  </p>
                  <Link
                    href="/mint"
                    className="inline-flex items-center px-4 py-2 bg-[#4DA2FF] text-white rounded-xl hover:bg-[#4DA2FF]/80 transition-colors"
                  >
                    Mint NFT
                  </Link>
                </div>
              )}
              <div className="mt-4">
                <Link
                  href="/objects"
                  className="inline-flex items-center px-4 py-2 bg-[#011829] text-[#C0E6FF] rounded-xl hover:bg-[#011829]/80 transition-colors border border-white/10"
                >
                  View All Objects
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
