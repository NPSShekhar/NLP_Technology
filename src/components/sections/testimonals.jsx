import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

const testimonials = [
  {
    quote: "NLP Technology re-engineered our production line and cut cycle times dramatically. Their automation expertise is world-class.",
    author: "Director of Operations",
    company: "Global Electronics Manufacturer"
  },
  {
    quote: "The digital twin implementation gave us visibility we never had before. A genuinely strategic partner.",
    author: "Head of Smart Factory",
    company: "Advanced Manufacturing Firm"
  },
  {
    quote: "From design to deployment, they operated like a true extension of our team. Reliable, precise, and deeply innovative.",
    author: "VP of Engineering",
    company: "Industrial Automation Group"
  },
  {
    quote: "NLP Technology re-engineered our production line and cut cycle times dramatically. Their automation expertise is world-class.",
    author: "Director of Operations",
    company: "Global Electronics Manufacturer"
  }
];

// Double the items to allow seamless infinite marquee scrolling
const doubleTestimonials = [...testimonials, ...testimonials];

export default function Philosophy() {
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
      id="philosophy"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="py-10 lg:py-16 bg-[#FFFFFF] text-[#2A2E34] overflow-hidden relative"
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
          className={`text-center mb-8 sm:mb-12 transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-['Space_Grotesk'] mt-[-10px] sm:mt-[-15px] lg:mb-[120px] font-bold text-[25px] sm:text-[36px] lg:text-[40px] leading-[30px] sm:leading-[45px] lg:leading-[67.1px] text-[#2A2E34]">
            Trusted by Industry Leaders
          </h2>
        </div>
      </div>

      {/* Testimonial Marquee Slider Container Wrapper */}
      <div className="relative w-full">
        {/* Background Word (Large, light grey) */}
        <div className="absolute top-[-25px] sm:top-[-30px] lg:top-[-82px] left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap z-0 font-['Space_Grotesk'] font-bold text-[50px] sm:text-[80px] lg:text-[180px] leading-[1] text-[#626A75] opacity-10 text-center uppercase tracking-wide">
          TESTIMONIALS
        </div>

        <div
          className={`responsive-container relative z-10 mt-4 sm:mt-6 overflow-hidden transition-all duration-1000 ease-out delay-300 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
        {/* Left & Right Fade Overlays for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-[5vw] bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-[5vw] bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

        {/* Scroll Wrapper */}
        <div className="flex w-max gap-4 sm:gap-6 hover:[animation-play-state:paused] animate-marquee">
          {doubleTestimonials.map((item, index) => (
            <div
              key={index}
              className="w-[85vw] sm:w-[min(370px,80vw)] min-h-[200px] sm:min-h-[230px] bg-white border-[0.67px] border-t-[0.67px] border-[#DFE5EB] rounded-[20px] sm:rounded-[22px] p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-[0px_16px_40px_-30px_#00AEEE1A] select-none hover:border-[#0EA5E9] hover:shadow-[0px_16px_40px_-20px_#00AEEE35] transition-all duration-300 cursor-pointer"
            >
              {/* Top Quote Icon*/}
                <div className="flex-shrink-0 flex">
                  {/* First Quote */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 12 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                  >
                    <path
                      d="M4.00004 1.3335C3.2928 1.3335 2.61452 1.61445 2.11442 2.11454C1.61433 2.61464 1.33337 3.29292 1.33337 4.00016V12.0002C1.33337 12.7074 1.61433 13.3857 2.11442 13.8858C2.61452 14.3859 3.2928 14.6668 4.00004 14.6668C4.35366 14.6668 4.6928 14.8073 4.94285 15.0574C5.1929 15.3074 5.33337 15.6465 5.33337 16.0002V17.3335C5.33337 18.0407 5.05242 18.719 4.55233 19.2191C4.05223 19.7192 3.37395 20.0002 2.66671 20.0002C2.31309 20.0002 1.97395 20.1406 1.7239 20.3907C1.47385 20.6407 1.33337 20.9799 1.33337 21.3335V24.0002C1.33337 24.3538 1.47385 24.6929 1.7239 24.943C1.97395 25.193 2.31309 25.3335 2.66671 25.3335C4.78844 25.3335 6.82327 24.4906 8.32356 22.9904C9.82385 21.4901 10.6667 19.4552 10.6667 17.3335V4.00016C10.6667 3.29292 10.3858 2.61464 9.88566 2.11454C9.38556 1.61445 8.70728 1.3335 8.00004 1.3335H4.00004Z"
                      stroke="#00AEEE"
                      strokeOpacity="0.3"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* Second Quote */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 12 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 -ml-4"
                  >
                    <path
                      d="M4.00004 1.3335C3.2928 1.3335 2.61452 1.61445 2.11442 2.11454C1.61433 2.61464 1.33337 3.29292 1.33337 4.00016V12.0002C1.33337 12.7074 1.61433 13.3857 2.11442 13.8858C2.61452 14.3859 3.2928 14.6668 4.00004 14.6668C4.35366 14.6668 4.6928 14.8073 4.94285 15.0574C5.1929 15.3074 5.33337 15.6465 5.33337 16.0002V17.3335C5.33337 18.0407 5.05242 18.719 4.55233 19.2191C4.05223 19.7192 3.37395 20.0002 2.66671 20.0002C2.31309 20.0002 1.97395 20.1406 1.7239 20.3907C1.47385 20.6407 1.33337 20.9799 1.33337 21.3335V24.0002C1.33337 24.3538 1.47385 24.6929 1.7239 24.943C1.97395 25.193 2.31309 25.3335 2.66671 25.3335C4.78844 25.3335 6.82327 24.4906 8.32356 22.9904C9.82385 21.4901 10.6667 19.4552 10.6667 17.3335V4.00016C10.6667 3.29292 10.3858 2.61464 9.88566 2.11454C9.38556 1.61445 8.70728 1.3335 8.00004 1.3335H4.00004Z"
                      stroke="#00AEEE"
                      strokeOpacity="0.3"
                      strokeWidth="2.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

              {/* Quote Text */}
              <p className="font-['DM_Sans'] text-[13px] sm:text-[14px] font-normal leading-[20px] sm:leading-[22.75px] text-[#2A2E34CC] mt-4 line-clamp-4 sm:line-clamp-3">
                "{item.quote}"
              </p>

              {/* Divider + Author */}
              <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                <h4 className="font-['DM_Sans'] font-bold text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#2A2E34]">
                  {item.author}
                </h4>

                <p className="font-['DM_Sans'] font-normal text-[11px] sm:text-[12px] leading-[14px] sm:leading-[16px] text-[#626A75] mt-1">
                  {item.company}
                </p>
              </div>
            </div>
          ))}
        </div>
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
          id={active ? "grid-pattern-active-testimonials" : "grid-pattern-base-testimonials"}
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
      <rect width="100%" height="100%" fill={active ? "url(#grid-pattern-active-testimonials)" : "url(#grid-pattern-base-testimonials)"} />
    </svg>
  );
};
