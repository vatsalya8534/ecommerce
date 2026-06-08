"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCart } from "@/components/use-cart";
import { formatPrice } from "@/lib/format-price";

const protectPromiseFee = 19;

export function CartPage() {
  const router = useRouter();
  const { cartItems, subtotal, discountTotal, total, removeItem, updateQuantity, clearCart } = useCart();

  const detailedItems = cartItems
    .map((item) => {
      const product = item.product;
      if (!product) {
        return null;
      }

      return {
        ...item,
        product,
        lineOriginalTotal: product.originalPriceValue * item.quantity,
        lineTotal: product.priceValue * item.quantity,
        lineSavings: (product.originalPriceValue - product.priceValue) * item.quantity,
      };
    })
    .filter((item) => item !== null);

  const serviceFee = detailedItems.length > 0 ? protectPromiseFee : 0;
  const orderTotal = total + serviceFee;

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
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex w-fit items-center justify-center rounded-full border border-[#cad2bb] px-5 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            {detailedItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1.8rem] border border-[#dde4d1] bg-white shadow-[0_24px_70px_-52px_rgba(31,41,18,0.24)]"
              >
                <div className="grid gap-5 p-5 sm:grid-cols-[140px_minmax(0,1fr)] sm:p-6">
                  <div className={`relative min-h-[140px] overflow-hidden rounded-[1.4rem] ${item.product.bgClassName}`}>
                    <Image
                      src={item.product.imageSrc}
                      alt={item.product.imageAlt}
                      fill
                      sizes="140px"
                      className="object-contain p-4"
                    />
                  </div>

                  <div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="inline-flex rounded-full bg-[#eef4e5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#30411a]">
                          {item.product.badge}
                        </p>
                        <h2 className="mt-3 text-2xl font-black tracking-tight text-[#151a0f]">
                          <Link href={`/products/${item.product.id}`} className="transition hover:text-[#30411a]">
                            {item.product.name}
                          </Link>
                        </h2>
                        <p className="mt-2 text-sm text-[#667156]">
                          {item.product.brand} · {item.product.categoryName}
                        </p>
                        <p className="mt-1 text-sm text-[#667156]">
                          {item.color} · {item.size}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-sm text-[#7a846e] line-through">{formatPrice(item.lineOriginalTotal)}</p>
                        <p className="mt-1 text-3xl font-black tracking-tight text-[#11160c]">
                          {formatPrice(item.lineTotal)}
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#2f8f4e]">
                          You save {formatPrice(item.lineSavings)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-[#566048]">{item.product.blurb}</p>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="inline-flex w-fit items-center rounded-full border border-[#dbe2cf] bg-[#fbfcf9] p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#263118] transition hover:bg-[#eef4e5]"
                          aria-label={`Decrease quantity for ${item.product.name}`}
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
                          aria-label={`Increase quantity for ${item.product.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#f5f8ef] px-4 py-2 text-sm font-semibold text-[#30411a]">
                          {item.product.delivery}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#e5d7d7] px-4 py-2 text-sm font-semibold text-[#8d3737] transition hover:bg-[#fff5f5]"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-[1.8rem] border border-[#dde4d1] bg-white shadow-[0_24px_70px_-52px_rgba(31,41,18,0.24)]">
              <div className="border-b border-[#ecf1e5] p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805b]">Price details</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#14190e]">
                  {detailedItems.length} item{detailedItems.length === 1 ? "" : "s"} in cart
                </h2>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between text-sm text-[#33401f]">
                  <span>Original subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#33401f]">
                  <span>Discount</span>
                  <span className="font-semibold text-[#2f8f4e]">- {formatPrice(discountTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#33401f]">
                  <span>Protect promise fee</span>
                  <span className="font-semibold">{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#33401f]">
                  <span>Delivery</span>
                  <span className="font-semibold text-[#2f8f4e]">Free</span>
                </div>

                <div className="border-t border-dashed border-[#e2e8d7] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#1e2812]">Total amount</span>
                    <span className="text-3xl font-black tracking-tight text-[#11160c]">
                      {formatPrice(orderTotal)}
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.4rem] bg-[#edf8ef] px-4 py-3 text-sm font-semibold text-[#2f8f4e]">
                  You&apos;ll save {formatPrice(discountTotal)} on this order.
                </div>

                <div className="space-y-3 rounded-[1.6rem] bg-[#f7f9f4] p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-[#30411a]" />
                    <p className="text-sm leading-6 text-[#556048]">
                      Safe and secure payments with easy returns on eligible products.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-5 w-5 text-[#30411a]" />
                    <p className="text-sm leading-6 text-[#556048]">
                      Fast shipping backed by marketplace delivery support and seller protection.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#f4b400] px-6 py-4 text-sm font-black text-[#2b2100] transition hover:bg-[#e8aa00]"
                >
                  Checkout
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
