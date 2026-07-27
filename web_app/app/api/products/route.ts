
import { NextRequest, NextResponse } from "next/server";
import { basicSearch } from "@/lib/search/basicSearch"

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
    const pageParam = req.nextUrl.searchParams.get("page") ?? "0";
    const limitParam = req.nextUrl.searchParams.get("limit") ?? String(DEFAULT_LIMIT);

    const page = Number(pageParam);
    const limit = Math.min(Number(limitParam) || DEFAULT_LIMIT, MAX_LIMIT);

    // would make it so when fetching if you tried these cases it would instead change it to default behavior? 
    if (!Number.isInteger(page) || page < 0 || !Number.isFinite(limit) || limit <= 0) {
        return NextResponse.json({ error: "Invalid page or limit" }, { status: 400 })
    }

    const offset = page * limit;

    try {
        const results = await basicSearch(limit, page * limit);

        // hasMore checks that the # of results returned is less than the limit -> no more results to load vs. if == then there are more results
        return NextResponse.json({
            results, page, hasMore: results.length === limit
        });
    } catch (err) {
        console.error("GET /api/products failed:", err);
        return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
    }
}