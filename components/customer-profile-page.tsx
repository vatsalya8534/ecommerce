"use client";

import { Edit3, MapPin, Save, X } from "lucide-react";
import { useState } from "react";

import { CustomerAccountShell } from "@/components/customer-account-shell";

const initialAddresses = [
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
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [details, setDetails] = useState({
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    mobile: "+1 (555) 840-2201",
    language: "English (US)",
  });
  const [addresses, setAddresses] = useState(initialAddresses);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  const updateAddress = (
    label: string,
    field: "address" | "contact",
    value: string
  ) => {
    setAddresses((current) =>
      current.map((address) =>
        address.label === label ? { ...address, [field]: value } : address
      )
    );
  };

  return (
    <CustomerAccountShell activeSection="profile">
        <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6d7b5d]">
                Account details
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#1b2511]">
                {details.fullName}
              </h2>
              <p className="mt-1 text-sm text-[#5e6a52]">
                Manage your personal information and delivery details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingDetails((current) => !current)}
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#d8e1ca] bg-[#fbfcf8] px-4 py-2 text-sm font-semibold text-[#243015] transition hover:bg-[#f3f8ec]"
            >
              {isEditingDetails ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  Edit profile
                </>
              )}
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[#f7faf3] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78876a]">
                Full name
              </p>
              {isEditingDetails ? (
                <input
                  value={details.fullName}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      fullName: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#d8dfcc] bg-white px-3 py-2 text-sm text-[#1f2a13] outline-none focus:border-[#93a374]"
                />
              ) : (
                <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
                  {details.fullName}
                </p>
              )}
            </div>
            <div className="rounded-[1.5rem] bg-[#f7faf3] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78876a]">
                Email
              </p>
              {isEditingDetails ? (
                <input
                  value={details.email}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#d8dfcc] bg-white px-3 py-2 text-sm text-[#1f2a13] outline-none focus:border-[#93a374]"
                />
              ) : (
                <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
                  {details.email}
                </p>
              )}
            </div>
            <div className="rounded-[1.5rem] bg-[#f7faf3] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78876a]">
                Mobile
              </p>
              {isEditingDetails ? (
                <input
                  value={details.mobile}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      mobile: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#d8dfcc] bg-white px-3 py-2 text-sm text-[#1f2a13] outline-none focus:border-[#93a374]"
                />
              ) : (
                <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
                  {details.mobile}
                </p>
              )}
            </div>
            <div className="rounded-[1.5rem] bg-[#f7faf3] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78876a]">
                Language
              </p>
              {isEditingDetails ? (
                <input
                  value={details.language}
                  onChange={(event) =>
                    setDetails((current) => ({
                      ...current,
                      language: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#d8dfcc] bg-white px-3 py-2 text-sm text-[#1f2a13] outline-none focus:border-[#93a374]"
                />
              ) : (
                <p className="mt-2 text-sm font-semibold text-[#1f2a13]">
                  {details.language}
                </p>
              )}
            </div>
          </div>

          {isEditingDetails ? (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditingDetails(false)}
                className="inline-flex items-center gap-2 rounded-full bg-[#223013] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a250f]"
              >
                <Save className="h-4 w-4" />
                Save details
              </button>
            </div>
          ) : null}
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
            {addresses.map((address) => {
              const isEditing = editingAddress === address.label;

              return (
                <div
                  key={address.label}
                  className="rounded-[1.5rem] border border-[#e4eadb] bg-[#fbfcf9] p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${address.accent}`}
                      >
                        {address.label}
                      </span>
                      {isEditing ? (
                        <div className="mt-3 space-y-3">
                          <input
                            value={address.address}
                            onChange={(event) =>
                              updateAddress(
                                address.label,
                                "address",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-[#d8dfcc] bg-white px-3 py-2 text-sm text-[#1f2a13] outline-none focus:border-[#93a374]"
                          />
                          <input
                            value={address.contact}
                            onChange={(event) =>
                              updateAddress(
                                address.label,
                                "contact",
                                event.target.value
                              )
                            }
                            className="w-full rounded-xl border border-[#d8dfcc] bg-white px-3 py-2 text-sm text-[#1f2a13] outline-none focus:border-[#93a374]"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="mt-3 text-sm font-semibold text-[#1f2a13]">
                            {address.address}
                          </p>
                          <p className="mt-1 text-sm text-[#66725b]">
                            {address.contact}
                          </p>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingAddress((current) =>
                          current === address.label ? null : address.label
                        )
                      }
                      className="rounded-full border border-[#d9e2cd] px-4 py-2 text-sm font-semibold text-[#243015] transition hover:bg-[#f2f7eb]"
                    >
                      {isEditing ? "Save" : "Edit"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
    </CustomerAccountShell>
  );
}
