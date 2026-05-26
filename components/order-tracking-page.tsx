import {
  BadgeCheck,
  Clock3,
  MapPin,
  Package,
  ScanSearch,
  Truck,
} from "lucide-react";

const trackingEvents = [
  {
    title: "Picked up from fulfillment center",
    time: "May 27, 7:20 AM",
    detail: "Package scanned at Bengaluru south hub.",
    active: true,
  },
  {
    title: "Arrived at destination city",
    time: "May 27, 11:35 PM",
    detail: "Reached Chicago transit node and queued for morning dispatch.",
    active: true,
  },
  {
    title: "Out for delivery",
    time: "May 28, 10:05 AM",
    detail: "Driver Mia Johnson is 6 stops away.",
    active: true,
  },
  {
    title: "Delivery handoff",
    time: "Pending",
    detail: "Keep your phone nearby for final delivery confirmation.",
    active: false,
  },
];

export function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(31,111,235,0.12),_transparent_26%),linear-gradient(180deg,#f7f9f4_0%,#edf2e8_52%,#fafcf8_100%)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_30px_90px_-40px_rgba(35,45,24,0.45)]">
          <div className="grid gap-6 bg-[linear-gradient(135deg,#1c2635_0%,#2159b5_55%,#59a6ff_100%)] px-6 py-8 text-white lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
                Order tracker
              </p>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Nothing Ear (2025) is on the way.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                A focused tracking page with courier details, milestone history,
                and delivery context customers actually need during the wait.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                  Tracking ID
                </p>
                <p className="mt-2 text-xl font-black">BD458201778</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                  ETA
                </p>
                <p className="mt-2 text-xl font-black">Today, 7:00 PM</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                  Courier
                </p>
                <p className="mt-2 text-xl font-black">BlueDart</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                  Live progress
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#1b2511]">
                  Shipment timeline
                </h2>
              </div>
              <Truck className="h-5 w-5 text-[#1f6feb]" />
            </div>

            <div className="mt-6 space-y-5">
              {trackingEvents.map((event, index) => (
                <div key={event.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        event.active
                          ? "bg-[#1f6feb] text-white"
                          : "bg-[#eef3e5] text-[#6a775f]"
                      }`}
                    >
                      {event.active ? (
                        <BadgeCheck className="h-4 w-4" />
                      ) : (
                        <Clock3 className="h-4 w-4" />
                      )}
                    </span>
                    {index < trackingEvents.length - 1 ? (
                      <span className="mt-2 h-full w-px bg-[#dfe7d4]" />
                    ) : null}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-semibold text-[#1f2a13]">
                      {event.title}
                    </p>
                    <p className="mt-1 text-sm text-[#637056]">{event.time}</p>
                    <p className="mt-2 text-sm leading-6 text-[#67745c]">
                      {event.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#e8f1ff] p-2 text-[#1f6feb]">
                  <ScanSearch className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                    Current location
                  </p>
                  <h3 className="mt-1 text-lg font-black text-[#1b2511]">
                    22 miles away from destination
                  </h3>
                </div>
              </div>
              <div className="mt-5 rounded-[1.5rem] bg-[#f6faf1] p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-[#42621f]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f2a13]">
                      Chicago local delivery hub
                    </p>
                    <p className="mt-1 text-sm text-[#67745c]">
                      Final sort completed. Driver assignment confirmed for
                      same-day drop.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-[#dce5d0] bg-white p-6 shadow-[0_24px_60px_-50px_rgba(35,45,24,0.5)]">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#eef7e8] p-2 text-[#3d6a17]">
                  <Package className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#758463]">
                    Delivery checklist
                  </p>
                  <h3 className="mt-1 text-lg font-black text-[#1b2511]">
                    Be ready for handoff
                  </h3>
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-[#647159]">
                <li className="rounded-[1.25rem] bg-[#fbfcf9] px-4 py-3">
                  Keep your phone reachable for OTP confirmation.
                </li>
                <li className="rounded-[1.25rem] bg-[#fbfcf9] px-4 py-3">
                  Verify package seal before accepting delivery.
                </li>
                <li className="rounded-[1.25rem] bg-[#fbfcf9] px-4 py-3">
                  Use in-app support if the driver misses the promised window.
                </li>
              </ul>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
