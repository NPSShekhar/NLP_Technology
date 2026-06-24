import React, { useState } from "react";
import mechanicimg from "../../assets/mechanic.png";
import { 
 motion, 
 useMotionValue, 
 useMotionTemplate, 
 useAnimationFrame,
 useInView
} from "framer-motion";
import { useRef } from "react";

export default function Innovation() {
 const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
 const mouseX = useMotionValue(0);
 const mouseY = useMotionValue(0);

 const sectionRef = useRef(null);
 const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

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

 return (
 <section 
 id="about" 
 ref={sectionRef}
 onMouseMove={handleMouseMove}
 className="relative py-12 lg:py-20 bg-[#FFFFFF] overflow-hidden text-[#2A2E34]"
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
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 items-stretch">
 
 {/* Left Column: Title, Copywriting & Button */}
 <motion.div
 className="w-full h-full flex flex-col justify-start items-start text-left"
 initial={{ opacity: 0, y: 40 }}
 animate={isInView ? { opacity: 1, y: 0 } : {}}
 transition={{ duration: 0.7, ease: "easeOut", delay: 0 }}
 >
 <h2 className="font-['Space_Grotesk'] text-[clamp(1.5rem,2.8vw,2.5rem)] font-bold text-[#2A2E34] tracking-[-1px]">
 One Partner
 <br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#6366F1]">
 Complete Capability
 </span>
 </h2>
 
 <p className="mt-5 sm:mt-6 font-['DM_Sans'] text-fluid-p font-normal text-[#626A75]">
 NLP Technology was built to be the engineering partner
 that growing B2B manufacturers have always needed — deeply capable,
 cost-conscious, and genuinely invested in your long-term success.
 </p>

 <a
 href="#capabilities"
 className="hidden lg:flex mt-6 sm:mt-8 items-center justify-center px-6 lg:px-8 h-[44px] lg:h-[50px] rounded-[15px] bg-[#2A2E34] font-['DM_Sans'] text-fluid-nav font-normal text-white hover:bg-[#0EA5E9] hover:scale-[1.03] transition-all duration-300 ease-out active:scale-95 shadow-md"
 >
 Read More
 </a>
 </motion.div>

 {/* Middle Column: Vertical Image */}
 <motion.div
 className="w-full h-full flex justify-center items-center"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={isInView ? { opacity: 1, scale: 1 } : {}}
 transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
 >
 <div className="w-full lg:max-w-[380px] xl:max-w-[420px] aspect-[3/2] sm:aspect-[2/1] lg:aspect-[4/5]">
 <img
 src={mechanicimg}
 alt="Foundry of Innovation - NLP Engineering Machinist"
 className="w-full h-full object-cover rounded-[24px] sm:rounded-[30px] shadow-lg hover:scale-[1.02] transition-transform duration-500 ease-out"
 />
 </div>
 </motion.div>

 {/* Right Column: Stacked Mission & Vision Cards */}
 <div className="w-full h-full flex flex-col justify-end items-start gap-5 lg:gap-6">
 {/* Mission Card */}
 <motion.div
 className="w-full flex flex-col gap-2 p-5 sm:p-6 lg:p-7 border-l-[4px] border-[#006591] bg-[#F0F7FD]"
 initial={{ opacity: 0, x: 40 }}
 animate={isInView ? { opacity: 1, x: 0 } : {}}
 transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
 >
 <h3 className="font-['Space_Grotesk'] font-bold text-fluid-h3 text-[#2A2E34]">
 Our Mission
 </h3>
 <p className="font-['DM_Sans'] text-fluid-sm font-normal text-[#626A75] mt-1">
 To provide seamless hardware-software integration for complex industrial challenges.
 </p>
 </motion.div>

 {/* Vision Card */}
 <motion.div
 className="w-full flex flex-col gap-2 p-5 sm:p-6 lg:p-7 border-l-[4px] border-[#006591] bg-[#F0F7FD]"
 initial={{ opacity: 0, x: 40 }}
 animate={isInView ? { opacity: 1, x: 0 } : {}}
 transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
 >
 <h3 className="font-['Space_Grotesk'] font-bold text-fluid-h3 text-[#2A2E34]">
 Our Vision
 </h3>
 <p className="font-['DM_Sans'] text-fluid-sm font-normal text-[#626A75] mt-1">
 To be the global benchmark for regional manufacturing excellence in Southeast Asia.
 </p>
 </motion.div>

 {/* Mobile/Tablet Read More Button (Hidden on Desktop) */}
 <a
 href="#capabilities"
 className="lg:hidden mx-auto mt-4 sm:mt-6 flex w-max items-center justify-center px-6 h-[44px] sm:h-[48px] rounded-[15px] bg-[#2A2E34] font-['DM_Sans'] text-[14px] sm:text-[15px] lg:text-[16px] text-fluid-nav font-normal text-white hover:bg-[#0EA5E9] hover:scale-[1.03] transition-all duration-300 ease-out active:scale-95 shadow-md"
 >
 Read More
 </a>
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
 id={active ? "grid-pattern-active-about" : "grid-pattern-base-about"}
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
 <rect width="100%" height="100%" fill={active ? "url(#grid-pattern-active-about)" : "url(#grid-pattern-base-about)"} />
 </svg>
 );
};
