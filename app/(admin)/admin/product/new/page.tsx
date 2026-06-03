import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import {
  DollarSignIcon,
  FileTextIcon,
  ImageIcon,
  PackageIcon,
  TruckIcon,
} from "lucide-react"

import { createProductAction, updateProductAction } from "@/lib/catalog-actions"
import { getAdminCategories, getAdminProducts } from "@/lib/catalog-admin"
import { hasDatabaseUrl } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ProductPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const productTabs = [
  { value: "identity", label: "Identity", icon: PackageIcon },
  { value: "pricing", label: "Pricing", icon: DollarSignIcon },
  { value: "media", label: "Media", icon: ImageIcon },
  { value: "copy", label: "Copy & SEO", icon: FileTextIcon },
  { value: "logistics", label: "Logistics", icon: TruckIcon },
] as const

const inputClassName =
  "w-full rounded-2xl border border-white/55 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"

const textareaClassName = `${inputClassName} min-h-24 resize-y py-3`

const feedbackMessages: Record<string, string> = {
  created: "Product created successfully.",
  updated: "Product updated successfully.",
  deleted: "Product deleted successfully.",
  "missing-fields": "Category, name, slug, SKU, brand, price, stock quantity, and at least one image are required.",
  "slug-exists": "That product slug is already in use.",
  "sku-exists": "That product SKU is already in use.",
  "invalid-pricing": "Check the pricing, compare-at price, tax, or weight values.",
  "invalid-inventory": "Check the stock quantity and order quantity values.",
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Product registry</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Add complete ecommerce product records with merchandising, inventory, and SEO details.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              This editor captures the fields shoppers and fulfillment teams usually need:
              identity, pricing, stock, gallery images, variant options, copy, and publish state.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">Products</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-950">{products.length}</p>
            </div>
            <div className="rounded-2xl border border-sky-200/80 bg-sky-50/80 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-sky-700">Categories</p>
              <p className="mt-1 text-2xl font-semibold text-sky-950">{categories.length}</p>
            </div>
          </div>
        </div>
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

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Active products" value={String(products.filter((product) => product.isActive).length)} />
        <MetricCard label="Featured products" value={String(products.filter((product) => product.isFeatured).length)} />
        <MetricCard label="In stock" value={String(products.filter((product) => product.stockStatus === "In stock").length)} />
        <MetricCard label="Gallery items" value={String(products.reduce((sum, product) => sum + product.imageCount, 0))} />
      </section>

      {canManage ? (
        <section className="grid gap-6">
          <div className="rounded-[32px] border border-white/50 bg-white/60 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{editProduct ? "Edit product" : "New product"}</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  {editProduct ? editProduct.name : "Create a product that feels retail-ready from day one."}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                  Use the tabs to move through identity, pricing, media, copy, and logistics without losing the
                  structure of a premium catalog workflow.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                  {products.length} products
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">
                  {categories.length} categories
                </span>
                {editProduct ? (
                  <Link href="/admin/product" className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:bg-slate-50">
                    Clear edit
                  </Link>
                ) : null}
              </div>
            </div>

            <Tabs defaultValue="identity" className="mt-8">
              <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <TabsList className="flex w-full min-w-max items-stretch gap-1 rounded-full border border-slate-200/80 bg-white/85 p-1.5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.95)] backdrop-blur-xl">
                  {productTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="group flex-none min-w-[132px] justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-slate-500 transition-all hover:text-white-900 data-active:bg-slate-950 data-active:text-white data-active:shadow-[0_10px_22px_-12px_rgba(15,23,42,0.85)]"
                    >
                      <tab.icon className="size-4 shrink-0 text-slate-400 transition group-data-[state=active]:text-white" />
                      <span className="truncate">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <form action={editProduct ? updateProductAction : createProductAction} className="mt-5 space-y-6">
                {editProduct ? <input type="hidden" name="id" value={editProduct.id} /> : null}

                <TabsContent value="identity" className="mt-0 outline-none">
                  <Panel
                    title="Identity"
                    description="Define how the product is named, routed, and grouped across the catalog."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Product name" required>
                        <input
                          name="name"
                          defaultValue={editProduct?.name ?? ""}
                          className={inputClassName}
                          required
                        />
                      </Field>

                      <Field
                        label="Slug"
                        hint="Used for clean URLs or future storefront routing. Leave blank to auto-generate from the name."
                      >
                        <input
                          name="slug"
                          defaultValue={editProduct?.slug ?? ""}
                          className={inputClassName}
                          placeholder="mens-wear-premium-shirt"
                        />
                      </Field>

                      <Field label="SKU" required>
                        <input
                          name="sku"
                          defaultValue={editProduct?.sku ?? ""}
                          className={inputClassName}
                          placeholder="SKU-001"
                          required
                        />
                      </Field>

                      <Field label="Category" required>
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

                      <Field label="Brand" required>
                        <input
                          name="brand"
                          defaultValue={editProduct?.brand ?? ""}
                          className={inputClassName}
                          placeholder="ShopHub Essentials"
                          required
                        />
                      </Field>

                      <Field label="Seller / vendor">
                        <input
                          name="sellerName"
                          defaultValue={editProduct?.sellerName ?? ""}
                          className={inputClassName}
                          placeholder="ShopHub Marketplace"
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <ToggleField
                        name="isActive"
                        label="Published"
                        description="When enabled, this product is treated as live and ready to be shown to shoppers."
                        defaultChecked={editProduct?.isActive ?? true}
                      />
                      <ToggleField
                        name="isFeatured"
                        label="Featured"
                        description="Highlight this product in featured placements and curated showcases."
                        defaultChecked={editProduct?.isFeatured ?? false}
                      />
                    </div>
                  </Panel>
                </TabsContent>

                <TabsContent value="pricing" className="mt-0 outline-none">
                  <Panel
                    title="Pricing & inventory"
                    description="Capture the commercial details that power pricing badges, checkout logic, and stock status."
                  >
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Price" required>
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

                      <Field label="Compare-at price">
                        <input
                          name="compareAtPrice"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={editProduct?.compareAtPrice?.toFixed(2) ?? ""}
                          className={inputClassName}
                          placeholder="129.99"
                        />
                      </Field>

                      <Field label="Tax rate %">
                        <input
                          name="taxRate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          defaultValue={editProduct?.taxRate?.toFixed(2) ?? ""}
                          className={inputClassName}
                          placeholder="18"
                        />
                      </Field>

                      <Field label="Stock quantity" required>
                        <input
                          name="stockQuantity"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={String(editProduct?.stockQuantity ?? 0)}
                          className={inputClassName}
                          required
                        />
                      </Field>

                      <Field label="Minimum order quantity" required>
                        <input
                          name="minOrderQuantity"
                          type="number"
                          min="1"
                          step="1"
                          defaultValue={String(editProduct?.minOrderQuantity ?? 1)}
                          className={inputClassName}
                          required
                        />
                      </Field>

                      <Field label="Maximum order quantity">
                        <input
                          name="maxOrderQuantity"
                          type="number"
                          min="1"
                          step="1"
                          defaultValue={editProduct?.maxOrderQuantity ?? ""}
                          className={inputClassName}
                          placeholder="10"
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

                      <Field label="Weight">
                        <input
                          name="weight"
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={editProduct?.weight?.toFixed(2) ?? ""}
                          className={inputClassName}
                          placeholder="1.25"
                        />
                      </Field>

                      <Field label="Dimensions">
                        <input
                          name="dimensions"
                          defaultValue={editProduct?.dimensions ?? ""}
                          className={inputClassName}
                          placeholder="12 x 8 x 4 cm"
                        />
                      </Field>

                      <Field label="Barcode / GTIN">
                        <input
                          name="barcode"
                          defaultValue={editProduct?.barcode ?? ""}
                          className={inputClassName}
                          placeholder="8901234567890"
                        />
                      </Field>
                    </div>
                  </Panel>
                </TabsContent>

                <TabsContent value="media" className="mt-0 outline-none">
                  <Panel
                    title="Media & merchandising"
                    description="Set the visual signals that make the product feel trustworthy in catalogs and results."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Badge">
                        <input
                          name="badge"
                          defaultValue={editProduct?.badge ?? ""}
                          className={inputClassName}
                          placeholder="Best seller"
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

                      <Field label="Image alt text">
                        <input
                          name="imageAlt"
                          defaultValue={editProduct?.imageAlt ?? ""}
                          className={inputClassName}
                          placeholder="Front angle of the product"
                        />
                      </Field>
                    </div>

                    <Field
                      label={editProduct ? "Upload new gallery images" : "Upload product images"}
                      hint="Uploading new images replaces the current gallery on edit."
                    >
                      <input
                        name="images"
                        type="file"
                        accept="image/*"
                        multiple
                        required={!editProduct}
                        className={`${inputClassName} file:mr-3 file:rounded-full file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white`}
                      />
                    </Field>

                    {editProduct?.imageUrls.length ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {editProduct.imageUrls.map((imageUrl, index) => (
                          <Image
                            key={imageUrl}
                            src={imageUrl}
                            alt={`${editProduct.name} image ${index + 1}`}
                            width={180}
                            height={180}
                            className="h-28 w-full rounded-3xl border border-white/60 object-cover shadow-sm"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-500">
                        No gallery images yet. Upload at least one product image to make the listing feel complete.
                      </div>
                    )}
                  </Panel>
                </TabsContent>

                <TabsContent value="copy" className="mt-0 outline-none">
                  <Panel
                    title="Copy & SEO"
                    description="Keep the product persuasive on the page and discoverable in search and catalog flows."
                  >
                    <Field label="Short description">
                      <textarea
                        name="blurb"
                        defaultValue={editProduct?.blurb ?? ""}
                        className={textareaClassName}
                        placeholder="A concise, shopper-friendly summary."
                      />
                    </Field>

                    <Field label="Description">
                      <textarea
                        name="description"
                        defaultValue={editProduct?.description ?? ""}
                        className={`${textareaClassName} min-h-32`}
                        placeholder="Long-form description, features, and usage notes."
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="SEO title">
                        <input
                          name="seoTitle"
                          defaultValue={editProduct?.seoTitle ?? ""}
                          className={inputClassName}
                          placeholder="Best Product Name | Brand"
                        />
                      </Field>

                      <Field label="SEO description">
                        <input
                          name="seoDescription"
                          defaultValue={editProduct?.seoDescription ?? ""}
                          className={inputClassName}
                          placeholder="Search-friendly summary for listings."
                        />
                      </Field>
                    </div>
                  </Panel>
                </TabsContent>

                <TabsContent value="logistics" className="mt-0 outline-none">
                  <Panel
                    title="Variants, logistics, and tags"
                    description="Optional data that helps with merchandising, fulfillment, and filtering."
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Color options" hint="One per line or comma separated.">
                        <textarea
                          name="colorOptions"
                          defaultValue={editProduct?.colorOptions.join("\n") ?? ""}
                          className={textareaClassName}
                          placeholder={"Black\nWhite\nBlue"}
                        />
                      </Field>

                      <Field label="Size options" hint="One per line or comma separated.">
                        <textarea
                          name="sizeOptions"
                          defaultValue={editProduct?.sizeOptions.join("\n") ?? ""}
                          className={textareaClassName}
                          placeholder={"S\nM\nL"}
                        />
                      </Field>

                      <Field label="Materials" hint="One per line or comma separated.">
                        <textarea
                          name="materials"
                          defaultValue={editProduct?.materials.join("\n") ?? ""}
                          className={textareaClassName}
                          placeholder={"Cotton\nPolyester"}
                        />
                      </Field>

                      <Field label="Tags" hint="One per line or comma separated.">
                        <textarea
                          name="tags"
                          defaultValue={editProduct?.tags.join("\n") ?? ""}
                          className={textareaClassName}
                          placeholder={"sale\nnew arrival"}
                        />
                      </Field>
                    </div>

                    <Field label="Highlights" hint="One per line or comma separated. Use short, benefit-led bullets.">
                      <textarea
                        name="highlights"
                        defaultValue={editProduct?.highlights.join("\n") ?? ""}
                        className={`${textareaClassName} min-h-28`}
                        placeholder={"Fast delivery\nPremium finish\nEasy returns"}
                      />
                    </Field>

                    <Field
                      label="Specifications"
                      hint="One per line or comma separated. Good for key-value style specs or bullets."
                    >
                      <textarea
                        name="specifications"
                        defaultValue={editProduct?.specifications.join("\n") ?? ""}
                        className={`${textareaClassName} min-h-28`}
                        placeholder={"Brand: ShopHub\nWeight: 1.2 kg\nMaterial: Cotton blend"}
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Shipping details">
                        <textarea
                          name="shippingDetails"
                          defaultValue={editProduct?.shippingDetails ?? ""}
                          className={textareaClassName}
                          placeholder="Dispatch timing, delivery window, or shipping class."
                        />
                      </Field>

                      <Field label="Care instructions">
                        <textarea
                          name="careInstructions"
                          defaultValue={editProduct?.careInstructions ?? ""}
                          className={textareaClassName}
                          placeholder="How the product should be cleaned or maintained."
                        />
                      </Field>
                    </div>

                    <Field label="Warranty">
                      <textarea
                        name="warranty"
                        defaultValue={editProduct?.warranty ?? ""}
                        className={textareaClassName}
                        placeholder="1 year manufacturer warranty."
                      />
                    </Field>
                  </Panel>
                </TabsContent>

                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    {editProduct ? "Save product" : "Create product"}
                  </button>
                  <p className="text-xs leading-5 text-slate-500">
                    Required fields are enforced on the server so the catalog stays clean, searchable, and ready for
                    operations.
                  </p>
                </div>
              </form>
            </Tabs>
          </div>

          <aside className="w-full">
            <div className="rounded-[30px] border border-white/50 bg-white/60 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Product companion</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-950">
                    {editProduct ? editProduct.name : "New product checklist"}
                  </h3>
                </div>
                {/* <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                  <SparklesIcon className="mr-1 inline size-3.5" />
                  Pro mode
                </div> */}
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
                <div className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-sm font-medium text-slate-500">Quick checklist</p>
                  {editProduct ? (
                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <SummaryRow label="Category" value={editProduct.categoryName} />
                      <SummaryRow label="Slug" value={editProduct.slug ?? "Not set"} />
                      <SummaryRow label="SKU" value={editProduct.sku ?? "Not set"} />
                      <SummaryRow label="Brand" value={editProduct.brand ?? "Not set"} />
                      <SummaryRow label="Price" value={`$${editProduct.price.toFixed(2)}`} />
                      <SummaryRow
                        label="Compare-at"
                        value={
                          typeof editProduct.compareAtPrice === "number"
                            ? `$${editProduct.compareAtPrice.toFixed(2)}`
                            : "Not set"
                        }
                      />
                      <SummaryRow label="Stock" value={`${editProduct.stockQuantity} units`} />
                      <SummaryRow label="Featured" value={editProduct.isFeatured ? "Yes" : "No"} />
                      <SummaryRow label="Published" value={editProduct.isActive ? "Yes" : "No"} />
                      <SummaryRow label="Tags" value={String(editProduct.tags.length)} />
                      <SummaryRow label="Images" value={String(editProduct.imageUrls.length)} />
                    </div>
                  ) : (
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                      <li>1. Start with identity fields: product name, SKU, brand, and category.</li>
                      <li>2. Move through pricing, inventory, and media with the tabs above.</li>
                      <li>3. Finish with copy, SEO, logistics, and tags before publishing.</li>
                      <li>4. Keep highlights short and sharp so the product stays easy to scan.</li>
                    </ul>
                  )}
                </div>

                <div className="rounded-[24px] border border-slate-100 bg-gradient-to-br from-sky-50/90 to-emerald-50/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <PackageIcon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Gallery snapshot</p>
                      <h3 className="text-base font-semibold text-slate-950">
                        {editProduct?.imageUrls.length ? `${editProduct.imageUrls.length} image(s)` : "No gallery yet"}
                      </h3>
                    </div>
                  </div>

                  {editProduct?.imageUrls.length ? (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {editProduct.imageUrls.slice(0, 4).map((imageUrl, index) => (
                        <Image
                          key={imageUrl}
                          src={imageUrl}
                          alt={`${editProduct.name} gallery ${index + 1}`}
                          width={160}
                          height={160}
                          className="h-28 w-full rounded-2xl border border-white/60 object-cover"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      Upload product photos in the Media tab to make the listing feel complete and trustworthy.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </section>
      ) : null}

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

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[28px] border border-white/45 bg-white/55 p-5 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.9)]">
      <div className="mb-5">
        <h4 className="text-base font-semibold text-slate-950">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <span className="text-right text-sm font-medium text-slate-800">{value}</span>
    </div>
  )
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="ml-1 text-rose-500">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-2 block text-xs leading-5 text-slate-500">{hint}</span> : null}
    </label>
  )
}

function ToggleField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string
  label: string
  description: string
  defaultChecked: boolean
}) {
  return (
    <label className="flex items-start gap-3 rounded-[24px] border border-white/45 bg-white/60 p-4">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 size-4 rounded border-slate-300 text-emerald-600"
      />
      <span>
        <span className="block text-sm font-medium text-slate-900">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
    </label>
  )
}
