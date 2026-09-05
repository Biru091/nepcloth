import ProductCard from "@/app/components/ProductCard/ProductCard";
import { getNewArrivalProducts } from "@/app/libs/products";
import { Product } from "@/app/types/products";

export default async function NewArrivalsPage() {
  const products = await getNewArrivalProducts();

  const newArrivalProducts = products as unknown as Product[];

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-12">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            Latest Drop
          </p>

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            New Arrivals
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-black/50">
            Explore our latest pieces, fresh designs, and new
            additions to the collection.
          </p>
        </div>

        {/* TOP BAR */}

        <div className="mb-8 flex items-center justify-between border-y border-black/10 py-4">
          <p className="text-xs text-black/50">
            {newArrivalProducts.length} Products
          </p>

          <button
            type="button"
            className="text-xs font-medium uppercase tracking-wider"
          >
            Filter & Sort
          </button>
        </div>

        {/* PRODUCTS */}

        {newArrivalProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {newArrivalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-black/50">
              No new arrivals available.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
