import Link from "next/link";
import productsData from "@/app/data/products.json"
import ProductCard from "../ProductCard/page";
import { Product } from "@/app/types/products";
export default function NewArrivals() {
  const products: Product[] =
    productsData.products as Product[];

  const newArrivalProducts = products
    .filter((product) => product.newArrival)
    .slice(0, 6);

  return (
    <section className="w-full px-4 py-20 md:px-6 lg:py-25">

      {/* Heading */}
      <div className="mb-10 flex items-end justify-between">

        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
            Just In
          </p>

          <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
            New Arrivals
          </h2>
        </div>

        {/* Desktop */}
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

      {/* Products */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {newArrivalProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* Mobile */}
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