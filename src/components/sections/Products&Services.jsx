import React, { useState, useEffect, useRef } from "react";
import img1 from "../../assets/serviceimg1.png";
import img2 from "../../assets/serviceimg2.png";
import img3 from "../../assets/serviceimg3.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Contract Manufacturing & Equipment Contract Manufacturing (ECM)",
    image: img1,
  },
  {
    title: "After Sales & Service Support",
    image: img2,
  },
  {
    title: "Spare Parts Support",
    image: img3,
  },
];

export default function ProductsAndServices() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-[40px] lg:py-[60px] bg-[#EEF6FD] text-[#2A2E34] overflow-hidden"
    >
      <div className="responsive-container">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-[30px] h-[2px] bg-[#00B2F9]"></div>

            <span className="font-['Inter'] font-semibold text-[12px] md:text-[14px] lg:text-[16px] leading-[18px] tracking-[1.8px] uppercase text-[#00B2F9]">
              PRODUCTS & SERVICES
            </span>
          </motion.div>

          <motion.h2
            className="font-['Space_Grotesk'] font-bold text-[25px] md:text-[33px] lg:text-[40px] leading-[1.2] lg:leading-[50px] text-[#2A2E34] max-w-[774px]"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              delay: 0.1,
            }}
          >
            From prototype to full-scale production
          </motion.h2>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative rounded-[20px] overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0px_20px_40px_rgba(0,0,0,0.1)]"
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2 + index * 0.1,
              }}
            >
              <div className="w-full h-[300px] md:h-[380px] lg:h-[530px] bg-gray-100 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/10"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <h3 className="font-['Space_Grotesk'] font-medium text-[17px] md:text-[16px] lg:text-[26px] leading-[1.4] tracking-[-0.48px] text-white">
                    {service.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore More Button */}
     <motion.div
  className="flex justify-center mt-12 sm:mt-16"
  initial={{ opacity: 0, y: 20 }}
  animate={isVisible ? { opacity: 1, y: 0 } : {}}
  transition={{
    duration: 0.6,
    ease: "easeOut",
    delay: 0.6,
  }}
>
  <Link
    to="/services"
    onClick={() => window.scrollTo(0, 0)}
    className="flex items-center justify-center px-5 md:px-7 lg:px-8 h-[45px] md:h-[46px] lg:h-[50px] rounded-[15px] bg-[#00B2F9] font-['DM_Sans'] text-[15px] md:text-[16px] lg:text-[18px] font-medium text-[#FFFFFF] hover:bg-[#0EA5E9] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md w-[30px] sm:w-auto min-w-[160px]"
  >
    Explore More
  </Link>
</motion.div>
      </div>
    </section>
  );
}