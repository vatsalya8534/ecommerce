import { ProductCatalog } from "@/components/product-catalog";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    price?: string;
    sort?: string;
  }>;
}) {
  return (
    <ProductCatalog
      searchParams={searchParams}
      formAction="/products"
      title="Marketplace products with category-first filtering"
      intro="This products module takes inspiration from Flipkart's browse-first catalog pattern: a dedicated filter rail, clear product rows, category-aware results, and sorting that helps shoppers narrow quickly."
    />
  );
}
