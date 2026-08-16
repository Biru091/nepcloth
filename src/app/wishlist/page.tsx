"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import productsData from "@/app/data/products.json";

import { Product } from "../types/products";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
  } = useCart();

  const products = productsData.products as Product[];

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  return (
    <main className="min-h-screen px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Wishlist
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1
                ? "item"
                : "items"}
            </p>
          </div>

          <Heart
            size={28}
            strokeWidth={1.5}
          />
        </div>

        {/* Empty Wishlist */}
        {wishlistProducts.length === 0 && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <Heart
              size={48}
              strokeWidth={1}
              className="mb-5"
            />

            <h2 className="text-xl font-medium">
              Your wishlist is empty
            </h2>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Save products you love and come back to
              them later.
            </p>

            <Link
              href="/products"
              className="mt-6 bg-black px-6 py-3 text-sm text-white"
            >
              Explore Products
            </Link>
          </div>
        )}

        {/* Wishlist Products */}
        {wishlistProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group relative"
              >
                {/* Remove */}
                <button
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                  className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <X size={16} />
                </button>

                {/* Product Image */}
                <Link
                  href={`/products/${product.slug}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Image
                      src="/tshirt/tshirt.webp"
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="mt-4">
                  <Link
                    href={`/products/${product.slug}`}
                  >
                    <h2 className="text-sm font-medium">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-1 text-sm text-gray-500">
                    Rs. {product.price.toLocaleString()}
                  </p>

                  {/* Add to cart */}
                  <button
                    onClick={() =>
                      addToCart(product.id, "M")
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 border border-black py-2.5 text-sm transition-colors hover:bg-black hover:text-white"
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}