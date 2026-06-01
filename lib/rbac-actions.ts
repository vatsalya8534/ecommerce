"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { hashPassword, normalizeEmail } from "@/lib/auth"
import { hasDatabaseUrl, prisma } from "@/lib/prisma"
import { requireModulePermission } from "@/lib/rbac"

function normalizeModuleKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizeModulePath(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  if (trimmedValue.startsWith("/")) {
    return trimmedValue
  }

  return `/${trimmedValue}`
}

function revalidateAccessPages() {
  revalidatePath("/admin")
  revalidatePath("/admin/user")
  revalidatePath("/admin/user/roles")
  revalidatePath("/admin/user/modules")
}

export async function createModuleAction(formData: FormData) {
  await requireModulePermission("modules", "action")

  if (!hasDatabaseUrl || !prisma) {
    return
  }

  const name = String(formData.get("name") ?? "").trim()
  const providedKey = String(formData.get("key") ?? "").trim()
  const key = normalizeModuleKey(providedKey || name)
  const description = String(formData.get("description") ?? "").trim()
  const path = normalizeModulePath(String(formData.get("path") ?? ""))
  const groupName = String(formData.get("groupName") ?? "Management").trim() || "Management"
  const sortOrder = Number(String(formData.get("sortOrder") ?? "0"))

  if (!name || !key) {
    throw new Error("Module name and key are required.")
  }

  await prisma.module.create({
    data: {
      name,
      key,
      description: description || null,
      path,
      groupName,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isSystem: false,
    },
  })

  revalidateAccessPages()
}

export async function updateModuleAction(formData: FormData) {
  await requireModulePermission("modules", "action")

  if (!hasDatabaseUrl || !prisma) {
    return
  }

  const id = String(formData.get("id") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const providedKey = String(formData.get("key") ?? "").trim()
  const key = normalizeModuleKey(providedKey || name)
  const description = String(formData.get("description") ?? "").trim()
  const path = normalizeModulePath(String(formData.get("path") ?? ""))
  const groupName = String(formData.get("groupName") ?? "Management").trim() || "Management"
  const sortOrder = Number(String(formData.get("sortOrder") ?? "0"))

  if (!id || !name || !key) {
    throw new Error("Module id, name, and key are required.")
  }

  const existingModule = await prisma.module.findUnique({
    where: {
      id,
    },
    select: {
      isSystem: true,
    },
  })

  if (!existingModule) {
    throw new Error("Module not found.")
  }

  if (existingModule.isSystem) {
    throw new Error("System modules cannot be edited.")
  }

  await prisma.module.update({
    where: {
      id,
    },
    data: {
      name,
      key,
      description: description || null,
      path,
      groupName,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  revalidateAccessPages()
}

export async function deleteModuleAction(formData: FormData) {
  await requireModulePermission("modules", "action")

  if (!hasDatabaseUrl || !prisma) {
    return
  }

  const id = String(formData.get("id") ?? "")

  if (!id) {
    throw new Error("Module id is required.")
  }

  const existingModule = await prisma.module.findUnique({
    where: {
      id,
    },
    select: {
      isSystem: true,
    },
  })

  if (!existingModule) {
    throw new Error("Module not found.")
  }

  if (existingModule.isSystem) {
    throw new Error("System modules cannot be deleted.")
  }

  await prisma.module.delete({
    where: {
      id,
    },
  })

  revalidateAccessPages()
}

function buildRolePermissionRows(formData: FormData, moduleIds: string[]) {
  return moduleIds
    .map((moduleId) => {
      const canView = formData.get(`view:${moduleId}`) === "on"
      const canAction = formData.get(`action:${moduleId}`) === "on"

      if (!canView && !canAction) {
        return null
      }

      return {
        moduleId,
        canView: canView || canAction,
        canAction,
      }
    })
    .filter((permission): permission is { moduleId: string; canView: boolean; canAction: boolean } => Boolean(permission))
}

export async function createRoleAction(formData: FormData) {
  await requireModulePermission("roles", "action")

  if (!hasDatabaseUrl || !prisma) {
    return
  }

  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!name) {
    throw new Error("Role name is required.")
  }

  const modules = await prisma.module.findMany({
    select: {
      id: true,
    },
  })

  const permissions = buildRolePermissionRows(
    formData,
    modules.map((moduleRecord) => moduleRecord.id),
  )

  await prisma.role.create({
    data: {
      name,
      description: description || null,
      modulePermissions: {
        create: permissions,
      },
    },
  })

  revalidateAccessPages()
}

export async function updateRoleAction(formData: FormData) {
  await requireModulePermission("roles", "action")

  if (!hasDatabaseUrl || !prisma) {
    return
  }

  const id = String(formData.get("id") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!id || !name) {
    throw new Error("Role id and name are required.")
  }

  const existingRole = await prisma.role.findUnique({
    where: {
      id,
    },
    select: {
      isSystem: true,
    },
  })

  if (!existingRole) {
    throw new Error("Role not found.")
  }

  if (existingRole.isSystem) {
    throw new Error("System roles cannot be edited.")
  }

  const modules = await prisma.module.findMany({
    select: {
      id: true,
    },
  })

  const permissions = buildRolePermissionRows(
    formData,
    modules.map((moduleRecord) => moduleRecord.id),
  )

  await prisma.role.update({
    where: {
      id,
    },
    data: {
      name,
      description: description || null,
      modulePermissions: {
        deleteMany: {},
        create: permissions,
      },
    },
  })

  revalidateAccessPages()
}

export async function deleteRoleAction(formData: FormData) {
  await requireModulePermission("roles", "action")

  if (!hasDatabaseUrl || !prisma) {
    return
  }

  const id = String(formData.get("id") ?? "")

  if (!id) {
    throw new Error("Role id is required.")
  }

  const existingRole = await prisma.role.findUnique({
    where: {
      id,
    },
    select: {
      isSystem: true,
    },
  })

  if (!existingRole) {
    throw new Error("Role not found.")
  }

  if (existingRole.isSystem) {
    throw new Error("System roles cannot be deleted.")
  }

  await prisma.role.delete({
    where: {
      id,
    },
  })

  revalidateAccessPages()
}

export async function assignUserRoleAction(formData: FormData) {
  await requireModulePermission("users", "action")

  if (!hasDatabaseUrl || !prisma) {
    return
  }

  const userId = String(formData.get("userId") ?? "")
  const roleId = String(formData.get("roleId") ?? "")

  if (!userId) {
    throw new Error("User id is required.")
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      roleId: roleId || null,
    },
  })

  revalidateAccessPages()
}

export async function createManagedUserAction(formData: FormData) {
  await requireModulePermission("users", "action")

  if (!hasDatabaseUrl || !prisma) {
    redirect("/admin/user?error=database")
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = normalizeEmail(String(formData.get("email") ?? ""))
  const password = String(formData.get("password") ?? "")
  const roleId = String(formData.get("roleId") ?? "")

  if (!name || !email || !password) {
    redirect("/admin/user?error=missing-fields")
  }

  if (name.length < 2) {
    redirect("/admin/user?error=invalid-name")
  }

  if (password.length < 8) {
    redirect("/admin/user?error=weak-password")
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  })

  if (existingUser) {
    redirect("/admin/user?error=email-exists")
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        roleId: roleId || null,
      },
    })
  } catch {
    redirect("/admin/user?error=create-failed")
  }

  revalidateAccessPages()
  redirect("/admin/user?created=1")
}
