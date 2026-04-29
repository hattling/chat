import "server-only";

// Returns a summary of what is currently indexed in Pinecone:
//   - total vector count
//   - namespace breakdown
//   - sampled repo_name values (from the first page of vector IDs + fetch)
// GET /api/rag-stats

const API_VERSION = "2024-07";

async function pineconeGet<T>(url: string, apiKey: string): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Api-Key": apiKey,
      "X-Pinecone-API-Version": API_VERSION,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Pinecone ${res.status} for ${url}: ${body.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

export async function GET() {
  const apiKey = process.env.PINECONE_API_KEY?.trim();
  const indexName = process.env.PINECONE_INDEX?.trim() || "repo-chunks";
  const configuredHost = process.env.PINECONE_INDEX_HOST?.trim();

  if (!apiKey) {
    return Response.json({ error: "PINECONE_API_KEY not set" }, { status: 400 });
  }

  try {
    // Resolve index host
    let host: string;
    if (configuredHost) {
      host = configuredHost.startsWith("http") ? configuredHost : `https://${configuredHost}`;
    } else {
      const info = await pineconeGet<{ host?: string }>(
        `https://api.pinecone.io/indexes/${encodeURIComponent(indexName)}`,
        apiKey
      );
      if (!info.host) {
        return Response.json({ error: `Index '${indexName}' not found` }, { status: 404 });
      }
      host = info.host.startsWith("http") ? info.host : `https://${info.host}`;
    }

    // Index stats — gives total vector count and per-namespace breakdown
    const stats = await pineconeGet<{
      totalVectorCount?: number;
      namespaces?: Record<string, { vectorCount?: number }>;
      dimension?: number;
    }>(`${host}/describe_index_stats`, apiKey);

    // List a sample of vector IDs to inspect repo_name metadata
    // /vectors/list is supported by serverless indexes
    let sampleIds: string[] = [];
    let repoNames: string[] = [];
    try {
      const listRes = await pineconeGet<{ vectors?: Array<{ id: string }> }>(
        `${host}/vectors/list?limit=50`,
        apiKey
      );
      sampleIds = (listRes.vectors ?? []).map((v) => v.id).slice(0, 50);
    } catch {
      // /vectors/list may not be available on all index types — skip silently
    }

    if (sampleIds.length > 0) {
      try {
        const fetchRes = await fetch(`${host}/vectors/fetch?ids=${sampleIds.map(encodeURIComponent).join("&ids=")}`, {
          method: "GET",
          headers: {
            "Api-Key": apiKey,
            "X-Pinecone-API-Version": API_VERSION,
          },
        });
        if (fetchRes.ok) {
          const data = await fetchRes.json() as { vectors?: Record<string, { metadata?: Record<string, unknown> }> };
          const names = new Set<string>();
          for (const v of Object.values(data.vectors ?? {})) {
            const rn = v.metadata?.repo_name;
            if (typeof rn === "string") names.add(rn);
          }
          repoNames = [...names].sort();
        }
      } catch {
        // fetch failed — skip
      }
    }

    return Response.json({
      index: indexName,
      host,
      totalVectorCount: stats.totalVectorCount ?? 0,
      dimension: stats.dimension,
      namespaces: stats.namespaces ?? {},
      sampledRepoNames: repoNames,
      note: repoNames.length === 0 && (stats.totalVectorCount ?? 0) > 0
        ? "Vectors exist but repo_name could not be sampled — check the Pinecone console Browse tab"
        : repoNames.length === 0
        ? "Index is empty — run: python chat/ingestion/vector_db_sync.py --reindex-all"
        : null,
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
