"use client";
import {
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { toBase64 } from "@mysten/sui/utils";

export function useEnokiSponsor() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const { mutateAsync: signTransaction } = useSignTransaction(); // sadece İMZA alır (execute etmez)

  return async function sponsorAndExecute(
    tx: Transaction,
    opts?: {
      network?: "testnet" | "devnet";
      allowedMoveCallTargets?: string[];
      allowedAddresses?: string[];
      chain?: string; // "sui:testnet" / "sui:devnet"
    }
  ) {
    if (!account) throw new Error("Connect wallet first");
    tx.setSender(account.address);

    // 1) onlyTransactionKind bytes üret
    const kindBytes = await tx.build({ client, onlyTransactionKind: true });

    // 2) Enoki sponsor çağrısı (backend)
    const sponsor = await fetch("/api/enoki/sponsor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionBlockKindBytes: toBase64(kindBytes),
        sender: account.address,
        network: opts?.network ?? "testnet",
        allowedMoveCallTargets: opts?.allowedMoveCallTargets,
        allowedAddresses: opts?.allowedAddresses,
      }),
    }).then((r) => r.json()); // { digest, bytes }

    if (sponsor.error) {
      throw new Error(`Enoki sponsor error: ${JSON.stringify(sponsor.error)}`);
    }

    // 3) Enoki'nin döndürdüğü bytes'ı cüzdanla İMZALA
    const txToSign = Transaction.from(sponsor.bytes);
    const { signature, reportTransactionEffects } = await signTransaction({
      transaction: txToSign,
      chain:
        opts?.chain ??
        ((opts?.network === "devnet"
          ? "sui:devnet"
          : "sui:testnet") as `${string}:${string}`),
    });

    // 4) İmzayı backend'e gönder → Enoki execute etsin
    const exec = await fetch(`/api/enoki/execute/${sponsor.digest}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature }),
    }).then((r) => r.json()); // { digest }

    if (exec.error) {
      throw new Error(`Enoki execute error: ${JSON.stringify(exec.error)}`);
    }

    // 5) Opsiyonel: sonucu bekle & wallet'a effects raporla
    const waited = await client.waitForTransaction({
      digest: exec.digest,
      options: { showRawEffects: true },
    });
    if (waited.rawEffects) {
      reportTransactionEffects(waited.rawEffects as any);
    }

    return exec.digest;
  };
}
