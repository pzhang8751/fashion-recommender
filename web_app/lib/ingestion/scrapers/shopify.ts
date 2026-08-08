
interface ShopifyScrapeOptions {
    domain: string;
    collectionHandle?: string;
    limit?: number;
    delayMs?: number; 
}

export async function scrapeShopifyCollection({
    domain, 
    collectionHandle = "all",
    limit = 100,
    delayMs = 750,
}: ShopifyScrapeOptions): Promise<unknown[]> {
    const allProducts:unknown[] = [];
    let page = 1; 

    while (true) {
        const url = `https://${domain}/collections/${collectionHandle}/products.json?limit=${limit}&page=${page}`;
        const res = await fetch(url, {
            headers: {"User-Agent": "FashionRecommender-Ingestion/1.0 (contact: patrick8751@gmail.com)"},
        });

        // 429 == "Too Many Requests", wait 5000 milliseconds and try again
        if (res.status == 429) {
            await sleep(5000); 
            continue; 
        }

        if (!res.ok) throw new Error(`Shopify fetch failed: ${res.status} on page ${page}`);

        const data = await res.json();
        const products = data.products ?? [];

        if (products.length === 0) break; // no more pages / products
        allProducts.push(...products);
        if (products.length < limit) break; // last page because there are no more products to load

        page += 1; 
        await sleep(delayMs); // wait seconds to not break website 
    }

    return allProducts; 
}

// function to wait 
function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms)); 
}