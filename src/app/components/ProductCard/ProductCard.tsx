"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Product } from "@/app/types/products";
import { useCart } from "@/app/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useCart();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlist = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  /*
   * Image comes from MongoDB:
   *
   * frontImage: {
   *   data: "...base64...",
   *   contentType: "image/jpeg"
   * }
   *
   * Convert it into a browser-readable data URL.
   */
  const imageSrc =
    product.frontImage?.data &&
    product.frontImage.contentType
      ? `data:${product.frontImage.contentType};base64,${product.frontImage.data}`
      : null;

  return (
    <div className="group block border border-black/10 transition-all duration-300 group-hover:shadow-lg ">
      {/* ================= IMAGE ================= */}
      <div className="relative aspect-5/4 w-full overflow-hidden bg-white ">
        <Link
          href={`/products/${product.id}`}
          className="block h-full w-full"
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              unoptimized
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-100">
              <span className="text-xs text-black/40">
                Image unavailable
              </span>
            </div>
          )}
        </Link>

        {/* ================= NEW BADGE ================= */}
        {product.newArrival && (
          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-black">
            New
          </span>
        )}

        {/* ================= WISHLIST ================= */}
        <button
          type="button"
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          onClick={handleWishlist}
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-black backdrop-blur-sm transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <Heart
            size={17}
            strokeWidth={1.8}
            fill={
              isWishlisted
                ? "currentColor"
                : "none"
            }
          />
        </button>
      </div>

      {/* ================= PRODUCT INFO ================= */}
      <Link href={`/products/${product.id}`}>
        <div className="px-1 py-2 border border-t border-black/10 ">
          <div className="flex items-start justify-between gap-3 px-3 py-1">

            {/* Name + Type */}
            <div>
              <h3 className="text-sm font-medium tracking-tight text-black">
                {product.name}
              </h3>

              <p className="mt-1 text-xs capitalize text-black/50">
                {product.type === "printed"
                  ? product.printCoverage
                    ? `${product.printCoverage} print`
                    : "Printed"
                  : "Plain"}
              </p>
            </div>

            {/* Price */}
            <p className="shrink-0 text-sm font-medium text-black">
              Rs. {product.price}
            </p>

          </div>
        </div>
      </Link>
    </div>
  );
}