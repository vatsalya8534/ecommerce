import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { ImageIcon } from "lucide-react"

import { createCategoryAction, updateCategoryAction } from "@/lib/catalog-actions"
import { getAdminCategories } from "@/lib/catalog-admin"
import { hasDatabaseUrl } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"

type CategoryPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const inputClassName =
  "w-full rounded-2xl border border-white/55 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"

const textareaClassName = `${inputClassName} min-h-24 resize-y py-3`

const feedbackMessages: Record<string, string> = {
  created: "Category created successfully.",
  updated: "Category updated successfully.",
  deleted: "Category deleted successfully.",
  "missing-fields": "Name and slug are required.",
  "slug-exists": "That category slug is already in use.",
  "not-found": "The requested category could not be found.",
  database: "Database connection is not available.",
}

export default async function CategoryEditorPage({ searchParams }: CategoryPageProps) {
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Category editor</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Create a category that feels clean, shoppable, and ready for the catalog.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Add the metadata, imagery, and merchandising copy the storefront needs so browsing stays
              intuitive and polished.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatPill label="Categories" value={String(categories.length)} />
            {editCategory ? (
              <Link
                href="/admin/category"
                className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back to table
              </Link>
            ) : null}
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
          `DATABASE_URL` is missing, so category management is currently read only.
        </section>
      ) : null}

      {canManage ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)]">
          <div className="rounded-[32px] border border-white/50 bg-white/60 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {editCategory ? "Edit category" : "New category"}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  {editCategory ? editCategory.name : "Create a category record"}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                  Fill the fields below to shape the category card, navigation entry, and merchandising
                  experience.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                  Merchant ready
                </span>
                {editCategory ? (
                  <Link
                    href="/admin/category/new"
                    className="rounded-full border border-slate-200 px-3 py-1 text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear edit
                  </Link>
                ) : null}
              </div>
            </div>

            <form
              action={editCategory ? updateCategoryAction : createCategoryAction}
              className="mt-5 space-y-6"
            >
              {editCategory ? <input type="hidden" name="id" value={editCategory.id} /> : null}

              <FormSection
                title="Identity"
                description="These fields define the category name, routing, and how it appears in the store."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name" required>
                    <input
                      name="name"
                      defaultValue={editCategory?.name ?? ""}
                      className={inputClassName}
                      required
                    />
                  </Field>

                  <Field
                    label="Slug"
                    hint="Used for clean URLs and should remain short and readable."
                    required
                  >
                    <input
                      name="slug"
                      defaultValue={editCategory?.slug ?? ""}
                      className={inputClassName}
                      placeholder="electronics"
                      required
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
                      placeholder="Everything your team needs"
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Visuals"
                description="Set the image and surface styles used in category cards and landing sections."
              >
                <div className="grid gap-4 md:grid-cols-2">
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
                </div>

                {editCategory ? (
                  <div className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4">
                    <p className="text-sm font-medium text-slate-500">Current image</p>
                    <div className="mt-3 overflow-hidden rounded-3xl border border-white/70">
                      <Image
                        src={editCategory.imageSrc}
                        alt={editCategory.imageAlt ?? editCategory.name}
                        width={1200}
                        height={600}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  </div>
                ) : null}
              </FormSection>

              <FormSection
                title="Merchandising copy"
                description="Add the copy blocks that help the category page feel complete and scannable."
              >
                <Field label="Tagline">
                  <input
                    name="tagline"
                    defaultValue={editCategory?.tagline ?? ""}
                    className={inputClassName}
                    placeholder="Browse the essentials"
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    name="description"
                    defaultValue={editCategory?.description ?? ""}
                    className={textareaClassName}
                    placeholder="A concise description of the category."
                  />
                </Field>

                <Field label="Hero body">
                  <textarea
                    name="heroBody"
                    defaultValue={editCategory?.heroBody ?? ""}
                    className={textareaClassName}
                    placeholder="Short, persuasive category intro for the storefront."
                  />
                </Field>

                <Field
                  label="Stats"
                  hint="One per line or comma separated. These appear as quick scan points."
                >
                  <textarea
                    name="stats"
                    defaultValue={editCategory?.stats.join("\n") ?? ""}
                    className={textareaClassName}
                    placeholder={"240+ gadgets\nFast movers\nEveryday essentials"}
                  />
                </Field>

                <Field
                  label="Highlights"
                  hint="One per line or comma separated. Keep these short and benefit-led."
                >
                  <textarea
                    name="highlights"
                    defaultValue={editCategory?.highlights.join("\n") ?? ""}
                    className={textareaClassName}
                    placeholder={"Laptops & monitors\nAudio gear\nCharging accessories"}
                  />
                </Field>
              </FormSection>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {editCategory ? "Save category" : "Create category"}
                </button>
                <p className="text-xs leading-5 text-slate-500">
                  Required fields stay strict on the server so the catalog remains structured and easy to
                  navigate.
                </p>
              </div>
            </form>
          </div>

          <aside className="w-full">
            <div className="h-full w-full rounded-[30px] border border-white/50 bg-gradient-to-br from-sky-50/90 to-emerald-50/80 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <ImageIcon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Visual preview</p>
                  <h3 className="text-base font-semibold text-slate-950">
                    {editCategory ? "Current merchandising art" : "No preview yet"}
                  </h3>
                </div>
              </div>

              <div className="mt-5">
                {editCategory ? (
                  <div className="space-y-4">
                    <SummaryRow label="Slug" value={editCategory.slug} />
                    <SummaryRow label="Chip" value={editCategory.chipLabel ?? "Not set"} />
                    <SummaryRow label="Products" value={String(editCategory.productCount)} />
                    <SummaryRow label="Stats" value={String(editCategory.stats.length)} />
                    <SummaryRow label="Highlights" value={String(editCategory.highlights.length)} />
                    <div className="overflow-hidden rounded-3xl border border-white/70">
                      <Image
                        src={editCategory.imageSrc}
                        alt={editCategory.imageAlt ?? editCategory.name}
                        width={1200}
                        height={600}
                        className="h-56 w-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[340px] w-full items-center justify-center rounded-[26px] border border-dashed border-slate-200/80 bg-white/55 px-6 text-center text-sm leading-6 text-slate-600">
                    Keep the image source and surface styling aligned with the rest of the storefront so the
                    category card feels intentional and premium.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>
      ) : null}
    </div>
  )
}

function StatPill({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm shadow-[0_18px_48px_-34px_rgba(15,23,42,0.95)]">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="text-base font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function FormSection({
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
