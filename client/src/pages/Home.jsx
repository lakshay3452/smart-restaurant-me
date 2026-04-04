import Hero from "../components/Hero";
import SignatureDishes from "../components/SignatureDishes";
import BentoGrid from "../components/BentoGrid";
import Stats from "../components/Stats";
import BookTable from "../components/BookTable";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <SignatureDishes />
      <BentoGrid />
      <Stats />
      <BookTable />
      <Testimonials />
    </>
  );
}
