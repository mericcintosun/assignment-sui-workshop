import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const res = await fetch("https://api.enoki.mystenlabs.com/v1/transaction-blocks/sponsor", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ENOKI_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        network: body.network ?? process.env.ENOKI_DEFAULT_NETWORK ?? "testnet",
        transactionBlockKindBytes: body.transactionBlockKindBytes, // base64
        sender: body.sender, // zkLogin yoksa zorunlu
        allowedMoveCallTargets: body.allowedMoveCallTargets, // opsiyonel güvenlik
        allowedAddresses: body.allowedAddresses,             // opsiyonel güvenlik
      }),
    });

    const json = await res.json();
    
    if (!res.ok) {
      console.error("Enoki sponsor error:", json);
      return NextResponse.json({ error: json }, { status: res.status });
    }
    
    return NextResponse.json(json.data); // { digest, bytes }
  } catch (error) {
    console.error("Enoki sponsor API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
