import Link from "next/link";

export default function HeroContent() {
  return (
    <div className="relative flex min-h-[calc(100svh-64px)] flex-col justify-between overflow-hidden bg-[#f4f3ef] px-6 py-8 sm:px-10 lg:px-16 lg:py-10">

      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[12%] top-0 h-full w-px bg-black/10" />
        <div className="absolute left-1/2 top-0 h-full w-px bg-black/10" />
        <div className="absolute right-[12%] top-0 h-full w-px bg-black/10" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-black/10" />
        <div className="absolute left-0 top-2/3 h-px w-full bg-black/10" />
      </div>

      {/* Top */}
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.3em]">
          NEPCLOTH
        </p>

        <p className="text-xs uppercase tracking-[0.25em] text-black/50">
          EST. 2026
        </p>
      </div>

      {/* Main */}
      <div className="relative z-10 py-12">

        <p className="mb-6 text-xs uppercase tracking-[0.35em] text-black/50">
          Everyday / Unordinary
        </p>

        <h1 className="max-w-6xl text-[17vw] font-medium leading-[0.78] tracking-[-0.08em]  text-black sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem]">
          <span className="animate-pulse">WEAR</span>
          <br />

          <span className="ml-[8vw] ">YOUR</span>
          <br />

          <span className="text-black/30">OWN.</span>
        </h1>

        <div className="mt-10 flex flex-col gap-6 sm:ml-[8vw] sm:flex-row sm:items-center sm:gap-10">

          <p className="max-w-xs text-sm leading-6 text-black/60">
            Clothing for those who dont follow the usual.
            Designed with intention. Made to be remembered.
          </p>

          <Link
            href="/shop"
            className="group flex w-fit items-center gap-4 rounded-full bg-black px-7 py-4 text-sm font-medium text-white transition-all duration-300 hover:px-9"
          >
            <span className="animate-pulse" >Explore Collection</span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 flex items-end justify-between">

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
            Kathmandu — Nepal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-black" />

          <p className="text-[10px] uppercase tracking-[0.3em] text-black/50">
            Scroll to explore
          </p>
        </div>

      </div>

    </div>
  );
}