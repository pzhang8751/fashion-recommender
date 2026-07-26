
import { db } from "@/lib/db/index";
import { products, productEmbeddings } from "@/lib/db/schema";
import { generateEmbedding } from "../embeddings/generateEmbedding";
import { eq, isNull } from "drizzle-orm";

async function main() {
    const missing = await db.select({
        id: products.id,
        title: products.title,
        description: products.description,
        category: products.category, 
    })
    .from(products) // selects products from products table and checks from the embeddings table which product ids are missing
    .leftJoin(productEmbeddings, eq(products.id, productEmbeddings.productId))
    .where(isNull(productEmbeddings.productId));

    for (const product of missing) {
        // creates a combined description of the title, actual desc, and type of item
        // consider breaking this down into separate when matching to get better specificity? can identify what types of words match items, what types of words match description, etc. 
        const text = [product.title, product.description, product.category].filter(Boolean).join(" ");

        try {
            const embedding = await generateEmbedding(text);

            await db // look into batching when more # products increase
                .insert(productEmbeddings)
                .values({
                    productId: product.id,
                    textEmbedding: embedding
                })
                .onConflictDoUpdate({ // updates previous entry in case overlap
                    target: productEmbeddings.productId,
                    set: { textEmbedding: embedding }
                });
        } catch (err) {
            console.error(`Failed on ${product.id}, ${product.title}:`, err)
        }
    }
}

main().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1); 
})