'use client';

import Link from 'next/link';
import {
  Award,
  Mail,
  MapPin,
  Phone,
  Shield,
  Truck,
} from 'lucide-react';
import { useState } from 'react';

const featureItems = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over $50',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    description: 'Protected checkout every time',
  },
  {
    icon: Award,
    title: 'Easy Returns',
    description: 'Simple 30-day return policy',
  },
];

const footerGroups = [
  {
    title: 'Shop',
    links: [
      { href: '/products', label: 'All Products' },
      { href: '/categories', label: 'Categories' },
      { href: '/deals', label: 'Deals & Offers' },
      { href: '/track-order', label: 'Track Order' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/contact', label: 'Contact Us' },
      { href: '/faq', label: 'FAQ' },
      { href: '/shipping', label: 'Shipping Info' },
      { href: '/returns', label: 'Returns & Exchanges' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return;
    }

    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <footer className="border-t border-[#dce5d0] bg-[linear-gradient(180deg,#fbfdf8_0%,#f2f7eb_100%)] text-[#223013]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {featureItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[1.6rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_45px_-35px_rgba(35,45,24,0.45)] backdrop-blur"
              >
                <div className="flex items-start gap-4">
                  <span className="rounded-2xl bg-[#eef5ff] p-3 text-[#1f6feb]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#1d2811]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#66725b]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-8 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_70px_-45px_rgba(35,45,24,0.4)] backdrop-blur lg:grid-cols-[1.15fr_1fr] lg:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#738160]">
              Stay Connected
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#16200d] sm:text-3xl">
              Light, clean, and built for shoppers who want clarity.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#617055]">
              Get product drops, limited-time offers, and account updates in a
              softer footer experience that matches the navbar.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="min-w-0 flex-1 rounded-full border border-[#d8dfcc] bg-[#fbfcf9] px-4 py-3 text-sm text-[#1f2a13] outline-none transition focus:border-[#93a374]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#2f3b1d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#243015]"
              >
                Subscribe
              </button>
            </form>

            {isSubscribed ? (
              <p className="mt-3 text-sm font-medium text-[#2d7a36]">
                Subscription successful.
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-[#e4eadb] bg-[#f9fbf6] p-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-[#1f6feb]" />
                <div>
                  <p className="text-sm font-semibold text-[#1f2a13]">
                    Call us
                  </p>
                  <p className="mt-1 text-sm text-[#66725b]">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[#e4eadb] bg-[#f9fbf6] p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-[#42621f]" />
                <div>
                  <p className="text-sm font-semibold text-[#1f2a13]">
                    Email support
                  </p>
                  <p className="mt-1 text-sm text-[#66725b]">
                    support@shophub.com
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-[#e4eadb] bg-[#f9fbf6] p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-[#8d5a11]" />
                <div>
                  <p className="text-sm font-semibold text-[#1f2a13]">
                    Visit us
                  </p>
                  <p className="mt-1 text-sm text-[#66725b]">
                    123 Commerce St, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 rounded-[2rem] border border-[#dfe7d4] bg-white/60 p-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h3 className="text-2xl font-black text-[#16200d]">ShopHub</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#66725b]">
              Your premium destination for thoughtful products, easier account
              management, and a cleaner shopping experience from top to bottom.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-[#5e6b52]">
                  {group.title}
                </h4>
                <div className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-[#435236] transition hover:text-[#1f6feb]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[#dce5d0] pt-6 text-sm text-[#66725b] md:flex-row md:items-center md:justify-between">
          <p>© 2026 ShopHub. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="transition hover:text-[#1f6feb]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-[#1f6feb]">
              Terms of Service
            </Link>
            <Link href="/cookies" className="transition hover:text-[#1f6feb]">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
