import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { digest: string } }) {
  try {
    const { signature } = await req.json();
    
    const res = await fetch(`https://api.enoki.mystenlabs.com/v1/transaction-blocks/sponsor/${params.digest}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ENOKI_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ signature }),
    });

    const json = await res.json();
    
    if (!res.ok) {
      console.error("Enoki execute error:", json);
      return NextResponse.json({ error: json }, { status: res.status });
    }
    
    return NextResponse.json(json.data); // { digest }
  } catch (error) {
    console.error("Enoki execute API error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
