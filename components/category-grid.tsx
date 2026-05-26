import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryCatalog } from "@/lib/category-catalog";

type CategoryGridProps = {
  title?: string;
  intro?: string;
  limit?: number;
};

export function CategoryGrid({
  title = "Shop by categories that match real buying intent",
  intro = "Explore the most important departments first, then jump into a focused category page with relevant products only.",
  limit,
}: CategoryGridProps) {
  const categories = typeof limit === "number" ? categoryCatalog.slice(0, limit) : categoryCatalog;

  return (
    <section className="bg-[linear-gradient(180deg,#f7f8f2_0%,#eef2e6_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#71805b]">
            Categories
          </p>
          <h2 className="text-3xl font-black tracking-tight text-[#1c2212] sm:text-4xl">
            {title}
          </h2>
          <p className="text-sm leading-7 text-[#5b644b] sm:text-base">{intro}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-[1.35rem] border border-[#d7ddca] bg-white shadow-[0_14px_36px_-30px_rgba(34,43,22,0.34)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_54px_-30px_rgba(34,43,22,0.4)]"
            >
              <div className={`relative overflow-hidden p-3 ${category.surfaceClassName}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#344225]">
                    {category.chipLabel}
                  </span>
                  <span className="text-xs font-semibold text-[#667256]">
                    {category.products.length} items
                  </span>
                </div>

                <div className={`relative mt-3 h-40 overflow-hidden rounded-[1rem] bg-gradient-to-br ${category.accentClassName}`}>
                  <Image
                    src={category.imageSrc}
                    alt={category.imageAlt}
                    fill
                    sizes="(max-width: 1280px) 50vw, 25vw"
                    className="object-contain p-4 transition duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-[1.35rem] font-black tracking-tight text-[#182010]">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5b644b]">{category.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.highlights.slice(0, 2).map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-[#eff3e7] px-3 py-1.5 text-xs font-semibold text-[#3f4a2f]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#30411a]">
                  View category
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
