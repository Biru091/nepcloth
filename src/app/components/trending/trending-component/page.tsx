import Link from "next/link";
import products from "@/app/data/products.json"
import ProductCard from "../../ProductCard/page";
import { Product } from "@/app/types/products";

export default function Trending() {
    const productdata:Product[] =products.products as Product[]
  const trendingProducts = productdata
    .filter((product:Product) => product.trending)
    .slice(0, 6);

  return (
    <section className="w-full px-4 py-10 md:px-6 lg:py-2">

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

      <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {trendingProducts.map((product:Product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* Mobile Viw */}
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