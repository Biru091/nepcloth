"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/app/context/CartContext";
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

  const [transactionCode, setTransactionCode] =
    useState("");

  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);

  const [screenshotPreview, setScreenshotPreview] =
    useState("");

  const [orderMessage, setOrderMessage] =
    useState("");

  const [orderError, setOrderError] =
    useState("");

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

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);

    setOrderMessage("");
    setOrderError("");

    if (method === "cod") {
      setTransactionCode("");
      setPaymentScreenshot(null);
      setScreenshotPreview("");
    }
  };

  // Handle screenshot upload
  const handleScreenshotChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPaymentScreenshot(null);
      setScreenshotPreview("");
      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      setOrderError(
        "Payment screenshot must be smaller than 5MB."
      );

      e.target.value = "";
      setPaymentScreenshot(null);
      setScreenshotPreview("");

      return;
    }

    setOrderError("");
    setPaymentScreenshot(file);

    const previewUrl = URL.createObjectURL(file);
    setScreenshotPreview(previewUrl);
  };

  // Place order
  const handlePlaceOrder = () => {
    setOrderMessage("");
    setOrderError("");

    if (paymentMethod === "online") {
      if (!transactionCode.trim()) {
        setOrderError(
          "Please enter your transaction code."
        );
        return;
      }

      if (!paymentScreenshot) {
        setOrderError(
          "Please upload your payment screenshot."
        );
        return;
      }
    }

    /*
      Later this function will send the order to:

      POST /api/orders

      including:
      - products
      - customer information
      - payment method
      - transaction code
      - payment screenshot
      - total
    */

    setOrderMessage(
      "Your order has been submitted successfully."
    );

    console.log({
      paymentMethod,
      transactionCode,
      paymentScreenshot,
      cart: cartProducts,
      subtotal,
      shipping,
      total,
    });
  };

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

          {/* ================= LEFT ================= */}
          <div>

            {/* Contact */}
            <section>

              <h2 className="text-lg font-medium">
                Contact Information
              </h2>

              <div className="mt-6">

                <label
                  htmlFor="email"
                  className="text-xs text-black/50"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
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

                {/* First Name */}
                <div>

                  <label
                    htmlFor="first-name"
                    className="text-xs text-black/50"
                  >
                    First Name
                  </label>

                  <input
                    id="first-name"
                    type="text"
                    placeholder="First name"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                {/* Last Name */}
                <div>

                  <label
                    htmlFor="last-name"
                    className="text-xs text-black/50"
                  >
                    Last Name
                  </label>

                  <input
                    id="last-name"
                    type="text"
                    placeholder="Last name"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                {/* Phone */}
                <div className="md:col-span-2">

                  <label
                    htmlFor="phone"
                    className="text-xs text-black/50"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="98XXXXXXXX"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                {/* Address */}
                <div className="md:col-span-2">

                  <label
                    htmlFor="address"
                    className="text-xs text-black/50"
                  >
                    Address
                  </label>

                  <input
                    id="address"
                    type="text"
                    placeholder="Street / Tole"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                {/* City */}
                <div>

                  <label
                    htmlFor="city"
                    className="text-xs text-black/50"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    placeholder="Kathmandu"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

                {/* Postal Code */}
                <div>

                  <label
                    htmlFor="postal-code"
                    className="text-xs text-black/50"
                  >
                    Postal Code
                  </label>

                  <input
                    id="postal-code"
                    type="text"
                    placeholder="44600"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />

                </div>

              </div>

            </section>

            {/* ================= PAYMENT ================= */}
            <section className="mt-12">

              <h2 className="text-lg font-medium">
                Payment Method
              </h2>

              <div className="mt-6 space-y-3">

                {/* COD */}
                <button
                  type="button"
                  onClick={() =>
                    handlePaymentMethodChange("cod")
                  }
                  className={`flex w-full items-center justify-between border p-4 text-left transition ${
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
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      paymentMethod === "cod"
                        ? "border-black"
                        : "border-black/30"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="h-2 w-2 rounded-full bg-black" />
                    )}
                  </div>

                </button>

                {/* ONLINE PAYMENT */}
                <button
                  type="button"
                  onClick={() =>
                    handlePaymentMethodChange("online")
                  }
                  className={`flex w-full items-center justify-between border p-4 text-left transition ${
                    paymentMethod === "online"
                      ? "border-black"
                      : "border-black/10"
                  }`}
                >

                  <div>

                    <p className="text-sm font-medium">
                      Online Payment
                    </p>

                    <p className="mt-1 text-xs text-black/40">
                      Pay using QR code
                    </p>

                  </div>

                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      paymentMethod === "online"
                        ? "border-black"
                        : "border-black/30"
                    }`}
                  >
                    {paymentMethod === "online" && (
                      <div className="h-2 w-2 rounded-full bg-black" />
                    )}
                  </div>

                </button>

              </div>

              {/* ONLINE PAYMENT DETAILS */}
              {paymentMethod === "online" && (
                <div className="mt-6 border border-black/10 p-5 md:p-6">

                  {/* QR */}
                  <div className="text-center">

                    <p className="text-sm font-medium">
                      Scan to Pay
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/40">
                      Scan the QR code using your mobile
                      banking app.
                    </p>

                    <div className="mx-auto mt-5 w-fit border border-black/10 p-3">

                      <Image
                        src="/qr/qr.jpg"
                        alt="NEPCLOTH payment QR code"
                        width={220}
                        height={220}
                        className="h-auto w-[220px]"
                        priority
                      />

                    </div>

                    <p className="mt-4 text-sm font-medium">
                      Amount: Rs. {total}
                    </p>

                  </div>

                  {/* Transaction Code */}
                  <div className="mt-7">

                    <label
                      htmlFor="transaction-code"
                      className="text-xs text-black/50"
                    >
                      Transaction Code
                    </label>

                    <input
                      id="transaction-code"
                      type="text"
                      value={transactionCode}
                      onChange={(e) => {
                        setTransactionCode(e.target.value);
                        setOrderError("");
                        setOrderMessage("");
                      }}
                      placeholder="Enter your transaction ID"
                      required={paymentMethod === "online"}
                      className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                    />

                    <p className="mt-2 text-[11px] leading-5 text-black/40">
                      Enter the transaction/reference number
                      from your payment.
                    </p>

                  </div>

                  {/* Screenshot */}
                  <div className="mt-6">

                    <label
                      htmlFor="payment-screenshot"
                      className="text-xs text-black/50"
                    >
                      Payment Screenshot
                    </label>

                    <input
                      id="payment-screenshot"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      required={paymentMethod === "online"}
                      onChange={handleScreenshotChange}
                      className="mt-2 block w-full cursor-pointer border border-black/15 px-3 py-3 text-sm outline-none file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:font-medium file:text-white"
                    />

                    <p className="mt-2 text-[11px] leading-5 text-black/40">
                      PNG, JPG or WEBP · Maximum 5MB
                    </p>

                  </div>

                  {/* Screenshot Preview */}
                  {screenshotPreview && (
                    <div className="mt-6">

                      <p className="mb-2 text-xs text-black/50">
                        Screenshot Preview
                      </p>

                      <div className="relative overflow-hidden border border-black/10 bg-neutral-50">

                        <Image
                          src={screenshotPreview}
                          alt="Payment screenshot preview"
                          width={800}
                          height={800}
                          unoptimized
                          className="max-h-[400px] w-full object-contain"
                        />

                      </div>

                    </div>
                  )}

                </div>
              )}

            </section>

          </div>

          {/* ================= RIGHT ================= */}
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

                      {/* Product Image */}
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-neutral-100">

                        <Image
                          src="/tshirt/tshirt.webp"
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />

                      </div>

                      {/* Product Info */}
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
                              className="flex h-7 w-7 items-center justify-center transition hover:bg-black hover:text-white"
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
                              className="flex h-7 w-7 items-center justify-center transition hover:bg-black hover:text-white"
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
                            className="text-black/30 transition hover:text-black"
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

              {/* Total */}
              <div className="mt-6 flex justify-between border-t border-black/10 pt-6">

                <span className="font-medium">
                  Total
                </span>

                <span className="font-medium">
                  Rs. {total}
                </span>

              </div>

              {/* Error */}
              {orderError && (
                <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                  {orderError}
                </div>
              )}

              {/* Success */}
              {orderMessage && (
                <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
                  {orderMessage}
                </div>
              )}

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