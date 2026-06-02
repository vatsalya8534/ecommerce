import Link from "next/link"
import Image from "next/image"

import {
  createProductAction,
  updateProductAction,
} from "@/lib/catalog-actions"
import { getAdminCategories, getAdminProducts } from "@/lib/catalog-admin"
import { hasDatabaseUrl } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"
import { ProductList } from "./product-list"

type ProductPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const inputClassName =
  "w-full rounded-2xl border border-white/55 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"

const feedbackMessages: Record<string, string> = {
  created: "Product created successfully.",
  updated: "Product updated successfully.",
  deleted: "Product deleted successfully.",
  "missing-fields": "Category, product name, a valid price, and at least one image are required.",
  "not-found": "The requested product could not be found.",
  database: "Database connection is not available.",
}

export default async function ProductAdminPage({ searchParams }: ProductPageProps) {
  const accessContext = await requireModulePermission("products", "view")
  const canManage = hasModulePermission(accessContext.permissions, "products", "action")
  const params = await searchParams
  const categories = await getAdminCategories()
  const products = await getAdminProducts()
  const editId = typeof params.edit === "string" ? params.edit : undefined
  const editProduct = products.find((product) => product.id === editId) ?? null

  const feedbackKey = ["created", "updated", "deleted"].find((key) => params[key] === "1")
  const errorKey = typeof params.error === "string" ? params.error : null
  const feedbackMessage = feedbackKey
    ? feedbackMessages[feedbackKey]
    : errorKey
      ? feedbackMessages[errorKey]
      : null

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[30px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
        <p className="text-sm font-medium text-slate-500">Product registry</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Add products, keep earlier seeded items visible, and map each one to a category.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          This page uses the same seeded catalog bootstrap as categories, so earlier product
          entries stay visible while new records can be added from the admin area.
        </p>
      </section>

      {feedbackMessage ? (
        <section
          className={`rounded-[24px] border px-5 py-4 text-sm ${
            feedbackKey
              ? "border-emerald-200 bg-emerald-50/80 text-emerald-800"
              : "border-rose-200 bg-rose-50/80 text-rose-800"
          }`}
        >
          {feedbackMessage}
        </section>
      ) : null}

      {!hasDatabaseUrl ? (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-900">
          `DATABASE_URL` is missing, so product management is currently read only.
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total products" value={String(products.length)} />
        <MetricCard label="Categories available" value={String(categories.length)} />
        <MetricCard
          label="Products in stock"
          value={String(products.filter((product) => product.stockStatus === "In stock").length)}
        />
      </section>

      {canManage ? (
        <section className="rounded-[30px] border border-white/45 bg-white/55 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">
                {editProduct ? "Edit product" : "Create product"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {editProduct
                  ? "Update a product record and keep it attached to the right category."
                  : "Create a new product and assign it to one of your existing categories."}
              </p>
            </div>
            {editProduct ? (
              <Link
                href="/admin/product"
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Clear
              </Link>
            ) : null}
          </div>

          <form
            action={editProduct ? updateProductAction : createProductAction}
            className="mt-5 grid gap-4 lg:grid-cols-2"
          >
            {editProduct ? <input type="hidden" name="id" value={editProduct.id} /> : null}

            <Field label="Product name">
              <input
                name="name"
                defaultValue={editProduct?.name ?? ""}
                className={inputClassName}
                required
              />
            </Field>

            <Field label="Category">
              <select
                name="categoryId"
                defaultValue={editProduct?.categoryId ?? ""}
                className={inputClassName}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Price">
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={editProduct ? editProduct.price.toFixed(2) : ""}
                className={inputClassName}
                required
              />
            </Field>

            <Field label="Stock status">
              <select
                name="stockStatus"
                defaultValue={editProduct?.stockStatus ?? "In stock"}
                className={inputClassName}
              >
                <option value="In stock">In stock</option>
                <option value="Limited stock available">Limited stock available</option>
                <option value="Out of stock">Out of stock</option>
              </select>
            </Field>

            <Field label="Badge">
              <input
                name="badge"
                defaultValue={editProduct?.badge ?? ""}
                className={inputClassName}
                placeholder="Best seller"
              />
            </Field>

            <Field label="Image alt text">
              <input
                name="imageAlt"
                defaultValue={editProduct?.imageAlt ?? ""}
                className={inputClassName}
              />
            </Field>

            <Field label="Background class">
              <input
                name="bgClassName"
                defaultValue={editProduct?.bgClassName ?? ""}
                className={inputClassName}
                placeholder="bg-[#eef8ff]"
              />
            </Field>

            <div className="lg:col-span-2">
              <Field label={editProduct ? "Upload new gallery images" : "Upload product images"}>
                <input
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  required={!editProduct}
                  className={`${inputClassName} file:mr-3 file:rounded-full file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white`}
                />
              </Field>
              <p className="mt-2 text-xs text-slate-500">
                {editProduct
                  ? "Upload one or more files to replace the current gallery stored in the database."
                  : "You can upload multiple images. They will be stored directly in the database."}
              </p>
              {editProduct?.imageUrls.length ? (
                <div className="mt-3 flex flex-wrap gap-3">
                  {editProduct.imageUrls.map((imageUrl, index) => (
                    <Image
                      key={imageUrl}
                      src={imageUrl}
                      alt={`${editProduct.name} image ${index + 1}`}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-2xl border border-white/60 object-cover"
                    />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-2">
              <Field label="Blurb">
                <textarea
                  name="blurb"
                  defaultValue={editProduct?.blurb ?? ""}
                  className={`${inputClassName} min-h-24 resize-y py-3`}
                />
              </Field>
            </div>

            <div className="lg:col-span-2">
              <Field label="Description">
                <textarea
                  name="description"
                  defaultValue={editProduct?.description ?? ""}
                  className={`${inputClassName} min-h-28 resize-y py-3`}
                />
              </Field>
            </div>

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {editProduct ? "Save product" : "Create product"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <ProductList products={products} canManage={canManage} />
    </div>
  )
}

function MetricCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-[28px] border border-white/45 bg-white/50 p-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  )
}
