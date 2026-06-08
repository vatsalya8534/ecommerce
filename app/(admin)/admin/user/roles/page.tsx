import Link from "next/link"
import { CheckSquareIcon, ShieldCheckIcon, UsersIcon } from "lucide-react"

import {
  createRoleAction,
  deleteRoleAction,
  updateRoleAction,
} from "@/lib/rbac-actions"
import { hasDatabaseUrl, prisma } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"

type RolePageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const inputClassName =
  "w-full rounded-2xl border border-white/55 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"

export default async function RoleRegistryPage({ searchParams }: RolePageProps) {
  const accessContext = await requireModulePermission("roles", "view")
  const canManage = hasModulePermission(accessContext.permissions, "roles", "action")
  const params = await searchParams
  const editId = typeof params.edit === "string" ? params.edit : undefined

  const [modules, roles] =
    hasDatabaseUrl && prisma
      ? await Promise.all([
          prisma.module.findMany({
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
              name: true,
              key: true,
              description: true,
            },
          }),
          prisma.role.findMany({
            orderBy: {
              name: "asc",
            },
            select: {
              id: true,
              name: true,
              description: true,
              isSystem: true,
              users: {
                select: {
                  id: true,
                },
              },
              modulePermissions: {
                select: {
                  moduleId: true,
                  canView: true,
                  canAction: true,
                  module: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          }),
        ])
      : [[], []]

  const editRole = roles.find((role) => role.id === editId) ?? null
  const selectedPermissions = new Map(
    (editRole?.modulePermissions ?? []).map((permission) => [permission.moduleId, permission]),
  )

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[30px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Role registry</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              Build roles from the modules you want each team to access.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Every role can choose whether a module is visible and whether the user can take
              actions inside it. Action permission automatically includes view access.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatChip icon={ShieldCheckIcon} label="Roles" value={String(roles.length)} />
            <StatChip icon={UsersIcon} label="Assigned users" value={String(roles.reduce((sum, role) => sum + role.users.length, 0))} />
            <StatChip icon={CheckSquareIcon} label="Modules" value={String(modules.length)} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_1.55fr]">
        {canManage ? (
          <div className="rounded-[32px] border border-white/50 bg-white/60 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                  {editRole ? "Edit role" : "Create role"}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {editRole
                    ? "Adjust module-level permissions for this role."
                    : "Create a reusable permission bundle for users."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {editRole ? (
                  <Link
                    href="/admin/user/roles"
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear edit
                  </Link>
                ) : null}
              </div>
            </div>

            {editRole?.isSystem ? (
              <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-sm text-sky-800">
                The system Administrator role stays locked at full access.
              </div>
            ) : (
              <form
                action={editRole ? updateRoleAction : createRoleAction}
                className="mt-5 space-y-5"
              >
                {editRole ? <input type="hidden" name="id" value={editRole.id} /> : null}
                <Field label="Role name">
                  <input
                    name="name"
                    defaultValue={editRole?.name ?? ""}
                    className={inputClassName}
                    required
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    name="description"
                    defaultValue={editRole?.description ?? ""}
                    className={`${inputClassName} min-h-24 resize-y py-3`}
                  />
                </Field>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Module permissions</h4>
                      <p className="text-xs text-slate-500">
                        Choose whether this role can view a module and perform actions in it.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white/60">
                    <table className="min-w-full divide-y divide-slate-100 text-left">
                      <thead className="bg-[#0ea5e9] text-xs uppercase tracking-[0.16em] text-white">
                        <tr>
                          <th className="px-4 py-3 font-medium">Module</th>
                          <th className="px-4 py-3 font-medium">View</th>
                          <th className="px-4 py-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {modules.map((moduleRecord, index) => {
                          const selected = selectedPermissions.get(moduleRecord.id)

                          return (
                            <tr key={moduleRecord.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                              <td className="px-4 py-3">
                                <p className="font-medium text-slate-900">{moduleRecord.name}</p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {moduleRecord.description ?? moduleRecord.key}
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  name={`view:${moduleRecord.id}`}
                                  defaultChecked={selected?.canView ?? false}
                                  className="size-4 rounded border-slate-300 text-sky-600"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  name={`action:${moduleRecord.id}`}
                                  defaultChecked={selected?.canAction ?? false}
                                  className="size-4 rounded border-slate-300 text-sky-600"
                                />
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {editRole ? "Save role" : "Create role"}
                </button>
              </form>
            )}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-[32px] border border-white/50 bg-white/60 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
          <div className="border-b border-slate-100 px-5 py-5">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">All roles</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {roles.length} role(s) currently available for user assignment.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-[#0ea5e9] text-xs uppercase tracking-[0.18em] text-white">
                <tr>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Permissions</th>
                  <th className="px-5 py-3 font-medium">Assigned users</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.map((role, index) => (
                  <tr key={role.id} className={`align-top text-sm text-slate-700 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{role.name}</p>
                        {role.isSystem ? (
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                            System
                          </span>
                        ) : null}
                      </div>
                      {role.description ? (
                        <p className="mt-2 text-xs leading-5 text-slate-500">{role.description}</p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      <p>{role.modulePermissions.length} configured module(s)</p>
                      <p className="mt-2">
                        {role.modulePermissions
                          .slice(0, 3)
                          .map((permission) => permission.module.name)
                          .join(", ") || "No modules selected"}
                        {role.modulePermissions.length > 3 ? "..." : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{role.users.length}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 text-xs font-medium">
                        {canManage && !role.isSystem ? (
                          <Link
                            href={`/admin/user/roles?edit=${role.id}`}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                          >
                            Edit
                          </Link>
                        ) : null}
                        {canManage && !role.isSystem ? (
                          <form action={deleteRoleAction}>
                            <input type="hidden" name="id" value={role.id} />
                            <button type="submit" className="rounded-full border border-rose-200 px-3 py-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-700">
                              Delete
                            </button>
                          </form>
                        ) : null}
                        {role.isSystem ? <span className="text-slate-400">Locked</span> : null}
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
