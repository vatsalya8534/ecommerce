import {
  BadgeCheck,
  ChevronRight,
  Clock3,
  PackageCheck,
  PackageOpen,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";

import { CustomerAccountShell } from "@/components/customer-account-shell";

const orderCards = [
  {
    id: "SH-240901",
    item: "Nothing Ear (2025) Wireless Earbuds",
    status: "Out for delivery",
    delivery: "Arriving today, by 7:00 PM",
    amount: "$129.00",
    progress: 92,
    accent: "bg-[#e8f1ff] text-[#1f6feb] border-[#cbdcff]",
  },
  {
    id: "SH-240876",
    item: "Dyson V12 Detect Slim",
    status: "In transit",
    delivery: "Expected on May 29",
    amount: "$499.00",
    progress: 64,
    accent: "bg-[#eef7e8] text-[#3d6a17] border-[#dceac8]",
  },
  {
    id: "SH-240845",
    item: "Apple MacBook Air 15-inch",
    status: "Delivered",
    delivery: "Delivered on May 22",
    amount: "$1,399.00",
    progress: 100,
    accent: "bg-[#fff3e5] text-[#9a5c0f] border-[#ffe0b5]",
  },
];

const timeline = [
  {
    label: "Order confirmed",
    detail: "May 26, 9:10 AM",
    done: true,
  },
  {
    label: "Packed at warehouse",
    detail: "May 26, 1:45 PM",
    done: true,
  },
  {
    label: "Shipped with BlueDart",
    detail: "May 27, 7:20 AM",
    done: true,
  },
  {
    label: "Out for delivery",
    detail: "May 28, 10:05 AM",
    done: true,
  },
  {
    label: "Delivered",
    detail: "Pending final handoff",
    done: false,
  },
];

export function CustomerOrdersPage() {
  return (
    <CustomerAccountShell
      activeSection="orders"
      badge="Order tracking"
      title="Track every shipment with cleaner status, fewer clicks, and better context."
      description="Inspired by Flipkart’s account flow: orders are easy to find, tracking is front-and-center, and each card emphasizes the next action customers actually care about."
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                Recent orders
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#1b2511]">
                Shipment status overview
              </h2>
            </div>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f6feb] transition hover:text-[#195ec9]"
            >
              Open detailed tracker
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {orderCards.map((order) => (
              <div
                key={order.id}
                className="rounded-[1.5rem] border border-[#e3ead9] bg-[#fbfcf9] p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${order.accent}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a876a]">
                        {order.id}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-[#1f2a13]">
                      {order.item}
                    </h3>
                    <p className="mt-1 text-sm text-[#617055]">
                      {order.delivery}
                    </p>
                  </div>

                  <div className="min-w-[140px] rounded-[1.25rem] bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#7a876a]">
                      Amount
                    </p>
                    <p className="mt-2 text-lg font-black text-[#1f2a13]">
                      {order.amount}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-[#778469]">
                    <span>Delivery progress</span>
                    <span>{order.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#e9efdf]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#1f6feb_0%,#59a6ff_100%)]"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                Live timeline
              </p>
              <h3 className="mt-2 text-xl font-black text-[#1b2511]">
                Order SH-240901
              </h3>
            </div>
            <Truck className="h-5 w-5 text-[#1f6feb]" />
          </div>

          <div className="mt-6 space-y-5">
            {timeline.map((step, index) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-[#1f6feb] text-white"
                        : "bg-[#eef3e5] text-[#5f6d53]"
                    }`}
                  >
                    {step.done ? (
                      <BadgeCheck className="h-4 w-4" />
                    ) : (
                      <Clock3 className="h-4 w-4" />
                    )}
                  </span>
                  {index < timeline.length - 1 ? (
                    <span className="mt-2 h-full w-px bg-[#dfe7d4]" />
                  ) : null}
                </div>
                <div className="pb-5">
                  <p className="text-sm font-semibold text-[#1f2a13]">
                    {step.label}
                  </p>
                  <p className="mt-1 text-sm text-[#67745c]">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
          <PackageCheck className="h-6 w-6 text-[#2c7a34]" />
          <h3 className="mt-4 text-lg font-black text-[#1b2511]">
            Delivery promise
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#647159]">
            Real-time courier status, day-of-delivery windows, and prompt delay
            notices keep expectations clear.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
          <PackageOpen className="h-6 w-6 text-[#1f6feb]" />
          <h3 className="mt-4 text-lg font-black text-[#1b2511]">
            Easy order actions
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#647159]">
            Return, replace, invoice download, and support entry points can sit
            next to each order when backend flows are added.
          </p>
        </article>

        <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
          <ShieldCheck className="h-6 w-6 text-[#9a5c0f]" />
          <h3 className="mt-4 text-lg font-black text-[#1b2511]">
            Trusted updates
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#647159]">
            OTP delivery confirmation, trusted courier names, and clearer status
            labels reduce support load.
          </p>
        </article>
      </section>
    </CustomerAccountShell>
  );
}
