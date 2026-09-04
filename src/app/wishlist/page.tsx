
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";

import { Product } from "@/app/types/products";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
  } = useCart();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // LOAD PRODUCTS FROM DATABASE
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(
          "/api/products",
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error(
          "WISHLIST PRODUCTS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================================
  // MATCH WISHLIST IDS WITH PRODUCTS
  // =====================================================

  const wishlistProducts =
    products.filter((product) =>
      wishlist.includes(product.id)
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="h-8 w-32 animate-pulse bg-gray-100" />

            <div className="mt-3 h-4 w-20 animate-pulse bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div key={index}>
                <div className="aspect-[3/4] animate-pulse bg-gray-100" />

                <div className="mt-4 h-4 w-32 animate-pulse bg-gray-100" />

                <div className="mt-2 h-4 w-20 animate-pulse bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // IMAGE FUNCTION
  // =====================================================

  const getImageSrc = (
    product: Product
  ) => {
    if (
      product.frontImage?.data &&
      product.frontImage.contentType
    ) {
      return `data:${product.frontImage.contentType};base64,${product.frontImage.data}`;
    }

    return null;
  };

  return (
    <main className="min-h-screen px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

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

        {/* ================= EMPTY ================= */}

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
              Save products you love and
              come back to them later.
            </p>

            <Link
              href="/products"
              className="mt-6 bg-black px-6 py-3 text-sm text-white"
            >
              Explore Products
            </Link>
          </div>
        )}

        {/* ================= PRODUCTS ================= */}

        {wishlistProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">

            {wishlistProducts.map(
              (product) => {

                const imageSrc =
                  getImageSrc(product);

                return (
                  <div
                    key={product.id}
                    className="group relative"
                  >

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(
                          product.id
                        )
                      }
                      className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow-sm"
                      aria-label="Remove from wishlist"
                    >
                      <X size={16} />
                    </button>

                    {/* IMAGE */}

                    <Link
                      href={`/products/${product.id}`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={product.name}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-xs text-black/40">
                              Image unavailable
                            </span>
                          </div>
                        )}

                      </div>
                    </Link>

                    {/* PRODUCT INFO */}

                    <div className="mt-4">

                      <Link
                        href={`/products/${product.id}`}
                      >
                        <h2 className="text-sm font-medium">
                          {product.name}
                        </h2>
                      </Link>

                      <p className="mt-1 text-sm text-gray-500">
                        Rs.{" "}
                        {product.price.toLocaleString()}
                      </p>

                      {/* ADD TO CART */}

                      <button
                        type="button"
                        onClick={() =>
                          addToCart(
                            product.id,
                            "M"
                          )
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 border border-black py-2.5 text-sm transition-colors hover:bg-black hover:text-white"
                      >
                        <ShoppingBag
                          size={16}
                        />

                        Add to Cart
                      </button>

                    </div>
                  </div>
                );
              }
            )}

          </div>
        )}
      </div>
    </main>
  );
}

