import Hero from "../components/Hero";
import SignatureDishes from "../components/SignatureDishes";
import BentoGrid from "../components/BentoGrid";
import Stats from "../components/Stats";
import BookTable from "../components/BookTable";
import Testimonials from "../components/Testimonials";
import Recommendations from "../components/Recommendations";

export default function Home() {
  return (
    <>
      <Hero />
      <Recommendations />
      <SignatureDishes />
      <BentoGrid />
      <Stats />
      <BookTable />
      <Testimonials />
    </>
  );
}
