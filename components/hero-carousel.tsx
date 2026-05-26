"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  offer: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
};

const AUTO_ADVANCE_MS = 4000;

const slides: HeroSlide[] = [
  {
    id: "01",
    title: "Up to 50% off",
    subtitle: "Dry fruits, nuts and healthy snacking picks",
    offer: "Earn extra savings on curated pantry essentials this week.",
    ctaLabel: "Shop grocery deals",
    ctaHref: "/products",
    imageSrc: "/hero-home.svg",
    imageAlt: "Marketplace banner showing dry fruits and nuts offer",
  },
  {
    id: "02",
    title: "Mega electronics days",
    subtitle: "Headphones, keyboards and desk gear at launch prices",
    offer: "Limited-time bank offers plus fast delivery on bestsellers.",
    ctaLabel: "Explore electronics",
    ctaHref: "/products",
    imageSrc: "/hero-tech.svg",
    imageAlt: "Marketplace banner showing electronics and desk accessories",
  },
  {
    id: "03",
    title: "Travel essentials sale",
    subtitle: "Backpacks, bottles and organizers for every commute",
    offer: "Save more on smart carry gear and quick-trip favorites.",
    ctaLabel: "Shop travel picks",
    ctaHref: "/products",
    imageSrc: "/hero-travel.svg",
    imageAlt: "Marketplace banner showing travel gear and accessories",
  },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[activeIndex];

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className="bg-[#e3e6e6]">
      <div className="mx-auto max-w-[1500px]">
        <div className="relative">
          <div className="relative h-[240px] overflow-hidden sm:h-[300px] lg:h-[360px]">
            <Image
              key={activeSlide.id}
              src={activeSlide.imageSrc}
              alt={activeSlide.imageAlt}
              fill
              preload={activeIndex === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.34)_34%,rgba(0,0,0,0.08)_62%,rgba(0,0,0,0.02)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(227,230,230,0)_78%,#e3e6e6_100%)]" />

            <div className="absolute inset-y-0 left-2 z-20 flex items-center sm:left-4">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={goToPrevious}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/65 bg-white/8 text-white backdrop-blur-sm transition hover:bg-white/18 sm:h-14 sm:w-14"
              >
                <ChevronLeft className="h-7 w-7 sm:h-9 sm:w-9" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-2 z-20 flex items-center sm:right-4">
              <button
                type="button"
                aria-label="Next slide"
                onClick={goToNext}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/65 bg-white/8 text-white backdrop-blur-sm transition hover:bg-white/18 sm:h-14 sm:w-14"
              >
                <ChevronRight className="h-7 w-7 sm:h-9 sm:w-9" />
              </button>
            </div>

            <div className="absolute left-1/2 top-6 z-10 w-[min(92%,760px)] -translate-x-1/2 text-center text-white sm:top-8">
              <p className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                {activeSlide.title}
              </p>
              <p className="mt-1 text-lg font-semibold sm:text-3xl">
                {activeSlide.subtitle}
              </p>
              <div className="mx-auto mt-4 max-w-xl rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg sm:text-base">
                {activeSlide.offer}
              </div>
              <Link
                href={activeSlide.ctaHref}
                className="mt-4 inline-flex rounded-md bg-[#ffd814] px-5 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-[#f7ca00]"
              >
                {activeSlide.ctaLabel}
              </Link>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 hidden px-4 sm:block">
            <div className="flex items-center justify-center gap-2 pb-3">
              {slides.map((slide, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to slide ${slide.id}`}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isActive ? "w-10 bg-white" : "w-3 bg-white/45"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
