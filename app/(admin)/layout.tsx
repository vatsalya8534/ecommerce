import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { NotificationDropdown } from "@/components/notification-dropdown"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getCurrentAdminAccessContext } from "@/lib/rbac"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const accessContext = await getCurrentAdminAccessContext()

  if (!accessContext) {
    redirect("/login")
  }

  if (!accessContext.permissions.some((permission) => permission.canView && permission.path)) {
    redirect("/")
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div
          className="flex min-h-svh w-full bg-[radial-gradient(circle_at_top_left,rgba(186,230,253,0.95),transparent_28%),radial-gradient(circle_at_top_right,rgba(153,246,228,0.8),transparent_26%),linear-gradient(180deg,#f6fbff_0%,#eef7f6_52%,#f8fbfd_100%)]"
          style={
            {
              "--background": "oklch(0.985 0.01 196)",
              "--card": "oklch(1 0 0 / 0.7)",
              "--popover": "oklch(1 0 0 / 0.82)",
              "--border": "oklch(0.89 0.02 210 / 0.7)",
              "--input": "oklch(0.93 0.02 210 / 0.65)",
              "--primary": "oklch(0.54 0.1 201)",
              "--primary-foreground": "oklch(0.99 0.01 196)",
              "--secondary": "oklch(0.97 0.01 196 / 0.82)",
              "--muted": "oklch(0.96 0.01 210 / 0.7)",
              "--muted-foreground": "oklch(0.46 0.03 218)",
              "--accent": "oklch(0.95 0.03 192 / 0.8)",
              "--accent-foreground": "oklch(0.26 0.03 220)",
              "--ring": "oklch(0.74 0.06 202 / 0.65)",
              "--sidebar": "oklch(0.97 0.01 196 / 0.55)",
              "--sidebar-foreground": "oklch(0.28 0.03 220)",
              "--sidebar-border": "oklch(0.88 0.02 205 / 0.7)",
              "--sidebar-accent": "oklch(1 0 0 / 0.7)",
              "--sidebar-accent-foreground": "oklch(0.22 0.03 220)",
              "--sidebar-primary": "oklch(0.55 0.1 201)",
              "--sidebar-primary-foreground": "oklch(0.99 0.01 196)",
              "--sidebar-ring": "oklch(0.74 0.06 202 / 0.65)",
            } as React.CSSProperties
          }
        >
          <AppSidebar permissions={accessContext.permissions} />

          <SidebarInset className="bg-transparent">
            <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
              <div className="flex h-[4.5rem] items-center justify-between gap-4 rounded-[28px] border border-white/40 bg-white/55 px-4 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.9)] backdrop-blur-2xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="-ml-1 rounded-full border border-white/50 bg-white/70 text-slate-700 hover:bg-white hover:text-slate-950" />
                  <Separator
                    orientation="vertical"
                    className="mr-1 hidden data-vertical:h-5 data-vertical:self-auto sm:block"
                  />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                      Admin Workspace
                    </p>
                    <h1 className="text-sm font-semibold text-slate-900 sm:text-base">
                      Store dashboard
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* <div className="hidden rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700 md:block">
                      Operations healthy
                    </div> */}
                  <NotificationDropdown />
                  <ProfileDropdown
                    user={accessContext.user}
                    roleName={accessContext.role?.name}
                  />
                </div>
              </div>
            </header>

            <div className="flex flex-1 flex-col gap-6 p-4 pt-6 md:px-6 md:pb-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
