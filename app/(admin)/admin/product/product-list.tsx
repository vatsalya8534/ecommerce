"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useState } from "react"

import { deleteProductAction } from "@/lib/catalog-actions"
import type { ProductAdminRecord } from "@/lib/catalog-admin"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const ITEMS_PER_PAGE = 8

export function ProductList({
  products,
  canManage,
}: {
  products: ProductAdminRecord[]
  canManage: boolean
}) {
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<string | null>(products[0]?.id ?? null)

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const pageItems = products.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  const activeOpenId = pageItems.some((product) => product.id === openId)
    ? openId
    : (pageItems[0]?.id ?? null)

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/45 bg-white/55 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
      <div className="border-b border-white/40 px-5 py-5">
        <h3 className="text-xl font-semibold text-slate-950">All products</h3>
        <p className="mt-1 text-sm text-slate-500">
          {products.length} product record(s) currently available in the admin catalog.
        </p>
      </div>

      <div className="divide-y divide-white/20">
        {pageItems.map((product) => {
          const isOpen = activeOpenId === product.id

          return (
            <Collapsible
              key={product.id}
              open={isOpen}
              onOpenChange={(nextOpen) => setOpenId(nextOpen ? product.id : null)}
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/35"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="rounded-full bg-slate-900/6 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {product.stockStatus}
                      </span>
                      <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-700">
                        {product.imageCount} image{product.imageCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {product.categoryName} | {product.categorySlug}
                    </p>
                    {product.blurb ? (
                      <p className="mt-2 line-clamp-1 text-sm text-slate-500">{product.blurb}</p>
                    ) : null}
                  </div>
                  <ChevronDownIcon
                    className={`size-4 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="border-t border-white/20 bg-white/30 px-5 py-4">
                <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_auto] lg:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Description
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.description ?? product.blurb ?? "No description yet."}
                    </p>
                    {product.imageUrls.length ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {product.imageUrls.map((imageUrl, index) => (
                          <Image
                            key={imageUrl}
                            src={imageUrl}
                            alt={`${product.name} image ${index + 1}`}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-2xl border border-white/60 object-cover"
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Product details
                    </p>
                    <div className="mt-2 space-y-2 text-sm text-slate-600">
                      <p>Category: {product.categoryName}</p>
                      <p>Badge: {product.badge ?? "No badge"}</p>
                      <p>Updated: {product.updatedAt.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    {canManage ? (
                      <Link
                        href={`/admin/product?edit=${product.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-950"
                      >
                        Edit
                      </Link>
                    ) : null}
                    {canManage ? (
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="text-sm font-medium text-rose-600 hover:text-rose-700">
                          Delete
                        </button>
                      </form>
                    ) : null}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}

        {!pageItems.length ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No products available.
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/35 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {pageItems.length} of {products.length} products
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={safePage === 1}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="min-w-24 text-center font-medium text-slate-700">
            Page {safePage} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
            disabled={safePage === totalPages}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </section>
  )
}
