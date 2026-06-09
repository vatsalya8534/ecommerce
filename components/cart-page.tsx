"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import type { CartItem } from "@/components/cart-provider";
import { useCart } from "@/components/use-cart";
import { formatPrice } from "@/lib/format-price";

type DetailedCartItem = {
  id: string;
  product: NonNullable<CartItem["product"]>;
  color: string;
  size: string;
  quantity: number;
  lineOriginalTotal: number;
  lineTotal: number;
  lineSavings: number;
};

type CartTableRow = {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  categoryName: string;
  color: string;
  size: string;
  imageSrc: string;
  imageAlt: string;
  bgClassName: string;
  quantity: number;
  lineOriginalTotal: number;
  lineTotal: number;
  lineSavings: number;
  status: "Order not placed";
};

export function CartPage({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const { cartItems, removeItem, updateQuantity, clearCart } = useCart();

  const detailedItems = React.useMemo<DetailedCartItem[]>(
    () =>
      cartItems.flatMap((item) => {
        const product = item.product;

        if (!product) {
          return [];
        }

        return [
          {
            id: item.id,
            product,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            lineOriginalTotal: product.originalPriceValue * item.quantity,
            lineTotal: product.priceValue * item.quantity,
            lineSavings: (product.originalPriceValue - product.priceValue) * item.quantity,
          },
        ];
      }),
    [cartItems]
  );

  const cartRows = React.useMemo<CartTableRow[]>(
    () =>
      detailedItems.map((item) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        categoryName: item.product.categoryName,
        color: item.color,
        size: item.size,
        imageSrc: item.product.imageSrc,
        imageAlt: item.product.imageAlt,
        bgClassName: item.product.bgClassName,
        quantity: item.quantity,
        lineOriginalTotal: item.lineOriginalTotal,
        lineTotal: item.lineTotal,
        lineSavings: item.lineSavings,
        status: "Order not placed",
      })),
    [detailedItems]
  );

  const cartColumns = React.useMemo<ColumnDef<CartTableRow>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="flex min-w-[280px] items-center gap-4">
              <div className={`relative h-16 w-16 overflow-hidden rounded-2xl ${item.bgClassName}`}>
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-950">
                  <Link href={`/products/${item.productId}`} className="transition hover:text-sky-700">
                    {item.productName}
                  </Link>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.brand} - {item.categoryName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {item.color} / {item.size}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "quantity",
        header: "Qty",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="inline-flex items-center rounded-full border border-[#dbe2cf] bg-[#fbfcf9] p-1">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#263118] transition hover:bg-[#eef4e5]"
                aria-label={`Decrease quantity for ${item.productName}`}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-12 text-center text-sm font-bold text-[#1d2711]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#263118] transition hover:bg-[#eef4e5]"
                aria-label={`Increase quantity for ${item.productName}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
      {
        accessorKey: "lineTotal",
        header: "Pricing",
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="text-sm">
              <p className="font-semibold text-slate-950">{formatPrice(item.lineTotal)}</p>
              <p className="mt-1 text-xs text-slate-500 line-through">
                {formatPrice(item.lineOriginalTotal)}
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                You save {formatPrice(item.lineSavings)}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: () => (
          <Badge
            variant="outline"
            className="rounded-full border-0 bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700"
          >
            Order not placed
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const item = row.original;

          return (
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="inline-flex items-center gap-2 rounded-full border border-[#e5d7d7] px-4 py-2 text-sm font-semibold text-[#8d3737] transition hover:bg-[#fff5f5]"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          );
        },
      },
    ],
    [removeItem, updateQuantity]
  );

  const checkoutHref = isAuthenticated ? "/checkout" : "/login?mode=login&redirect=/checkout";

  if (detailedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f7faf3_0%,_#ffffff_45%,_#f4f7ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#dde4d1] bg-white p-8 text-center shadow-[0_30px_80px_-54px_rgba(31,41,18,0.28)] sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef4e5] text-[#30411a]">
            <ShoppingBag className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-[#14190e]">Your cart is empty</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5d6750]">
            Start adding products you like and they will appear here with quantity controls, savings, and an easy checkout summary.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#2f3b1d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
            >
              Explore products
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-full border border-[#cad2bb] px-6 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
            >
              Browse categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f7faf3_0%,_#ffffff_45%,_#f4f7ef_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#71805b]">Cart overview</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#14190e]">Shopping cart</h1>
            <p className="mt-2 text-sm leading-7 text-[#5d6750]">
              Review selected products, adjust quantity, and see your savings update instantly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/dashboard"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-[#cad2bb] px-5 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex w-fit items-center justify-center rounded-full border border-[#cad2bb] px-5 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
            >
              Clear cart
            </button>
            <button
              type="button"
              onClick={() => router.push(checkoutHref)}
              className="inline-flex w-fit items-center justify-center rounded-full bg-[#f4b400] px-5 py-3 text-sm font-black text-[#2b2100] transition hover:bg-[#e8aa00]"
            >
              {isAuthenticated ? "Checkout" : "Log in to checkout"}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <DataTable
            data={cartRows}
            columns={cartColumns}
            title="Cart items"
            description="Review the cart as rows before checkout. Each row shows status, quantity, and pricing details."
            searchKey="productName"
            searchPlaceholder="Search cart items..."
            emptyMessage="No cart items found."
            columnVisibilityLabel="Show columns"
          />
        </div>
      </div>
    </div>
  );
}
