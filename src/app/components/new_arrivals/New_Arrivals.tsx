
"use client";
import Link from "next/link";

import { useEffect, useState } from "react";

import ProductCard from "@/app/components/ProductCard/ProductCard";

import { Product } from "@/app/types/products";

export default function NewArrivalsPage() {
  // =====================================================
  // STATE
  // =====================================================

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // =================================================
        // FETCH FROM API
        // =================================================

        const response = await fetch("/api/products");

        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        // =================================================
        // GET JSON
        // =================================================

        const data = await response.json();

        // =================================================
        // CHECK API SUCCESS
        // =================================================

        if (!data.success) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        // =================================================
        // SAVE PRODUCTS
        // =================================================

        setProducts(data.products);
      } catch (error) {
        console.error("NEW ARRIVALS LOAD ERROR:", error);
        setError("Unable to load products.");
      } finally {
        // =================================================
        // STOP LOADING
        // =================================================

        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // =====================================================
  // FILTER LATEST 5 NEW ARRIVALS
  // =====================================================

  const newArrivalProducts = products
    .filter((product) => product.newArrival === true)
    .slice(0, 6);

  // =====================================================
  // RETURN
  // =====================================================

  
  
    return (
       <section className="w-full px-4 py-10 md:px-6 lg:pt-14">
         <div className="mb-10 flex items-end justify-between">
           <div>
            
   
             <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
               New Arrivals
             </h2>
           </div>
   
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
   
         {/* Loading */}
         {loading && (
           <div className="py-20 text-center">
             <p className="text-sm text-black/50">
               Loading products...
             </p>
           </div>
         )}
   
         {/* Error */}
         {!loading && error && (
           <div className="py-20 text-center">
             <p className="text-sm text-red-500">
               {error}
             </p>
           </div>
         )}
   
         {/* Products */}
         {!loading && !error && (
           <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
             {
             newArrivalProducts.map((product) => (
               <ProductCard
                 key={product.id}
                 product={product}
               />
             ))}
           </div>
         )}
   
         {/* Mobile View */}
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

