import {
  MapPin,
  Edit3,
} from "lucide-react";

import { CustomerAccountShell } from "@/components/customer-account-shell";

const savedAddresses = [
  {
    label: "Home",
    address: "742 Evergreen Terrace, Springfield, IL 62704",
    contact: "+1 (555) 183-2048",
    accent: "bg-[#eef5ff] text-[#1f6feb]",
  },
  {
    label: "Office",
    address: "18 Market Square, Suite 420, Chicago, IL 60607",
    contact: "+1 (555) 901-7712",
    accent: "bg-[#f4f9ed] text-[#42621f]",
  },
  {
    label: "Parents",
    address: "88 Lakeview Road, Naperville, IL 60540",
    contact: "+1 (555) 300-2290",
    accent: "bg-[#fff4e7] text-[#8d5a11]",
  },
];

export function CustomerProfilePage() {
  return (
    <CustomerAccountShell
      activeSection="profile"
      badge="Customer profile"
      title="Everything important about your account, in one place."
      description="Designed with the same clear, high-signal account patterns large marketplaces use: fast scanning, strong hierarchy, and actions exactly where customers expect them."
    >
      <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7b5d]">
              Account details
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#1b2511]">
              Aarav Sharma
            </h2>
            <p className="mt-1 text-sm text-[#5e6a52]">
              Manage your personal information and delivery details.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8e1ca] bg-[#fbfcf8] px-4 py-2 text-sm font-semibold text-[#243015] transition hover:bg-[#f3f8ec]"
          >
            <Edit3 className="h-4 w-4" />
            Edit profile
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-[#f7faf3] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78876a]">
              Full name
            </p>
            <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
              Aarav Sharma
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#f7faf3] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78876a]">
              Email
            </p>
            <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
              aarav.sharma@example.com
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#f7faf3] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78876a]">
              Mobile
            </p>
            <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
              +1 (555) 840-2201
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-[#f7faf3] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78876a]">
              Language
            </p>
            <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
              English (US)
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
              Saved addresses
            </p>
            <h3 className="mt-2 text-xl font-black text-[#1b2511]">
              Delivery destinations
            </h3>
          </div>
          <MapPin className="h-5 w-5 text-[#42621f]" />
        </div>

        <div className="mt-5 grid gap-4">
          {savedAddresses.map((address) => (
            <div
              key={address.label}
              className="rounded-[1.5rem] border border-[#e4eadb] bg-[#fbfcf9] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${address.accent}`}
                  >
                    {address.label}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-[#1f2a13]">
                    {address.address}
                  </p>
                  <p className="mt-1 text-sm text-[#66725b]">
                    {address.contact}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-[#d9e2cd] px-4 py-2 text-sm font-semibold text-[#243015] transition hover:bg-[#f2f7eb]"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </CustomerAccountShell>
  );
}
