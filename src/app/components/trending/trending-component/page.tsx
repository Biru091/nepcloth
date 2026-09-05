"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import ProductCard from "../../ProductCard/ProductCard";

import { Product } from "@/app/types/products";

export default function Trending() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // =================================================
        // FETCH ONLY TRENDING PRODUCTS
        // =================================================

        const response = await fetch(
          "/api/products?trending=true"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        // =================================================
        // GET RESPONSE DATA
        // =================================================

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        // =================================================
        // SAVE PRODUCTS
        // =================================================

        setProducts(data.products);
      } catch (error) {
        console.error("TRENDING LOAD ERROR:", error);

        setError("Unable to load trending products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // API already returns only trending products.
  // Homepage displays maximum 6.
  const trendingProducts = products.slice(0, 6);

  return (
    <section className="w-full px-4 py-10 md:px-6 lg:py-2">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            Discover
          </p>

          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
            Trending
          </h2>
        </div>

        <Link
          href="/category/trending"
          className="group hidden items-center gap-2 text-sm font-medium md:flex"
        >
          View all

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div className="py-20 text-center">
          <p className="text-sm text-black/50">
            Loading products...
          </p>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div className="py-20 text-center">
          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* =================================================
          PRODUCTS
      ================================================= */}

      {!loading &&
        !error &&
        trendingProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        trendingProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-black/50">
              No trending products available.
            </p>
          </div>
        )}

      {/* =================================================
          MOBILE VIEW
      ================================================= */}

      <div className="mt-10 flex justify-center md:hidden">
        <Link
          href="/category/trending"
          className="border-b border-black pb-1 text-sm font-medium"
        >
          View all trending
        </Link>
      </div>
    </section>
  );
}
