import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
  useInView
} from "framer-motion";
import { useRef } from "react";

export default function Aboutus() {
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
      className="relative pt-[80px] pb-20 md:pt-[95px] md:pb-[85px] lg:pt-[100px] lg:pb-26 bg-[#FFFFFF] overflow-hidden text-[#2A2E34] flex flex-col items-center justify-center min-h-[600px]"
    >
      {/* Base Grid Background */}
      <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          active={false}
        />
      </div>

      {/* Hover Active Grid Layer */}
      <motion.div
        className="absolute inset-0 z-0 opacity-100 pointer-events-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          active={true}
        />
      </motion.div>

      <div className="responsive-container relative z-10 flex flex-col items-center text-center max-w-[1000px] mx-auto">
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-[30px] h-[1px] bg-[#00B2F9]"></div>

          <span className="font-['Inter'] font-semibold text-[12px] md:text-[14px] lg:text-[16px] leading-[18px] tracking-[1.8px] uppercase text-[#00B2F9]">
            about us
          </span>
        </motion.div>

        <motion.h2
          className="font-['Space_Grotesk'] font-bold text-[25px] md:text-[33px] lg:text-[40px] leading-[1.2] lg:leading-[50px] text-[#2A2E34] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: 0.1
          }}
        >
          A reliable manufacturing partner — engineered in Malaysia
        </motion.h2>

        <motion.p
          className="font-['DM_Sans'] font-medium text-[15px] md:text-[18px] lg:text-[20px] leading-[30.2px] text-[#64748B] mb-12 max-w-[898px]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            ease: "easeOut",
            delay: 0.2
          }}
        >
          NLP Technology Sdn Bhd is a Malaysia-based contract manufacturing
          company for the semiconductor, electronics, and advanced technology
          sectors. We provide reliable, high-quality manufacturing solutions
          tailored to our customers&apos; needs — from small-batch production
          to large-scale manufacturing.
        </motion.p>

        <Link
          to="/about"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center justify-center px-5 md:px-7 lg:px-8 h-[45px] md:h-[46px] lg:h-[50px] rounded-[15px] bg-[#00B2F9] text-[#FFFFFF] font-['DM_Sans'] text-[15px] md:text-[16px] lg:text-[18px] font-medium leading-[24px] hover:bg-[#0EA5E9] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md"
        >
          Read More
        </Link>
      </div>
    </section>
  );
}

const GridPattern = ({ offsetX, offsetY, active }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={
            active
              ? "grid-pattern-active-about"
              : "grid-pattern-base-about"
          }
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
            strokeWidth="1.3"
            className={
              active
                ? "text-[#0EA5E9]/[0.25]"
                : "text-[#2A2E34]/[0.03]"
            }
          />
        </motion.pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={
          active
            ? "url(#grid-pattern-active-about)"
            : "url(#grid-pattern-base-about)"
        }
      />
    </svg>
  );
};