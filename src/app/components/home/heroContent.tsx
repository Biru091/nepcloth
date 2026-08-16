import Link from "next/link";
export default function HeroContent() {
  
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center">

      <div className="flex flex-col items-center">

        <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-red-800">
          NEPCLOTH
        </p>

        <h1 className="max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-red-900 sm:text-6xl md:text-7xl lg:text-8xl">
          Wear Y
          <span className="text-red">o</span>
          ur Identity
        </h1>

        <p className="mt-6 max-w-md text-sm leading-6  sm:text-base text-white">
          Contemporary pieces designed to express who you are.
        </p>

        <div className="pointer-events-auto mt-8 flex items-center gap-3">

          <Link
            href="/products"
            className="rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition-transform duration-300 hover:scale-105"
          >
            Explore Collection
          </Link>

          <Link
            href="/category/new-arrivals"
            className="rounded-full border border-black/20 bg-white/40 px-7 py-3 text-sm font-medium text-black backdrop-blur-sm transition-colors duration-300 hover:bg-black hover:text-white"
          >
            New Arrivals
          </Link>

        </div>

      </div>
    </div>
  );
}