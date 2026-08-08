import type { ProductSearchResult } from "@/lib/search/types";

export default function ProductCard({ product }: { product: ProductSearchResult }) {
  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
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
      <p className="">{product.brandName}</p>
    </a>
  );
}