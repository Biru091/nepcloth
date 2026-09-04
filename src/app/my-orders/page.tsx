"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
} from "lucide-react";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface Order {
  id: string;
  email: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "cod" | "online";
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus:
    | "pending"
    | "paid"
    | "failed";
  createdAt: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openOrder, setOpenOrder] = useState<string | null>(
    null
  );

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/orders", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to load orders."
          );
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("LOAD ORDERS ERROR:", error);

        setError(
          "Something went wrong while loading your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-NP",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (
    status: Order["status"]
  ) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700";

      case "confirmed":
        return "bg-blue-50 text-blue-700";

      case "processing":
        return "bg-purple-50 text-purple-700";

      case "shipped":
        return "bg-indigo-50 text-indigo-700";

      case "delivered":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-black/5 text-black/60";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl items-center justify-center">
          <p className="text-sm text-black/40">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center text-center">
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>

          <Link
            href="/login"
            className="bg-black px-8 py-4 text-sm font-medium uppercase tracking-wider text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  // =====================================================
  // NO ORDERS
  // =====================================================

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
        <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center text-center">
          <Package
            size={40}
            strokeWidth={1}
            className="mb-6"
          />

          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-black/40">
            NEPCLOTH
          </p>

          <h1 className="text-4xl font-medium tracking-tight">
            No orders yet
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-black/40">
            You haven,t placed any orders yet.
            Start shopping and your orders will
            appear here.
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

  // =====================================================
  // ORDERS PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-12">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            NEPCLOTH
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
            My Orders
          </h1>

          <p className="mt-4 text-sm text-black/40">
            View your order history and track your
            purchases.
          </p>
        </div>

        {/* ORDERS */}

        <div className="space-y-5">
          {orders.map((order) => {
            const isOpen =
              openOrder === order.id;

            return (
              <div
                key={order.id}
                className="border border-black/10"
              >
                {/* ORDER HEADER */}

                <button
                  type="button"
                  onClick={() =>
                    setOpenOrder(
                      isOpen ? null : order.id
                    )
                  }
                  className="w-full p-5 text-left md:p-6"
                >
                  <div className="flex items-center justify-between gap-4">

                    <div>
                      <p className="text-xs text-black/40">
                        Order
                      </p>

                      <p className="mt-1 break-all text-sm font-medium">
                        #{order.id}
                      </p>
                    </div>

                    {isOpen ? (
                      <ChevronUp
                        size={18}
                        className="shrink-0"
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                        className="shrink-0"
                      />
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">

                    {/* DATE */}

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-black/40">
                        Date
                      </p>

                      <p className="mt-1 text-sm">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>
                    </div>

                    {/* ITEMS */}

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-black/40">
                        Items
                      </p>

                      <p className="mt-1 text-sm">
                        {order.items.reduce(
                          (total, item) =>
                            total +
                            item.quantity,
                          0
                        )}
                      </p>
                    </div>

                    {/* TOTAL */}

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-black/40">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        Rs.{" "}
                        {order.total.toLocaleString()}
                      </p>
                    </div>

                    {/* STATUS */}

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-black/40">
                        Status
                      </p>

                      <span
                        className={`mt-1 inline-block px-2.5 py-1 text-[10px] font-medium capitalize ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </button>

                {/* ORDER DETAILS */}

                {isOpen && (
                  <div className="border-t border-black/10 px-5 py-6 md:px-6">

                    {/* PRODUCTS */}

                    <div>
                      <h2 className="text-sm font-medium">
                        Order Items
                      </h2>

                      <div className="mt-5 divide-y divide-black/10">
                        {order.items.map(
                          (item, index) => (
                            <div
                              key={`${item.productId}-${item.size}-${index}`}
                              className="flex items-center justify-between gap-4 py-4"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium">
                                  {item.name}
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  Size:{" "}
                                  {item.size}
                                </p>

                                <p className="mt-1 text-xs text-black/40">
                                  Quantity:{" "}
                                  {item.quantity}
                                </p>
                              </div>

                              <p className="shrink-0 text-sm">
                                Rs.{" "}
                                {(
                                  item.price *
                                  item.quantity
                                ).toLocaleString()}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* DELIVERY */}

                    <div className="mt-8 border-t border-black/10 pt-6">
                      <h2 className="text-sm font-medium">
                        Delivery Information
                      </h2>

                      <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">

                        <div>
                          <p className="text-xs text-black/40">
                            Name
                          </p>

                          <p className="mt-1">
                            {
                              order.customer
                                .firstName
                            }{" "}
                            {
                              order.customer
                                .lastName
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-black/40">
                            Phone
                          </p>

                          <p className="mt-1">
                            {
                              order.customer
                                .phone
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-black/40">
                            Email
                          </p>

                          <p className="mt-1 break-all">
                            {order.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-black/40">
                            City
                          </p>

                          <p className="mt-1">
                            {
                              order.customer
                                .city
                            }
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-xs text-black/40">
                            Address
                          </p>

                          <p className="mt-1">
                            {
                              order.customer
                                .address
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-black/40">
                            Postal Code
                          </p>

                          <p className="mt-1">
                            {
                              order.customer
                                .postalCode
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PAYMENT */}

                    <div className="mt-8 border-t border-black/10 pt-6">
                      <h2 className="text-sm font-medium">
                        Payment
                      </h2>

                      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">

                        <div>
                          <p className="text-xs text-black/40">
                            Method
                          </p>

                          <p className="mt-1 text-sm uppercase">
                            {order.paymentMethod ===
                            "cod"
                              ? "Cash on Delivery"
                              : "Online Payment"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-black/40">
                            Payment Status
                          </p>

                          <p className="mt-1 text-sm capitalize">
                            {
                              order.paymentStatus
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-black/40">
                            Order Status
                          </p>

                          <p className="mt-1 text-sm capitalize">
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PRICE SUMMARY */}

                    <div className="mt-8 border-t border-black/10 pt-6">
                      <div className="ml-auto max-w-sm space-y-3">

                        <div className="flex justify-between text-sm">
                          <span className="text-black/50">
                            Subtotal
                          </span>

                          <span>
                            Rs.{" "}
                            {order.subtotal.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-black/50">
                            Shipping
                          </span>

                          <span>
                            {order.shipping ===
                            0
                              ? "Free"
                              : `Rs. ${order.shipping.toLocaleString()}`}
                          </span>
                        </div>

                        <div className="flex justify-between border-t border-black/10 pt-4 text-sm font-medium">
                          <span>Total</span>

                          <span>
                            Rs.{" "}
                            {order.total.toLocaleString()}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}