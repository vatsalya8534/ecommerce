import { getAdminCategories } from "@/lib/catalog-admin"
import { hasDatabaseUrl } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"

import { CategoryTable } from "./category-table"

type CategoryPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const feedbackMessages: Record<string, string> = {
  created: "Category created successfully.",
  updated: "Category updated successfully.",
  deleted: "Category deleted successfully.",
  "missing-fields": "Name and slug are required.",
  "slug-exists": "That category slug is already in use.",
  "not-found": "The requested category could not be found.",
  database: "Database connection is not available.",
}

export default async function CategoryAdminPage({ searchParams }: CategoryPageProps) {
  const accessContext = await requireModulePermission("categories", "view")
  const canManage = hasModulePermission(accessContext.permissions, "categories", "action")
  const params = await searchParams
  const categories = await getAdminCategories()

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
          `DATABASE_URL` is missing, so category management is currently read only.
        </section>
      ) : null}

      <CategoryTable categories={categories} canManage={canManage} />
    </div>
  )
}
