import React, { useState } from "react";
import heroImg from "../../assets/herobg_remove.png";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

const stats = [
  { value: "15+", label: "Years of Engineering Experience" },
  { value: "100+", label: "Projects Delivered Worldwide" },
  { value: "Global", label: "Manufacturing Expertise" },
  { value: "End-to-End", label: "Engineering Solutions" },
];

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Tilt calculations
    const x = ((clientX - left) / width - 0.5) * 2;
    const y = ((clientY - top) / height - 0.5) * 2;
    setMousePos({ x, y });

    // Grid coordinates
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
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

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-[#FFFFFF] text-[#2A2E34] overflow-hidden pt-[68px] sm:pt-[76px] lg:pt-[40px] pb-2 sm:pb-4 lg:pb-8 perspective-[1000px]"
    >
      {/* Base Grid Background (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} active={false} />
      </div>

      {/* Hover Active Grid Layer (Masked Reveal) */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-100 pointer-events-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} active={true} />
      </motion.div>

      {/* Hero Content Container */}
      <div className="responsive-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">
        
        {/* Left Column: Heading + Buttons */}
        <div className="w-full lg:w-[58%] xl:w-[55%] flex flex-col justify-center text-left">
          <h1 className="font-['Space_Grotesk'] font-bold text-[clamp(2.25rem,2rem+2vw,4.25rem)] leading-[1.25] lg:leading-[1.23] tracking-[-1.2px] animate-text-gradient bg-clip-text text-transparent pb-4 sm:pb-5 select-none">
            Engineering the Future
            <br />
            of Intelligent
            <br />
             Manufacturing
          </h1>

          {/* Action Buttons */}
          <div className="flex flex-col justify-between gap-6 sm:gap-8 py-1 lg:py-5">
            {/* Buttons Section */}
            <div className="flex flex-row items-center gap-3 sm:gap-5">
              <a
                href="#contact"
                className="flex items-center justify-center px-6 lg:px-6 h-[38px] sm:h-[42px] lg:h-[50px] rounded-[15px] bg-[#2A2E34] font-['DM_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] font-normal text-white hover:bg-[#0EA5E9] hover:scale-[1.03] transition-all duration-300 ease-out active:scale-95 shadow-md"
              >
                Get Started
              </a>

              <a
                href="#capabilities"
                className="flex items-center justify-center px-5 lg:px-6 h-[38px] sm:h-[42px] lg:h-[50px]
                bg-white
                rounded-[15px]
                border border-[#2A2E34]
                font-['DM_Sans']
                text-[13px] sm:text-[14px] lg:text-[16px]
                font-normal
                text-[#2A2E34]
                hover:bg-white
                hover:text-[#0EA5E9]
                hover:border-[#0EA5E9]
                hover:scale-[1.03]
                transition-all duration-300 ease-out
                active:scale-95"
              >
                View Capabilities
              </a>
            </div>
          </div>
          </div>
          {/* Image Section */}
        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-[40%] xl:w-[42%] flex justify-center items-center relative">
          <div
            className="w-full max-w-[480px] flex items-center justify-center relative rounded-[30px] animate-[floatImage_4s_ease-in-out_infinite]"
          >
            <img
              src={heroImg}
              alt="NLP Robotics Manufacturing Arm"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>  
        </div>
      
      {/* Horizontal Stats Bar */}
      <div className="responsive-container relative z-10 mt-2 sm:mt-4 lg:mt-5">
        <div className="w-full rounded-[20px] sm:rounded-[26px] border border-[#DFE5EB] bg-[#FFFFFF] shadow-[0px_30px_35px_-30px_#00AEEE59] overflow-hidden">
          <div className="flex flex-wrap lg:flex-nowrap">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center bg-[#FFFFFF] hover:bg-[#F0F7FD] py-4 sm:py-5 lg:py-6 px-3 sm:px-5 lg:px-6 min-h-[70px] sm:min-h-[80px] lg:min-h-[95px] transition-colors duration-300 w-1/2 lg:w-1/4 ${
                  i % 2 === 0 ? 'border-r border-[#DFE5EB]' : ''
                } ${
                  i < 2 ? 'border-b border-[#DFE5EB]' : ''
                } lg:border-b-0 ${
                  i < stats.length - 1 ? 'lg:border-r' : 'lg:border-r-0'
                }`}
              >
                <span className="font-['Space_Grotesk'] font-bold text-[18px] sm:text-[21px] lg:text-[24px] leading-[30px] text-center bg-gradient-to-r from-[#2A2E34] to-[#008CBB] animate-text-gradient bg-clip-text text-transparent select-none">
                  {stat.value}
                </span>
                <span className="font-['DM_Sans'] font-normal text-[10px] sm:text-[11px] leading-[14px] sm:leading-[10px] text-center text-[#626A75] mt-1">
                  {stat.label}
                </span>
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
          id={active ? "grid-pattern-active" : "grid-pattern-base"}
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
      <rect width="100%" height="100%" fill={active ? "url(#grid-pattern-active)" : "url(#grid-pattern-base)"} />
    </svg>
  );
};