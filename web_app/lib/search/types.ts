
export type ProductSearchResult = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  imageUrl: string;
  productUrl: string;
  brandName: string;
  similarity?: number; 
};