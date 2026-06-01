import "server-only"

import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
import { hasDatabaseUrl, prisma } from "@/lib/prisma"

export type SystemModuleDefinition = {
  key: string
  name: string
  path?: string
  description: string
  groupName: string
  sortOrder: number
}

export const SYSTEM_MODULES: SystemModuleDefinition[] = [
  {
    key: "dashboard",
    name: "Dashboard",
    path: "/admin/dashboard",
    description: "Store overview, KPIs, and quick admin shortcuts.",
    groupName: "Sidebar",
    sortOrder: 10,
  },
  {
    key: "orders",
    name: "Orders",
    path: "/admin/order",
    description: "Review, track, and manage customer orders.",
    groupName: "Management",
    sortOrder: 20,
  },
  {
    key: "products",
    name: "Products",
    path: "/admin/product",
    description: "Manage product catalog visibility and inventory updates.",
    groupName: "Management",
    sortOrder: 30,
  },
  {
    key: "categories",
    name: "Categories",
    path: "/admin/category",
    description: "Maintain storefront category structure and campaigns.",
    groupName: "Management",
    sortOrder: 40,
  },
  {
    key: "users",
    name: "Users",
    path: "/admin/user",
    description: "Assign roles to users and review access coverage.",
    groupName: "Management",
    sortOrder: 50,
  },
  {
    key: "roles",
    name: "Roles",
    path: "/admin/user/roles",
    description: "Create reusable roles and choose module permissions.",
    groupName: "Management",
    sortOrder: 60,
  },
  {
    key: "modules",
    name: "Modules",
    path: "/admin/user/modules",
    description: "Manage the master list of modules used by RBAC.",
    groupName: "Management",
    sortOrder: 70,
  },
  {
    key: "configuration",
    name: "Configuration",
    path: "/admin/configuration",
    description: "Store operational settings and connected services.",
    groupName: "Management",
    sortOrder: 80,
  },
]

export type PermissionSnapshot = {
  id: string
  key: string
  name: string
  path: string | null
  description: string | null
  groupName: string
  sortOrder: number
  canView: boolean
  canAction: boolean
}

export type AdminAccessContext = {
  user: {
    id: string
    name: string
    email: string
  }
  role: {
    id: string
    name: string
    description: string | null
  } | null
  permissions: PermissionSnapshot[]
}

export async function ensureRbacSetup() {
  if (!hasDatabaseUrl || !prisma) {
    return
  }

  for (const moduleDefinition of SYSTEM_MODULES) {
    await prisma.module.upsert({
      where: {
        key: moduleDefinition.key,
      },
      update: {
        name: moduleDefinition.name,
        path: moduleDefinition.path,
        description: moduleDefinition.description,
        groupName: moduleDefinition.groupName,
        sortOrder: moduleDefinition.sortOrder,
        isSystem: true,
      },
      create: {
        key: moduleDefinition.key,
        name: moduleDefinition.name,
        path: moduleDefinition.path,
        description: moduleDefinition.description,
        groupName: moduleDefinition.groupName,
        sortOrder: moduleDefinition.sortOrder,
        isSystem: true,
      },
    })
  }

  const administratorRole = await prisma.role.upsert({
    where: {
      name: "Administrator",
    },
    update: {
      description: "Full access to every RBAC-managed admin module.",
      isSystem: true,
    },
    create: {
      name: "Administrator",
      description: "Full access to every RBAC-managed admin module.",
      isSystem: true,
    },
  })

  const modules = await prisma.module.findMany({
    select: {
      id: true,
    },
  })

  for (const moduleRecord of modules) {
    await prisma.roleModulePermission.upsert({
      where: {
        roleId_moduleId: {
          roleId: administratorRole.id,
          moduleId: moduleRecord.id,
        },
      },
      update: {
        canView: true,
        canAction: true,
      },
      create: {
        roleId: administratorRole.id,
        moduleId: moduleRecord.id,
        canView: true,
        canAction: true,
      },
    })
  }
}

export async function bootstrapInitialAdminForUser(userId: string) {
  if (!hasDatabaseUrl || !prisma) {
    return
  }

  await ensureRbacSetup()

  const [assignedAdminCount, user] = await Promise.all([
    prisma.user.count({
      where: {
        roleId: {
          not: null,
        },
      },
    }),
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        roleId: true,
      },
    }),
  ])

  if (!user || user.roleId || assignedAdminCount !== 0) {
    return
  }

  const administratorRole = await prisma.role.findUnique({
    where: {
      name: "Administrator",
    },
    select: {
      id: true,
    },
  })

  if (!administratorRole) {
    return
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roleId: administratorRole.id,
    },
  })
}

export async function getUserAccessContext(userId: string): Promise<AdminAccessContext | null> {
  if (!hasDatabaseUrl || !prisma) {
    return null
  }

  await ensureRbacSetup()

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: {
        select: {
          id: true,
          name: true,
          description: true,
          modulePermissions: {
            select: {
              canView: true,
              canAction: true,
              module: {
                select: {
                  id: true,
                  key: true,
                  name: true,
                  path: true,
                  description: true,
                  groupName: true,
                  sortOrder: true,
                },
              },
            },
          },
        },
      },
    },
  })

  if (!user) {
    return null
  }

  const permissions =
    user.role?.modulePermissions
      .map((permission) => ({
        id: permission.module.id,
        key: permission.module.key,
        name: permission.module.name,
        path: permission.module.path,
        description: permission.module.description,
        groupName: permission.module.groupName,
        sortOrder: permission.module.sortOrder,
        canView: permission.canView,
        canAction: permission.canAction,
      }))
      .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name)) ?? []

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    role: user.role
      ? {
          id: user.role.id,
          name: user.role.name,
          description: user.role.description,
        }
      : null,
    permissions,
  }
}

export async function getCurrentAdminAccessContext() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  await bootstrapInitialAdminForUser(user.id)

  return getUserAccessContext(user.id)
}

export function hasModulePermission(
  permissions: PermissionSnapshot[],
  moduleKey: string,
  permission: "view" | "action" = "view",
) {
  const modulePermission = permissions.find((item) => item.key === moduleKey)

  if (!modulePermission) {
    return false
  }

  return permission === "action" ? modulePermission.canAction : modulePermission.canView
}

export function getFirstAccessibleAdminPath(permissions: PermissionSnapshot[]) {
  return (
    permissions.find((permission) => permission.canView && permission.path)?.path ??
    "/"
  )
}

export async function requireModulePermission(
  moduleKey: string,
  permission: "view" | "action" = "view",
) {
  const context = await getCurrentAdminAccessContext()

  if (!context) {
    redirect("/login")
  }

  if (!hasModulePermission(context.permissions, moduleKey, permission)) {
    redirect(getFirstAccessibleAdminPath(context.permissions))
  }

  return context
}
