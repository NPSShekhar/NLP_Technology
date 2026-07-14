import Navbar from "../components/layout/navbar";
import Hero from "../components/sections/hero";
import Aboutus from "../components/sections/Aboutus";
import ProductsServices from "../components/sections/Products&Services";
import Capabilities from "../components/sections/Capabilities";
import Whychooseus from "../components/sections/Whychooseus";
import ContactSection from "../components/sections/Contactus";
import Footer from "../components/Layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-[#0EA5E9] selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Aboutus />
        <Whychooseus />
        <Capabilities />
        <ProductsServices /> 
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}