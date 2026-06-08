"use client";

import { createContext, useEffect, useSyncExternalStore } from "react";
import type { ProductEntry } from "@/lib/product-catalog";

const CART_STORAGE_KEY = "shophub-cart";
const CART_EVENT = "shophub-cart-updated";
const EMPTY_CART: CartItem[] = [];
let cachedCartRaw = "";
let cachedCartSnapshot: CartItem[] = EMPTY_CART;

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  color: string;
  size: string;
  product?: ProductEntry;
};

type CartProviderProps = {
  children: React.ReactNode;
  initialProducts: ProductEntry[];
};

type CartContextValue = {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  addItem: (input: { productId: string; product?: ProductEntry; quantity?: number; color?: string; size?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | undefined>(undefined);

function createCartItemId(productId: string, color: string, size: string) {
  return `${productId}__${color}__${size}`;
}

function readCartSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY) ?? "";

    if (stored === cachedCartRaw) {
      return cachedCartSnapshot;
    }

    cachedCartRaw = stored;
    cachedCartSnapshot = stored ? (JSON.parse(stored) as CartItem[]) : EMPTY_CART;
    return cachedCartSnapshot;
  } catch {
    cachedCartRaw = "";
    cachedCartSnapshot = EMPTY_CART;
    return EMPTY_CART;
  }
}

function writeCartSnapshot(nextItems: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  const nextRaw = JSON.stringify(nextItems);
  cachedCartRaw = nextRaw;
  cachedCartSnapshot = nextItems.length > 0 ? nextItems : EMPTY_CART;
  window.localStorage.setItem(CART_STORAGE_KEY, nextRaw);
  window.dispatchEvent(new Event(CART_EVENT));
}

function subscribeToCartStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(CART_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(CART_EVENT, handleChange);
  };
}

export function CartProvider({ children, initialProducts }: CartProviderProps) {
  const cartItems = useSyncExternalStore(
    subscribeToCartStore,
    readCartSnapshot,
    () => EMPTY_CART
  );

  useEffect(() => {
    const missingProductIds = Array.from(new Set(cartItems.filter((item) => !item.product).map((item) => item.productId)));

    if (missingProductIds.length === 0) {
      return;
    }

    const productsById = new Map(
      initialProducts.filter((product) => missingProductIds.includes(product.id)).map((product) => [product.id, product])
    );

    let hasUpdates = false;
    const nextItems = cartItems.map((item) => {
      if (item.product) {
        return item;
      }

      const product = productsById.get(item.productId);
      if (!product) {
        return item;
      }

      hasUpdates = true;
      return {
        ...item,
        product,
      };
    });

    if (hasUpdates) {
      writeCartSnapshot(nextItems);
    }

    return () => {};
  }, [cartItems, initialProducts]);

  const addItem: CartContextValue["addItem"] = ({ productId, product, quantity = 1, color, size }) => {
    const resolvedProduct = product ?? initialProducts.find((entry) => entry.id === productId);
    if (!resolvedProduct) {
      return;
    }

    const safeColor = color ?? resolvedProduct.colors[0] ?? "Standard";
    const safeSize = size ?? resolvedProduct.sizes[0] ?? "Standard";
    const itemId = createCartItemId(productId, safeColor, safeSize);
    const existingItem = cartItems.find((item) => item.id === itemId);

    if (existingItem) {
      writeCartSnapshot(
        cartItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, 10), product: item.product ?? resolvedProduct }
            : item
        )
      );
      return;
    }

    writeCartSnapshot([
      ...cartItems,
      {
        id: itemId,
        productId,
        quantity: Math.min(quantity, 10),
        color: safeColor,
        size: safeSize,
        product: resolvedProduct,
      },
    ]);
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (id, quantity) => {
    if (quantity <= 0) {
      writeCartSnapshot(cartItems.filter((item) => item.id !== id));
      return;
    }

    writeCartSnapshot(
      cartItems.map((item) => (item.id === id ? { ...item, quantity: Math.min(quantity, 10) } : item))
    );
  };

  const removeItem: CartContextValue["removeItem"] = (id) => {
    writeCartSnapshot(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    writeCartSnapshot([]);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.product;
    return sum + (product?.originalPriceValue ?? 0) * item.quantity;
  }, 0);
  const discountTotal = cartItems.reduce((sum, item) => {
    const product = item.product;
    if (!product) {
      return sum;
    }

    return sum + (product.originalPriceValue - product.priceValue) * item.quantity;
  }, 0);
  const total = subtotal - discountTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        discountTotal,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
