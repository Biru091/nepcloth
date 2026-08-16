import HeroContent from "./heroContent";
export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-30"
      >
        <source
          src="/videos/nepcloth1.mp4"
          type="video/mp4"
        />
      </video>

      {/* Hero Content */}
      <HeroContent />

    </section>
  );
}