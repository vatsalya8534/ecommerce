"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
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

  function handleAddToCart() {
    startTransition(() => {
      addItem({
        productId: product.id,
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

      <div className="mt-5 max-w-[180px]">
        <label htmlFor="quantity" className="text-sm font-semibold text-[#222d14]">
          Quantity
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="mt-2 w-full rounded-2xl border border-[#d8dfcc] bg-white px-4 py-3 text-sm text-[#253116] outline-none transition focus:border-[#93a374]"
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <option key={index + 1} value={index + 1}>
              Qty: {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full border border-[#cad2bb] px-6 py-3 text-sm font-bold text-[#263118] transition hover:bg-[#f5f8ef] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Adding..." : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isPending}
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
