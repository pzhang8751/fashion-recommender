import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import { semanticSearch } from "@/lib/search/semanticSearch";
import { basicSearch } from "@/lib/search/basicSearch";

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() || undefined;
  const normalizedQ = q ?? null; // tempfix? maybe convert all components to work with either null or undefined

  const initialItems = q 
    ? await semanticSearch(q, 20, 0)
    : await basicSearch(20, 0); 

  return (
    <main className="">
          <p>Hello, this is the landing page!</p>
          {/* if q is undefined defaults to "" in searchbar */}
          <SearchBar initialQuery={q}></SearchBar>
          <ProductGrid key={q ?? "all"} initialItems={initialItems} initialQuery={normalizedQ}></ProductGrid>
    </main>
  );
}
