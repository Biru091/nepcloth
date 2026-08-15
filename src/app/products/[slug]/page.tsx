"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext"
import { useRouter } from "next/navigation";
import productsData from "@/app/data/products.json"
import { Product } from "@/app/types/products";

export default function ProductPage() {

    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { addToCart } = useCart();
    const products: Product[] =
        productsData.products as Product[];

    const product = products.find(
        (product) => product.slug === slug
    );

    if (!product) {
        notFound();
    }

    const [view, setView] = useState<"front" | "back">("front");
    const [selectedSize, setSelectedSize] = useState<string>("")

    const image =
        view === "front"
            ? "/tshirt/tshirt.webp"
            : "/tshirt/tshirt-back.jpg";

    return (
        <main className="min-h-screen bg-white px-4 pb-20 pt-24 md:px-6 md:pt-28">

            <div className="mx-auto max-w-7xl">

                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-xs text-black/40">
                    <Link href="/">Home</Link>

                    <span>/</span>

                    <Link href="/products">
                        T-Shirts
                    </Link>

                    <span>/</span>

                    <span className="text-black/60">
                        {product.name}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">

                    {/* IMAGE SECTION */}
                    <div>

                        {/* Main Image */}
                        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">

                            <Image
                                src={image}
                                alt={`${product.name} ${view}`}
                                fill
                                priority
                                className="object-cover transition-opacity duration-300"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {product.newArrival && (
                                <span className="absolute left-4 top-4 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                                    New
                                </span>
                            )}

                        </div>

                        {/* Front / Back Buttons */}
                        <div className="mt-4 grid grid-cols-2 gap-2">

                            <button
                                type="button"
                                onClick={() => setView("front")}
                                className={`py-3 text-sm font-medium transition-colors ${view === "front"
                                    ? "bg-black text-white"
                                    : "border border-black/15 hover:border-black"
                                    }`}
                            >
                                Front
                            </button>

                            <button
                                type="button"
                                onClick={() => setView("back")}
                                className={`py-3 text-sm font-medium transition-colors ${view === "back"
                                    ? "bg-black text-white"
                                    : "border border-black/15 hover:border-black"
                                    }`}
                            >
                                Back
                            </button>

                        </div>

                    </div>

                    {/* PRODUCT INFO */}
                    <div className="flex flex-col justify-center">

                        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
                            NEPCLOTH
                        </p>

                        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
                            {product.name}
                        </h1>

                        <p className="mt-4 text-lg font-medium">
                            Rs. {product.price}
                        </p>

                        <p className="mt-6 max-w-md text-sm leading-7 text-black/50">
                            A premium everyday T-shirt designed with a clean
                            silhouette and distinctive NEPCLOTH aesthetic.
                        </p>

                        {/* Details */}
                        <div className="mt-8 border-y border-black/10">

                            <div className="flex justify-between border-b border-black/10 py-4 text-sm">
                                <span className="text-black/50">
                                    Type
                                </span>

                                <span className="capitalize">
                                    {product.type}
                                </span>
                            </div>

                            {product.type === "printed" && (
                                <div className="flex justify-between border-b border-black/10 py-4 text-sm">
                                    <span className="text-black/50">
                                        Print
                                    </span>

                                    <span className="capitalize">
                                        {product.print} · {product.printCoverage}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between py-4 text-sm">
                                <span className="text-black/50">
                                    Availability
                                </span>

                                <span>
                                    In Stock
                                </span>
                            </div>

                        </div>

                        {/* Size */}
                        <div className="mt-8">

                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm font-medium">
                                    Select Size
                                </p>

                                <button
                                    type="button"
                                    className="text-xs text-black/50 underline"
                                >
                                    Size Guide
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-2">

                                {["S", "M", "L", "XL"].map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={` ${selectedSize === size
                                            ? "border-black bg-black text-white"
                                            : "border-black/15 bg-white text-black hover:border-black hover:bg-black hover:text-white"
                                            } border-black/15 py-3 text-sm transition-colors  hover:border-black hover:bg-black hover:text-white`}
                                        onClick={() => {
                                            setSelectedSize(size)
                                            
                                        }
                                        }
                                    >
                                        {size}
                                    </button>
                                ))}

                            </div>

                        </div>

                        {/* Buttons */}
                        <button
                            type="button"
                            className="mt-8 w-full bg-black py-4 text-sm font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-80"
                            onClick={() => {
                                if (!selectedSize) {
                                    alert("Please select a size");
                                    return;
                                }

                                addToCart(product.id, selectedSize);
                                router.push("/cart");

                            }}

                        >
                            Add to Cart
                        </button>

                        <button
                            type="button"
                            className="mt-3 w-full border border-black py-4 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-black hover:text-white"
                        >
                            Buy Now
                        </button>

                    </div>

                </div>

            </div>

        </main>
    );
}