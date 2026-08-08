
import { db } from "@/lib/db";
import { products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type ProductDetails = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  productUrl: string;
  brandName: string;
};

export async function getProductById(id: string): Promise<ProductDetails | null> {
    const [result] = await db
    .select({
      id: products.id,
      title: products.title,
      description: products.description,
      imageUrl: products.imageUrl,
      productUrl: products.productUrl,
      brandName: brands.name,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.id, id))
    .limit(1);

  return result ?? null;
}