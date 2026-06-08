"use client";

import type { CartItem } from "@/components/cart-provider";
import type { AuthUser } from "@/lib/auth-types";

const ORDERS_STORAGE_KEY = "shophub-orders";
const ORDERS_EVENT = "shophub-orders-updated";
const EMPTY_ORDERS: StoredOrder[] = [];

let cachedOrdersRaw = "";
let cachedOrdersSnapshot: StoredOrder[] = EMPTY_ORDERS;
let cachedFilteredEmail = "";
let cachedFilteredRaw = "";
let cachedFilteredSnapshot: StoredOrder[] = EMPTY_ORDERS;

export type CheckoutAddress = {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckoutPaymentMethod = "card" | "upi" | "bank" | "cod";

export type StoredOrderItem = {
  id: string;
  productId: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
  color: string;
  size: string;
  quantity: number;
  lineTotal: number;
  lineOriginalTotal: number;
  lineSavings: number;
};

export type StoredOrder = {
  id: string;
  placedAt: string;
  status: "Processing";
  paymentMethod: CheckoutPaymentMethod;
  customerName: string;
  customerEmail: string;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  items: StoredOrderItem[];
  subtotal: number;
  discountTotal: number;
  serviceFee: number;
  total: number;
};

function readOrdersSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_ORDERS;
  }

  try {
    const stored = window.localStorage.getItem(ORDERS_STORAGE_KEY) ?? "";

    if (stored === cachedOrdersRaw) {
      return cachedOrdersSnapshot;
    }

    cachedOrdersRaw = stored;
    cachedOrdersSnapshot = stored ? (JSON.parse(stored) as StoredOrder[]) : EMPTY_ORDERS;
    return cachedOrdersSnapshot;
  } catch {
    cachedOrdersRaw = "";
    cachedOrdersSnapshot = EMPTY_ORDERS;
    return EMPTY_ORDERS;
  }
}

function writeOrdersSnapshot(nextOrders: StoredOrder[]) {
  if (typeof window === "undefined") {
    return;
  }

  const nextRaw = JSON.stringify(nextOrders);
  cachedOrdersRaw = nextRaw;
  cachedOrdersSnapshot = nextOrders.length > 0 ? nextOrders : EMPTY_ORDERS;
  cachedFilteredEmail = "";
  cachedFilteredRaw = "";
  cachedFilteredSnapshot = EMPTY_ORDERS;
  window.localStorage.setItem(ORDERS_STORAGE_KEY, nextRaw);
  window.dispatchEvent(new Event(ORDERS_EVENT));
}

export function readStoredOrders() {
  return readOrdersSnapshot();
}

export function readStoredOrdersForCustomer(email: string) {
  if (typeof window === "undefined") {
    return EMPTY_ORDERS;
  }

  const orders = readOrdersSnapshot();
  if (cachedFilteredEmail === email && cachedFilteredRaw === cachedOrdersRaw) {
    return cachedFilteredSnapshot;
  }

  cachedFilteredEmail = email;
  cachedFilteredRaw = cachedOrdersRaw;
  cachedFilteredSnapshot = orders.filter((order) => order.customerEmail === email);
  return cachedFilteredSnapshot;
}

export function subscribeToStoredOrders(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(ORDERS_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(ORDERS_EVENT, handleChange);
  };
}

function createOrderId() {
  const randomPart = globalThis.crypto?.randomUUID?.().slice(0, 8).toUpperCase() ?? Math.random().toString(36).slice(2, 10).toUpperCase();
  return `ORD-${randomPart}`;
}

export function createOrderFromCheckout({
  cartItems,
  subtotal,
  discountTotal,
  serviceFee,
  total,
  shippingAddress,
  billingAddress,
  paymentMethod,
  user,
}: {
  cartItems: CartItem[];
  subtotal: number;
  discountTotal: number;
  serviceFee: number;
  total: number;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  paymentMethod: CheckoutPaymentMethod;
  user: AuthUser;
}): StoredOrder {
  return {
    id: createOrderId(),
    placedAt: new Date().toISOString(),
    status: "Processing",
    paymentMethod,
    customerName: user.name,
    customerEmail: user.email,
    shippingAddress,
    billingAddress,
    items: cartItems.map((item) => {
      const product = item.product;

      return {
        id: item.id,
        productId: item.productId,
        name: product?.name ?? "Unknown product",
        imageSrc: product?.imageSrc ?? "/hero-home.svg",
        imageAlt: product?.imageAlt ?? product?.name ?? "Product image",
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        lineTotal: (product?.priceValue ?? 0) * item.quantity,
        lineOriginalTotal: (product?.originalPriceValue ?? 0) * item.quantity,
        lineSavings: ((product?.originalPriceValue ?? 0) - (product?.priceValue ?? 0)) * item.quantity,
      };
    }),
    subtotal,
    discountTotal,
    serviceFee,
    total,
  };
}

export function saveStoredOrder(order: StoredOrder) {
  const nextOrders = [order, ...readOrdersSnapshot()];
  writeOrdersSnapshot(nextOrders);
}

export function clearStoredOrders() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ORDERS_STORAGE_KEY);
  window.dispatchEvent(new Event(ORDERS_EVENT));
}
