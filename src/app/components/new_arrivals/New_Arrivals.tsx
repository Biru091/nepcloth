"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import ProductCard from "@/app/components/ProductCard/ProductCard";
import { Product } from "@/app/types/products";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Fetch ONLY new arrival products
        const response = await fetch(
          "/api/products?newArrival=true"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        setProducts(data.products);
      } catch (error) {
        console.error(
          "NEW ARRIVALS LOAD ERROR:",
          error
        );

        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // API already returns only new arrivals.
  // Display maximum 6 on homepage.
  const newArrivalProducts = products.slice(0, 6);

  return (
    <section className="w-full px-4 py-10 md:px-6 lg:pt-14">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
            New Arrivals
          </h2>
        </div>

        <Link
          href="/category/new-arrivals"
          className="group hidden items-center gap-2 text-sm font-medium md:flex"
        >
          View all

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Loading */}

      {loading && (
        <div className="py-20 text-center">
          <p className="text-sm text-black/50">
            Loading products...
          </p>
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="py-20 text-center">
          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Products */}

      {!loading &&
        !error &&
        newArrivalProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {newArrivalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      {/* Empty */}

      {!loading &&
        !error &&
        newArrivalProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-black/50">
              No new arrivals available.
            </p>
          </div>
        )}

      {/* Mobile View All */}

      <div className="mt-10 flex justify-center md:hidden">
        <Link
          href="/category/new-arrivals"
          className="border-b border-black pb-1 text-sm font-medium"
        >
          View all new arrivals
        </Link>
      </div>
    </section>
  );
}
