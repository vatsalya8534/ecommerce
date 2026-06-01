import ConfigurationClientPage from "./configuration-client"

import { requireModulePermission } from "@/lib/rbac"

export default async function ConfigurationPage() {
  await requireModulePermission("configuration", "view")

  return <ConfigurationClientPage />
}
