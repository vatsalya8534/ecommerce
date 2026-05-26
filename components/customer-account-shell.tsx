import Link from "next/link";
import {
  ChevronRight,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

type AccountSection = "profile" | "orders";

const accountLinks = [
  {
    href: "/account/profile",
    label: "Profile",
    description: "Personal details and saved addresses",
    icon: UserRound,
    key: "profile",
  },
  {
    href: "/account/orders",
    label: "Orders",
    description: "Track shipments and review order history",
    icon: Package,
    key: "orders",
  },
] as const;

export function CustomerAccountShell({
  activeSection,
  title,
  description,
  badge,
  children,
}: {
  activeSection: AccountSection;
  title: string;
  description: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_28%),linear-gradient(180deg,#f7f9f4_0%,#eef3e7_48%,#f9fbf7_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_30px_90px_-40px_rgba(35,45,24,0.45)] backdrop-blur">
          <div className="grid gap-6 bg-[linear-gradient(135deg,#fdfcf6_0%,#edf4e6_55%,#e4ecd9_100%)] px-6 py-8 lg:grid-cols-[1.5fr_0.8fr] lg:px-8">
            <div>
              <p className="inline-flex rounded-full border border-[#d8e1ca] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#5f7148]">
                {badge}
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-[#13200d] sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#56644b] sm:text-base">
                {description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1f6feb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#195ec9]"
                >
                  View orders
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/track-order"
                  className="inline-flex items-center gap-2 rounded-full border border-[#cad6b8] bg-white/80 px-5 py-3 text-sm font-semibold text-[#223013] transition hover:bg-[#f4f8ee]"
                >
                  Live tracking
                  <Package className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                  Member tier
                </p>
                <p className="mt-2 text-2xl font-black text-[#1f2a13]">
                  Plus
                </p>
                <p className="mt-1 text-sm text-[#5d6950]">
                  Free express delivery and faster support.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                  Active orders
                </p>
                <p className="mt-2 text-2xl font-black text-[#1f2a13]">03</p>
                <p className="mt-1 text-sm text-[#5d6950]">
                  One arriving today, two in transit.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/70 bg-white/85 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                  Saved value
                </p>
                <p className="mt-2 text-2xl font-black text-[#1f2a13]">
                  $184
                </p>
                <p className="mt-1 text-sm text-[#5d6950]">
                  Cashback, coupons, and delivery savings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="rounded-[1.75rem] border border-[#dce5d0] bg-white/90 p-4 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
            <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#1f6feb_0%,#2159b5_100%)] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                Account hub
              </p>
              <h2 className="mt-3 text-xl font-bold">Aarav Sharma</h2>
              <p className="mt-1 text-sm text-white/80">
                aarav.sharma@example.com
              </p>
            </div>

            <nav className="mt-4 space-y-2">
              {accountLinks.map((link) => {
                const Icon = link.icon;
                const isActive = link.key === activeSection;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-start gap-3 rounded-[1.25rem] border px-4 py-4 transition ${
                      isActive
                        ? "border-[#bfd2f8] bg-[#eef5ff] shadow-sm"
                        : "border-transparent bg-transparent hover:border-[#dde7d0] hover:bg-[#f7faf2]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 rounded-full p-2 ${
                        isActive
                          ? "bg-[#1f6feb] text-white"
                          : "bg-[#eef3e5] text-[#425236]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[#1f2a13]">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#647159]">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 grid gap-3 rounded-[1.5rem] border border-[#e2e8d8] bg-[#fbfcf8] p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#2d7a36]" />
                <div>
                  <p className="text-sm font-semibold text-[#223013]">
                    Protected account
                  </p>
                  <p className="text-xs text-[#67745c]">
                    2-step verification enabled
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#1f6feb]" />
                <div>
                  <p className="text-sm font-semibold text-[#223013]">
                    3 saved addresses
                  </p>
                  <p className="text-xs text-[#67745c]">
                    Home, Office, Weekend stay
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-[#8d5a11]" />
                <div>
                  <p className="text-sm font-semibold text-[#223013]">
                    2 payment methods
                  </p>
                  <p className="text-xs text-[#67745c]">
                    Visa ending 2024 and UPI enabled
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
