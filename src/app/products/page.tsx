"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import { Product } from "@/app/types/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/products");

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
        console.error("PRODUCT LOAD ERROR:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            The Collection
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            All T-Shirts
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-black/50">
            Explore the complete NEPCLOTH collection.
            Discover printed and plain styles made for everyday wear.
          </p>
        </div>

        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between border-y border-black/10 py-4">
          <p className="text-xs text-black/50">
            {loading ? "Loading..." : `${products.length} Products`}
          </p>

          <button
            type="button"
            className="text-xs font-medium uppercase tracking-wider"
          >
            Filter & Sort
          </button>
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

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-black/50">
              No products available.
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}