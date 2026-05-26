import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const merchSections = [
  {
    title: "Appliance for Cool Summer",
    wrapperClassName: "bg-[linear-gradient(90deg,#15784f_0%,#0c6a48_100%)]",
    cardClassName: "bg-white",
    href: "/products?category=electronics",
    items: [
      {
        title: "True Wireless",
        offer: "Special offer",
        imageSrc: "/hero-tech.svg",
        href: "/categories/electronics",
      },
      {
        title: "Trimmers",
        offer: "Min. 50% Off",
        imageSrc: "/hero-home.svg",
        href: "/categories/diy-tools",
      },
      {
        title: "Smart Watches",
        offer: "Min. 40% Off",
        imageSrc: "/hero-tech.svg",
        href: "/categories/gadgets",
      },
      {
        title: "Neckband",
        offer: "Min. 50% Off",
        imageSrc: "/hero-travel.svg",
        href: "/categories/electronics",
      },
    ],
  },
  {
    title: "Widest collection",
    wrapperClassName: "bg-[linear-gradient(90deg,#fbff00_0%,#fff858_55%,#fffba5_100%)]",
    cardClassName: "bg-white",
    href: "/categories",
    items: [
      {
        title: "Don't Miss",
        offer: "Min. 80% Off",
        imageSrc: "/hero-travel.svg",
        href: "/categories/sports-fitness",
      },
      {
        title: "Grab Now",
        offer: "Under ₹299",
        imageSrc: "/hero-home.svg",
        href: "/categories/mens-wear",
      },
      {
        title: "Most Loved",
        offer: "Top Rated",
        imageSrc: "/hero-home.svg",
        href: "/categories/groceries",
      },
      {
        title: "In Focus Now",
        offer: "From ₹699",
        imageSrc: "/hero-tech.svg",
        href: "/categories/gadgets",
      },
    ],
  },
];

export function HomeMerchStrips() {
  return (
    <section className="bg-[#eef2e6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        {merchSections.map((section) => (
          <div
            key={section.title}
            className={`overflow-hidden rounded-[1.6rem] p-3 shadow-[0_18px_60px_-42px_rgba(29,38,19,0.45)] ${section.wrapperClassName}`}
          >
            <div className="flex items-center justify-between gap-4 px-2 pb-3">
              <h2 className="text-2xl font-black tracking-tight text-white">
                {section.title}
              </h2>
              <Link
                href={section.href}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#223617] transition hover:scale-105"
                aria-label={`Open ${section.title}`}
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {section.items.map((item) => (
                <Link
                  key={`${section.title}-${item.title}`}
                  href={item.href}
                  className={`group overflow-hidden rounded-[1.2rem] ${section.cardClassName} p-2 shadow-sm transition hover:-translate-y-0.5`}
                >
                  <div className="relative h-48 overflow-hidden rounded-[1rem] bg-[#f4f5f7]">
                    <Image
                      src={item.imageSrc}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1280px) 50vw, 25vw"
                      className="object-contain p-4 transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-1 pb-1 pt-3">
                    <p className="text-[1.05rem] font-medium leading-6 text-[#111111]">{item.title}</p>
                    <p className="text-[1.05rem] font-black leading-6 text-[#111111]">{item.offer}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
