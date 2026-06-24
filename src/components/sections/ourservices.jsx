import React, { useState, useEffect, useRef } from "react";
import serviceimg1 from "../../assets/serviceimg1.png";
import serviceimg2 from "../../assets/serviceimg2.png";
import serviceimg3 from "../../assets/serviceimg3.png"; 
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

const services = [
  {
    title: "Supply Chain & Procurement",
    description: "Strategic sourcing and logistics optimization to ensure material availability and project continuity.",
    image: serviceimg1,
  },
  {
    title: "Advanced Manufacturing",
    description: "Planning, production engineering, configuration and fulfilment services delivered under one roof by experienced teams.",
    image: serviceimg2,
  },
  {
    title: "After-Market Support",
    description: "Process enhancements, automation upgrades, robot retrofits, motor replacements, and hands-on on-site training for your team.",
    image: serviceimg3,
  },
];

export default function WhatWeDo() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.4; 
  const speedY = 0.4;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

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
      onMouseMove={handleMouseMove}
      className="py-12 lg:py-20 bg-[#FFFFFF] text-[#2A2E34] overflow-hidden relative"
    >
      {/* Base Grid Background */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} active={false} />
      </div>

      {/* Hover Active Grid Layer */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-100 pointer-events-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} active={true} />
      </motion.div>

      <div className="responsive-container relative z-10">
        
        {/* Section Header */}
        <div
          className={`max-w-2xl mx-auto text-center mb-12 sm:mb-14 lg:mb-20 transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-['Space_Grotesk'] font-bold text-[25px] sm:text-[36px] lg:text-[40px] leading-[35px] sm:leading-[46px] lg:leading-[50px] text-[#2A2E34]">
            End-to-End Manufacturing
            <br />
            <span className="bg-gradient-to-r from-[#0EA5E9] to-[#818CF8] bg-clip-text text-transparent">
              Under One Roof
            </span>
          </h2>
          <p className="mt-2 font-['DM_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[25px] sm:leading-[27.2px] text-[#64748B] max-w-xl lg:max-w-2xl mx-auto">
            From first concept to final delivery and beyond — NLP Technology manages every phase of your product's manufacturing lifecycle.
          </p>
        </div>

        {/* 3-Card Layout Wrapper */}
        <div className="relative w-full">
          {/* Background Word (Large, light grey) */}
          <div className="absolute top-[-28px] sm:top-[-45px] lg:top-[-82px] left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap z-0 font-['Space_Grotesk'] font-bold text-[55px] sm:text-[90px] lg:text-[180px] leading-[1] text-[#626A75] opacity-10 text-center uppercase tracking-wide">
            OUR SERVICES
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            let delayClass = "delay-25";
            if (index === 1) delayClass = "delay-100";
            if (index === 2) delayClass = "delay-100";

            return (
              <div
                key={index}
                className={`group flex flex-col bg-[#2A2E34] rounded-[20px] overflow-hidden shadow-lg hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] hover:-translate-y-3 hover:scale-[1.02] transition-all duration-200 ease-out transform ${delayClass} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                {/* Text Area */}
                <div className="p-6 sm:p-8 pb-4 flex-grow flex flex-col justify-start">
                  <h3 className="font-['Space_Grotesk'] text-[18px] sm:text-[19px] leading-[30px] sm:leading-[33.6px] tracking-[-0.48px] text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2 sm:mt-3 font-['DM_Sans'] text-[13px] sm:text-[14px] font-light leading-[20px] sm:leading-[21px] text-[#E2E8F0] tracking-[0.14px]">
                    {service.description}
                  </p>
                </div>

                {/* Image Area */}
                <div className="w-full aspect-[16/10] overflow-hidden mt-auto rounded-b-[20px] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A2E34]/40 to-transparent z-10 pointer-events-none"></div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-b-[20px] transition-transform duration-200 ease-out group-hover:scale-110"
                  />
                </div>
              </div>
            );
          })}
          </div>
        </div>

        {/* Read More Button */}
        <div
          className={`flex justify-center mt-10 sm:mt-12 transition-all duration-700 ease-out delay-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="#capabilities"
            className="flex items-center justify-center px-6 lg:px-8 h-[44px] lg:h-[50px] rounded-[15px] bg-[#2A2E34] font-['DM_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] font-normal text-white hover:bg-[#0EA5E9] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md"
          >
            Read More
          </a>
        </div>

      </div>
    </section>
  );
}

const GridPattern = ({ offsetX, offsetY, active }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={active ? "grid-pattern-active-services" : "grid-pattern-base-services"}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className={active ? "text-[#0EA5E9]/[0.25]" : "text-[#2A2E34]/[0.03]"}
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={active ? "url(#grid-pattern-active-services)" : "url(#grid-pattern-base-services)"} />
    </svg>
  );
};
