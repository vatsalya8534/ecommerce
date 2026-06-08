import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getPublicProductById, getPublicRelatedProducts } from "@/lib/catalog-admin";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getPublicProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getPublicRelatedProducts(product.id, product.categorySlug);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
