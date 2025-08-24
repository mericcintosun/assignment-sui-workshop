'use client';

import { useSuiClientContext } from '@mysten/dapp-kit';
import Link from 'next/link';
import { useState } from 'react';

const NETWORKS = [
  { id: 'localnet', name: 'Localnet', description: 'Local development network' },
  { id: 'testnet', name: 'Testnet', description: 'Sui test network' },
  { id: 'mainnet', name: 'Mainnet', description: 'Sui main network' },
];

export default function SettingsPage() {
  const { selectNetwork, network } = useSuiClientContext();
  const [selectedNetwork, setSelectedNetwork] = useState(network);

  const handleNetworkChange = (networkId: string) => {
    setSelectedNetwork(networkId);
    selectNetwork(networkId);
  };

  return (
    <div className="min-h-screen bg-[#030F1C]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#011829]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-[#C0E6FF] hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
            <h1 className="text-2xl font-semibold text-white mb-6">Settings</h1>
            
            <div className="space-y-6">
              {/* Network Switcher */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">Network Configuration</h2>
                
                <div className="space-y-3">
                  {NETWORKS.map((net) => (
                    <div
                      key={net.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedNetwork === net.id
                          ? 'border-[#4DA2FF] bg-[#4DA2FF]/10'
                          : 'border-white/5 hover:border-white/10'
                      }`}
                      onClick={() => handleNetworkChange(net.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">{net.name}</h3>
                          <p className="text-[#C0E6FF]/70 text-sm">{net.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedNetwork === net.id && (
                            <div className="w-3 h-3 bg-[#4DA2FF] rounded-full"></div>
                          )}
                          <span className="text-[#C0E6FF] text-sm">
                            {selectedNetwork === net.id ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-[#011829] rounded-lg border border-white/5">
                  <h3 className="text-white font-medium mb-2">Current Network</h3>
                  <p className="text-[#C0E6FF] text-sm capitalize">{selectedNetwork}</p>
                </div>
              </div>

              {/* Network Information */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">Network Information</h2>
                
                <div className="space-y-4 text-[#C0E6FF]">
                  <div>
                    <h3 className="text-white font-medium mb-2">Testnet</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Use CLI faucet to get test SUI: <code className="bg-[#011829] px-2 py-1 rounded">sui client faucet</code></li>
                      <li>Network URL: <code className="bg-[#011829] px-2 py-1 rounded">https://fullnode.testnet.sui.io</code></li>
                      <li>Explorer: <a href="https://suiexplorer.com/txblock?network=testnet" target="_blank" rel="noopener noreferrer" className="text-[#4DA2FF] hover:underline">Sui Explorer Testnet</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-2">Mainnet</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>No faucet available - use real SUI</li>
                      <li>Network URL: <code className="bg-[#011829] px-2 py-1 rounded">https://fullnode.mainnet.sui.io</code></li>
                      <li>Explorer: <a href="https://suiexplorer.com/txblock?network=mainnet" target="_blank" rel="noopener noreferrer" className="text-[#4DA2FF] hover:underline">Sui Explorer Mainnet</a></li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-2">Localnet</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Requires local Sui node: <code className="bg-[#011829] px-2 py-1 rounded">sui start</code></li>
                      <li>Network URL: <code className="bg-[#011829] px-2 py-1 rounded">http://127.0.0.1:9000</code></li>
                      <li>Use for local development and testing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Environment Variables */}
              <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">Environment Configuration</h2>
                
                <div className="space-y-3 text-[#C0E6FF]">
                  <p className="text-sm">The app uses the following environment variable:</p>
                  <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                    <code className="text-sm">
                      NEXT_PUBLIC_SUI_NETWORK={process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet'}
                    </code>
                  </div>
                  <p className="text-sm">
                    You can change this in your <code className="bg-[#011829] px-2 py-1 rounded">.env.local</code> file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
