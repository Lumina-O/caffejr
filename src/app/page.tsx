import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Hero from "@/components/sections/Hero/Hero";
import Help from "@/components/sections/Help/Help";
import Process from "@/components/sections/Process/Process";
import Testimonials from "@/components/sections/Testimonials/Testimonials";
import Contact from "@/components/sections/Contact/Contact";
import "./globals.css";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Help />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}

// TODO: Add final spacing polish, responsive tuning, and real assets from the approved design.