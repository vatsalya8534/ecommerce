import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getProductById, getRelatedProducts, productCatalog } from "@/lib/product-catalog";

export function generateStaticParams() {
  return productCatalog.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, product.categorySlug);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
