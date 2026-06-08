"use server"

import { redirect } from "next/navigation"

import { hasDatabaseUrl, prisma } from "@/lib/prisma"
import {
  createSessionForUser,
  hashPassword,
  normalizeEmail,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth"
import {
  bootstrapInitialAdminForUser,
  getFirstAccessibleAdminPath,
  getUserAccessContext,
} from "@/lib/rbac"

export type AuthActionState = {
  error?: string
}

function sanitizeRedirectPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return null
  }

  return value
}

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasDatabaseUrl || !prisma) {
    return { error: "Set DATABASE_URL to enable sign in and sign up." }
  }

  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const redirectTarget = sanitizeRedirectPath(String(formData.get("redirect") ?? "").trim())

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const user = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
  })

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid email or password." }
  }

  await bootstrapInitialAdminForUser(user.id)

  const token = await createSessionForUser(user.id)

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  })

  await setSessionCookie(token)

  if (redirectTarget) {
    redirect(redirectTarget)
  }

  const accessContext = await getUserAccessContext(user.id)
  redirect(accessContext ? getFirstAccessibleAdminPath(accessContext.permissions) : "/")
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasDatabaseUrl || !prisma) {
    return { error: "Set DATABASE_URL to enable sign in and sign up." }
  }

  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")
  const redirectTarget = sanitizeRedirectPath(String(formData.get("redirect") ?? "").trim())

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Please fill in all fields." }
  }

  if (name.length < 2) {
    return { error: "Please enter your full name." }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  const normalizedEmail = normalizeEmail(email)
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  })

  if (existingUser) {
    return { error: "An account with this email already exists." }
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash: hashPassword(password),
      },
    })
  } catch {
    return { error: "An account with this email already exists." }
  }

  redirect(`/login?mode=login&registered=1${redirectTarget ? `&redirect=${encodeURIComponent(redirectTarget)}` : ""}`)
}
