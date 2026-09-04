import ProductCard from "@/app/components/ProductCard/ProductCard";
import { Product } from "@/app/types/products";

async function getProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.products || [];
}

export default async function TrendingPage() {
  const products = await getProducts();

  const trendingProducts = products.filter(
    (product) => product.trending
  );

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            Most Wanted
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            Trending
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-black/50">
            Discover the pieces everyone is talking about.
            Explore our most popular styles and current favorites.
          </p>
        </div>

        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between border-y border-black/10 py-4">
          <p className="text-xs text-black/50">
            {trendingProducts.length} Products
          </p>

          <button
            type="button"
            className="text-xs font-medium uppercase tracking-wider"
          >
            Filter & Sort
          </button>
        </div>

        {/* Products */}
        {trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-black/50">
              No trending products available.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}