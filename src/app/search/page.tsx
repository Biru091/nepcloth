import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

import productsData from "@/app/data/products.json";
import { Product } from "@/app/types/products";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const query =
    typeof params?.q === "string"
      ? params.q
      : "";

  const products =
    productsData.products as Product[];

  // -----------------------------
  // FILTER PRODUCTS
  // -----------------------------

  const search = query
    .toLowerCase()
    .trim();

  const filteredProducts = search
    ? products.filter((product) => {
        return (
          product.name
            ?.toLowerCase()
            .includes(search) ||
          product.type
            ?.toLowerCase()
            .includes(search) ||
          product.slug
            ?.toLowerCase()
            .includes(search)
        );
      })
    : [];

  return (
    <main className="min-h-screen px-4 pb-20 pt-28 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mx-auto max-w-3xl">

          <h1 className="text-3xl font-medium tracking-tight md:text-5xl">
            Search
          </h1>

          {/* SEARCH BAR */}

          <form
            action="/search"
            method="GET"
            className="mt-8 flex items-center border-b border-black pb-3"
          >

            <Search
              size={20}
              strokeWidth={1.5}
              className="mr-3 shrink-0"
            />

            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search products..."
              className="w-full bg-transparent text-lg outline-none placeholder:text-black/30"
              autoFocus
            />

            {query && (
              <Link
                href="/search"
                className="ml-3 shrink-0"
                aria-label="Clear search"
              >
                <X
                  size={18}
                  strokeWidth={1.5}
                />
              </Link>
            )}

          </form>
        </div>

        {/* RESULTS */}

        <div className="mt-14">

          {/* NO QUERY */}

          {!query && (
            <div className="py-20 text-center">

              <p className="text-sm text-black/50">
                Search for products
              </p>

            </div>
          )}

          {/* NO RESULTS */}

          {query &&
            filteredProducts.length === 0 && (
              <div className="py-20 text-center">

                <p className="text-lg">
                  No products found
                </p>

                <p className="mt-2 text-sm text-black/50">
                  Try searching for something else.
                </p>

              </div>
            )}

          {/* RESULTS */}

          {filteredProducts.length > 0 && (
            <>

              {/* RESULT COUNT */}

              <div className="mb-8">

                <p className="text-sm text-black/50">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "result"
                    : "results"}{" "}
                  for &quot;{query}&quot;
                </p>

              </div>

              {/* PRODUCT GRID */}

              <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4">

                {filteredProducts.map(
                  (product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">

                        <Image
                          src="/tshirt/tshirt.webp"
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* NEW BADGE */}

                        {product.newArrival && (
                          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                            New
                          </span>
                        )}

                      </div>

                      {/* PRODUCT INFO */}

                      <div className="px-1 pt-4">

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <h2 className="text-sm font-medium tracking-tight">
                              {product.name}
                            </h2>

                            <p className="mt-1 text-xs capitalize text-black/50">
                              {product.type ===
                              "printed"
                                ? `${product.printCoverage} print`
                                : "Plain"}
                            </p>

                          </div>

                          <p className="shrink-0 text-sm font-medium">
                            Rs. {product.price}
                          </p>

                        </div>

                      </div>

                    </Link>
                  )
                )}

              </div>

            </>
          )}

        </div>
      </div>
    </main>
  );
}