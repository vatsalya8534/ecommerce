import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import type { CategoryEntry } from "@/lib/category-catalog";
import { ProductCatalog } from "@/components/product-catalog";

type CategoryDetailProps = {
  category: CategoryEntry;
  searchParams?: Promise<{
    q?: string;
    price?: string;
    sort?: string;
  }>;
};

export function CategoryDetail({ category, searchParams }: CategoryDetailProps) {
  return (
    <div className={category.surfaceClassName}>
      <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#30411a] transition hover:text-[#223013]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all categories
        </Link>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_26px_80px_-48px_rgba(31,41,18,0.42)]">
          <div className={`grid gap-6 bg-gradient-to-br ${category.accentClassName} p-6 text-white lg:grid-cols-[1.05fr_0.95fr] lg:p-8`}>
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit rounded-full bg-white/16 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] backdrop-blur">
                {category.chipLabel}
              </span>
              <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
                {category.heroTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/84 sm:text-base">
                {category.heroBody}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {category.stats.map((stat) => (
                  <span
                    key={stat}
                    className="rounded-full border border-white/28 bg-white/12 px-4 py-2 text-sm font-semibold text-white/95"
                  >
                    {stat}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative min-h-[280px] overflow-hidden rounded-[1.8rem] bg-white/12">
              <Image
                src={category.imageSrc}
                alt={category.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-contain p-6"
              />
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[0.72fr_1.28fr] lg:p-8">
            {/* <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#71805b]">
                Category overview
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1c2212]">
                {category.name}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#5b644b] sm:text-base">
                {category.description}
              </p>

              <div className="mt-6 space-y-3">
                {category.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-3 rounded-2xl bg-[#f1f5ea] px-4 py-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#30411a] text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-[#2d341f]">{highlight}</span>
                  </div>
                ))}
              </div>
            </div> */}
            {/* <div className="rounded-[1.8rem] bg-[#f5f8ef] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#71805b]">
                Filtered view
              </p>
              <h3 className="mt-3 text-3xl font-black tracking-tight text-[#1c2212]">
                Products from {category.name.toLowerCase()} only
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#556048]">
                The products module below is locked to this category, so every filter stays focused on
                {` ${category.name.toLowerCase()}`} products only.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
    <ProductCatalog
      searchParams={searchParams}
      lockedCategorySlug={category.slug}
      formAction={`/categories/${category.slug}`}
      title={`${category.name} products`}
      // intro={`A Flipkart-style filtered product listing for ${category.name.toLowerCase()}, with search, price filtering, and sorting while staying inside this category only.`}
    />
    </div>
  );
}
