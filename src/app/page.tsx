import Hero from "./components/home/hero";
import HeroContent from "./components/home/heroContent";
import Trending from "./components/trending/trending-component/page";
import NewArrivals from "./components/new_arrivals/New_Arrivals";
export default function Home() {
  return (
    <div>
      <Hero/>
      <HeroContent/>
      <Trending/>
      <NewArrivals/>

    </div>
    
  );
}
