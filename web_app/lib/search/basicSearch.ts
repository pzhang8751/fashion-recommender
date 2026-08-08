
import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import type { ProductSearchResult } from "./types";

export async function basicSearch(
  limit = 20,
  offset = 0
): Promise<ProductSearchResult[]> {
  const rows = await db
    .select({
      id: products.id,
      title: products.title,
      imageUrl: products.imageUrl,
    })
    .from(products)
    .orderBy(desc(products.createdAt)) // consider making sort by name and another id because products can be created at the same time
    .limit(limit)
    .offset(offset);

  return rows.map((r) => ({
    ...r,
  }));
}