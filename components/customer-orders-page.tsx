import {
  ArrowLeft,
  PackageCheck,
  PackageOpen,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import type { AuthUser } from "@/lib/auth-types";
import { CustomerAccountShell } from "@/components/customer-account-shell";
import { OrderHistoryPanel } from "@/components/order-history-panel";

export function CustomerOrdersPage({ user }: { user: AuthUser }) {
  return (
    <CustomerAccountShell activeSection="orders" user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#758463]">
              Orders
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#1b2511]">
              Your order history
            </h1>
          </div>

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cad2bb] px-5 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        <OrderHistoryPanel user={user} />

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
