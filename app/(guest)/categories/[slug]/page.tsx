import { notFound } from "next/navigation";
import { CategoryDetail } from "@/components/category-detail";
import { categoryCatalog, getCategoryBySlug } from "@/lib/category-catalog";

export function generateStaticParams() {
  return categoryCatalog.map((category) => ({ slug: category.slug }));
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    q?: string;
    price?: string;
    sort?: string;
  }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return <CategoryDetail category={category} searchParams={searchParams} />;
}
