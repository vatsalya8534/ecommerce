"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/use-cart";
import type { ProductEntry } from "@/lib/product-catalog";

type ProductPurchasePanelProps = {
  product: ProductEntry;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "Standard");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "Standard");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const canDecreaseQuantity = quantity > 1;
  const canIncreaseQuantity = quantity < 10;

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(10, current + 1));
  }

  function handleAddToCart() {
    startTransition(() => {
      addItem({
        productId: product.id,
        product,
        color: selectedColor,
        size: selectedSize,
        quantity,
      });
      setMessage("Added to cart");
      window.setTimeout(() => setMessage(""), 1800);
    });
  }

  function handleBuyNow() {
    startTransition(() => {
      addItem({
        productId: product.id,
        product,
        color: selectedColor,
        size: selectedSize,
        quantity,
      });
      router.push("/cart");
    });
  }

  return (
    <>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="color" className="text-sm font-semibold text-[#222d14]">
            Color
          </label>
          <select
            id="color"
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
            suppressHydrationWarning
            className="mt-2 w-full rounded-2xl border border-[#d8dfcc] bg-white px-4 py-3 text-sm text-[#253116] outline-none transition focus:border-[#93a374]"
          >
            {product.colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="size" className="text-sm font-semibold text-[#222d14]">
            Size
          </label>
          <select
            id="size"
            value={selectedSize}
            onChange={(event) => setSelectedSize(event.target.value)}
            suppressHydrationWarning
            className="mt-2 w-full rounded-2xl border border-[#d8dfcc] bg-white px-4 py-3 text-sm text-[#253116] outline-none transition focus:border-[#93a374]"
          >
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 max-w-[240px]">
        <label htmlFor="quantity" className="text-sm font-semibold text-[#222d14]">
          Quantity
        </label>
        <div
          id="quantity"
          className="mt-2 flex items-center overflow-hidden rounded-2xl border border-[#d8dfcc] bg-white shadow-sm"
          suppressHydrationWarning
        >
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={!canDecreaseQuantity || isPending}
            aria-label="Decrease quantity"
            className="inline-flex h-12 w-12 items-center justify-center text-[#445133] transition hover:bg-[#f3f6ed] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="flex min-h-12 flex-1 items-center justify-center border-x border-[#e7ecdd] px-4 text-sm font-bold text-[#253116]">
             {quantity}
          </div>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={!canIncreaseQuantity || isPending}
            aria-label="Increase quantity"
            className="inline-flex h-12 w-12 items-center justify-center text-[#445133] transition hover:bg-[#f3f6ed] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          suppressHydrationWarning
          className="inline-flex items-center justify-center rounded-full border border-[#cad2bb] px-6 py-3 text-sm font-bold text-[#263118] transition hover:bg-[#f5f8ef] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Adding..." : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isPending}
          suppressHydrationWarning
          className="inline-flex items-center justify-center rounded-full bg-[#2f3b1d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
        >
          Buy now
        </button>
      </div>

      {message ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#eef7ea] px-4 py-2 text-sm font-semibold text-[#2f8f4e]">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      ) : null}
    </>
  );
}
