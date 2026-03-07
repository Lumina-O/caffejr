"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Hero from "@/components/sections/Hero/Hero";
import Help from "@/components/sections/Help/Help";
import Process from "@/components/sections/Process/Process";
import Testimonials from "@/components/sections/Testimonials/Testimonials";
import Contact from "@/components/sections/Contact/Contact";
import type { Language } from "@/data/siteData";
import "./globals.css";

export default function Home() {
  const [language, setLanguage] = useState<Language>("da");

  return (
    <main className="overflow-x-hidden">
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

// TODO: Add final spacing polish, responsive tuning, and real assets from the approved design.
// TODO: Save selected language in localStorage so it stays after refresh.
// TODO: Detect browser language and set Danish or English automatically on first visit.