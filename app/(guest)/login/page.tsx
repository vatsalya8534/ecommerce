import { redirect } from "next/navigation"

import { LoginPage } from "@/components/login-page"
import { getCurrentUser } from "@/lib/auth"
import { getFirstAccessibleAdminPath, getUserAccessContext } from "@/lib/rbac"

export default async function LoginRoutePage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string
    registered?: string
  }>
}) {
  const user = await getCurrentUser()

  if (user) {
    const accessContext = await getUserAccessContext(user.id)
    redirect(accessContext ? getFirstAccessibleAdminPath(accessContext.permissions) : "/")
  }

  const params = await searchParams

  return (
    <LoginPage
      initialMode={params.mode === "signup" ? "signup" : "login"}
      successMessage={
        params.registered
          ? "Account created successfully. Log in with your new credentials."
          : undefined
      }
    />
  )
}
