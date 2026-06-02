"use client"

import Link from "next/link"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { deleteCategoryAction } from "@/lib/catalog-actions"
import type { CategoryAdminRecord } from "@/lib/catalog-admin"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const ITEMS_PER_PAGE = 6

export function CategoryList({
  categories,
  canManage,
}: {
  categories: CategoryAdminRecord[]
  canManage: boolean
}) {
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState<string | null>(categories[0]?.id ?? null)

  const totalPages = Math.max(1, Math.ceil(categories.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const pageItems = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage)
    }
  }, [page, safePage])

  useEffect(() => {
    if (pageItems.length === 0) {
      setOpenId(null)
      return
    }

    if (!pageItems.some((category) => category.id === openId)) {
      setOpenId(pageItems[0]?.id ?? null)
    }
  }, [openId, pageItems])

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/45 bg-white/55 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
      <div className="border-b border-white/40 px-5 py-5">
        <h3 className="text-xl font-semibold text-slate-950">All categories</h3>
        <p className="mt-1 text-sm text-slate-500">
          {categories.length} category record(s) currently available for product mapping.
        </p>
      </div>

      <div className="divide-y divide-white/20">
        {pageItems.map((category) => {
          const isOpen = openId === category.id

          return (
            <Collapsible
              key={category.id}
              open={isOpen}
              onOpenChange={(nextOpen) => setOpenId(nextOpen ? category.id : null)}
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/35"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{category.name}</p>
                      <span className="rounded-full bg-slate-900/6 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                        {category.productCount} product(s)
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{category.slug}</p>
                    {category.tagline ? (
                      <p className="mt-2 line-clamp-1 text-sm text-slate-500">{category.tagline}</p>
                    ) : null}
                  </div>
                  <ChevronDownIcon
                    className={`size-4 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent className="border-t border-white/20 bg-white/30 px-5 py-4">
                <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Description
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {category.description ?? category.heroBody ?? "No description yet."}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Highlights
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {category.highlights.length
                        ? category.highlights.join(" | ")
                        : "No highlights yet"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Stats
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {category.stats.length ? category.stats.join(" | ") : "No stats yet"}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      Updated {category.updatedAt.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    {canManage ? (
                      <Link
                        href={`/admin/category?edit=${category.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-950"
                      >
                        Edit
                      </Link>
                    ) : null}
                    {canManage ? (
                      <form action={deleteCategoryAction}>
                        <input type="hidden" name="id" value={category.id} />
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
            No categories available.
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/35 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {pageItems.length} of {categories.length} categories
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
