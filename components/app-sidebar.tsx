"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  LifeBuoyIcon,
  Package2Icon,
  Settings2Icon,
  ShoppingBagIcon,
  SparklesIcon,
  TagIcon,
} from "lucide-react"

const navigationGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboardIcon,
        hint: "Today",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Orders",
        href: "/admin/order",
        icon: ShoppingBagIcon,
        hint: "Live",
      },
      {
        title: "Products",
        href: "/admin/product",
        icon: Package2Icon,
        hint: "Catalog",
      },
      {
        title: "Categories",
        href: "/admin/category",
        icon: TagIcon,
        hint: "Browse",
      },
      {
        title: "Configuration",
        href: "/admin/configuration",
        icon: Settings2Icon,
        hint: "Browse",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      className="border-none bg-transparent p-3"
      {...props}
    >
      <SidebarHeader className="gap-3 rounded-[28px] border border-white/35 bg-white/55 p-3 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#38bdf8)] text-white shadow-lg shadow-cyan-950/20">
            <SparklesIcon className="size-5" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-slate-900">
              Admin Studio
            </p>
            <p className="truncate text-xs text-slate-500">
              Calm control for your store
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/40 bg-white/65 p-3 group-data-[collapsible=icon]:hidden">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">This week</p>
            <Badge className="border-0 bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/12">
              +8.4%
            </Badge>
          </div>
          <p className="text-lg font-semibold text-slate-900">$24.8k revenue</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Orders are moving steadily and fulfillment is on track.
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="mt-3 gap-4 rounded-[28px] border border-white/30 bg-white/45 p-2 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label} className="p-1">
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-11 rounded-2xl px-3 text-slate-600 transition-all duration-200 hover:bg-white/70 hover:text-slate-950 data-[active=true]:bg-[linear-gradient(135deg,rgba(15,118,110,0.16),rgba(56,189,248,0.18))] data-[active=true]:text-slate-950 data-[active=true]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)]"
                    >
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span className="font-medium">{item.title}</span>
                        <span className="ml-auto text-[11px] text-slate-400 group-data-[collapsible=icon]:hidden">
                          {item.hint}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="mt-3 rounded-[28px] border border-white/30 bg-white/45 p-3 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.9)] backdrop-blur-2xl group-data-[collapsible=icon]:items-center">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-900 text-white group-data-[collapsible=icon]:flex">
          <LifeBuoyIcon className="size-4" />
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-semibold text-slate-900">Need a hand?</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Keep pricing, stock, and shipping updated before the evening rush.
          </p>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
