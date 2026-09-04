"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import ProductCard from "@/app/components/ProductCard/ProductCard";
import { Product } from "@/app/types/products";

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(productList);
      } catch (error) {
        console.error("FETCH PRODUCTS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return false;
    }

    return (
      product.name?.toLowerCase().includes(query) ||
      product.slug?.toLowerCase().includes(query) ||
      product.type?.toLowerCase().includes(query) ||
      product.print?.toLowerCase().includes(query) ||
      product.printCoverage?.toLowerCase().includes(query)
    );
  });

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  function clearSearch() {
    setSearch("");
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-white px-5 pb-20 pt-28 md:px-10 lg:px-16">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Search
          </h1>

          <p className="mt-2 text-sm text-black/50">
            Find the perfect product for you.
          </p>
        </div>

        {/* ================= SEARCH INPUT ================= */}

        <div className="mx-auto flex max-w-2xl items-center border-b border-black/20 pb-3">

          <Search
            size={20}
            strokeWidth={1.5}
            className="mr-3 shrink-0 text-black/40"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for t-shirts, printed, plain..."
            autoFocus
            className="w-full bg-transparent text-base outline-none placeholder:text-black/30"
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="ml-3 shrink-0 text-black/40 transition hover:text-black"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="py-24 text-center">
            <p className="text-sm text-black/40">
              Loading products...
            </p>
          </div>
        )}

        {/* ================= RESULTS ================= */}

        {!loading && search && (
          <>
            <div className="mt-10 mb-6">
              <p className="text-sm text-black/50">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "product"
                  : "products"}{" "}
                found for{" "}
                <span className="font-medium text-black">
                  `&ldquo;`{search}`&rdquo;`
                </span>
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">

                <Search
                  size={32}
                  strokeWidth={1.2}
                  className="mx-auto mb-4 text-black/20"
                />

                <h2 className="text-lg font-medium">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-black/40">
                  Try searching for another product.
                </p>

              </div>
            )}
          </>
        )}

        {/* ================= BEFORE SEARCH ================= */}

        {!loading && !search && (
          <div className="py-24 text-center">

            <Search
              size={32}
              strokeWidth={1.2}
              className="mx-auto mb-4 text-black/20"
            />

            <p className="text-sm text-black/40">
              Start typing to search products.
            </p>

          </div>
        )}

      </div>
    </main>
  );
}

