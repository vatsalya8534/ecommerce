import "server-only"

import { createHash, pbkdf2Sync, randomBytes } from "node:crypto"
import { cookies } from "next/headers"

import { hasDatabaseUrl, prisma } from "@/lib/prisma"
import type { AuthUser } from "@/lib/auth-types"

export const SESSION_COOKIE_NAME = "shophub_session"
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30

type SessionWithUser = {
  id: string
  tokenHash: string
  expiresAt: Date
  user: AuthUser
}

export function createSessionToken() {
  return randomBytes(32).toString("hex")
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derivedKey = pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex")
  return `${salt}:${derivedKey}`
}

export function verifyPassword(password: string, storedPasswordHash: string) {
  const [salt, expectedHash] = storedPasswordHash.split(":")

  if (!salt || !expectedHash) {
    return false
  }

  const actualHash = pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex")
  return actualHash === expectedHash
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentSession(): Promise<SessionWithUser | null> {
  if (!hasDatabaseUrl || !prisma) {
    return null
  }

  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: {
      tokenHash: hashSessionToken(sessionToken),
    },
    select: {
      id: true,
      tokenHash: true,
      expiresAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  if (!session || session.expiresAt <= new Date()) {
    return null
  }

  return session
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getCurrentSession()
  return session?.user ?? null
}

export async function removeSessionByToken(token: string) {
  if (!hasDatabaseUrl || !prisma) {
    return
  }

  await prisma.session
    .delete({
      where: {
        tokenHash: hashSessionToken(token),
      },
    })
    .catch(() => undefined)
}

export async function createSessionForUser(userId: string) {
  if (!hasDatabaseUrl || !prisma) {
    throw new Error("DATABASE_URL is required to create sessions.")
  }

  const token = createSessionToken()

  await prisma.session.create({
    data: {
      tokenHash: hashSessionToken(token),
      userId,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    },
  })

  return token
}
