"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useSyncExternalStore } from "react";

import { DataTable } from "@/components/data-table";
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

type OrderTableRow = {
  id: string;
  orderId: string;
  order: StoredOrder;
  status: StoredOrder["status"];
  placedAt: string;
  firstItemName: string;
  itemCount: number;
  paymentMethodLabel: string;
  shippingDestination: string;
  total: number;
};

type OrderHistoryPanelProps = {
  user: AuthUser;
};

export function OrderHistoryPanel({ user }: OrderHistoryPanelProps) {
  const router = useRouter();
  const orders = useSyncExternalStore(
    subscribeToStoredOrders,
    () => readStoredOrdersForCustomer(user.email),
    () => readStoredOrdersForCustomer(user.email),
  );

  const orderRows = React.useMemo<OrderTableRow[]>(
    () =>
      orders.map((order) => {
        const firstItem = order.items[0];

        return {
          id: order.id,
          orderId: order.id,
          order,
          status: order.status,
          placedAt: order.placedAt,
          firstItemName: firstItem?.name ?? "Order",
          itemCount: order.items.length,
          paymentMethodLabel: getPaymentMethodLabel(order.paymentMethod),
          shippingDestination: `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
          total: order.total,
        };
      }),
    [orders]
  );

  if (orders.length === 0) {
    return (
      <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
              Recent orders
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#1b2511]">No orders yet</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#647159]">
              When you place your first checkout, it will appear here in a table with
              its status, payment method, destination, and total.
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
    <section className="overflow-hidden rounded-[1.75rem] border border-[#dce5d0] bg-white shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
      <DataTable
        data={orderRows}
        onRowClick={(row) => router.push(`/account/orders/${row.order.id}`)}
        columns={[
          {
            accessorKey: "orderId",
            header: "Order",
            cell: ({ row }) => {
              const item = row.original;

              return (
                <div>
                  <p className="text-sm font-semibold text-[#1b2511]">{item.orderId}</p>
                  <p className="mt-1 text-xs text-[#667156]">
                    Placed on {formatOrderDate(item.placedAt)}
                  </p>
                </div>
              );
            },
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[row.original.status]}`}
              >
                {row.original.status}
              </span>
            ),
          },
          {
            accessorKey: "firstItemName",
            header: "Items",
            cell: ({ row }) => {
              const item = row.original;

              return (
                <div>
                  <p className="text-sm font-semibold text-[#1f2a13]">{item.firstItemName}</p>
                  <p className="mt-1 text-xs text-[#667156]">
                    {item.itemCount} item{item.itemCount === 1 ? "" : "s"}
                  </p>
                </div>
              );
            },
          },
          {
            accessorKey: "paymentMethodLabel",
            header: "Payment",
          },
          {
            accessorKey: "shippingDestination",
            header: "Ship to",
          },
          {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => (
              <p className="text-sm font-semibold text-[#1f2a13]">
                {formatPrice(row.original.total)}
              </p>
            ),
          },
          {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
              <Link
                href={`/account/orders/${row.original.order.id}`}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center gap-2 rounded-full border border-[#d7e0cb] bg-[#f8faf5] px-4 py-2 text-sm font-semibold text-[#425136] transition hover:bg-[#eef4e7]"
              >
                View details
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            ),
          },
        ]}
        title="Recent orders"
        description="Review your placed orders in a compact table with order id, status, payment, destination, and total. Click an order to open its full detail page."
        searchKey="firstItemName"
        searchPlaceholder="Search orders..."
        emptyMessage="No orders found."
        columnVisibilityLabel="Show columns"
      />
    </section>
  );
}

function formatOrderDate(placedAt: string) {
  return new Date(placedAt).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
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
