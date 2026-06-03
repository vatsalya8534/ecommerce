import Link from "next/link"
import { BoxesIcon, Layers3Icon, ShieldCheckIcon } from "lucide-react"

import {
  createModuleAction,
  deleteModuleAction,
  updateModuleAction,
} from "@/lib/rbac-actions"
import { hasDatabaseUrl, prisma } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"

type ModulePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const inputClassName =
  "w-full rounded-2xl border border-white/55 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"

export default async function ModuleRegistryPage({ searchParams }: ModulePageProps) {
  const accessContext = await requireModulePermission("modules", "view")
  const canManage = hasModulePermission(accessContext.permissions, "modules", "action")
  const params = await searchParams
  const editId = typeof params.edit === "string" ? params.edit : undefined

  const modules =
    hasDatabaseUrl && prisma
      ? await prisma.module.findMany({
          orderBy: [
            {
              sortOrder: "asc",
            },
            {
              name: "asc",
            },
          ],
          select: {
            id: true,
            key: true,
            name: true,
            path: true,
            description: true,
            groupName: true,
            sortOrder: true,
            isSystem: true,
            _count: {
              select: {
                rolePermissions: true,
              },
            },
          },
        })
      : []

  const editModule = modules.find((moduleRecord) => moduleRecord.id === editId) ?? null

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[30px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Module registry</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Manage the source list used by every RBAC role.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Every role reads from this list. Add new modules here first, then attach them to roles
              with view or action permission.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatChip icon={BoxesIcon} label="Modules" value={String(modules.length)} />
            <StatChip icon={ShieldCheckIcon} label="System" value={String(modules.filter((moduleRecord) => moduleRecord.isSystem).length)} />
            <StatChip icon={Layers3Icon} label="Grouped" value={String(new Set(modules.map((moduleRecord) => moduleRecord.groupName)).size)} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_1.6fr]">
        {canManage ? (
          <div className="rounded-[32px] border border-white/50 bg-white/60 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                  {editModule ? "Edit module" : "Create module"}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {editModule
                    ? "Update the module metadata used in roles and navigation."
                    : "Create a new module so roles can grant access to it."}
                </p>
              </div>
              {editModule ? (
                <Link
                  href="/admin/user/modules"
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Clear edit
                </Link>
              ) : null}
            </div>

            <form
              action={editModule ? updateModuleAction : createModuleAction}
              className="mt-5 space-y-4"
            >
              {editModule ? <input type="hidden" name="id" value={editModule.id} /> : null}
              <Field label="Name">
                <input
                  name="name"
                  defaultValue={editModule?.name ?? ""}
                  className={inputClassName}
                  required
                />
              </Field>
              <Field label="Key">
                <input
                  name="key"
                  defaultValue={editModule?.key ?? ""}
                  className={inputClassName}
                  placeholder="inventory-audit"
                  required
                />
              </Field>
              <Field label="Path">
                <input
                  name="path"
                  defaultValue={editModule?.path ?? ""}
                  className={inputClassName}
                  placeholder="/admin/inventory-audit"
                />
              </Field>
              <Field label="Description">
                <textarea
                  name="description"
                  defaultValue={editModule?.description ?? ""}
                  className={`${inputClassName} min-h-24 resize-y py-3`}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Group">
                  <input
                    name="groupName"
                    defaultValue={editModule?.groupName ?? "Management"}
                    className={inputClassName}
                  />
                </Field>
                <Field label="Sort order">
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={editModule?.sortOrder ?? 0}
                    className={inputClassName}
                  />
                </Field>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {editModule ? "Save module" : "Create module"}
              </button>
            </form>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[32px] border border-white/50 bg-white/60 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
          <div className="border-b border-slate-100 px-5 py-5">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">All modules</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {modules.length} module(s) currently available for role permission mapping.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-[#0ea5e9] text-xs uppercase tracking-[0.18em] text-white">
                <tr>
                  <th className="px-5 py-3 font-medium">Module</th>
                  <th className="px-5 py-3 font-medium">Path</th>
                  <th className="px-5 py-3 font-medium">Group</th>
                  <th className="px-5 py-3 font-medium">Roles using it</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modules.map((moduleRecord, index) => (
                  <tr key={moduleRecord.id} className={`align-top text-sm text-slate-700 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{moduleRecord.name}</p>
                        {moduleRecord.isSystem ? (
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                            System
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{moduleRecord.key}</p>
                      {moduleRecord.description ? (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {moduleRecord.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {moduleRecord.path ?? "No route"}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {moduleRecord.groupName} | order {moduleRecord.sortOrder}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {moduleRecord._count.rolePermissions}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-xs font-medium">
                        {canManage && !moduleRecord.isSystem ? (
                          <Link
                            href={`/admin/user/modules?edit=${moduleRecord.id}`}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                          >
                            Edit
                          </Link>
                        ) : null}
                        {canManage && !moduleRecord.isSystem ? (
                          <form action={deleteModuleAction}>
                            <input type="hidden" name="id" value={moduleRecord.id} />
                            <button type="submit" className="rounded-full border border-rose-200 px-3 py-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700">
                              Delete
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 px-4 py-3 shadow-[0_18px_48px_-34px_rgba(15,23,42,0.95)]">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="text-xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  )
}

