import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Heart,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import type { ProductEntry } from "@/lib/product-catalog";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";

type ProductDetailProps = {
  product: ProductEntry;
  relatedProducts: ProductEntry[];
};

export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,245,245,0.96),_rgba(234,240,226,0.8)_38%,_#ffffff_72%)]">
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#30411a] transition hover:text-[#223013]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>

          <div className="mt-5 overflow-hidden rounded-[2rem] border border-[#dde4d1] bg-white shadow-[0_28px_90px_-52px_rgba(31,41,18,0.38)]">
            <div className="grid gap-8 p-5 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
              <div className="grid gap-4 md:grid-cols-[88px_minmax(0,1fr)]">
                <div className="order-2 flex gap-3 md:order-1 md:flex-col">
                  {product.gallery.map((image, index) => (
                    <div
                      key={`${product.id}-thumb-${index + 1}`}
                      className={`relative h-20 w-20 overflow-hidden rounded-[1.1rem] border ${index === 0 ? "border-[#30411a]" : "border-[#dce2d0]"} ${image.bgClassName}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="80px"
                        className="object-contain p-3"
                      />
                    </div>
                  ))}
                </div>

                <div
                  className={`order-1 relative h-[400px] overflow-hidden rounded-[1.8rem] ${product.bgClassName} md:order-2 lg:h-[400px]`}
                >
                  <Image
                    src={product.gallery[0].src}
                    alt={product.gallery[0].alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-contain p-8"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {product.badge ? (
                        <span className="rounded-full bg-[#eef4e5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#30411a]">
                          {product.badge}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-[#f4f6ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#5e6a4d]">
                        {product.categoryName}
                      </span>
                    </div>
                    <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-[#13180d] sm:text-5xl">
                      {product.name}
                    </h1>
                  </div>

                  <button
                    type="button"
                    aria-label="Save product"
                    suppressHydrationWarning
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d9dfcd] text-[#233015] transition hover:bg-[#f4f7ee]"
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#556048]">
                  {product.brand ? (
                    <span className="font-semibold text-[#233015]">
                      {product.brand}
                    </span>
                  ) : null}
                  {typeof product.rating === "number" &&
                  typeof product.reviews === "number" ? (
                    <>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#2f8f4e] px-3 py-1 font-bold text-white">
                        {product.rating}
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </span>
                      <span>{product.reviews} verified ratings</span>
                    </>
                  ) : null}
                  {product.stockStatus ? (
                    <span className="font-semibold text-[#2f8f4e]">
                      {product.stockStatus}
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 rounded-[1.6rem] bg-[#f7f9f4] p-5">
                  <p className="text-sm font-semibold text-[#6c765e]">
                    As low as
                  </p>
                  <div className="mt-1 flex flex-wrap items-end gap-3">
                    <p className="text-4xl font-black tracking-tight text-[#11160c]">
                      {product.priceLabel}
                    </p>
                    {product.originalPriceLabel ? (
                      <p className="pb-1 text-base text-[#79836c] line-through">
                        {product.originalPriceLabel}
                      </p>
                    ) : null}
                    {product.savingsLabel ? (
                      <p className="pb-1 text-sm font-bold text-[#2f8f4e]">
                        {product.savingsLabel}
                      </p>
                    ) : null}
                  </div>
                  {product.description ? (
                    <p className="mt-4 max-w-2xl text-lg leading-9 text-[#636d56]">
                      {product.description}
                    </p>
                  ) : null}
                </div>

                <ProductPurchasePanel product={product} />

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {product.delivery ? (
                    <div className="rounded-[1.4rem] border border-[#e4ead8] bg-[#fbfcf8] p-4">
                      <Truck className="h-5 w-5 text-[#30411a]" />
                      <p className="mt-3 text-sm font-bold text-[#1f2913]">
                        {product.delivery}
                      </p>
                    </div>
                  ) : null}
                  {product.warranty ? (
                    <div className="rounded-[1.4rem] border border-[#e4ead8] bg-[#fbfcf8] p-4">
                      <ShieldCheck className="h-5 w-5 text-[#30411a]" />
                      <p className="mt-3 text-sm font-bold text-[#1f2913]">
                        {product.warranty}
                      </p>
                    </div>
                  ) : null}
                  {product.care || product.seller ? (
                    <div className="rounded-[1.4rem] border border-[#e4ead8] bg-[#fbfcf8] p-4">
                      <RotateCcw className="h-5 w-5 text-[#30411a]" />
                      {product.seller ? (
                        <p className="mt-3 text-sm font-bold text-[#1f2913]">
                          {product.seller}
                        </p>
                      ) : null}
                      {product.care ? (
                        <p className="mt-1 text-sm text-[#667156]">
                          {product.care}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {product.highlights.length > 0 ||
                product.specifications.length > 0 ? (
                  <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    {product.highlights.length > 0 ? (
                      <div className="rounded-[1.6rem] border border-[#e4ead8] p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805b]">
                          Key highlights
                        </p>
                        <div className="mt-4 space-y-3">
                          {product.highlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="flex items-start gap-3 rounded-2xl bg-[#f5f8ef] px-4 py-3"
                            >
                              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#30411a] text-white">
                                <Check className="h-4 w-4" />
                              </span>
                              <span className="text-sm font-medium leading-6 text-[#2b341d]">
                                {highlight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {product.specifications.length > 0 ? (
                      <div className="rounded-[1.6rem] border border-[#e4ead8] p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805b]">
                          Specifications
                        </p>
                        <ul className="mt-4 space-y-3">
                          {product.specifications.map((spec, id) => (
                            <li
                              key={`${spec.label}-${id}`}
                              className="rounded-2xl bg-[#fbfcf8] px-4 py-3 text-sm leading-6 text-[#263118]"
                            >
                              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#71805b]">
                                {spec.label}
                              </span>
                              <span className="mt-1 block font-medium text-[#1f2913]">
                                {spec.value}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="mt-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805b]">
                    You may also like
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-[#13180d]">
                    Related products
                  </h2>
                </div>
                <Link
                  href={`/categories/${product.categorySlug}`}
                  className="text-sm font-semibold text-[#30411a] transition hover:text-[#223013]"
                >
                  More from {product.categoryName}
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    className="overflow-hidden rounded-[1.6rem] border border-[#dde4d1] bg-white p-4 shadow-[0_18px_50px_-44px_rgba(31,41,18,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-46px_rgba(31,41,18,0.38)]"
                  >
                    <div
                      className={`relative min-h-[180px] overflow-hidden rounded-[1.2rem] ${relatedProduct.bgClassName}`}
                    >
                      <Image
                        src={relatedProduct.imageSrc}
                        alt={relatedProduct.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-contain p-4"
                      />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-[#667256]">
                      {relatedProduct.brand}
                    </p>
                    <h3 className="mt-1 text-lg font-black tracking-tight text-[#1b2112]">
                      {relatedProduct.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-2xl font-black text-[#14190e]">
                        {relatedProduct.priceLabel}
                      </p>
                      {relatedProduct.badge ? (
                        <span className="rounded-full bg-[#eef4e5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#30411a]">
                          {relatedProduct.badge}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
