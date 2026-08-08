import "dotenv/config";
import { brandRegistry, type BrandConfig } from "../ingestion/brandRegistry";
import { upsertBrand } from "../ingestion/upsertBrand";
import { normalizeShopifyProduct } from "../ingestion/normalize";
import { upsertProduct } from "../ingestion/upsertProduct";

async function ingestBrand(config: BrandConfig) {
    // starting scrape script
    console.log(`[${config.slug}] starting`)

    // grab brand data using brandconfig and db
    const brandId = await upsertBrand(config);
    const domain = new URL(config.websiteUrl).host;

    let rawProducts:unknown[];
    try {
        // scrape products from site
        rawProducts = await config.scrape(); 
    } catch (err) {
        console.error(`[${config.slug}] scrape failed, skipping brand`, err)
        return;
    }

    console.log(`[${config.slug}] scraped ${rawProducts.length} products`);

    let upserted = 0; 
    for (const raw of rawProducts) {
        try {
            // turn raw products into db storable items 
            const normalized = normalizeShopifyProduct(raw, domain, brandId);
            // insert db with item
            await upsertProduct(normalized);
            upserted++; 
        } catch (err) {
            console.error(`[${config.slug}] failed on one product, continuing`, err);
        }
    }

    // finished scraping and inserting
    console.log(`[${config.slug}] done — ${upserted}/${rawProducts.length} upserted`);
}

async function main() {
    const requestedSlugs = process.argv.slice(2) // allows to target specific slug handles for script

    const toRun = requestedSlugs.length
        ? brandRegistry.filter((b) => requestedSlugs.includes(b.slug)) // takes only requested slugs
        : brandRegistry; // otherwise defaults to all 

    if (requestedSlugs.length && toRun.length === 0) {
        console.error(`No brand matches: ${requestedSlugs.join(", ")}`);
        process.exit(1);
    }

    for (const config of toRun) {
        await ingestBrand(config);
    }

    console.log("ingestion complete");
    process.exit(0);
}

main().catch((err) => {
    console.error("ingestion script failed", err);
    process.exit(1); 
})