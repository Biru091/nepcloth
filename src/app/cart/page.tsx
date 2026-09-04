
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/app/context/CartContext";
import { Product } from "@/app/types/products";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
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
          "CART PRODUCTS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================================
  // MATCH CART ITEMS WITH PRODUCTS
  // =====================================================

  const cartProducts = cart
    .map((cartItem) => {
      const product =
        products.find(
          (product) =>
            product.id ===
            cartItem.productId
        );

      if (!product) {
        return null;
      }

      return {
        product,
        cartItem,
      };
    })
    .filter(
      (
        item
      ): item is {
        product: Product;
        cartItem: (typeof cart)[number];
      } => item !== null
    );

  // =====================================================
  // IMAGE
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

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const subtotal =
    cartProducts.reduce(
      (
        total,
        { product, cartItem }
      ) =>
        total +
        product.price *
          cartItem.quantity,
      0
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12">
            <div className="h-3 w-20 animate-pulse bg-neutral-100" />

            <div className="mt-4 h-12 w-64 animate-pulse bg-neutral-100" />

            <div className="mt-4 h-4 w-20 animate-pulse bg-neutral-100" />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">

            <div className="space-y-6">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="flex gap-5 border-b border-black/10 pb-6"
                >
                  <div className="h-36 w-28 animate-pulse bg-neutral-100" />

                  <div className="flex-1">
                    <div className="h-4 w-32 animate-pulse bg-neutral-100" />

                    <div className="mt-3 h-3 w-16 animate-pulse bg-neutral-100" />

                    <div className="mt-8 h-9 w-28 animate-pulse bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>

            <div className="h-72 animate-pulse bg-neutral-100" />

          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center text-center">

          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            Your Bag
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
            Your cart is empty
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-6 text-black/50">
            Looks like you haven&apos;t
            added anything to your cart
            yet.
          </p>

          <Link
            href="/products"
            className="mt-8 bg-black px-8 py-4 text-sm font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-80"
          >
            Shop T-Shirts
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-12">

          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            Your Bag
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
            Shopping Cart
          </h1>

          <p className="mt-4 text-sm text-black/50">
            {cart.length}{" "}
            {cart.length === 1
              ? "item"
              : "items"}
          </p>

        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">

          {/* =====================================================
              CART ITEMS
          ===================================================== */}

          <div>

            <div className="border-t border-black/10">

              {cartProducts.map(
                ({
                  product,
                  cartItem,
                }) => {

                  const imageSrc =
                    getImageSrc(product);

                  return (
                    <div
                      key={`${product.id}-${cartItem.size}`}
                      className="flex gap-4 border-b border-black/10 py-6 md:gap-6"
                    >

                      {/* IMAGE */}

                      <Link
                        href={`/products/${product.id}`}
                        className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden bg-neutral-100 md:w-36"
                      >

                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={product.name}
                            fill
                            unoptimized
                            sizes="144px"
                            className="object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-xs text-black/40">
                              Image unavailable
                            </span>
                          </div>
                        )}

                      </Link>

                      {/* DETAILS */}

                      <div className="flex min-w-0 flex-1 flex-col">

                        <div className="flex justify-between gap-4">

                          <div>

                            <Link
                              href={`/products/${product.id}`}
                              className="text-sm font-medium"
                            >
                              {product.name}
                            </Link>

                            <p className="mt-1 text-xs text-black/50">
                              Size:{" "}
                              {cartItem.size}
                            </p>

                            {product.type ===
                              "printed" && (
                              <p className="mt-1 text-xs capitalize text-black/40">
                                {product.print ||
                                  "Printed"}

                                {product.printCoverage
                                  ? ` · ${product.printCoverage} print`
                                  : ""}
                              </p>
                            )}

                          </div>

                          {/* PRICE */}

                          <p className="shrink-0 text-sm font-medium">
                            Rs.{" "}
                            {(
                              product.price *
                              cartItem.quantity
                            ).toLocaleString()}
                          </p>

                        </div>

                        {/* CONTROLS */}

                        <div className="mt-auto flex items-center justify-between pt-6">

                          {/* QUANTITY */}

                          <div className="flex items-center border border-black/15">

                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  cartItem.size,
                                  cartItem.quantity -
                                    1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center hover:bg-black hover:text-white"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="flex h-9 w-9 items-center justify-center text-sm">
                              {
                                cartItem.quantity
                              }
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  cartItem.size,
                                  cartItem.quantity +
                                    1
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center hover:bg-black hover:text-white"
                            >
                              <Plus size={14} />
                            </button>

                          </div>

                          {/* REMOVE */}

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                product.id,
                                cartItem.size
                              )
                            }
                            className="flex items-center gap-2 text-xs text-black/40 transition-colors hover:text-black"
                          >
                            <Trash2 size={15} />

                            <span className="hidden sm:block">
                              Remove
                            </span>
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {/* CONTINUE */}

            <Link
              href="/products"
              className="mt-6 inline-block border-b border-black pb-1 text-sm"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* =====================================================
              ORDER SUMMARY
          ===================================================== */}

          <div>

            <div className="border border-black/10 p-6 md:p-8">

              <h2 className="text-lg font-medium">
                Order Summary
              </h2>

              <div className="mt-8 space-y-4 border-b border-black/10 pb-6">

                <div className="flex justify-between text-sm">

                  <span className="text-black/50">
                    Subtotal
                  </span>

                  <span>
                    Rs.{" "}
                    {subtotal.toLocaleString()}
                  </span>

                </div>

                

              </div>

              <div className="flex justify-between py-6">

                <span className="font-medium">
                  Total
                </span>

                <span className="font-medium">
                  Rs.{" "}
                  {subtotal.toLocaleString()}
                </span>

              </div>

              <Link
                href="/buy"
                className="block w-full bg-black py-4 text-center text-sm font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-80"
              >
                Proceed to Checkout
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-black/40">
                Shipping charges will be
                calculated during checkout.
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
