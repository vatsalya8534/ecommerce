import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { categoryCatalog, getCategoryBySlug } from "@/lib/category-catalog";
import { filterProducts } from "@/lib/product-catalog";

type SearchParamsShape = Promise<{
  category?: string;
  q?: string;
  price?: string;
  sort?: string;
}>;

type ProductCatalogProps = {
  searchParams?: SearchParamsShape;
  lockedCategorySlug?: string;
  formAction: string;
  title?: string;
  intro?: string;
};

const priceOptions = [
  { value: "", label: "Any price" },
  { value: "under-25", label: "Under $25" },
  { value: "25-50", label: "$25 to $50" },
  { value: "50-100", label: "$50 to $100" },
  { value: "100-plus", label: "$100 and above" },
];

const sortOptions = [
  { value: "", label: "Popularity" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export async function ProductCatalog({
  searchParams,
  lockedCategorySlug,
  formAction,
  title = "Products",
  intro = "Use filters to narrow results the way shoppers expect in a marketplace flow.",
}: ProductCatalogProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activeCategorySlug = lockedCategorySlug ?? resolvedSearchParams.category ?? "";
  const activeCategory = activeCategorySlug ? getCategoryBySlug(activeCategorySlug) : undefined;
  const products = filterProducts({
    category: activeCategorySlug || undefined,
    q: resolvedSearchParams.q,
    price: resolvedSearchParams.price,
    sort: resolvedSearchParams.sort,
  });

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#71805b]">
            Product module
          </p>
          <h2 className="text-3xl font-black tracking-tight text-[#1c2212] sm:text-4xl">{title}</h2>
          <p className="max-w-3xl text-sm leading-7 text-[#566048] sm:text-base">{intro}</p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-[1.8rem] border border-[#d7ddca] bg-white shadow-[0_18px_50px_-42px_rgba(31,41,18,0.45)]">
            <div className="border-b border-[#e7ecd9] px-5 py-4">
              <div className="flex items-center gap-2 text-[#1f2814]">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-[0.18em]">Filters</span>
              </div>
            </div>

            <form action={formAction} className="space-y-5 px-5 py-5">
              {!lockedCategorySlug ? (
                <div>
                  <label htmlFor="category" className="text-sm font-semibold text-[#263118]">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={resolvedSearchParams.category ?? ""}
                    className="mt-2 w-full rounded-2xl border border-[#d6dcc9] bg-[#f8faf3] px-4 py-3 text-sm text-[#263118] outline-none transition focus:border-[#93a374]"
                  >
                    <option value="">All categories</option>
                    {categoryCatalog.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#eef4e5] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#677453]">
                    Category locked
                  </p>
                  <p className="mt-2 text-base font-bold text-[#223013]">{activeCategory?.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[#586349]">
                    This list is showing only products from this category.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="q" className="text-sm font-semibold text-[#263118]">
                  Search
                </label>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6f7c5c]" />
                  <input
                    id="q"
                    name="q"
                    defaultValue={resolvedSearchParams.q ?? ""}
                    placeholder="Search products"
                    className="w-full rounded-2xl border border-[#d6dcc9] bg-[#f8faf3] py-3 pl-11 pr-4 text-sm text-[#263118] outline-none transition focus:border-[#93a374]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="price" className="text-sm font-semibold text-[#263118]">
                  Price
                </label>
                <select
                  id="price"
                  name="price"
                  defaultValue={resolvedSearchParams.price ?? ""}
                  className="mt-2 w-full rounded-2xl border border-[#d6dcc9] bg-[#f8faf3] px-4 py-3 text-sm text-[#263118] outline-none transition focus:border-[#93a374]"
                >
                  {priceOptions.map((option) => (
                    <option key={option.value || "any"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sort" className="text-sm font-semibold text-[#263118]">
                  Sort
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={resolvedSearchParams.sort ?? ""}
                  className="mt-2 w-full rounded-2xl border border-[#d6dcc9] bg-[#f8faf3] px-4 py-3 text-sm text-[#263118] outline-none transition focus:border-[#93a374]"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value || "default"} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#2f3b1d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
                >
                  Apply filters
                </button>
                <Link
                  href={lockedCategorySlug ? formAction : "/products"}
                  className="inline-flex items-center justify-center rounded-full border border-[#cad2bb] px-5 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
                >
                  Clear filters
                </Link>
              </div>
            </form>
          </aside>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-[1.8rem] border border-[#d7ddca] bg-white px-5 py-4 shadow-[0_18px_50px_-42px_rgba(31,41,18,0.45)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#223013]">
                  {products.length} product{products.length === 1 ? "" : "s"} found
                </p>
                <p className="mt-1 text-sm text-[#5a644b]">
                  {activeCategory
                    ? `Showing only ${activeCategory.name.toLowerCase()} products.`
                    : "Showing results across all current categories."}
                </p>
              </div>
              {activeCategory ? (
                <span className="inline-flex w-fit rounded-full bg-[#eef4e5] px-4 py-2 text-sm font-semibold text-[#30411a]">
                  {activeCategory.name}
                </span>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-[1.8rem] border border-[#d7ddca] bg-white p-4 shadow-[0_18px_50px_-42px_rgba(31,41,18,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-44px_rgba(31,41,18,0.48)]"
                >
                  <div className={`relative min-h-[220px] overflow-hidden rounded-[1.4rem] ${product.bgClassName}`}>
                    <Image
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 220px"
                      className="object-contain p-5"
                    />
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#eef4e5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#30411a]">
                        {product.badge}
                      </span>
                      <span className="rounded-full bg-[#f4f6ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5e6a4d]">
                        {product.categoryName}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-black tracking-tight text-[#1b2112]">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-[#667256]">{product.brand}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#2f8f4e] px-3 py-1 font-bold text-white">
                        {product.rating}
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </span>
                      <span className="text-[#5a644b]">{product.reviews} ratings</span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-[#566048]">{product.blurb}</p>
                    <p className="mt-3 text-sm font-medium text-[#2f8f4e]">{product.delivery}</p>

                    <div className="mt-5 border-t border-[#e9eedf] pt-4">
                      <p className="text-3xl font-black tracking-tight text-[#1a2011]">
                        {product.priceLabel}
                      </p>
                      <p className="mt-1 text-sm text-[#5d6750]">Marketplace value pick</p>
                      <Link
                        href={`/categories/${product.categorySlug}`}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#2f3b1d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
                      >
                        View category details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}

              {products.length === 0 ? (
                <div className="rounded-[1.8rem] border border-dashed border-[#cfd7c1] bg-white px-6 py-12 text-center">
                  <p className="text-2xl font-black tracking-tight text-[#1b2112]">No products match these filters</p>
                  <p className="mt-3 text-sm leading-7 text-[#5a644b]">
                    Try a different search term, remove the price filter, or clear the current category restriction.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
