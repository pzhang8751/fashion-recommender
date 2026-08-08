
import { getProductById, ProductDetails } from "@/lib/products/getProductById";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product: ProductDetails | null = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <div>
            <img src={product.imageUrl} alt={product.title} />
            <h1>{product.title}</h1>
            <p>{product.brandName}</p>
            <p>{product.description}</p>
            <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                View on site
            </a>
        </div>
    )
}