
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
      description: products.description,
      price: products.price,
      currency: products.currency,
      imageUrl: products.imageUrl,
      productUrl: products.productUrl,
      brandName: brands.name,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .orderBy(desc(products.createdAt)) // consider making sort by name and another id because products can be created at the same time
    .limit(limit)
    .offset(offset);

  return rows.map((r) => ({
    ...r,
    price: r.price !== null ? Number(r.price) : null,
  }));
}