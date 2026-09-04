"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "@/app/context/CartContext";
import { Product } from "@/app/types/products";

export default function BuyPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  // =====================================================
  // PRODUCTS
  // =====================================================

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // PAYMENT
  // =====================================================

  const [paymentMethod, setPaymentMethod] =
    useState<"cod" | "online">("cod");

  const [transactionCode, setTransactionCode] =
    useState("");

  const [paymentScreenshot, setPaymentScreenshot] =
    useState<File | null>(null);

  const [screenshotPreview, setScreenshotPreview] =
    useState("");

  // =====================================================
  // CUSTOMER
  // =====================================================

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // =====================================================
  // ORDER STATE
  // =====================================================

  const [orderMessage, setOrderMessage] =
    useState("");

  const [orderError, setOrderError] =
    useState("");

  const [placingOrder, setPlacingOrder] =
    useState(false);

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

        const data = await response.json();

        if (response.ok && data.success) {
          setProducts(data.products);
        } else {
          console.error(
            "PRODUCT LOAD ERROR:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "BUY PRODUCTS ERROR:",
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
      const product = products.find(
        (product) =>
          product.id === cartItem.productId
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
  // PRICE
  // =====================================================

  const subtotal = cartProducts.reduce(
    (total, { product, cartItem }) =>
      total +
      product.price * cartItem.quantity,
    0
  );

  const shipping = subtotal >= 3000 ? 0 : 150;

  const total = subtotal + shipping;

  // =====================================================
  // IMAGE
  // =====================================================

  const getImageSrc = (product: Product) => {
    if (
      product.frontImage?.data &&
      product.frontImage.contentType
    ) {
      return `data:${product.frontImage.contentType};base64,${product.frontImage.data}`;
    }

    return null;
  };

  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const handlePaymentMethodChange = (
    method: "cod" | "online"
  ) => {
    setPaymentMethod(method);

    setOrderMessage("");
    setOrderError("");

    if (method === "cod") {
      setTransactionCode("");
      setPaymentScreenshot(null);
      setScreenshotPreview("");
    }
  };

  // =====================================================
  // SCREENSHOT
  // =====================================================

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

    const previewUrl =
      URL.createObjectURL(file);

    setScreenshotPreview(previewUrl);
  };

  // =====================================================
  // FILE TO BASE64
  // =====================================================

  const fileToBase64 = (
    file: File
  ): Promise<string> => {
    return new Promise(
      (resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          resolve(reader.result as string);
        };

        reader.onerror = (error) => {
          reject(error);
        };
      }
    );
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================
    const router = useRouter();

  const handlePlaceOrder = async () => {
    setOrderMessage("");
    setOrderError("");

    // ---------------------------------------------
    // CHECK CART
    // ---------------------------------------------

    if (cartProducts.length === 0) {
      setOrderError(
        "Your cart is empty."
      );

      return;
    }

    // ---------------------------------------------
    // CUSTOMER VALIDATION
    // ---------------------------------------------

    if (!email.trim()) {
      setOrderError(
        "Please enter your email."
      );

      return;
    }

    if (!firstName.trim()) {
      setOrderError(
        "Please enter your first name."
      );

      return;
    }

    if (!lastName.trim()) {
      setOrderError(
        "Please enter your last name."
      );

      return;
    }

    if (!phone.trim()) {
      setOrderError(
        "Please enter your phone number."
      );

      return;
    }

    if (!address.trim()) {
      setOrderError(
        "Please enter your address."
      );

      return;
    }

    if (!city.trim()) {
      setOrderError(
        "Please enter your city."
      );

      return;
    }

    if (!postalCode.trim()) {
      setOrderError(
        "Please enter your postal code."
      );

      return;
    }

    // ---------------------------------------------
    // ONLINE PAYMENT VALIDATION
    // ---------------------------------------------

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

    try {
      setPlacingOrder(true);

      // -------------------------------------------
      // PAYMENT SCREENSHOT
      // -------------------------------------------

      let screenshotData:
        | {
          data: string;
          contentType: string;
        }
        | null = null;

      if (
        paymentMethod === "online" &&
        paymentScreenshot
      ) {
        const base64 =
          await fileToBase64(
            paymentScreenshot
          );

        screenshotData = {
          data: base64,
          contentType:
            paymentScreenshot.type,
        };
      }

      // -------------------------------------------
      // ORDER ITEMS
      // -------------------------------------------



      // -------------------------------------------
      // SEND ORDER
      // -------------------------------------------

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email: email.trim(),

            customer: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              phone: phone.trim(),
              address: address.trim(),
              city: city.trim(),
              postalCode: postalCode.trim(),
            },

            paymentMethod,

            transactionCode:
              paymentMethod === "online"
                ? transactionCode.trim()
                : null,

            paymentScreenshot:
              paymentMethod === "online"
                ? screenshotData
                : null,
          }),
        }
      );

      const data =
        await response.json();

      // -------------------------------------------
      // ERROR
      // -------------------------------------------

      if (!response.ok) {
        setOrderError(
          data.message ||
          "Failed to place order."
        );

        return;
      }

      // -------------------------------------------
      // SUCCESS
      // -------------------------------------------

      setOrderMessage(
        "Your order has been submitted successfully."
      );

      // Clear cart
      cartProducts.forEach(
        ({ product, cartItem }) => {
          removeFromCart(
            product.id,
            cartItem.size
          );
        }
      );

      // Clear payment fields
      setTransactionCode("");
      setPaymentScreenshot(null);
      setScreenshotPreview("");
      router.push("/my-orders");
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      setOrderError(
        "Something went wrong while placing your order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <p className="text-sm text-black/40">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // EMPTY CART
  // =====================================================

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

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-12">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            NEPCLOTH
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div>

            {/* CONTACT */}

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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setOrderError("");
                  }}
                  placeholder="you@example.com"
                  required
                  className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                />
              </div>
            </section>

            {/* DELIVERY */}

            <section className="mt-12">
              <h2 className="text-lg font-medium">
                Delivery Information
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* FIRST NAME */}

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
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(
                        e.target.value
                      );
                      setOrderError("");
                    }}
                    placeholder="First name"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* LAST NAME */}

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
                    value={lastName}
                    onChange={(e) => {
                      setLastName(
                        e.target.value
                      );
                      setOrderError("");
                    }}
                    placeholder="Last name"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* PHONE */}

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
                    value={phone}
                    onChange={(e) => {
                      setPhone(
                        e.target.value
                      );
                      setOrderError("");
                    }}
                    placeholder="98XXXXXXXX"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* ADDRESS */}

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
                    value={address}
                    onChange={(e) => {
                      setAddress(
                        e.target.value
                      );
                      setOrderError("");
                    }}
                    placeholder="Street / Tole"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* CITY */}

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
                    value={city}
                    onChange={(e) => {
                      setCity(
                        e.target.value
                      );
                      setOrderError("");
                    }}
                    placeholder="Kathmandu"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

                {/* POSTAL CODE */}

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
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(
                        e.target.value
                      );
                      setOrderError("");
                    }}
                    placeholder="44600"
                    required
                    className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
                  />
                </div>

              </div>
            </section>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <section className="mt-12">
              <h2 className="text-lg font-medium">
                Payment Method
              </h2>

              <div className="mt-6 space-y-3">

                {/* COD */}

                <button
                  type="button"
                  onClick={() =>
                    handlePaymentMethodChange(
                      "cod"
                    )
                  }
                  className={`flex w-full items-center justify-between border p-4 text-left transition ${paymentMethod === "cod"
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
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${paymentMethod === "cod"
                        ? "border-black"
                        : "border-black/30"
                      }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="h-2 w-2 rounded-full bg-black" />
                    )}
                  </div>
                </button>

                {/* ONLINE */}

                <button
                  type="button"
                  onClick={() =>
                    handlePaymentMethodChange(
                      "online"
                    )
                  }
                  className={`flex w-full items-center justify-between border p-4 text-left transition ${paymentMethod === "online"
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
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${paymentMethod === "online"
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

              {/* ONLINE DETAILS */}

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
                      Amount: Rs.{" "}
                      {total.toLocaleString()}
                    </p>
                  </div>

                  {/* TRANSACTION CODE */}

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
                        setTransactionCode(
                          e.target.value
                        );
                        setOrderError("");
                        setOrderMessage("");
                      }}
                      placeholder="Enter your transaction ID"
                      required={
                        paymentMethod === "online"
                      }
                      className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none transition-colors focus:border-black"
                    />

                    <p className="mt-2 text-[11px] leading-5 text-black/40">
                      Enter the transaction/reference number
                      from your payment.
                    </p>
                  </div>

                  {/* SCREENSHOT */}

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
                      required={
                        paymentMethod === "online"
                      }
                      onChange={
                        handleScreenshotChange
                      }
                      className="mt-2 block w-full cursor-pointer border border-black/15 px-3 py-3 text-sm outline-none file:mr-4 file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:font-medium file:text-white"
                    />

                    <p className="mt-2 text-[11px] leading-5 text-black/40">
                      PNG, JPG or WEBP · Maximum 5MB
                    </p>
                  </div>

                  {/* SCREENSHOT PREVIEW */}

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

          {/* =================================================
              RIGHT
          ================================================= */}

          <div>
            <div className="border border-black/10 p-6 md:p-8">

              <h2 className="text-lg font-medium">
                Your Order
              </h2>

              {/* PRODUCTS */}

              <div className="mt-6 space-y-5">
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
                        className="flex gap-4"
                      >

                        {/* IMAGE */}

                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-neutral-100">

                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={product.name}
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[10px] text-black/40">
                                No image
                              </span>
                            </div>
                          )}

                        </div>

                        {/* INFO */}

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-medium">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-black/40">
                            Size:{" "}
                            {cartItem.size}
                          </p>

                          <p className="mt-1 text-xs text-black/40">
                            Rs.{" "}
                            {product.price.toLocaleString()}
                          </p>

                          {/* QUANTITY */}

                          <div className="mt-3 flex items-center justify-between">

                            <div className="flex items-center border border-black/10">

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    cartItem.size,
                                    cartItem.quantity -
                                    1
                                  )
                                }
                                className="flex h-7 w-7 items-center justify-center transition hover:bg-black hover:text-white"
                              >
                                <Minus size={12} />
                              </button>

                              <span className="flex h-7 w-7 items-center justify-center text-xs">
                                {
                                  cartItem.quantity
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    cartItem.size,
                                    cartItem.quantity +
                                    1
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
                    );
                  }
                )}
              </div>

              {/* SUMMARY */}

              <div className="mt-8 space-y-4 border-t border-black/10 pt-6">

                <div className="flex justify-between text-sm">
                  <span className="text-black/50">
                    Subtotal
                  </span>

                  <span>
                    Rs.{" "}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-black/50">
                    Shipping
                  </span>

                  <span>
                    {shipping === 0
                      ? "Free"
                      : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>

              </div>

              {/* TOTAL */}

              <div className="mt-6 flex justify-between border-t border-black/10 pt-6">

                <span className="font-medium">
                  Total
                </span>

                <span className="font-medium">
                  Rs.{" "}
                  {total.toLocaleString()}
                </span>

              </div>

              {/* ERROR */}

              {orderError && (
                <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                  {orderError}
                </div>
              )}

              {/* SUCCESS */}

              {orderMessage && (
                <div className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">
                  {orderMessage}
                </div>
              )}

              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="mt-8 w-full bg-black py-4 text-sm font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
             >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
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