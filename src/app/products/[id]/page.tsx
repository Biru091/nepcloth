"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

interface Product {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  type: "printed" | "plain";
  print: string | null;
  printCoverage: "half" | "full" | null;
  price: number;
  trending: boolean;
  newArrival: boolean;
  frontImage: string | null;
  backImage: string | null;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [view, setView] =
    useState<"front" | "back">("front");

  const [selectedSize, setSelectedSize] =
    useState("");

  /*
   * =====================================================
   * FETCH PRODUCT
   * =====================================================
   */

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/products/${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Failed to fetch product"
          );
        }

        if (!cancelled) {
          setProduct(data.product);
          setError("");
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "PRODUCT FETCH ERROR:",
          error
        );

        if (!cancelled) {
          setError(
            "Unable to load product."
          );

          setProduct(null);
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  /*
   * =====================================================
   * ADD TO CART
   * =====================================================
   */

  function handleAddToCart() {
    if (!product) {
      return;
    }

    /*
     * Size required
     */

    if (!selectedSize) {
      setError("Please select a size.");
      return;
    }

    /*
     * User is NOT logged in
     *
     * Save the action first.
     */

    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({
          productId: product.id,
          size: selectedSize,
          redirect: "/cart",
        })
      );

      router.push(
        `/auth?redirect=${encodeURIComponent(
          "/cart"
        )}`
      );

      return;
    }

    /*
     * User is already logged in.
     */

    addToCart(
      product.id,
      selectedSize
    );

    router.push("/cart");
  }

  /*
   * =====================================================
   * BUY NOW
   * =====================================================
   */

  function handleBuyNow() {
    if (!product) {
      return;
    }

    /*
     * Size required
     */

    if (!selectedSize) {
      setError("Please select a size.");
      return;
    }

    /*
     * User is NOT logged in
     *
     * Save the action first.
     */

    if (!user) {
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({
          productId: product.id,
          size: selectedSize,
          redirect: "/buy",
        })
      );

      router.push(
        `/auth?redirect=${encodeURIComponent(
          "/buy"
        )}`
      );

      return;
    }

    /*
     * User is already logged in.
     */

    addToCart(
      product.id,
      selectedSize
    );

    router.push("/buy");
  }

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (loading || authLoading) {
    return (
      <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
            <div className="aspect-[4/5] w-full animate-pulse bg-neutral-100" />

            <div className="flex flex-col justify-center">
              <div className="h-3 w-24 animate-pulse bg-neutral-100" />

              <div className="mt-5 h-10 w-72 animate-pulse bg-neutral-100" />

              <div className="mt-5 h-6 w-32 animate-pulse bg-neutral-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * PRODUCT ERROR
   * =====================================================
   */

  if (error && !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="text-2xl font-medium">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-black/50">
            {error ||
              "This product may have been removed."}
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block bg-black px-6 py-3 text-sm text-white"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  /*
   * =====================================================
   * CURRENT IMAGE
   * =====================================================
   */

  const imageSrc =
    view === "front"
      ? product.frontImage
      : product.backImage;

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-6xl">

        {/* BREADCRUMB */}

        <div className="mb-8 flex items-center gap-2 text-xs text-black/40">
          <Link
            href="/"
            className="hover:text-black"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            href="/products"
            className="hover:text-black"
          >
            T-Shirts
          </Link>

          <span>/</span>

          <span className="text-black/60">
            {product.name}
          </span>
        </div>

       

        {/* PRODUCT */}

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">

          {/* =====================================================
              IMAGE
              ===================================================== */}

          <div>
            <div className="relative aspect-4/3 w-full overflow-hidden bg-white">

              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={`${product.name} ${view}`}
                  fill
                  priority
                  unoptimized
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-black/40">
                    Image unavailable
                  </span>
                </div>
              )}

              {product.newArrival && (
                <span className="absolute left-4 top-4 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                  New
                </span>
              )}
            </div>

            {/* FRONT / BACK */}

            <div className="mt-4 grid grid-cols-2 gap-2">

              <button
                type="button"
                onClick={() => {
                  setView("front");
                  setError("");
                }}
                className={`py-3 text-sm font-medium ${
                  view === "front"
                    ? "bg-black text-white"
                    : "border border-black/15 hover:border-black"
                }`}
              >
                Front
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("back");
                  setError("");
                }}
                className={`py-3 text-sm font-medium ${
                  view === "back"
                    ? "bg-black text-white"
                    : "border border-black/15 hover:border-black"
                }`}
              >
                Back
              </button>

            </div>
          </div>

          {/* =====================================================
              PRODUCT INFO
              ===================================================== */}

          <div className="flex flex-col justify-center">

            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
              NEPCLOTH
            </p>

            <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 text-lg font-medium">
              Rs. {product.price.toLocaleString()}
            </p>

            <p className="mt-6 max-w-md text-sm leading-7 text-black/50">
              A premium everyday T-shirt
              designed with a clean silhouette
              and distinctive NEPCLOTH aesthetic.
            </p>

            {/* DETAILS */}

            <div className="mt-8 border-y border-black/10">

              <div className="flex justify-between border-b border-black/10 py-4 text-sm">
                <span className="text-black/50">
                  Type
                </span>

                <span className="capitalize">
                  {product.type}
                </span>
              </div>

              {product.type === "printed" && (
                <div className="flex justify-between border-b border-black/10 py-4 text-sm">
                  <span className="text-black/50">
                    Print
                  </span>

                  <span className="capitalize">
                    {product.print || "Printed"}

                    {product.printCoverage
                      ? ` · ${product.printCoverage}`
                      : ""}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-4 text-sm">
                <span className="text-black/50">
                  Availability
                </span>

                <span>
                  In Stock
                </span>
              </div>

            </div>

            {/* SIZE */}

            <div className="mt-8">

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium">
                  Select Size
                </p>

                <button
                  type="button"
                  className="text-xs text-black/50 underline"
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">

                {[
                  "S",
                  "M",
                  "L",
                  "XL",
                ].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(size);
                      setError("");
                    }}
                    className={`border py-3 text-sm transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-black/15 hover:border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}

              </div>
            </div>

            {/* ADD TO CART */}

            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 w-full bg-black py-4 text-sm font-medium uppercase tracking-wider text-white hover:opacity-80"
            >
              Add to Cart
            </button>

            {/* BUY NOW */}

            <button
              type="button"
              onClick={handleBuyNow}
              className="mt-3 w-full border border-black py-4 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white"
            >
              Buy Now
            </button>
       
          </div>
            {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        </div>
      </div>
    </main>
  );
}