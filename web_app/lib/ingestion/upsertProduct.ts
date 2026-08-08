import { db } from "@/lib/db/index";
import { products } from "../db/schema";
import type { NormalizedProduct } from "./normalize";

// inserts product into table
export async function upsertProduct(product: NormalizedProduct): Promise<string> {
    const [row] = await db
        .insert(products)
        .values({
            brandId: product.brandId,
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price?.toString(),
            currency: product.currency,
            productUrl: product.productUrl,
            imageUrl: product.imageUrl,
            updatedAt: new Date(),
        })
        .onConflictDoUpdate({
            target: products.productUrl,
            set: {
                title: product.title,
                description: product.description,
                category: product.category,
                price: product.price?.toString(),
                currency: product.currency,
                imageUrl: product.imageUrl,
                updatedAt: new Date(),
            },
        })
        .returning({ id: products.id });

    return row.id;
}