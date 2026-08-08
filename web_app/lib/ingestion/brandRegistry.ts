import { scrapeShopifyCollection } from "./scrapers/shopify";

export interface BrandConfig {
    slug: string; // unique identifier? 
    name: string;
    websiteUrl: string; 
    logoUrl?: string; 
    sourcePlatform: "shopify" | "custom";
    scrape: () => Promise<unknown[]>;
}

// keep all brands here 
export const brandRegistry: BrandConfig[] = [
    {
        slug: "sundae-school",
        name: "Sundae School",
        websiteUrl: "https://sundae.school",
        sourcePlatform: "shopify",
        scrape: () => scrapeShopifyCollection({domain: "sundae.school", collectionHandle:"all"})
    },
];