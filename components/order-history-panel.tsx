"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ChevronRight, Receipt, ShoppingBag } from "lucide-react";

import type { AuthUser } from "@/lib/auth-types";
import {
  readStoredOrdersForCustomer,
  subscribeToStoredOrders,
  type StoredOrder,
} from "@/lib/order-storage";
import { formatPrice } from "@/lib/format-price";

const statusStyles: Record<StoredOrder["status"], string> = {
  Processing: "bg-[#e8f1ff] text-[#1f6feb] border-[#cbdcff]",
};

type OrderHistoryPanelProps = {
  user: AuthUser;
};

export function OrderHistoryPanel({ user }: OrderHistoryPanelProps) {
  const orders = useSyncExternalStore(
    subscribeToStoredOrders,
    () => readStoredOrdersForCustomer(user.email),
    () => readStoredOrdersForCustomer(user.email),
  );

  if (orders.length === 0) {
    return (
      <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
              Recent orders
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#1b2511]">
              No orders yet
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647159]">
              When you place your first checkout, it will appear here with its
              status, payment method, and delivery summary.
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-full bg-[#2f3b1d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
          >
            Go to cart
          </Link>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] border border-[#e4ead8] bg-[#fbfcf8] p-4">
          <ShoppingBag className="h-5 w-5 text-[#30411a]" />
          <p className="text-sm leading-6 text-[#556048]">
            Your placed orders will appear automatically after checkout.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
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
        {orders.map((order) => {
          const firstItem = order.items[0];
          const remainingItemCount = Math.max(0, order.items.length - 1);

          return (
            <div
              key={order.id}
              className="rounded-[1.6rem] border border-[#e3ead9] bg-[#fbfcf9] p-5 transition hover:border-[#cfd9c1]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a876a]">
                      {order.id}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-black leading-snug text-[#1f2a13]">
                    {firstItem?.name ?? "Order"}
                  </h3>
                  <p className="mt-1 text-sm text-[#667156]">
                    Placed on {new Date(order.placedAt).toLocaleDateString("en-IN", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl bg-white p-3">
                      <Receipt className="mt-0.5 h-4 w-4 text-[#1f6feb]" />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                          Payment
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#1f2a13]">
                          {order.paymentMethod === "card"
                            ? "Credit / Debit Card"
                            : order.paymentMethod === "upi"
                              ? "UPI / Instant Pay"
                              : order.paymentMethod === "bank"
                                ? "Net Banking"
                                : "Cash on Delivery"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-white p-3">
                      <ShoppingBag className="mt-0.5 h-4 w-4 text-[#2c7a34]" />

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                          Items
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#1f2a13]">
                          {order.items.length} item{order.items.length === 1 ? "" : "s"}
                          {remainingItemCount > 0 ? ` + ${remainingItemCount} more` : ""}
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
                      {formatPrice(order.total)}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#edf1e6] pt-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#7a876a]">
                      Shipping to
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Link
                      href="/track-order"
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#1f6feb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#195ec9]"
                    >
                      Track Order
                    </Link>

                    <button className="inline-flex items-center justify-center rounded-xl border border-[#d7e0cb] bg-[#f8faf5] px-3 py-2.5 text-[#425136] transition hover:bg-[#eef4e7]">
                      <Receipt className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[1.4rem] border border-[#e6ebde] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                    Purchased items
                  </p>

                  <div className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-[#fbfcf8] p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#1f2a13]">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs text-[#667156]">
                            {item.color} / {item.size} x {item.quantity}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#1f2a13]">
                            {formatPrice(item.lineTotal)}
                          </p>
                          <p className="text-xs text-[#7a876a] line-through">
                            {formatPrice(item.lineOriginalTotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-[#e6ebde] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                    Order totals
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-[#33401f]">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#33401f]">
                      <span>Discount</span>
                      <span className="font-semibold text-[#2f8f4e]">
                        - {formatPrice(order.discountTotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#33401f]">
                      <span>Protect promise fee</span>
                      <span className="font-semibold">{formatPrice(order.serviceFee)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-dashed border-[#e2e8d7] pt-3 text-sm text-[#33401f]">
                      <span className="font-semibold text-[#1e2812]">Total paid</span>
                      <span className="text-lg font-black text-[#11160c]">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-[#fafcf8] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b866f]">
                      Shipping contact
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="mt-1 text-sm text-[#667156]">
                      {order.shippingAddress.addressLine1}
                    </p>
                    {order.shippingAddress.addressLine2 ? (
                      <p className="mt-1 text-sm text-[#667156]">
                        {order.shippingAddress.addressLine2}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-[#667156]">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
