import HeroContent from "./heroContent";
import Image from "next/image";
export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden py-7">

      {/* Background Video */}
      {/* <div className=" flex flex-col h-screen w-full md:flex-row gap-2 "> */}
        {/* <div className="flex flex-col flex-1 ">
          <Image src="/model/model.jpg" alt="1" width={300} height={300} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-row flex-1 md:flex-col ">
          <Image src="/model/model2.jpg" alt="" height={200} width={200} className="h-full w-1/2 object-cover md:h-1/2 md:w-full md:object-contain"/>
          <Image src="/model/model4.jpg" alt="" height={200} width={200} className="h-full w-1/2 object-cover md:h-1/2 md:w-full md:object-contain"/>

        </div>
      </div> */}

      {/* Hero Content */}
      <HeroContent />

    </section>
  );
}