import type { ProductSearchResult } from "@/lib/search/types";
import Link from "next/link";

export default function ProductCard({ product }: { product: ProductSearchResult }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block break-inside-avoid mb-4 group"
    >
      <div className="overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover"
        />
      </div>
      <p>{product.title}</p>
    </Link>
  );
}