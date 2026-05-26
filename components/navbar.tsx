'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X, ChevronDown, User } from 'lucide-react';
import { useCart } from '@/components/use-cart';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { itemCount } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center group"
          >
            <div className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              ShopHub
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                {link.label}
              </Link>
            ))}

            {/* Dropdown Menu */}
            <div className="relative group">
              <button
                onClick={toggleDropdown}
                className="px-3 py-2 text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 ease-in-out flex items-center gap-1 group"
              >
                More
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Dropdown Content */}
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out transform origin-top group-hover:scale-y-100 scale-y-0">
                <Link
                  href="/deals"
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 first:rounded-t-md"
                >
                  Deals & Offers
                </Link>
                <Link
                  href="/blog"
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                >
                  Blog
                </Link>
                <Link
                  href="/help"
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 last:rounded-b-md"
                >
                  Help & Support
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side - Search, Cart, Account */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Hidden on small screens */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent text-gray-700 outline-none w-40 placeholder-gray-500 text-sm"
              />
              <Search className="w-4 h-4 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors duration-200" />
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 ? (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center hover:bg-red-600 transition-colors duration-200">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>

            {/* Account/User Icon */}
            <Link
              href="/account"
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
            >
              <User className="w-6 h-6" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Mobile Search */}
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-3 hover:bg-gray-200 transition-colors duration-200">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-gray-700 outline-none w-full placeholder-gray-500 text-sm"
              />
              <Search className="w-4 h-4 text-gray-500" />
            </div>

            {/* Mobile Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Dropdown */}
              <div>
                <button
                  onClick={toggleDropdown}
                  className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 flex items-center justify-between"
                >
                  More
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="pl-4 space-y-2 animate-in fade-in slide-in-from-top duration-200">
                    <Link
                      href="/deals"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Deals & Offers
                    </Link>
                    <Link
                      href="/blog"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Blog
                    </Link>
                    <Link
                      href="/help"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Help & Support
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
