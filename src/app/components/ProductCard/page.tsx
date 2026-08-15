"use client"
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/types/products";
interface ProductCardProps {
  product: Product;
  image?: string;
}

export default function ProductCard({
  product,
  image = "/products/demo-tshirt.jpg",
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <Image
          src="/tshirt/tshirt.webp"
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {/* New badge */}
        {product.newArrival && (
          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-black">
            New
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-black opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
        >
          ♡
        </button>
      </div>

      {/* Product information */}
      <div className="px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium tracking-tight text-black">
              {product.name}
            </h3>

            <p className="mt-1 text-xs capitalize text-black/50">
              {product.type === "printed"
                ? `${product.printCoverage} print`
                : "Plain"}
            </p>
          </div>

          <p className="shrink-0 text-sm font-medium text-black">
            Rs. {product.price}
          </p>
        </div>
      </div>
    </Link>
  );
}