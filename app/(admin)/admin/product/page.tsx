import { getAdminProducts } from "@/lib/catalog-admin"
import { hasDatabaseUrl } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"
import { ProductTable } from "./product-table"

type ProductPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const feedbackMessages: Record<string, string> = {
  created: "Product created successfully.",
  updated: "Product updated successfully.",
  deleted: "Product deleted successfully.",
  database: "Database connection is not available.",
}

export default async function ProductAdminPage({ searchParams }: ProductPageProps) {
  const accessContext = await requireModulePermission("products", "view")
  const canManage = hasModulePermission(accessContext.permissions, "products", "action")
  const params = await searchParams
  const products = await getAdminProducts()

  const feedbackKey = ["created", "updated", "deleted"].find((key) => params[key] === "1")
  const errorKey = typeof params.error === "string" ? params.error : null
  const feedbackMessage = feedbackKey
    ? feedbackMessages[feedbackKey]
    : errorKey
      ? feedbackMessages[errorKey]
      : null

  return (
    <div className="flex flex-col gap-6">
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
        <MetricCard label="Total products" value={String(products.length)} />
        <MetricCard label="Active products" value={String(products.filter((product) => product.isActive).length)} />
        <MetricCard label="Featured products" value={String(products.filter((product) => product.isFeatured).length)} />
        <MetricCard label="Gallery items" value={String(products.reduce((sum, product) => sum + product.imageCount, 0))} />
      </section>

      <ProductTable products={products} canManage={canManage} />
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
