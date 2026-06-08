"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard, Landmark, ShieldCheck, ShoppingBag, Smartphone, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/use-cart";
import { formatPrice } from "@/lib/format-price";

const protectPromiseFee = 19;

type AddressFields = {
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

const emptyAddress: AddressFields = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

const paymentOptions = [
  {
    value: "card",
    title: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex, and other major cards.",
    icon: CreditCard,
  },
  {
    value: "upi",
    title: "UPI / Instant Pay",
    description: "Fast app-based payment with instant confirmation.",
    icon: Smartphone,
  },
  {
    value: "bank",
    title: "Net Banking",
    description: "Pay directly from your preferred bank account.",
    icon: Landmark,
  },
  {
    value: "cod",
    title: "Cash on Delivery",
    description: "Pay when the order reaches your address.",
    icon: ShoppingBag,
  },
] as const;

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#223013]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-[#d8dfcc] bg-white px-4 py-3 text-sm text-[#253116] outline-none transition focus:border-[#93a374]"
      />
    </label>
  );
}

export function CheckoutPage() {
  const { cartItems, subtotal, discountTotal, total } = useCart();
  const [shippingAddress, setShippingAddress] = useState<AddressFields>(emptyAddress);
  const [billingAddress, setBillingAddress] = useState<AddressFields>(emptyAddress);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentOptions)[number]["value"]>("card");

  const detailedItems = cartItems
    .map((item) => {
      const product = item.product;
      if (!product) {
        return null;
      }

      return {
        ...item,
        product,
        lineTotal: product.priceValue * item.quantity,
      };
    })
    .filter((item) => item !== null);

  const serviceFee = detailedItems.length > 0 ? protectPromiseFee : 0;
  const orderTotal = total + serviceFee;

  function updateShippingField<K extends keyof AddressFields>(key: K, value: AddressFields[K]) {
    setShippingAddress((current) => ({ ...current, [key]: value }));
  }

  function updateBillingField<K extends keyof AddressFields>(key: K, value: AddressFields[K]) {
    setBillingAddress((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  if (detailedItems.length === 0) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#f7faf3_0%,_#ffffff_45%,_#f4f7ef_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[#dde4d1] bg-white p-8 text-center shadow-[0_30px_80px_-54px_rgba(31,41,18,0.28)] sm:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eef4e5] text-[#30411a]">
            <ShoppingBag className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-[#14190e]">Your checkout is waiting for items</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5d6750]">
            Add products to your cart first, then return here to complete shipping, billing, and payment details.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#2f3b1d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#243015]"
            >
              Continue shopping
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
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#71805b]">Checkout</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-[#14190e]">Shipping, billing, and payment</h1>
            <p className="mt-2 text-sm leading-7 text-[#5d6750]">
              Complete your address details and choose the payment method that feels best for this order.
            </p>
          </div>
          <Link
            href="/cart"
            className="inline-flex w-fit items-center justify-center rounded-full border border-[#cad2bb] px-5 py-3 text-sm font-semibold text-[#263118] transition hover:bg-[#f5f8ef]"
          >
            Back to cart
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-[1.8rem] border border-[#dde4d1] bg-white p-5 shadow-[0_24px_70px_-52px_rgba(31,41,18,0.24)] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805b]">Shipping address</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={shippingAddress.fullName} onChange={(value) => updateShippingField("fullName", value)} />
                <Field label="Phone number" value={shippingAddress.phone} onChange={(value) => updateShippingField("phone", value)} type="tel" />
                <div className="sm:col-span-2">
                  <Field label="Email address" value={shippingAddress.email} onChange={(value) => updateShippingField("email", value)} type="email" />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Address line 1" value={shippingAddress.addressLine1} onChange={(value) => updateShippingField("addressLine1", value)} />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Address line 2"
                    value={shippingAddress.addressLine2}
                    onChange={(value) => updateShippingField("addressLine2", value)}
                    placeholder="Apartment, suite, landmark"
                  />
                </div>
                <Field label="City" value={shippingAddress.city} onChange={(value) => updateShippingField("city", value)} />
                <Field label="State" value={shippingAddress.state} onChange={(value) => updateShippingField("state", value)} />
                <Field label="Postal code" value={shippingAddress.postalCode} onChange={(value) => updateShippingField("postalCode", value)} />
                <Field label="Country" value={shippingAddress.country} onChange={(value) => updateShippingField("country", value)} />
              </div>
            </section>

            <section className="rounded-[1.8rem] border border-[#dde4d1] bg-white p-5 shadow-[0_24px_70px_-52px_rgba(31,41,18,0.24)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805b]">Billing address</p>
                  <p className="mt-1 text-sm text-[#5d6750]">Use the same address for billing or enter another one.</p>
                </div>
                <label className="inline-flex items-center gap-3 rounded-full bg-[#f5f8ef] px-4 py-2 text-sm font-semibold text-[#263118]">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                    className="h-4 w-4 rounded border-[#cbd5bf] text-[#30411a] focus:ring-[#93a374]"
                  />
                  Billing same as shipping
                </label>
              </div>

              {billingSameAsShipping ? (
                <div className="mt-5 rounded-[1.4rem] bg-[#f7f9f4] p-4 text-sm leading-7 text-[#556048]">
                  We&apos;ll use the shipping address above as your billing address too, so your customer does not need to enter it again.
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" value={billingAddress.fullName} onChange={(value) => updateBillingField("fullName", value)} />
                  <Field label="Phone number" value={billingAddress.phone} onChange={(value) => updateBillingField("phone", value)} type="tel" />
                  <div className="sm:col-span-2">
                    <Field label="Email address" value={billingAddress.email} onChange={(value) => updateBillingField("email", value)} type="email" />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Address line 1" value={billingAddress.addressLine1} onChange={(value) => updateBillingField("addressLine1", value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="Address line 2"
                      value={billingAddress.addressLine2}
                      onChange={(value) => updateBillingField("addressLine2", value)}
                      placeholder="Apartment, suite, landmark"
                    />
                  </div>
                  <Field label="City" value={billingAddress.city} onChange={(value) => updateBillingField("city", value)} />
                  <Field label="State" value={billingAddress.state} onChange={(value) => updateBillingField("state", value)} />
                  <Field label="Postal code" value={billingAddress.postalCode} onChange={(value) => updateBillingField("postalCode", value)} />
                  <Field label="Country" value={billingAddress.country} onChange={(value) => updateBillingField("country", value)} />
                </div>
              )}
            </section>

            <section className="rounded-[1.8rem] border border-[#dde4d1] bg-white p-5 shadow-[0_24px_70px_-52px_rgba(31,41,18,0.24)] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805b]">Payment method</p>
              <div className="mt-5 grid gap-4">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-4 rounded-[1.4rem] border p-4 transition ${
                        paymentMethod === option.value
                          ? "border-[#30411a] bg-[#f6f9f1] shadow-[0_18px_50px_-44px_rgba(31,41,18,0.3)]"
                          : "border-[#dde4d1] bg-white hover:bg-[#fbfcf9]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={() => setPaymentMethod(option.value)}
                        className="mt-1 h-4 w-4 border-[#cbd5bf] text-[#30411a] focus:ring-[#93a374]"
                      />
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4e5] text-[#30411a]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-base font-bold text-[#1d2711]">{option.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-[#5d6750]">{option.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <section className="overflow-hidden rounded-[1.8rem] border border-[#dde4d1] bg-white shadow-[0_24px_70px_-52px_rgba(31,41,18,0.24)]">
              <div className="border-b border-[#ecf1e5] p-5 sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#71805b]">Order summary</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#14190e]">
                  {detailedItems.length} item{detailedItems.length === 1 ? "" : "s"} ready
                </h2>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                {detailedItems.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-[1.4rem] bg-[#fafcf8] p-4">
                    <div className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] ${item.product.bgClassName}`}>
                      <Image
                        src={item.product.imageSrc}
                        alt={item.product.imageAlt}
                        fill
                        sizes="80px"
                        className="object-contain p-3"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-[#1d2711]">{item.product.name}</p>
                      <p className="mt-1 text-sm text-[#667156]">
                        {item.color} / {item.size}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#5d6750]">Qty {item.quantity}</span>
                        <span className="text-lg font-black text-[#11160c]">{formatPrice(item.lineTotal)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t border-dashed border-[#e2e8d7] pt-4">
                  <div className="flex items-center justify-between text-sm text-[#33401f]">
                    <span>Original subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-[#33401f]">
                    <span>Discount</span>
                    <span className="font-semibold text-[#2f8f4e]">- {formatPrice(discountTotal)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-[#33401f]">
                    <span>Protect promise fee</span>
                    <span className="font-semibold">{formatPrice(serviceFee)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-[#33401f]">
                    <span>Delivery</span>
                    <span className="font-semibold text-[#2f8f4e]">Free</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#ecf1e5] pt-4">
                    <span className="text-base font-semibold text-[#1e2812]">Payable now</span>
                    <span className="text-3xl font-black tracking-tight text-[#11160c]">{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                <div className="space-y-3 rounded-[1.6rem] bg-[#f7f9f4] p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-[#30411a]" />
                    <p className="text-sm leading-6 text-[#556048]">
                      Payment stays protected with secure processing and easy return support.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-5 w-5 text-[#30411a]" />
                    <p className="text-sm leading-6 text-[#556048]">
                      Delivery updates will be shared using the phone and email entered above.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#f4b400] px-6 py-4 text-sm font-black text-[#2b2100] transition hover:bg-[#e8aa00]"
                >
                  Confirm order
                </button>

              </div>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}
