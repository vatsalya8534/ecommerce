import { ArrowLeft } from "lucide-react";
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
      </div>
    </CustomerAccountShell>
  );
}
