"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/components/use-cart";
import type { ProductEntry } from "@/lib/product-catalog";

type AddToCartButtonProps = {
  product: ProductEntry;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [label, setLabel] = useState("Add to cart");
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      addItem({ productId: product.id, product });
      setLabel("Added");
      window.setTimeout(() => setLabel("Add to cart"), 1600);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Adding..." : label}
    </button>
  );
}
