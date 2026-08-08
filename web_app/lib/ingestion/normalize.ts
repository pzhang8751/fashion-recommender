// need to clean the bodyHtml from shopify to make it parseable and data uploadable 

import sanitizeHtml from "sanitize-html"

// what upsertProduct uses 
export interface NormalizedProduct {
    brandId: string;
    title: string;
    description: string | null;
    category: string | null;
    price: number | null;
    currency: string | null;
    productUrl: string;
    imageUrl: string;
}

interface ShopifyVariant {
    price: string;
}

interface ShopifyImage {
    src: string;
    position: number;
}

// the shopify object in products.json that also uses variant and image types 
interface ShopifyProduct {
    title: string;
    body_html: string;
    handle: string;
    product_type: string;
    images: ShopifyImage[];
    variants: ShopifyVariant[];
}

export function normalizeShopifyProduct(
    raw: unknown,
    domain: string,
    brandId: string,
    descriptionOverride?: (html: string) => string
): NormalizedProduct {
    const p = raw as ShopifyProduct; // convert returned entry from products.json into interface

    // sort images by position and take the one in position 1 - should already be sorted, just safety check
    const firstImage = (p.images ?? []).slice().sort((a, b) => a.position - b.position)[0];

    // filter all prices from all variants and then pick the lowest 
    const prices = (p.variants ?? [])
        .map((v) => parseFloat(v.price))
        .filter((n) => !isNaN(n));
    const price = prices.length ? Math.min(...prices) : null;

    // if there exists an override func, apply func on the body to parse it first, otherwise just use generic body
    const rawHtml = descriptionOverride
        ? descriptionOverride(p.body_html ?? "")
        : p.body_html ?? "";

    // after parsing -> clean body via sanitizeHtml
    const description = rawHtml
        ? sanitizeHtml(rawHtml,
            { allowedTags: [], allowedAttributes: {} }
        ).trim()
        : null; // return null if does not exist

    return {
        brandId,
        title: p.title.trim(),
        description,
        category: p.product_type?.trim() || null,
        price,
        currency: "USD", // hardcoded, may need to change depending on brand
        productUrl: `https://${domain}/products/${p.handle}`,
        imageUrl: firstImage?.src ?? "",
    }
}