import { VoyageAIClient } from 'voyageai';

// Voyage AI Client for embedding and rerank
const voyageClient = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY!,
});

/**
 * Generate embeddings using Voyage AI
 */
export async function generateEmbeddingVoyage(text: string): Promise<number[]> {
  const response = await voyageClient.embed({
    input: text,
    model: 'voyage-3',
  });
  
  return response.data[0].embedding;
}

/**
 * Rerank documents using Voyage AI
 */
export async function rerankDocumentsVoyage(
  query: string,
  documents: string[]
): Promise<{ index: number; relevanceScore: number }[]> {
  const response = await voyageClient.rerank({
    query,
    documents,
    model: 'rerank-2',
    topK: 10,
  });
  
  return response.data.map((item) => ({
    index: item.index,
    relevanceScore: item.relevance_score,
  }));
}

/**
 * Generate embeddings using Upstash Embedding
 * Models: 'nomic-embed-text-v1.5' or 'sentence-transformers/all-MiniLM-L6-v2'
 */
export async function generateEmbeddingUpstash(
  text: string,
  model: 'nomic' | 'minilm' = 'nomic'
): Promise<number[]> {
  const modelName = model === 'nomic' 
    ? 'nomic-embed-text-v1.5' 
    : 'sentence-transformers/all-MiniLM-L6-v2';
  
  const response = await fetch('https://api.upstash.com/v2/vector/embed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.UPSTASH_VECTOR_REST_TOKEN}`,
    },
    body: JSON.stringify({
      model: modelName,
      input: text,
    }),
  });
  
  const data = await response.json();
  return data.embedding;
}

/**
 * Main embedding function - choose between Voyage AI or Upstash
 */
export async function generateEmbedding(
  text: string,
  provider: 'voyage' | 'upstash' = 'voyage',
  upstashModel?: 'nomic' | 'minilm'
): Promise<number[]> {
  if (provider === 'voyage') {
    return generateEmbeddingVoyage(text);
  } else {
    return generateEmbeddingUpstash(text, upstashModel);
  }
}

