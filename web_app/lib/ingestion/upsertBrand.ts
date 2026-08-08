import { db } from "@/lib/db/index";
import { brands } from "../db/schema";
import type { BrandConfig } from "./brandRegistry";

// inserts brand into table
export async function upsertBrand(config: BrandConfig): Promise<string> {
    const [row] = await db
        .insert(brands)
        .values({
            name: config.name,
            websiteUrl: config.websiteUrl,
            logoUrl: config.logoUrl,
        })
        .onConflictDoUpdate({
            target: brands.websiteUrl,
            set: { name: config.name, logoUrl: config.logoUrl },
        })
        .returning({ id: brands.id })

    return row.id; 
}