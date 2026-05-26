import {
  BadgeCheck,
  ChevronRight,
  Clock3,
  PackageCheck,
  PackageOpen,
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard,
  Receipt,
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
    payment: "Paid via UPI",
    address: "221B Green Avenue, New Delhi",
    orderedOn: "May 26, 2026",
    courier: "BlueDart Express",
    accent: "bg-[#e8f1ff] text-[#1f6feb] border-[#cbdcff]",
  },
  {
    id: "SH-240876",
    item: "Dyson V12 Detect Slim",
    status: "In transit",
    delivery: "Expected on May 29",
    amount: "$499.00",
    payment: "Paid via Credit Card",
    address: "15 Sunrise Residency, Noida",
    orderedOn: "May 24, 2026",
    courier: "Delhivery",
    accent: "bg-[#eef7e8] text-[#3d6a17] border-[#dceac8]",
  },
  {
    id: "SH-240845",
    item: "Apple MacBook Air 15-inch",
    status: "Delivered",
    delivery: "Delivered on May 22",
    amount: "$1,399.00",
    payment: "Paid via Net Banking",
    address: "88 Lake View Apartments, Gurgaon",
    orderedOn: "May 18, 2026",
    courier: "Ekart Logistics",
    accent: "bg-[#fff3e5] text-[#9a5c0f] border-[#ffe0b5]",
  },
];

export function CustomerOrdersPage() {
  return (
    <CustomerAccountShell activeSection="orders">
      <div className="space-y-6">
        <section className="w-full">
          <article className="w-full rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
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

            <div className="mt-6 space-y-5">
              {orderCards.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[1.6rem] border border-[#e3ead9] bg-[#fbfcf9] p-5 transition hover:border-[#cfd9c1]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
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

                      <h3 className="mt-3 text-xl font-black leading-snug text-[#1f2a13]">
                        {order.item}
                      </h3>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="flex items-start gap-3 rounded-2xl bg-white p-3">
                          <Clock3 className="mt-0.5 h-4 w-4 text-[#1f6feb]" />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                              Delivery
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#1f2a13]">
                              {order.delivery}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl bg-white p-3">
                          <Truck className="mt-0.5 h-4 w-4 text-[#2c7a34]" />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                              Courier Partner
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#1f2a13]">
                              {order.courier}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl bg-white p-3">
                          <MapPin className="mt-0.5 h-4 w-4 text-[#9a5c0f]" />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                              Delivery Address
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#1f2a13]">
                              {order.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl bg-white p-3">
                          <CreditCard className="mt-0.5 h-4 w-4 text-[#7c3aed]" />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                              Payment Method
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#1f2a13]">
                              {order.payment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-[220px] rounded-[1.5rem] border border-[#e7eddc] bg-white p-5 shadow-sm">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#7a876a]">
                          Total Amount
                        </p>

                        <p className="mt-2 text-2xl font-black text-[#1f2a13]">
                          {order.amount}
                        </p>
                      </div>

                      <div className="mt-5 border-t border-[#edf1e6] pt-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#7a876a]">
                          Ordered On
                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
                          {order.orderedOn}
                        </p>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#1f6feb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#195ec9]">
                          Track Order
                        </button>

                        <button className="inline-flex items-center justify-center rounded-xl border border-[#d7e0cb] bg-[#f8faf5] px-3 py-2.5 text-[#425136] transition hover:bg-[#eef4e7]">
                          <Receipt className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
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
              Real-time courier status, day-of-delivery windows, and prompt
              delay notices keep expectations clear.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
            <PackageOpen className="h-6 w-6 text-[#1f6feb]" />

            <h3 className="mt-4 text-lg font-black text-[#1b2511]">
              Easy order actions
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#647159]">
              Return, replace, invoice download, and support entry points can
              sit next to each order when backend flows are added.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
            <ShieldCheck className="h-6 w-6 text-[#9a5c0f]" />

            <h3 className="mt-4 text-lg font-black text-[#1b2511]">
              Trusted updates
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#647159]">
              OTP delivery confirmation, trusted courier names, and clearer
              status labels reduce support load.
            </p>
          </article>
        </section>
      </div>
    </CustomerAccountShell>
  );
}