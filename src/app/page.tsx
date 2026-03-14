"use client";

import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Hero from "@/components/sections/Hero/Hero";
import Help from "@/components/sections/Help/Help";
import Process from "@/components/sections/Process/Process";
import Testimonials from "@/components/sections/Testimonials/Testimonials";
import Contact from "@/components/sections/Contact/Contact";
import { useLanguage } from "@/context/LanguageContext";
import "./globals.css";

export default function Home() {
  const { language, setLanguage } = useLanguage();

  return (
    <main id="top" className="overflow-x-hidden">
      <Navbar language={language} onLanguageChange={setLanguage} />
      <Hero language={language} />
      <Help language={language} />
      <Process language={language} />
      <Testimonials language={language} />
      <Contact language={language} />
      <Footer language={language} />
    </main>
  );
}

// TODO: Remove any duplicate language state from other pages and use the context everywhere.
// TODO: Add browser-language detection if no saved language exists.