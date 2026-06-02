import Link from "next/link"

import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/catalog-actions"
import { getAdminCategories } from "@/lib/catalog-admin"
import { hasDatabaseUrl } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"
import { CategoryList } from "./category-list"

type CategoryPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const inputClassName =
  "w-full rounded-2xl border border-white/55 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"

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
  const editId = typeof params.edit === "string" ? params.edit : undefined
  const editCategory = categories.find((category) => category.id === editId) ?? null

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
        <p className="text-sm font-medium text-slate-500">Category registry</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
          Add storefront categories and keep the seeded catalog visible.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Existing category data is loaded from the current catalog the first time this
          module runs, then all new changes are managed from here.
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
          `DATABASE_URL` is missing, so category management is currently read only.
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total categories" value={String(categories.length)} />
        <MetricCard
          label="Total products linked"
          value={String(categories.reduce((sum, category) => sum + category.productCount, 0))}
        />
        <MetricCard
          label="Categories with products"
          value={String(categories.filter((category) => category.productCount > 0).length)}
        />
      </section>

      {canManage ? (
        <section className="rounded-[30px] border border-white/45 bg-white/55 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">
                {editCategory ? "Edit category" : "Create category"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {editCategory
                  ? "Update the category metadata shown across the admin catalog."
                  : "Add a new category and make it available for product assignment."}
              </p>
            </div>
            {editCategory ? (
              <Link
                href="/admin/category"
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Clear
              </Link>
            ) : null}
          </div>

          <form
            action={editCategory ? updateCategoryAction : createCategoryAction}
            className="mt-5 grid gap-4 lg:grid-cols-2"
          >
            {editCategory ? <input type="hidden" name="id" value={editCategory.id} /> : null}

            <Field label="Name">
              <input
                name="name"
                defaultValue={editCategory?.name ?? ""}
                className={inputClassName}
                required
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                defaultValue={editCategory?.slug ?? ""}
                className={inputClassName}
                placeholder="electronics"
                required
              />
            </Field>

            <Field label="Tagline">
              <input
                name="tagline"
                defaultValue={editCategory?.tagline ?? ""}
                className={inputClassName}
              />
            </Field>

            <Field label="Chip label">
              <input
                name="chipLabel"
                defaultValue={editCategory?.chipLabel ?? ""}
                className={inputClassName}
                placeholder="Top tech"
              />
            </Field>

            <Field label="Hero title">
              <input
                name="heroTitle"
                defaultValue={editCategory?.heroTitle ?? ""}
                className={inputClassName}
              />
            </Field>

            <Field label="Image source">
              <input
                name="imageSrc"
                defaultValue={editCategory?.imageSrc ?? "/hero-home.svg"}
                className={inputClassName}
              />
            </Field>

            <Field label="Image alt text">
              <input
                name="imageAlt"
                defaultValue={editCategory?.imageAlt ?? ""}
                className={inputClassName}
              />
            </Field>

            <Field label="Surface class">
              <input
                name="surfaceClassName"
                defaultValue={editCategory?.surfaceClassName ?? ""}
                className={inputClassName}
                placeholder="bg-[#edf7ff]"
              />
            </Field>

            <Field label="Accent class">
              <input
                name="accentClassName"
                defaultValue={editCategory?.accentClassName ?? ""}
                className={inputClassName}
                placeholder="from-sky-500 via-cyan-500 to-slate-900"
              />
            </Field>

            <Field label="Stats">
              <textarea
                name="stats"
                defaultValue={editCategory?.stats.join("\n") ?? ""}
                className={`${inputClassName} min-h-28 resize-y py-3`}
                placeholder={"240+ gadgets\nFast movers\nEveryday essentials"}
              />
            </Field>

            <div className="lg:col-span-2">
              <Field label="Description">
                <textarea
                  name="description"
                  defaultValue={editCategory?.description ?? ""}
                  className={`${inputClassName} min-h-24 resize-y py-3`}
                />
              </Field>
            </div>

            <div className="lg:col-span-2">
              <Field label="Hero body">
                <textarea
                  name="heroBody"
                  defaultValue={editCategory?.heroBody ?? ""}
                  className={`${inputClassName} min-h-24 resize-y py-3`}
                />
              </Field>
            </div>

            <div className="lg:col-span-2">
              <Field label="Highlights">
                <textarea
                  name="highlights"
                  defaultValue={editCategory?.highlights.join("\n") ?? ""}
                  className={`${inputClassName} min-h-28 resize-y py-3`}
                  placeholder={"Laptops & monitors\nAudio gear\nCharging accessories"}
                />
              </Field>
            </div>

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {editCategory ? "Save category" : "Create category"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <CategoryList categories={categories} canManage={canManage} />
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
