import { pgTable, uuid, text, numeric, timestamp, vector, index } from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    websiteUrl: text("website_url").notNull().unique(),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    brandId: uuid("brand_id").references(() => brands.id).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    category: text("category"),
    price: numeric("price"),
    currency: text("currency"),
    productUrl: text("product_url").notNull().unique(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const productEmbeddings = pgTable("product_embeddings", {
    productId: uuid("product_id").references(() => products.id).primaryKey(),
    textEmbedding: vector("text_embedding", { dimensions: 1536 }),
    // imageEmbedding: vector("image_embedding", { dimensions: 512 }),
}, (table) => ({
    textEmbeddingIdx: index("text_embedding_idx")
        .using("ivfflat", table.textEmbedding.op("vector_cosine_ops"))
        .with({ lists: 100 }),
}));