import EmployeeProfileDataTable from "./order-data-table"

import { hasModulePermission, requireModulePermission } from "@/lib/rbac"

const EmployeeProfilePage = async () => {
  const accessContext = await requireModulePermission("products", "view")
  const canManage = hasModulePermission(accessContext.permissions, "products", "action")
  const records: never[] = []

  return (
    <EmployeeProfileDataTable
      data={records}
      canEdit={canManage}
      canDelete={canManage}
      title="Order"
    />
  )
}

export default EmployeeProfilePage
