"use client"

import Image from "next/image"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"

import { deleteCategoryAction } from "@/lib/catalog-actions"
import type { CategoryAdminRecord } from "@/lib/catalog-admin"
import { DataTable } from "@/components/data-table"

export function CategoryTable({
  categories,
  canManage,
}: {
  categories: CategoryAdminRecord[]
  canManage: boolean
}) {
  return (
    <DataTable
      data={categories}
      columns={getCategoryColumns(canManage)}
      title="All categories"
      description="A searchable catalog view with merchandising, hierarchy, and publishing details."
      searchKey="name"
      searchPlaceholder="Search by category name..."
      emptyMessage="No categories available."
      columnVisibilityLabel="Show columns"
      actions={
        canManage ? (
          <Link
            href="/admin/category/new"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Create category
          </Link>
        ) : null
      }
    />
  )
}

function getCategoryColumns(canManage: boolean): ColumnDef<CategoryAdminRecord>[] {
  return [
    {
      accessorKey: "imageSrc",
      header: "Image",
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
            <Image
              src={category.imageSrc}
              alt={category.imageAlt ?? category.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className="min-w-[220px]">
            <p className="text-sm font-semibold text-slate-950">{category.name}</p>
            <p className="mt-1 text-xs font-medium text-sky-600">{category.slug}</p>
            <p className="mt-1 text-xs text-slate-500">
              {category.chipLabel ?? "No chip label"} | {category.productCount} product(s)
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "tagline",
      header: "Merchandising",
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className="text-sm">
            <p className="font-semibold text-slate-900">{category.tagline ?? "No tagline"}</p>
            <p className="mt-1 text-xs text-slate-500">
              {category.heroTitle ?? "No hero title"}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "stats",
      header: "Signals",
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className="text-sm">
            <p className="font-semibold text-slate-950">
              {category.stats.length ? `${category.stats.length} stats` : "No stats"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {category.highlights.length ? `${category.highlights.length} highlights` : "No highlights"}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => <div className="text-sm">{row.original.updatedAt.toLocaleString()}</div>,
    },
    ...(canManage
      ? [
          {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
              const category = row.original

              return (
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Link
                    href={`/admin/category/new?edit=${category.id}`}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  >
                    Edit
                  </Link>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              )
            },
          } satisfies ColumnDef<CategoryAdminRecord>,
        ]
      : []),
  ]
}
