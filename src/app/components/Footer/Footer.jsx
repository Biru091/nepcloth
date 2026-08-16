import Link from "next/link";
import {
  Mail,
  ArrowUpRight,
} from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 w-full border-t border-black/10 bg-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              NEPCLOTH
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-black/50">
              Modern essentials made for everyday expression.
              Designed with simplicity, individuality, and
              comfort in mind.
            </p>

            {/* Social */}
            <div className="mt-7 flex items-center gap-4">

              <a
                href="https://www.instagram.com/nepcloth"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-black hover:text-white"
              >
                <FaInstagram size={16} strokeWidth={1.7} />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61593421283031"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-black hover:text-white"
              >
                <FaFacebookF size={16} strokeWidth={1.7} />
              </a>

              <a
                href="mailto:nishantkhadka566@gmail.com"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-colors hover:bg-black hover:text-white"
              >
                <Mail size={16} strokeWidth={1.7} />
              </a>

            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]">
              Shop
            </h3>

            <div className="flex flex-col gap-4 text-sm text-black/60">

              <Link
                href="/products"
                className="transition-colors hover:text-black"
              >
                T-Shirts
              </Link>

              <Link
                href="/category/new-arrivals"
                className="transition-colors hover:text-black"
              >
                New Arrivals
              </Link>

              <Link
                href="/category/trending"
                className="transition-colors hover:text-black"
              >
                Trending
              </Link>

              <Link
                href="/wishlist"
                className="transition-colors hover:text-black"
              >
                Wishlist
              </Link>

            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]">
              Help
            </h3>

            <div className="flex flex-col gap-4 text-sm text-black/60">

              <Link
                href="/contact"
                className="transition-colors hover:text-black"
              >
                Contact
              </Link>

              <Link
                href="/shipping"
                className="transition-colors hover:text-black"
              >
                Shipping
              </Link>

              <Link
                href="/returns"
                className="transition-colors hover:text-black"
              >
                Returns
              </Link>

              <Link
                href="/faq"
                className="transition-colors hover:text-black"
              >
                FAQ
              </Link>

            </div>
          </div>

        </div>

        {/* Newsletter */}
        <div className="mt-16 border-t border-black/10 pt-10">

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em]">
                Stay in the loop
              </p>

              <p className="mt-2 text-sm text-black/50">
                Get updates on new drops and collections.
              </p>
            </div>

            <form className="flex w-full max-w-md border-b border-black">

              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-black/30"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="flex items-center gap-1 text-sm font-medium"
              >
                Subscribe
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.8}
                />
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-black/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-black/40 md:flex-row md:items-center md:justify-between md:px-6">

          <p>
            © {new Date().getFullYear()} NEPCLOTH. All rights reserved.
          </p>

          <div className="flex gap-5">

            <Link
              href="/privacy"
              className="transition-colors hover:text-black"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-black"
            >
              Terms
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}