"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  UserRoundKey,
  LogOut,
  Package,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const { user, logout } = useAuth();

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logout();

      setUserMenuOpen(false);
      setMobileOpen(false);
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  };

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="pointer-events-auto fixed left-0 top-0 z-[100] w-full text-black">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between bg-white px-7 md:px-6">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          href="/"
          className="shrink-0"
          onClick={closeMobileMenu}
        >
          <Image
            src="/logo/Logo.png"
            alt="NEPCLOTH"
            width={56}
            height={56}
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* =====================================================
            DESKTOP LINKS
        ===================================================== */}

        <div className="hidden items-center gap-8 md:flex ">

          <Link
            href="/"
            className="text-sm"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="text-sm"
          >
            T-Shirts
          </Link>

          <Link
            href="/category/new-arrivals"
            className="text-sm"
          >
            New Arrivals
          </Link>

          <Link
            href="/category/trending"
            className="text-sm"
          >
            Trending
          </Link>

        </div>

        {/* =====================================================
            DESKTOP ACTIONS
        ===================================================== */}

        <div className="hidden items-center gap-7 md:flex ">

          {/* SEARCH */}

          <Link
            href="/search"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          {/* WISHLIST */}

          <Link
            href="/wishlist"
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </Link>

          {/* CART */}

          <Link
            href="/cart"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
          </Link>

          {/* =================================================
              MY ORDERS
          ================================================= */}

          {user && (
            <Link
              href="/my-orders"
              aria-label="My Orders"
              title="My Orders"
            >
              <Package size={20} />
            </Link>
          )}

          {/* =================================================
              USER
          ================================================= */}

          {user ? (
            <div className="relative">

              {/* USER BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setUserMenuOpen(
                    !userMenuOpen
                  )
                }
                className="flex items-center gap-2"
                aria-label="Account"
              >
                <UserRoundKey size={20} />

                
              </button>

              {/* USER DROPDOWN */}

              {userMenuOpen && (
                <div className="absolute right-0 top-10 w-56 border border-black/10 bg-white p-3 shadow-lg">

                  {/* USER INFO */}

                  <div className="px-2 py-2">

                    <p className="text-sm font-medium">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-black/50">
                      {user.email}
                    </p>

                  </div>

                  {/* MY ORDERS */}

                  <Link
                    href="/my-orders"
                    onClick={() =>
                      setUserMenuOpen(false)
                    }
                    className="mt-2 flex items-center gap-2 border-t border-black/10 px-2 py-3 text-sm transition hover:bg-black/[0.03]"
                  >
                    <Package size={17} />

                    <span>
                      My Orders
                    </span>
                  </Link>

                  {/* PROFILE */}

                 

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-black/10 px-2 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />

                    <span>
                      Logout
                    </span>
                  </button>

                </div>
              )}

            </div>
          ) : (

            /* LOGIN */

            <Link
              href="/auth"
              aria-label="Login"
            >
              <UserRoundKey size={20} />
            </Link>

          )}

        </div>

        {/* =====================================================
            MOBILE ACTIONS
            NO MY ORDERS ICON
        ===================================================== */}

        <div className="flex items-center gap-6 md:hidden">

          {/* SEARCH */}

          <Link
            href="/search"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>

          {/* CART */}

          <Link
            href="/cart"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
          </Link>

          {/* USER */}

          {user ? (

            <button
              type="button"
              onClick={() =>
                setUserMenuOpen(
                  !userMenuOpen
                )
              }
              aria-label="Account"
            >
              <UserRoundKey size={20} />
            </button>

          ) : (

            <Link
              href="/auth"
              aria-label="Login"
            >
              <UserRoundKey size={20} />
            </Link>

          )}

          {/* MENU */}

          <button
            type="button"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setUserMenuOpen(false);
            }}
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

      </nav>

      {/* =====================================================
          MOBILE ACCOUNT MENU
      ===================================================== */}

      {user &&
        userMenuOpen &&
        !mobileOpen && (

          <div className="border-t border-black/10 bg-white px-5 py-5 shadow-md md:hidden">

            {/* USER INFO */}

            <div className="border-b border-black/10 pb-4">

              <p className="text-sm font-medium">
                {user.name}
              </p>

              <p className="mt-1 break-all text-xs text-black/50">
                {user.email}
              </p>

            </div>

            {/* MY ORDERS */}

            <Link
              href="/my-orders"
              onClick={() =>
                setUserMenuOpen(false)
              }
              className="flex items-center gap-3 py-4 text-sm"
            >
              <Package size={18} />

              <span>
                My Orders
              </span>
            </Link>

            {/* PROFILE */}

           
            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 border-t border-black/10 py-4 text-sm text-red-600"
            >
              <LogOut size={18} />

              <span>
                Logout
              </span>
            </button>

          </div>

        )}

      {/* =====================================================
          MOBILE NAVIGATION MENU
      ===================================================== */}

      {mobileOpen && (

        <div className="border-t border-black/10 bg-white px-5 py-6 md:hidden">

          <div className="flex flex-col gap-5">

            {/* HOME */}

            <Link
              href="/"
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {/* T-SHIRTS */}

            <Link
              href="/products"
              onClick={closeMobileMenu}
            >
              T-Shirts
            </Link>

            {/* NEW ARRIVALS */}

            <Link
              href="/category/new-arrivals"
              onClick={closeMobileMenu}
            >
              New Arrivals
            </Link>

            {/* TRENDING */}

            <Link
              href="/category/trending"
              onClick={closeMobileMenu}
            >
              Trending
            </Link>

            {/* WISHLIST */}

            <Link
              href="/wishlist"
              onClick={closeMobileMenu}
            >
              Wishlist
            </Link>

            {/* =================================================
                LOGGED IN USER
            ================================================= */}

            {user && (
              <>

                {/* USER INFO */}

                <div className="border-t border-black/10 pt-5">

                  <p className="text-sm font-medium">
                    {user.name}
                  </p>

                  <p className="mt-1 break-all text-xs text-black/50">
                    {user.email}
                  </p>

                </div>

                {/* MY ORDERS */}

                <Link
                  href="/my-orders"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3"
                >
                  <Package size={18} />

                  <span>
                    My Orders
                  </span>
                </Link>

                {/* PROFILE */}

                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3"
                >
                  <UserRoundKey size={18} />

                  <span>
                    Profile
                  </span>
                </Link>

                {/* LOGOUT */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-red-600"
                >
                  <LogOut size={17} />

                  <span>
                    Logout
                  </span>
                </button>

              </>
            )}

          </div>

        </div>

      )}

    </header>
  );
}