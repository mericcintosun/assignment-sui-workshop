"use client";

import "@mysten/dapp-kit/dist/index.css";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode, useEffect } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  const { networkConfig } = useMemo(
    () =>
      createNetworkConfig({
        localnet: { url: getFullnodeUrl("localnet") },
        testnet: { url: getFullnodeUrl("testnet") },
        mainnet: { url: getFullnodeUrl("mainnet") },
      }),
    []
  );

  const defaultNetwork =
    (process.env.NEXT_PUBLIC_SUI_NETWORK as
      | "localnet"
      | "testnet"
      | "mainnet") ?? "testnet";

  // Handle wallet extension conflicts
  useEffect(() => {
    // Suppress console errors from wallet extensions
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    console.error = (...args) => {
      const message = args[0]?.toString() || "";
      if (
        message.includes("chrome-extension") ||
        message.includes("Failed to load resource") ||
        message.includes("message port closed") ||
        message.includes("content_script_bundle.js") ||
        message.includes("inpage.js") ||
        message.includes("Sui Wallet") ||
        message.includes("sui-wallet") ||
        message.includes("wallet-adapter") ||
        message.includes("Failed to execute") ||
        message.includes("Extension context invalidated")
      ) {
        return; // Suppress wallet extension conflicts
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args[0]?.toString() || "";
      if (
        message.includes("chrome-extension") ||
        message.includes("Sui Wallet") ||
        message.includes("sui-wallet") ||
        message.includes("wallet-adapter") ||
        message.includes("Attempting initialization")
      ) {
        return; // Suppress wallet extension conflicts
      }
      originalWarn.apply(console, args);
    };

    // Also suppress some noisy logs
    console.log = (...args) => {
      const message = args[0]?.toString() || "";
      if (
        message.includes("Attempting initialization") ||
        message.includes("content_script_bundle.js") ||
        message.includes("Sui Wallet") ||
        message.includes("sui-wallet")
      ) {
        return; // Suppress noisy initialization logs
      }
      originalLog.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={defaultNetwork}
      >
        <WalletProvider
          autoConnect
          preferredWallets={["Sui Wallet"]}
          adapters={[]}
          autoConnectTimeout={10000}
        >
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
