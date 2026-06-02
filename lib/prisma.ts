import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@/lib/generated/prisma/client"
import { normalizeDatabaseUrl } from "@/lib/database-url"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL)
export const hasDatabaseUrl = Boolean(connectionString)

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: connectionString as string,
    }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}

function hasExpectedDelegates(client: PrismaClient) {
  const prismaWithDelegates = client as PrismaClient & {
    category?: unknown
    module?: unknown
    product?: unknown
    productImage?: unknown
    role?: unknown
    roleModulePermission?: unknown
  }

  return Boolean(
    prismaWithDelegates.category &&
      prismaWithDelegates.module &&
      prismaWithDelegates.product &&
      prismaWithDelegates.productImage &&
      prismaWithDelegates.role &&
      prismaWithDelegates.roleModulePermission
  )
}

export const prisma = hasDatabaseUrl
  ? globalForPrisma.prisma && hasExpectedDelegates(globalForPrisma.prisma)
    ? globalForPrisma.prisma
    : createPrismaClient()
  : null

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma
}
