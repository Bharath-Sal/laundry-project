import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Services from "@/components/sections/Services";
import Pricing from "@/components/sections/Pricing";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0A0F2C]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <Pricing />
    </main>
  );
}
