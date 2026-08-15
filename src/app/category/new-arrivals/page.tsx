import productsData from "@/app/data/products.json"
import ProductCard from "@/app/components/ProductCard/page";
import { Product } from "@/app/types/products";

export default function NewArrivalsPage() {
  const products: Product[] =
    productsData.products as Product[];

  const newArrivalProducts = products.filter(
    (product) => product.newArrival
  );

  return (
    <main className="min-h-screen bg-white px-4 pb-20 pt-28 md:px-6 md:pt-32">

      {/* Header */}
      <div className="mx-auto mb-12 max-w-7xl">

        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
          Latest Drop
        </p>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <h1 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            New Arrivals
          </h1>

          <p className="max-w-sm text-sm leading-6 text-black/50">
            Explore our latest pieces, fresh designs, and new
            additions to the collection.
          </p>

        </div>

      </div>

      {/* Product count */}
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between border-b border-black/10 pb-4">

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

      {/* Products */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {newArrivalProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* Empty state */}
      {newArrivalProducts.length === 0 && (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-black/50">
            No new arrivals available.
          </p>
        </div>
      )}

    </main>
  );
}