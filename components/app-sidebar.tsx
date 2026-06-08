"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRightIcon,
  FolderKanbanIcon,
  Package2Icon,
  Settings2Icon,
  ShieldIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";

import { type PermissionSnapshot } from "@/lib/rbac";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

type NavigationSubItem = {
  title: string;
  href: string;
  description: string;
};

type NavigationItem = {
  key: string;
  title: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  hint: string;
  subItems?: NavigationSubItem[];
};

const iconMap: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  orders: ShoppingBagIcon,
  products: Package2Icon,
  categories: TagIcon,
  users: UserIcon,
  roles: ShieldIcon,
  modules: FolderKanbanIcon,
  configuration: Settings2Icon,
};

const moduleHints: Record<string, string> = {
  orders: "Live",
  products: "Catalog",
  categories: "Browse",
  users: "Manage",
  roles: "RBAC",
  modules: "Source",
  configuration: "Browse",
};

const moduleSubItems: Record<string, NavigationSubItem[]> = {
  orders: [
    {
      title: "My Orders",
      href: "/account/orders",
      description: "Review checkout history and shipment details",
    },
    {
      title: "Cart",
      href: "/cart",
      description: "Resume the active cart before checkout",
    },
  ],
  users: [
    {
      title: "All Users",
      href: "/admin/user",
      description: "Assign roles and review access",
    },
    {
      title: "Roles",
      href: "/admin/user/roles",
      description: "Create permission bundles",
    },
    {
      title: "Modules",
      href: "/admin/user/modules",
      description: "Manage the module registry",
    },
  ],
};

export function AppSidebar({
  permissions,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  permissions: PermissionSnapshot[];
}) {
  const pathname = usePathname();
  const { isMobile, state } = useSidebar();
  const [hoveredItemHref, setHoveredItemHref] = React.useState<string | null>(
    null,
  );

  const navigationGroups = React.useMemo(() => {
    const groupedItems = new Map<string, NavigationItem[]>();

    for (const permission of permissions) {
      if (!permission.canView || !permission.path) {
        continue;
      }

      if (permission.key === "dashboard") {
        continue;
      }

      const items = groupedItems.get(permission.groupName) ?? [];
      const visibleSubItems =
        permission.key === "orders"
          ? (moduleSubItems[permission.key] ?? [])
          : (moduleSubItems[permission.key] ?? []).filter((subItem) =>
              permissions.some(
                (candidate) =>
                  candidate.canView && candidate.path === subItem.href,
              ),
            );

      items.push({
        key: permission.key,
        title: permission.name,
        href: permission.path,
        icon: iconMap[permission.key] ?? FolderKanbanIcon,
        hint: moduleHints[permission.key] ?? "Access",
        subItems: visibleSubItems.length ? visibleSubItems : undefined,
      });
      groupedItems.set(permission.groupName, items);
    }

    return Array.from(groupedItems.entries()).map(([label, items]) => ({
      label,
      items: items.sort((left, right) => {
        const leftPermission = permissions.find(
          (permission) => permission.key === left.key,
        );
        const rightPermission = permissions.find(
          (permission) => permission.key === right.key,
        );

        return (
          (leftPermission?.sortOrder ?? 0) -
            (rightPermission?.sortOrder ?? 0) ||
          left.title.localeCompare(right.title)
        );
      }),
    }));
  }, [permissions]);

  const expandedItem =
    navigationGroups
      .flatMap((group) => group.items)
      .find((item) => item.href === hoveredItemHref) ?? null;

  const isExpandedPanelVisible =
    !!expandedItem?.subItems?.length && !isMobile && state === "expanded";

  return (
    <Sidebar
      collapsible="icon"
      className="border-none bg-transparent p-2"
      style={
        {
          "--sidebar-width": isExpandedPanelVisible ? "28rem" : "16rem",
          "--sidebar-width-icon": "4.5rem",
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader className="rounded-[24px] border border-white/45 bg-white/18 px-4 py-4 shadow-[0_18px_48px_-34px_rgba(35,45,24,0.35)] backdrop-blur-2xl group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(15,118,110,0.92),rgba(56,189,248,0.9))] text-white shadow-[0_12px_32px_-18px_rgba(14,116,144,0.7)]">
            <SparklesIcon className="size-5" />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-[0.01em] text-slate-900">
              Admin Studio
            </p>
            <p className="truncate text-xs text-slate-500">
              Calm control for your store
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent
        className="mt-3 min-h-0 flex-1 overflow-hidden rounded-[24px] border border-white/40 bg-white/10 shadow-[0_22px_56px_-36px_rgba(35,45,24,0.28)] backdrop-blur-2xl group-data-[collapsible=icon]:rounded-[28px]"
        onMouseLeave={() => setHoveredItemHref(null)}
      >
        <div className="flex h-full min-h-0">
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
            {navigationGroups.map((group) => (
              <SidebarGroup key={group.label} className="p-0 not-last:mb-3">
                <SidebarGroupLabel className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => (
                    <SidebarNavigationItem
                      key={item.key}
                      item={item}
                      pathname={pathname}
                      isActive={
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                      }
                      isExpanded={expandedItem?.key === item.key}
                      isMobile={isMobile}
                      onHover={() => setHoveredItemHref(item.href)}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ))}
          </div>

          {isExpandedPanelVisible ? (
            <div className="hidden h-full w-[12rem] shrink-0 border-l border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(247,250,242,0.14))] md:flex md:flex-col">
              <div className="border-b border-white/35 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {expandedItem.title}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Permission-aware navigation
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <div className="space-y-1">
                  {expandedItem.subItems?.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className="block rounded-2xl border border-transparent px-3 py-3 text-slate-700 transition-all duration-200 hover:border-white/55 hover:bg-white/40 hover:text-slate-950"
                    >
                      <p className="text-sm font-medium">{subItem.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {subItem.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

function SidebarNavigationItem({
  item,
  pathname,
  isActive,
  isExpanded,
  isMobile,
  onHover,
}: {
  item: NavigationItem;
  pathname: string;
  isActive: boolean;
  isExpanded: boolean;
  isMobile: boolean;
  onHover: () => void;
}) {
  const Icon = item.icon;
  const isItemActive =
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`) ||
    item.subItems?.some(
      (subItem) =>
        pathname === subItem.href || pathname.startsWith(`${subItem.href}/`),
    ) ||
    false;

  if (!item.subItems?.length || isMobile) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive || isItemActive}
          tooltip={item.title}
          className="h-11 rounded-2xl px-3 text-slate-600 transition-all duration-200 hover:bg-white/32 hover:text-slate-950 data-[active=true]:border data-[active=true]:border-white/50 data-[active=true]:bg-white/42 data-[active=true]:text-slate-950 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-2xl group-data-[collapsible=icon]:px-0"
        >
          <Link href={item.href}>
            <Icon className="size-4" />
            <span className="font-medium group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
            <span className="ml-auto text-[11px] text-slate-400 group-data-[collapsible=icon]:hidden">
              {item.hint}
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem onMouseEnter={onHover}>
      <SidebarMenuButton
        asChild
        isActive={isActive || isExpanded || isItemActive}
        tooltip={item.title}
        className="h-11 rounded-2xl px-3 text-slate-600 transition-all duration-200 hover:bg-white/32 hover:text-slate-950 data-[active=true]:border data-[active=true]:border-white/50 data-[active=true]:bg-white/42 data-[active=true]:text-slate-950 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-2xl group-data-[collapsible=icon]:px-0"
      >
        <Link href={item.href}>
          <Icon className="size-4" />
          <span className="font-medium group-data-[collapsible=icon]:hidden">
            {item.title}
          </span>
          <span className="ml-auto flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <span className="text-[11px] text-slate-400">{item.hint}</span>
            <ChevronRightIcon
              className={`size-4 text-slate-400 transition-transform duration-200 ${
                isExpanded ? "translate-x-0.5" : ""
              }`}
            />
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
