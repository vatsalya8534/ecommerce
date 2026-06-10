"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  PackageCheck,
  ShoppingBag,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CustomerAccountShell } from "@/components/customer-account-shell";
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

type CustomerOrderDetailPageProps = {
  user: AuthUser;
  orderId: string;
};

export function CustomerOrderDetailPage({ user, orderId }: CustomerOrderDetailPageProps) {
  const [isMounted, setIsMounted] = React.useState(false);
  const orders = useSyncExternalStore(
    subscribeToStoredOrders,
    () => readStoredOrdersForCustomer(user.email),
    () => readStoredOrdersForCustomer(user.email),
  );

  React.useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMounted(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const order = React.useMemo(
    () => orders.find((entry) => entry.id === orderId) ?? null,
    [orders, orderId]
  );

  return (
    <CustomerAccountShell activeSection="orders" user={user}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#758463]">
              Orders
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#1b2511]">
              Order details
            </h1>
            <p className="mt-2 text-sm leading-7 text-[#647159]">
              Opened from your order history. Review every item, address, and total for this order.
            </p>
          </div>

          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cad2bb] px-5 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>
        </div>

        {!isMounted ? (
          <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)] sm:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-28 rounded-full bg-[#e8efe0]" />
              <div className="h-10 w-80 max-w-full rounded-2xl bg-[#eef3e7]" />
              <div className="h-5 w-2/3 rounded-full bg-[#eef3e7]" />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 rounded-[1.4rem] bg-[#f5f7f1]" />
                ))}
              </div>
            </div>
          </section>
        ) : !order ? (
          <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)] sm:p-8">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                  Order not found
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#1b2511]">We could not find this order</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647159]">
                  The order may not belong to this account or may not exist anymore.
                </p>
              </div>

              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center rounded-full bg-[#2f3b1d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
              >
                Return to orders
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-[1.5rem] border border-[#e4ead8] bg-[#fbfcf8] p-4">
              <ShoppingBag className="h-5 w-5 text-[#30411a]" />
              <p className="text-sm leading-6 text-[#556048]">
                Open one of your orders from the history table to view its details here.
              </p>
            </div>
          </section>
        ) : (
          <section className="overflow-hidden rounded-[1.75rem] border border-[#dce5d0] bg-white shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
            <div className="border-b border-[#ecf1e5] bg-[linear-gradient(180deg,_#fbfcf8_0%,_#ffffff_100%)] p-6 sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#758463]">
                    Order details
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-[#1b2511]">
                    {order.id}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#647159]">
                    Placed on {formatOrderDate(order.placedAt)} for {order.customerName}.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full border-[#d7e0cb] bg-white px-3 py-1 text-xs font-semibold text-[#425136]"
                  >
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <DetailMetric label="Total" value={formatPrice(order.total)} />
                <DetailMetric
                  label="Items"
                  value={`${order.items.length} item${order.items.length === 1 ? "" : "s"}`}
                />
                <DetailMetric label="Service fee" value={formatPrice(order.serviceFee)} />
                <DetailMetric label="Placed at" value={formatOrderDateTime(order.placedAt)} />
              </div>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] sm:p-8">
              <div className="space-y-6">
                <section className="rounded-[1.6rem] border border-[#dde4d1] bg-white p-5 shadow-[0_22px_60px_-50px_rgba(35,45,24,0.35)] sm:p-6">
                  <div className="flex items-center gap-3">
                    <PackageCheck className="h-5 w-5 text-[#30411a]" />
                    <div>
                      <h3 className="text-lg font-black text-[#1b2511]">Order items</h3>
                      <p className="text-sm text-[#647159]">
                        {order.items.length} item{order.items.length === 1 ? "" : "s"} in this order.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 rounded-[1.4rem] bg-[#fafcf8] p-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-white">
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold text-[#1b2511]">{item.name}</p>
                          <p className="mt-1 text-sm text-[#667156]">
                            {item.color} / {item.size}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#556048]">
                            <span>Qty {item.quantity}</span>
                            <span>SKU {item.productId}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-[#11160c]">{formatPrice(item.lineTotal)}</p>
                          <p className="mt-1 text-xs text-[#7b846f] line-through">
                            {formatPrice(item.lineOriginalTotal)}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-[#2f8f4e]">
                            Save {formatPrice(item.lineSavings)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                  <AddressCard title="Shipping address" icon={Truck} address={order.shippingAddress} />
                  <AddressCard title="Billing address" icon={CreditCard} address={order.billingAddress} />
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-[1.6rem] border border-[#dde4d1] bg-white p-5 shadow-[0_22px_60px_-50px_rgba(35,45,24,0.35)] sm:p-6">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-[#30411a]" />
                    <div>
                      <h3 className="text-lg font-black text-[#1b2511]">Customer</h3>
                      <p className="text-sm text-[#647159]">Account details for this order.</p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4 text-sm">
                    <InfoRow icon={User} label="Name" value={order.customerName} />
                    <InfoRow icon={Mail} label="Email" value={order.customerEmail} />
                  </div>
                </section>

                <section className="rounded-[1.6rem] border border-[#dde4d1] bg-white p-5 shadow-[0_22px_60px_-50px_rgba(35,45,24,0.35)] sm:p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#758463]">Summary</p>
                  <div className="mt-5 space-y-3">
                    <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />
                    <SummaryRow
                      label="Discount"
                      value={`- ${formatPrice(order.discountTotal)}`}
                      valueClassName="text-[#2f8f4e]"
                    />
                    <SummaryRow label="Service fee" value={formatPrice(order.serviceFee)} />
                    <SummaryRow label="Total" value={formatPrice(order.total)} emphasis />
                  </div>
                </section>

                <section className="rounded-[1.6rem] border border-[#dde4d1] bg-[#f7f9f4] p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-[#30411a]" />
                    <p className="text-sm leading-6 text-[#556048]">
                      This order is stored locally for the account and can be reviewed again anytime from your order history.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </section>
        )}
      </div>
    </CustomerAccountShell>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[#e4ead8] bg-white px-4 py-3 shadow-[0_14px_30px_-26px_rgba(35,45,24,0.3)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">{label}</p>
      <p className="mt-2 text-sm font-bold text-[#1b2511]">{value}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  emphasis = false,
  valueClassName = "text-[#1b2511]",
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${emphasis ? "border-t border-[#ecf1e5] pt-3" : ""}`}>
      <span className={`text-sm ${emphasis ? "font-semibold text-[#1e2812]" : "text-[#33401f]"}`}>{label}</span>
      <span className={emphasis ? "text-lg font-black text-[#11160c]" : `text-sm font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

function AddressCard({
  title,
  icon: Icon,
  address,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  address: StoredOrder["shippingAddress"];
}) {
  const lines = [address.addressLine1, address.addressLine2].filter(Boolean);

  return (
    <section className="rounded-[1.6rem] border border-[#dde4d1] bg-white p-5 shadow-[0_22px_60px_-50px_rgba(35,45,24,0.35)] sm:p-6">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#30411a]" />
        <h3 className="text-lg font-black text-[#1b2511]">{title}</h3>
      </div>
      <div className="mt-4 space-y-2 text-sm leading-6 text-[#556048]">
        <p>{address.fullName}</p>
        <p>{address.phone}</p>
        <p>{address.email}</p>
        <p>{lines.join(", ") || "No address line"}</p>
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[1.2rem] bg-[#fafcf8] p-3">
      <Icon className="mt-0.5 h-4 w-4 text-[#30411a]" />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#758463]">{label}</p>
        <p className="mt-1 break-all text-sm font-semibold text-[#1b2511]">{value}</p>
      </div>
    </div>
  );
}

function formatOrderDate(placedAt: string) {
  return new Date(placedAt).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatOrderDateTime(placedAt: string) {
  return new Date(placedAt).toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getPaymentMethodLabel(paymentMethod: StoredOrder["paymentMethod"]) {
  return paymentMethod === "card"
    ? "Credit / Debit Card"
    : paymentMethod === "upi"
      ? "UPI / Instant Pay"
      : paymentMethod === "bank"
        ? "Net Banking"
        : "Cash on Delivery";
}
