'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Share2, MessageCircle, Heart, Users, Truck, Shield, Award } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Free Shipping */}
            <div className="flex flex-col items-center text-center group">
              <div className="mb-3 p-3 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-all duration-300 transform group-hover:scale-110">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">Free Shipping</h3>
              <p className="text-sm text-gray-400">On orders over $50</p>
            </div>

            {/* Secure Payment */}
            <div className="flex flex-col items-center text-center group">
              <div className="mb-3 p-3 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-all duration-300 transform group-hover:scale-110">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">Secure Payment</h3>
              <p className="text-sm text-gray-400">100% secure transactions</p>
            </div>

            {/* Easy Returns */}
            <div className="flex flex-col items-center text-center group">
              <div className="mb-3 p-3 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-all duration-300 transform group-hover:scale-110">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">Easy Returns</h3>
              <p className="text-sm text-gray-400">30-day return policy</p>
            </div>

            {/* 24/7 Support */}
            <div className="flex flex-col items-center text-center group">
              <div className="mb-3 p-3 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-all duration-300 transform group-hover:scale-110">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">24/7 Support</h3>
              <p className="text-sm text-gray-400">Dedicated support team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-800">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-8 md:p-12 text-center transform hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-blue-100 mb-6">Get exclusive deals, updates, and special offers delivered to your inbox!</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>
          {isSubscribed && (
            <p className="text-white text-sm mt-3 animate-pulse">✓ Thank you for subscribing!</p>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">ShopHub</h3>
            <p className="text-gray-400 text-sm mb-4">Your premium destination for quality products at unbeatable prices.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
                <Heart className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110">
                <Users className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Deals & Offers
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/bestsellers" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:translate-x-1 inline-block">
                  Partnerships
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors duration-200">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors duration-200">support@shophub.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm group-hover:text-blue-400 transition-colors duration-200">123 Commerce St, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <p className="text-gray-400 text-sm">&copy; 2026 ShopHub. All rights reserved.</p>
            <div className="flex gap-4 justify-center md:justify-center text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Terms of Service
              </Link>
              <span className="text-gray-600">•</span>
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-right">Made with ❤️ by ShopHub</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
