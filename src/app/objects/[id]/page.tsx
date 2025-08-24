"use client";

import { useSuiClientQuery } from "@mysten/dapp-kit";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ObjectDetailPage() {
  const params = useParams();
  const objectId = params.id as string;

  const {
    data: object,
    isLoading,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="text-[#C0E6FF]">Loading object...</div>
      </div>
    );
  }

  if (error || !object?.data) {
    return (
      <div className="min-h-screen bg-[#030F1C] flex items-center justify-center">
        <div className="bg-[#011829] rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-[#C0E6FF]">
            Object not found or error loading object
          </p>
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

  // Check if it's an NFT by looking at the content fields
  const content = objectData.content as { fields?: Record<string, unknown> };
  const fields = content?.fields;
  const isNFT =
    fields &&
    (fields.name || fields.image_url || fields.description || fields.creator);

  // Extract NFT data if it's an NFT
  const nftData = isNFT
    ? (objectData.content as { fields?: Record<string, unknown> })?.fields
    : null;

  return (
    <div className="min-h-screen bg-[#030F1C]">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#011829]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/objects"
              className="text-[#C0E6FF] hover:text-white transition-colors"
            >
              ← Back to Objects
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* NFT View */}
          {isNFT && nftData ? (
            <>
              {/* NFT Header */}
              <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {(nftData?.name as string) || "Unnamed NFT"}
                </h1>
                <p className="text-[#C0E6FF] text-sm font-mono break-all">
                  {objectId}
                </p>
              </div>

              {/* NFT Content */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* NFT Image */}
                <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    NFT Image
                  </h2>
                  <div className="aspect-square rounded-lg overflow-hidden bg-[#030F1C] border border-white/10">
                    {nftData.image_url ? (
                      <img
                        src={nftData.image_url}
                        alt={nftData.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23011829'/%3E%3Ctext x='200' y='200' text-anchor='middle' dy='.3em' fill='%23C0E6FF' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[#C0E6FF] text-lg">
                          No Image Available
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* NFT Details */}
                <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    NFT Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[#C0E6FF]/70 text-sm">Name</p>
                      <p className="text-white font-semibold text-lg">
                        {nftData.name || "Unnamed NFT"}
                      </p>
                    </div>

                    {nftData.description && (
                      <div>
                        <p className="text-[#C0E6FF]/70 text-sm">Description</p>
                        <p className="text-white">{nftData.description}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-[#C0E6FF]/70 text-sm">Creator</p>
                      <p className="text-white font-mono text-sm break-all">
                        {nftData.creator}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#C0E6FF]/70 text-sm">Created At</p>
                      <p className="text-white">
                        {nftData.created_at ||
                          nftData.mint_timestamp ||
                          "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#C0E6FF]/70 text-sm">Owner</p>
                      <p className="text-white font-mono text-sm break-all">
                        {typeof objectData.owner === "string"
                          ? objectData.owner
                          : JSON.stringify(objectData.owner)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#C0E6FF]/70 text-sm">Version</p>
                      <p className="text-white">{objectData.version}</p>
                    </div>

                    {/* Edit Button */}
                    <div className="mt-6">
                      <Link
                        href={`/objects/${objectId}/edit`}
                        className="block w-full px-4 py-3 bg-[#4DA2FF] text-white text-center rounded-xl hover:bg-[#4DA2FF]/80 transition-colors"
                      >
                        Edit NFT
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image URL */}
              {nftData.image_url && (
                <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Image URL
                  </h2>
                  <div className="bg-[#030F1C] rounded-xl p-4 border border-white/5">
                    <p className="text-[#C0E6FF] text-sm break-all">
                      {nftData.image_url}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Regular Object View
            <>
              {/* Object Header */}
              <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
                <h1 className="text-2xl font-semibold text-white mb-4">
                  {objectData.display?.data?.name || "Object Details"}
                </h1>
                <div className="bg-[#030F1C] rounded-xl p-4 border border-white/5">
                  <p className="text-[#C0E6FF] text-sm font-mono break-all">
                    {objectId}
                  </p>
                </div>
              </div>

              {/* Object Information */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Info */}
                <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Basic Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[#C0E6FF]/70 text-sm">Type</p>
                      <p className="text-white font-mono text-sm break-all">
                        {objectData.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#C0E6FF]/70 text-sm">Version</p>
                      <p className="text-white">{objectData.version}</p>
                    </div>
                    <div>
                      <p className="text-[#C0E6FF]/70 text-sm">Owner</p>
                      <p className="text-white font-mono text-sm break-all">
                        {typeof objectData.owner === "string"
                          ? objectData.owner
                          : JSON.stringify(objectData.owner)}
                      </p>
                    </div>
                    {objectData.display?.data?.description && (
                      <div>
                        <p className="text-[#C0E6FF]/70 text-sm">Description</p>
                        <p className="text-white">
                          {objectData.display.data.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Display Info */}
                {objectData.display?.data && (
                  <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
                    <h2 className="text-lg font-semibold text-white mb-4">
                      Display Information
                    </h2>
                    <div className="space-y-3">
                      {objectData.display.data.name && (
                        <div>
                          <p className="text-[#C0E6FF]/70 text-sm">Name</p>
                          <p className="text-white">
                            {objectData.display.data.name}
                          </p>
                        </div>
                      )}
                      {objectData.display.data.description && (
                        <div>
                          <p className="text-[#C0E6FF]/70 text-sm">
                            Description
                          </p>
                          <p className="text-white">
                            {objectData.display.data.description}
                          </p>
                        </div>
                      )}
                      {objectData.display.data.image_url && (
                        <div>
                          <p className="text-[#C0E6FF]/70 text-sm">Image URL</p>
                          <p className="text-white text-sm break-all">
                            {objectData.display.data.image_url}
                          </p>
                        </div>
                      )}
                      {objectData.display.data.project_url && (
                        <div>
                          <p className="text-[#C0E6FF]/70 text-sm">
                            Project URL
                          </p>
                          <p className="text-white text-sm break-all">
                            {objectData.display.data.project_url}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Object Content */}
              {objectData.content && (
                <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Object Content
                  </h2>
                  <div className="bg-[#030F1C] rounded-xl p-4 border border-white/5">
                    <pre className="text-[#C0E6FF] text-xs overflow-auto max-h-96">
                      {JSON.stringify(objectData.content, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Raw Object Data */}
          <div className="bg-[#011829] rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">
              Raw Object Data
            </h2>
            <div className="bg-[#030F1C] rounded-xl p-4 border border-white/5">
              <pre className="text-[#C0E6FF] text-xs overflow-auto max-h-96">
                {JSON.stringify(objectData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
