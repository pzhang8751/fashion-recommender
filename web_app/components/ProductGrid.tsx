"use client";

import { useState } from "react";
import InfiniteScrollSentinel from "./InfiniteScrollSentinel";
import { ProductSearchResult } from "@/lib/search/types";

export default function ProductGrid({
    initialItems, 
    initialQuery
} : {
    initialItems: ProductSearchResult[]; 
    initialQuery: string | null;
}) {
    const [items, setItems] = useState(initialItems);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(initialItems.length === 20);
    const [loading, setLoading] = useState(false); 

    async function fetchPage(pageNum: number) {
        setLoading(true);
        try {
            const results = await fetchProducts(pageNum, initialQuery);
            // appends new items to current list
            setItems((prev) => [...prev, ...results.items]);
            setHasMore(results.hasMore); 
        } finally {
            setLoading(false); 
        }
    }

    function handleSentinelVisible() {
        if (!hasMore || loading) return; 
        const nextPage = page + 1; 
        setPage(nextPage);
        fetchPage(nextPage); 
    }

    return (
        <div>
            {hasMore && <InfiniteScrollSentinel onVisible={handleSentinelVisible}></InfiniteScrollSentinel>}
        </div>
    )
}

// fetch more products for infinite scrolling 
async function fetchProducts(page: number, q: string | null) {
    const url = q
        ? `/api/search?q=${encodeURIComponent(q)}&page=${page}`
        : `/api/products?page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch products failed");
    const data = await res.json();
    return { 
        items: data.results as ProductSearchResult[],
        hasMore: data.hasMore as boolean
    }
}