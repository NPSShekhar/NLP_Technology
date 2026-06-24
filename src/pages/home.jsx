import Navbar from "../components/layout/navbar";
import Hero from "../components/sections/hero";
import Innovation from "../components/sections/onepartner";
import WhatWeDo from "../components/sections/ourservices";
import Capabilities from "../components/sections/capabilities";
import Process from "../components/sections/Process";
import Philosophy from "../components/sections/testimonals";
import ContactSection from "../components/sections/contactsection";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-[#0EA5E9] selection:text-white">
      <Navbar /> 
      <main className="flex-grow">
        <Hero />
        <Innovation />
        <WhatWeDo />
        <Capabilities />
        <Process />
        <Philosophy />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}