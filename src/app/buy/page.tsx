"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/app/context/CartContext"
import productsData from "@/app/data/products.json";
import { Product } from "@/app/types/products";

export default function BuyPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const products: Product[] =
    productsData.products as Product[];

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

 

  const cartProducts = cart
    .map((cartItem) => {
      const product = products.find(
        (product) => product.id === cartItem.productId
      );

      if (!product) return null;

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

  const subtotal = cartProducts.reduce(
    (total, { product, cartItem }) =>
      total + product.price * cartItem.quantity,
    0
  );

  const shipping = subtotal >= 3000 ? 0 : 150;

  const total = subtotal + shipping;

  // Empty cart
  if (cartProducts.length === 0) {
    return (
      <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center text-center">

          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/40">
            Checkout
          </p>

          <h1 className="text-4xl font-medium tracking-tight">
            Your cart is empty
          </h1>

          <Link
            href="/products"
            className="mt-8 bg-black px-8 py-4 text-sm font-medium uppercase tracking-wider text-white"
          >
            Shop T-Shirts
          </Link>

        </div>
      </main>
    );
  }

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
  };

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">

          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            NEPCLOTH
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
            Checkout
          </h1>

        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">

          {/* LEFT */}
          <div>

            {/* Contact */}
            <section>

              <h2 className="text-lg font-medium">
                Contact Information
              </h2>

              <div className="mt-6">

                <label className="text-xs text-black/50">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                />

              </div>

            </section>

            {/* Delivery */}
            <section className="mt-12">

              <h2 className="text-lg font-medium">
                Delivery Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="text-xs text-black/50">
                    First Name
                  </label>

                  <input
                    type="text"
                    placeholder="First name"
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs text-black/50">
                    Last Name
                  </label>

                  <input
                    type="text"
                    placeholder="Last name"
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div className="md:col-span-2">

                  <label className="text-xs text-black/50">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="98XXXXXXXX"
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                <div className="md:col-span-2">

                  <label className="text-xs text-black/50">
                    Address
                  </label>

                  <input
                    type="text"
                    placeholder="Street / Tole"
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                <div>
                  <label className="text-xs text-black/50">
                    City
                  </label>

                  <input
                    type="text"
                    placeholder="Kathmandu"
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs text-black/50">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    placeholder="44600"
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

              </div>

            </section>

            {/* Payment */}
            <section className="mt-12">

              <h2 className="text-lg font-medium">
                Payment Method
              </h2>

              <div className="mt-6 space-y-3">

                {/* COD */}
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod("cod")
                  }
                  className={`flex w-full items-center justify-between border p-4 text-left ${
                    paymentMethod === "cod"
                      ? "border-black"
                      : "border-black/10"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      Pay when your order arrives
                    </p>
                  </div>

                  <div
                    className={`h-4 w-4 rounded-full border ${
                      paymentMethod === "cod"
                        ? "border-black bg-black"
                        : "border-black/30"
                    }`}
                  />
                </button>               

              </div>

            </section>

          </div>

          {/* RIGHT */}
          <div>

            <div className="border border-black/10 p-6 md:p-8">

              <h2 className="text-lg font-medium">
                Your Order
              </h2>

              {/* Products */}
              <div className="mt-6 space-y-5">

                {cartProducts.map(
                  ({ product, cartItem }) => (
                    <div
                      key={`${product.id}-${cartItem.size}`}
                      className="flex gap-4"
                    >

                      {/* Image */}
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-neutral-100">

                        <Image
                          src="/tshirt/tshirt.webp"
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />

                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">

                        <p className="text-sm font-medium">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-black/40">
                          Size: {cartItem.size}
                        </p>

                        <p className="mt-1 text-xs text-black/40">
                          Rs. {product.price}
                        </p>

                        {/* Quantity */}
                        <div className="mt-3 flex items-center justify-between">

                          <div className="flex items-center border border-black/10">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  cartItem.size,
                                  cartItem.quantity - 1
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center hover:bg-black hover:text-white"
                            >
                              <Minus size={12} />
                            </button>

                            <span className="flex h-7 w-7 items-center justify-center text-xs">
                              {cartItem.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  cartItem.size,
                                  cartItem.quantity + 1
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center hover:bg-black hover:text-white"
                            >
                              <Plus size={12} />
                            </button>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                product.id,
                                cartItem.size
                              )
                            }
                            className="text-black/30 hover:text-black"
                          >
                            <Trash2 size={14} />
                          </button>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

              {/* Summary */}
              <div className="mt-8 space-y-4 border-t border-black/10 pt-6">

                <div className="flex justify-between text-sm">
                  <span className="text-black/50">
                    Subtotal
                  </span>

                  <span>
                    Rs. {subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-black/50">
                    Shipping
                  </span>

                  <span>
                    {shipping === 0
                      ? "Free"
                      : `Rs. ${shipping}`}
                  </span>
                </div>

              </div>

              <div className="mt-6 flex justify-between border-t border-black/10 pt-6">

                <span className="font-medium">
                  Total
                </span>

                <span className="font-medium">
                  Rs. {total}
                </span>

              </div>

              {/* Place Order */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="mt-8 w-full bg-black py-4 text-sm font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-80"
              >
                Place Order
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-black/40">
                By placing your order, you agree to our
                terms and conditions.
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}