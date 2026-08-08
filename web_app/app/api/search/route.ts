
import { NextRequest, NextResponse } from "next/server";
import { semanticSearch } from "@/lib/search/semanticSearch";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const page = Math.max(0, Number(req.nextUrl.searchParams.get("page") ?? "0"));
  const limit = 20;

  if (!q) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const results = await semanticSearch(q, limit, page * limit);
    return NextResponse.json({
      results,
      page,
      hasMore: results.length === limit,
    });
  } catch (err) {
    console.error("GET /api/search failed:", err);
    return NextResponse.json({ error: "Failed to load semantic products" }, { status: 500 });
  }
}