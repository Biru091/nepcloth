"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="pointer-events-auto fixed left-0 top-0 z-[100] w-full  bg-white text-black">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-7 md:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 transition-opacity hover:opacity-60"
        >
          <Image
            src="/logo/Logo.png"
            alt="NEPCLOTH"
            width={56}
            height={56}
            className="h-15 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex ">
          <Link
            href="/"
            className="text-sm transition-opacity hover:opacity-60"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="text-sm transition-opacity hover:opacity-60"
          >
            T-Shirts
          </Link>

          <Link
            href="/category/new-arrivals"
            className="text-sm transition-opacity hover:opacity-60"
          >
            New Arrivals
          </Link>

          <Link
            href="/category/trending"
            className="text-sm transition-opacity hover:opacity-60"
          >
            Trending
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/search"
            aria-label="Search"
            className="transition-opacity hover:opacity-60"
          >
            <Search size={20} strokeWidth={1.8} />
          </Link>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="transition-opacity hover:opacity-60"
          >
            <Heart size={20} strokeWidth={1.8} />
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="transition-opacity hover:opacity-60"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-6 md:hidden">
          <Link href="/search" aria-label="Search">
            <Search size={20} strokeWidth={1.8} />
          </Link>

          <Link href="/cart" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.8} />
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X size={22} strokeWidth={1.8} />
            ) : (
              <Menu size={22} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute left-0 top-16 w-full border-t border-black/10 bg-white px-4 py-6 shadow-md md:hidden">
          <div className="flex flex-col gap-5">

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm"
            >
              Home
            </Link>

            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="text-sm"
            >
              T-Shirts
            </Link>

            <Link
              href="/category/new-arrivals"
              onClick={() => setMobileOpen(false)}
              className="text-sm"
            >
              New Arrivals
            </Link>

            <Link
              href="/category/trending"
              onClick={() => setMobileOpen(false)}
              className="text-sm"
            >
              Trending
            </Link>

            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="text-sm"
            >
              Wishlist
            </Link>
          </div>
          
        </div>
        
      )}
      <div className="h-10"></div>
    </header>
  );
}