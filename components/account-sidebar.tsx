import Link from "next/link";
import { CreditCard, MapPin, Package, ShieldCheck, ShoppingCart } from "lucide-react";
import type { AuthUser } from "@/lib/auth-types";

export function AccountSidebar({
  activeSection,
  user,
}: {
  activeSection: "cart" | "orders" | "profile";
  user?: AuthUser;
}) {
  const links = [
    {
      href: "/cart",
      label: "Cart",
      description: "Review your cart and continue checkout",
      icon: ShoppingCart,
      key: "cart",
    },
    {
      href: "/account/orders",
      label: "Orders",
      description: "Track shipments and review order history",
      icon: Package,
      key: "orders",
    },
  ] as const;

  return (
    <aside className="rounded-[1.9rem] border border-white/50 bg-white/45 p-4 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)] backdrop-blur-xl">
      <div className="rounded-[1.6rem] border border-white/20 bg-[linear-gradient(160deg,rgba(31,111,235,0.95)_0%,rgba(33,89,181,0.88)_100%)] p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
          Account
        </p>
        <h2 className="mt-3 text-xl font-bold">{user?.name ?? "Aarav Sharma"}</h2>
        <p className="mt-1 text-sm text-white/80">{user?.email ?? "aarav.sharma@example.com"}</p>
      </div>

      <nav className="mt-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.key === activeSection;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-start gap-3 rounded-[1.25rem] border px-4 py-4 transition ${
                isActive
                  ? "border-[#bfd2f8] bg-[#eef5ff]/90 shadow-sm backdrop-blur-sm"
                  : "border-transparent hover:border-[#dde7d0] hover:bg-white/60"
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

      <div className="mt-4 grid gap-3 rounded-[1.5rem] border border-white/50 bg-white/55 p-4 backdrop-blur-lg">
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
              Home, Office, Parents
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
  );
}
