
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { generateEmbedding } from "@/lib/embeddings/generateEmbedding";
import type { ProductSearchResult } from "./types";

type SemanticSearchRow = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  image_url: string;
  product_url: string;
  brand_name: string;
  similarity: number;
};

export async function semanticSearch(
  query: string,
  limit = 20,
  offset = 0
): Promise<ProductSearchResult[]> {
  const embedding = await generateEmbedding(query);
  const vectorLiteral = `[${embedding.join(",")}]`;

  const result = await db.execute<SemanticSearchRow>(sql`
    SELECT
      p.id, p.title, p.image_url,
      1 - (pe.text_embedding <=> ${vectorLiteral}::vector) AS similarity
    FROM product_embeddings pe
    JOIN products p ON p.id = pe.product_id
    ORDER BY pe.text_embedding <=> ${vectorLiteral}::vector
    LIMIT ${limit} OFFSET ${offset}
  `);

  return result.map((r) => ({
    id: r.id,
    title: r.title,
    imageUrl: r.image_url,
    similarity: r.similarity,
  }));
}