"use client"

import Image from "next/image"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"

import { deleteProductAction } from "@/lib/catalog-actions"
import type { ProductAdminRecord } from "@/lib/catalog-admin"
import { DataTable } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"

export function ProductTable({
  products,
  canManage,
}: {
  products: ProductAdminRecord[]
  canManage: boolean
}) {
  const columns = getProductColumns(canManage)

  return (
    <DataTable
      data={products}
      columns={columns}
      title="All products"
      description="A searchable catalog view with product, pricing, inventory, and publish state details."
      searchKey="name"
      searchPlaceholder="Search by product name..."
      emptyMessage="No products available."
      columnVisibilityLabel="Show columns"
      actions={
        canManage ? (
          <Link
            href="/admin/product/new"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add product
          </Link>
        ) : null
      }
    />
  )
}

function getProductColumns(canManage: boolean): ColumnDef<ProductAdminRecord>[] {
  return [
    {
      accessorKey: "imageSrc",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
            <Image
              src={product.imageSrc}
              alt={product.imageAlt ?? product.name}
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
      header: "Product",
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="min-w-[220px]">
            <p className="text-sm font-semibold text-slate-950">{product.name}</p>
            <p className="mt-1 text-xs font-medium text-sky-600">{product.sku ?? "Not set"}</p>
            <p className="mt-1 text-xs text-slate-500">
              {product.brand ?? "No brand"} | {product.slug ?? "No slug"}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => (
        <div className="text-sm">
          <p className="font-semibold text-slate-900">{row.original.categoryName}</p>
          <p className="mt-1 text-xs text-slate-500">{row.original.categorySlug}</p>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Pricing",
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="text-sm">
            <p className="font-semibold text-slate-950">${product.price.toFixed(2)}</p>
            <p className="mt-1 text-xs text-slate-500">
              Compare-at: {typeof product.compareAtPrice === "number" ? `$${product.compareAtPrice.toFixed(2)}` : "-"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Tax: {typeof product.taxRate === "number" ? `${product.taxRate}%` : "-"}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "stockQuantity",
      header: "Inventory",
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="text-sm">
            <p className="font-semibold text-slate-950">{product.stockQuantity} units</p>
            <p className="mt-1 text-xs text-slate-500">{product.stockStatus}</p>
            <p className="mt-1 text-xs text-slate-500">
              Min {product.minOrderQuantity}
              {product.maxOrderQuantity !== null ? ` / Max ${product.maxOrderQuantity}` : ""}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold ${
                product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {product.isActive ? "ACTIVE" : "DRAFT"}
            </Badge>
            <Badge
              variant="outline"
              className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold ${
                product.isFeatured ? "bg-fuchsia-100 text-fuchsia-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {product.isFeatured ? "FEATURED" : "STANDARD"}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.updatedAt.toLocaleString()}
        </div>
      ),
    },
    ...(canManage
      ? [
          {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
              const product = row.original

              return (
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Link
                    href={`/admin/product/new?edit=${product.id}`}
                    className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  >
                    Edit
                  </Link>
                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      suppressHydrationWarning
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              )
            },
          } satisfies ColumnDef<ProductAdminRecord>,
        ]
      : []),
  ]
}
