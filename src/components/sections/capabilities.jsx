import React, { useState, useEffect, useRef } from "react";
import capimg1 from "../../assets/capimg1.png";
import capimg2 from "../../assets/capimg2.png";
import capimg3 from "../../assets/capimg3.png";
import capimg4 from "../../assets/capimg4.png"; 
import {
  Pyramid,
  Zap,
  Code,
  Cpu,
} from "lucide-react";
import { ExpandingCards } from "@/components/ui/expanding-cards";
const capabilitiesData = [
  {
    id: "mechanical-design",
    title: "Mechanical Design",
    description: "Structural engineering, 3D modelling, tolerance analysis and prototyping.",
    imgSrc: capimg1,
    linkHref: "#",
  },
  {
    id: "electrical-design",
    title: "Electrical Design",
    description: "PCB layout, power systems, wiring design and electrical safety compliance.",
    imgSrc: capimg2,  
    linkHref: "#",
  },
  {
    id: "software-design",
    title: "Software and Firmware Design",
    description: "Embedded systems, IoT connectivity, control logic and HMI development.",
    imgSrc: capimg3,  
    linkHref: "#",
  },
  {
    id: "automation-design",
    title: "Automation Design and Integration",
    description: "PLC programming, robotic systems, sensor arrays and machine vision.",
    imgSrc: capimg4,   
    linkHref: "#",
  },
];
export default function Capabilities() {
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
      id="capabilities"
      ref={sectionRef}
      className="py-12 lg:py-20 bg-[#EEF6FD] text-[#2A2E34] overflow-hidden"
    >
      <div className="responsive-container">
        
        {/* Section Header (2-Column Layout on Desktop) */}
        <div
          className={`flex flex-col lg:flex-row justify-between items-start gap-5 sm:gap-6 lg:gap-12 mb-12 sm:mb-16 transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="w-full lg:flex-1">
            <h2 className="font-['Space_Grotesk'] font-bold text-[25px] sm:text-[36px] lg:text-[40px] leading-[35px] sm:leading-[48px] lg:leading-[55px] text-[#2A2E34]">
              Integrated Capabilities
              <br />
              <span className="bg-gradient-to-r from-[#0EA5E9] to-[#818CF8] bg-clip-text text-transparent">
                Exceptional Outcomes
              </span>
            </h2>
          </div>
          <div className="w-full lg:flex-1 lg:mt-1">
            <p className="font-['DM_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[25px] sm:leading-[27.2px] text-[#64748B]">
              NLP Technology provides end-to-end engineering, manufacturing, automation, and lifecycle support solutions—from product design and development to production, fulfillment, and continuous operational improvement.
            </p>
          </div>
        </div>
        {/* Accordion Layout: Horizontal on Desktop, Vertical on Mobile */}
        <div
          className={`transition-all duration-700 ease-out delay-200 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <ExpandingCards items={capabilitiesData} defaultActiveIndex={null} />
        </div>
        {/* Explore More Button */}
        <div
          className={`flex justify-center mt-10 sm:mt-12 transition-all duration-700 ease-out delay-700 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <a
            href="#capabilities"
            className="flex items-center justify-center px-6 lg:px-8 h-[44px] lg:h-[50px] rounded-[15px] bg-[#2A2E34] font-['DM_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] font-normal text-white hover:bg-[#0EA5E9] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md"
          >
            Explore More
          </a>
        </div>
      </div>
    </section>
  );
}
