import Link from "next/link"
import { requireModulePermission } from "@/lib/rbac"

import {
  ArrowRightIcon,
  BoxesIcon,
  CreditCardIcon,
  PackageCheckIcon,
  ShoppingCartIcon,
  SparklesIcon,
  TrendingUpIcon,
  TruckIcon,
} from "lucide-react"

const stats = [
  {
    label: "Gross sales",
    value: "$48,260",
    delta: "+12.4%",
    note: "Compared with last week",
    tone: "from-cyan-500/20 to-sky-400/10",
    icon: CreditCardIcon,
  },
  {
    label: "Orders to fulfill",
    value: "128",
    delta: "21 urgent",
    note: "Packed before 6 PM cutoff",
    tone: "from-amber-400/20 to-orange-300/10",
    icon: ShoppingCartIcon,
  },
  {
    label: "Inventory health",
    value: "96%",
    delta: "8 low-stock SKUs",
    note: "Catalog is mostly stable",
    tone: "from-emerald-500/20 to-teal-400/10",
    icon: BoxesIcon,
  },
  {
    label: "Delivery score",
    value: "4.8/5",
    delta: "On-time 94%",
    note: "Returns remain under target",
    tone: "from-violet-400/20 to-fuchsia-300/10",
    icon: TruckIcon,
  },
]

const recentOrders = [
  {
    id: "#10842",
    customer: "Aarav Mehta",
    total: "$248.00",
    status: "Ready to ship",
    channel: "Website",
  },
  {
    id: "#10841",
    customer: "Sophia Williams",
    total: "$118.00",
    status: "Payment review",
    channel: "Instagram",
  },
  {
    id: "#10840",
    customer: "Noah Brown",
    total: "$362.00",
    status: "Packed",
    channel: "Marketplace",
  },
  {
    id: "#10839",
    customer: "Priya Sharma",
    total: "$84.00",
    status: "Delivered",
    channel: "Website",
  },
]

const inventoryWatch = [
  { name: "Cloud Weave Hoodie", stock: 4, color: "bg-rose-500" },
  { name: "Canvas Daypack", stock: 7, color: "bg-amber-500" },
  { name: "Studio Bottle", stock: 11, color: "bg-emerald-500" },
]

const activity = [
  {
    title: "New product batch synced",
    detail: "24 SKUs updated across product listings",
    time: "12 min ago",
  },
  {
    title: "High-value order flagged",
    detail: "Manual review requested for order #10841",
    time: "28 min ago",
  },
  {
    title: "Warehouse team checked in",
    detail: "Morning dispatch queue is 63% complete",
    time: "52 min ago",
  },
]

const topCategories = [
  { name: "Apparel", value: "38%", width: "w-[38%]" },
  { name: "Accessories", value: "27%", width: "w-[27%]" },
  { name: "Essentials", value: "19%", width: "w-[19%]" },
]

function statusClasses(status: string) {
  if (status === "Ready to ship") {
    return "bg-emerald-500/12 text-emerald-700"
  }

  if (status === "Payment review") {
    return "bg-amber-500/12 text-amber-700"
  }

  if (status === "Packed") {
    return "bg-sky-500/12 text-sky-700"
  }

  return "bg-slate-900/10 text-slate-600"
}

export default async function Page() {
  await requireModulePermission("dashboard", "view")

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="relative overflow-hidden rounded-[32px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-50px_rgba(15,23,42,0.9)] backdrop-blur-2xl md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_20%)]" />
        <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
              <SparklesIcon className="size-3.5 text-cyan-600" />
              Refined storefront operations
            </div>
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Keep your store calm, clear, and ready for the next rush.
            </h2>
            {/* <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
              Your core numbers, shipping queue, and inventory risks are all in
              one place so the team can make faster calls without visual noise.
            </p> */}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[26rem]">
            <Link
              href="/admin/order"
              className="rounded-[24px] border border-white/55 bg-slate-950 px-5 py-4 text-white shadow-lg shadow-slate-950/10 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Review live orders</span>
                <ArrowRightIcon className="size-4" />
              </div>
              <p className="mt-2 text-xs text-white/70">
                Open the order desk and handle pending checkouts.
              </p>
            </Link>
            <Link
              href="/admin/product"
              className="rounded-[24px] border border-white/65 bg-white/70 px-5 py-4 text-slate-900 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Update products</span>
                <PackageCheckIcon className="size-4 text-cyan-700" />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Refresh pricing, imagery, and stock in the catalog.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-[28px] border border-white/45 bg-white/50 p-5 shadow-[0_24px_70px_-52px_rgba(15,23,42,0.95)] backdrop-blur-2xl"
            >
              <div
                className={`mb-5 inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone}`}
              >
                <Icon className="size-5 text-slate-900" />
              </div>
              <p className="text-sm text-slate-500">{item.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-semibold tracking-tight text-slate-950">
                  {item.value}
                </p>
                <span className="rounded-full bg-slate-900/6 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {item.delta}
                </span>
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                {item.note}
              </p>
            </div>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[30px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Recent orders
              </p>
              <h3 className="mt-1 text-xl font-semibold text-slate-950">
                Prioritize the next shipment wave
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
              <TrendingUpIcon className="size-3.5" />
              Conversion up 6.2% today
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/55 bg-white/65">
            <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-200/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.8fr_0.8fr]">
              <span>Order</span>
              <span className="hidden md:block">Channel</span>
              <span className="hidden md:block">Total</span>
              <span className="hidden md:block">Status</span>
              <span className="text-right">Customer</span>
            </div>
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-200/60 px-4 py-4 last:border-b-0 md:grid-cols-[1.1fr_0.7fr_0.7fr_0.8fr_0.8fr]"
              >
                <div>
                  <p className="font-medium text-slate-900">{order.id}</p>
                  <p className="mt-1 text-xs text-slate-500 md:hidden">
                    {order.channel} - {order.total}
                  </p>
                </div>
                <p className="hidden text-sm text-slate-600 md:block">
                  {order.channel}
                </p>
                <p className="hidden text-sm font-medium text-slate-900 md:block">
                  {order.total}
                </p>
                <div className="hidden md:block">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-right text-sm text-slate-600">
                  {order.customer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[30px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <p className="text-sm font-medium text-slate-500">
              Inventory watch
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-950">
              Low stock needs attention
            </h3>
            <div className="mt-6 space-y-4">
              {inventoryWatch.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[22px] border border-white/60 bg-white/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`size-2.5 rounded-full ${item.color}`} />
                      <p className="truncate font-medium text-slate-900">
                        {item.name}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
            <p className="text-sm font-medium text-slate-500">
              Category mix
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-950">
              Top-selling segments
            </h3>
            <div className="mt-6 space-y-4">
              {topCategories.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-medium text-slate-900">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200/80">
                    <div
                      className={`h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#38bdf8)] ${item.width}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-[30px] border border-white/45 bg-white/55 p-6 shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)] backdrop-blur-2xl">
          <p className="text-sm font-medium text-slate-500">Team activity</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950">
            What changed in the last hour
          </h3>
          <div className="mt-6 space-y-4">
            {activity.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/60 bg-white/70 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-xs font-medium text-slate-400">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/45 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(15,118,110,0.82))] p-6 text-white shadow-[0_32px_90px_-56px_rgba(15,23,42,0.95)]">
          <p className="text-sm font-medium text-white/70">Daily brief</p>
          <h3 className="mt-1 text-xl font-semibold">
            The store is healthy, but the next hour matters.
          </h3>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">
            Focus on the payment review queue and restock the hoodie line first.
            That keeps the customer experience smooth while protecting your best
            selling category.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/15 bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Avg. basket
              </p>
              <p className="mt-2 text-2xl font-semibold">$82</p>
            </div>
            <div className="rounded-[22px] border border-white/15 bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Repeat rate
              </p>
              <p className="mt-2 text-2xl font-semibold">34%</p>
            </div>
            <div className="rounded-[22px] border border-white/15 bg-white/8 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Support load
              </p>
              <p className="mt-2 text-2xl font-semibold">09 open</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
