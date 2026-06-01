import Link from "next/link"

import {
  assignUserRoleAction,
  createManagedUserAction,
} from "@/lib/rbac-actions"
import { hasDatabaseUrl, prisma } from "@/lib/prisma"
import { hasModulePermission, requireModulePermission } from "@/lib/rbac"

type UserAccessPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const inputClassName =
  "w-full rounded-2xl border border-white/55 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"

const feedbackMessages: Record<string, string> = {
  created: "User created successfully.",
  "missing-fields": "Name, email, and password are required.",
  "invalid-name": "User name must be at least 2 characters.",
  "weak-password": "Password must be at least 8 characters.",
  "email-exists": "A user with this email already exists.",
  "create-failed": "Unable to create the user. Please try again.",
  database: "Database connection is not available.",
}

export default async function UserAccessPage({
  searchParams,
}: UserAccessPageProps) {
  const accessContext = await requireModulePermission("users", "view")
  const canManage = hasModulePermission(accessContext.permissions, "users", "action")
  const params = await searchParams
  const created = params.created === "1"
  const errorKey = typeof params.error === "string" ? params.error : null

  const [users, roles] =
    hasDatabaseUrl && prisma
      ? await Promise.all([
          prisma.user.findMany({
            orderBy: [
              {
                createdAt: "asc",
              },
            ],
            select: {
              id: true,
              name: true,
              email: true,
              lastLoginAt: true,
              createdAt: true,
              role: {
                select: {
                  id: true,
                  name: true,
                  modulePermissions: {
                    where: {
                      canView: true,
                    },
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          }),
          prisma.role.findMany({
            orderBy: {
              name: "asc",
            },
            select: {
              id: true,
              name: true,
            },
          }),
        ])
      : [[], []]

  const assignedCount = users.filter((user) => user.role).length
  const feedbackMessage = created
    ? feedbackMessages.created
    : errorKey
      ? feedbackMessages[errorKey]
      : null

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[30px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">User access</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Assign roles and review who can reach the admin modules.
            </h2>
            {/* <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              This page is the last step in the RBAC flow. Modules define what exists,
              roles define the permission bundle, and each user gets the role you assign here.
            </p> */}
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/user/roles"
              className="rounded-full border border-white/65 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              Manage roles
            </Link>
            <Link
              href="/admin/user/modules"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Manage modules
            </Link>
          </div>
        </div>
      </section>

      {feedbackMessage ? (
        <section
          className={`rounded-[24px] border px-5 py-4 text-sm ${
            created
              ? "border-emerald-200 bg-emerald-50/80 text-emerald-800"
              : "border-rose-200 bg-rose-50/80 text-rose-800"
          }`}
        >
          {feedbackMessage}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total users" value={String(users.length)} />
        <MetricCard label="Users with roles" value={String(assignedCount)} />
        <MetricCard label="Available roles" value={String(roles.length)} />
      </section>

      {canManage ? (
        <section className="rounded-[30px] border border-white/45 bg-white/55 p-5 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-slate-950">Create user</h3>
            <p className="text-sm text-slate-500">
              Add a new user account and optionally assign a role immediately.
            </p>
          </div>

          <form
            action={createManagedUserAction}
            className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
              <input
                name="name"
                className={inputClassName}
                placeholder="Jane Admin"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <input
                name="email"
                type="email"
                className={inputClassName}
                placeholder="jane@example.com"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                name="password"
                type="password"
                className={inputClassName}
                placeholder="Minimum 8 characters"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
              <select name="roleId" defaultValue="" className={inputClassName}>
                <option value="">No role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2 xl:col-span-4">
              <button
                type="submit"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Create user
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-[30px] border border-white/45 bg-white/55 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
        <div className="border-b border-white/40 px-5 py-5">
          <h3 className="text-xl font-semibold text-slate-950">User role assignments</h3>
          <p className="mt-1 text-sm text-slate-500">
            {canManage
              ? "Update a user role and save to refresh their admin access."
              : "You can review assignments, but your role does not include user access changes."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/30 text-left">
            <thead className="bg-white/35 text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Current role</th>
                <th className="px-5 py-3 font-medium">Visible modules</th>
                <th className="px-5 py-3 font-medium">Last login</th>
                <th className="px-5 py-3 font-medium">Assignment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {users.map((user) => (
                <tr key={user.id} className="align-top text-sm text-slate-700">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    {user.role ? (
                      <>
                        <span className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                          {user.role.name}
                        </span>
                        <p className="mt-2 text-xs text-slate-500">
                          {user.role.modulePermissions.length} module(s) visible
                        </p>
                      </>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-900/8 px-3 py-1 text-xs font-medium text-slate-500">
                        No role
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {user.role?.modulePermissions.length ? (
                      `${user.role.modulePermissions.length} enabled module(s)`
                    ) : (
                      "No admin modules assigned"
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {user.lastLoginAt ? user.lastLoginAt.toLocaleString() : "Never"}
                  </td>
                  <td className="px-5 py-4">
                    {canManage ? (
                      <form action={assignUserRoleAction} className="flex flex-col gap-2 sm:flex-row">
                        <input type="hidden" name="userId" value={user.id} />
                        <select
                          name="roleId"
                          defaultValue={user.role?.id ?? ""}
                          className={inputClassName}
                        >
                          <option value="">No role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-slate-500">Read only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
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
