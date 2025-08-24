'use client';

import Link from 'next/link';

export default function TransactionsPage() {
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
            <h1 className="text-2xl font-semibold text-white mb-6">Recent Transactions</h1>
            
            <div className="bg-[#030F1C] rounded-xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">How to Fetch Recent Transactions</h2>
              
              <div className="space-y-4 text-[#C0E6FF]">
                <p>
                  To fetch recent transactions for the connected address, you can use the following approach:
                </p>
                
                <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                  <h3 className="text-white font-medium mb-2">Using useSuiClientQuery:</h3>
                  <pre className="text-xs overflow-auto">
{`const { data: transactions } = useSuiClientQuery(
  'queryTransactions',
  {
    filter: {
      FromAddress: account?.address
    },
    options: {
      limit: 10,
      order: 'descending'
    }
  },
  {
    enabled: !!account?.address
  }
);`}
                  </pre>
                </div>

                <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                  <h3 className="text-white font-medium mb-2">Alternative: Query by Transaction Block:</h3>
                  <pre className="text-xs overflow-auto">
{`const { data: transactions } = useSuiClientQuery(
  'queryTransactions',
  {
    filter: {
      FromOrToAddress: account?.address
    },
    options: {
      limit: 20,
      order: 'descending'
    }
  },
  {
    enabled: !!account?.address
  }
);`}
                  </pre>
                </div>

                <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                  <h3 className="text-white font-medium mb-2">Transaction Details Include:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Transaction digest</li>
                    <li>Sender address</li>
                    <li>Gas used</li>
                    <li>Status (success/failure)</li>
                    <li>Timestamp</li>
                    <li>Object changes</li>
                    <li>Events emitted</li>
                  </ul>
                </div>

                <div className="bg-[#011829] rounded-lg p-4 border border-white/5">
                  <h3 className="text-white font-medium mb-2">Example Implementation:</h3>
                  <pre className="text-xs overflow-auto">
{`// Display transaction list
{transactions?.data?.map((tx) => (
  <div key={tx.digest} className="border border-white/5 rounded-lg p-4">
    <p className="text-white font-mono text-sm">{tx.digest}</p>
    <p className="text-[#C0E6FF] text-sm">Status: {tx.effects?.status?.status}</p>
    <p className="text-[#C0E6FF] text-sm">Gas: {tx.effects?.gasUsed?.computationCost}</p>
  </div>
))}`}
                  </pre>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[#C0E6FF] text-sm">
                  This page serves as a placeholder. You can implement the actual transaction fetching 
                  functionality using the patterns shown above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
