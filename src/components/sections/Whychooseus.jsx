import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame
} from "framer-motion";
import {
  FiDollarSign,
  FiSettings,
  FiCheckCircle
} from "react-icons/fi";
import { GlowingEffect } from "../ui/glowing-effect";

const reasons = [
  {
    title: "Cost-Effective Solutions",
    description:
      "Efficient processes and lean operations that deliver value without compromising on standards.",
    icon: (
      <FiDollarSign className="text-[#00B2F9] w-[28px] h-[28px]" />
    )
  },
  {
    title: "Flexible Manufacturing",
    description:
      "From small-batch prototyping to large-scale production — we scale with your needs.",
    icon: (
      <FiSettings className="text-[#00B2F9] w-[28px] h-[28px]" />
    )
  },
  {
    title: "Quality & Reliability",
    description:
      "Rigorous quality controls and proven processes engineered for long-term consistency.",
    icon: (
      <FiCheckCircle className="text-[#00B2F9] w-[28px] h-[28px]" />
    )
  }
];

export default function Whychooseus() {
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

  const maskImage = useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

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
      id="whychooseus"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="py-[40px] md:py-[40px] lg:py-[60px] bg-[#FFFFFF] overflow-hidden relative"
    >
      {/* Base Grid Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-100">
          <GridPattern
            offsetX={gridOffsetX}
            offsetY={gridOffsetY}
            active={false}
          />
        </div>

        {/* Hover Active Grid Layer */}
        <motion.div
          className="absolute inset-0 opacity-100"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <GridPattern
            offsetX={gridOffsetX}
            offsetY={gridOffsetY}
            active={true}
          />
        </motion.div>
      </div>

      <div className="responsive-container">
  <div className="w-full relative overflow-hidden">
        <div className="w-full relative overflow-hidden ">
          {/* Header */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-[30px] h-[2px] bg-[#00B2F9]"></div>

            <span className="font-['Inter'] font-semibold text-[12px] md:text-[14px] lg:text-[16px] leading-[18px] tracking-[1.8px] uppercase text-[#00B2F9]">
              why choose us
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: 0.1
            }}
            className="relative z-10 flex justify-center text-center"
          >
            <h2 className="font-['Space_Grotesk'] font-bold text-[25px] md:text-[33px] lg:text-[40px] leading-[1.2] lg:leading-[50px] text-[#2A2E34]">
              Three reasons partners stay with us.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-[65px] relative z-10 m-4 md:m-5 lg:m-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
               className="relative h-full bg-[#FFFFFF] rounded-[12px] p-8 lg:p-[40px] lg:pt-[40px] lg:pb-[60px] border border-[#E5E7EB] border-t-[7px] border-t-[#00B2F9] shadow-sm transition-all duration-300 ease-out  hover:shadow-lg hover:shadow-sky-100 hover:bg-white  cursor-pointer"   style={{ boxShadow: "0px 2px 8px -2px #0000000F, 0px 18px 30px -18px #00000014" }}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                whileHover={{
  y: -8,
  transition: {
    duration: 0.05,
    ease: "easeOut",
  },
}}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.2 + index * 0.1
                }}
              >
                <div className="w-[57px] h-[57px] rounded-[10px] bg-[#00B2F91A] flex items-center justify-center mb-[28px]">
                  {reason.icon}
                </div>

                <h3 className="font-['Space_Grotesk'] font-medium text-[18px] md:text-[20px] lg:text-[23px] leading-[28px] tracking-[-0.4px] mb-[13px] text-[#2A2E34]">
                  {reason.title}
                </h3>

                <p className="font-['Dm_Sans'] font-normal text-[15px] md:text-[18px] lg:text-[20px] leading-[24px] text-[#2A2E34]">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
</div>
      <style>
        {`
          .whychoose-shape {
            clip-path: polygon(
              0 0,
              calc(100% - 120px) 0,
              calc(100% - 80px) 40px,
              100% 40px,
              100% 100%,
              0 100%
            );
          }

          @media (min-width: 640px) and (max-width: 767px) {
            .whychoose-shape {
              clip-path: polygon(
                0 0,
                calc(100% - 220px) 0,
                calc(100% - 160px) 60px,
                100% 60px,
                100% 100%,
                0 100%
              );
            }
          }

          @media (min-width: 768px) and (max-width: 1023px) {
            .whychoose-shape {
              clip-path: polygon(
                0 0,
                calc(100% - 260px) 0,
                calc(100% - 210px) 50px,
                100% 50px,
                100% 100%,
                0 100%
              );
            }
          }

          @media (min-width: 1024px) {
            .whychoose-shape {
              clip-path: polygon(
                0 0,
                calc(100% - 450px) 0,
                calc(100% - 370px) 80px,
                100% 80px,
                100% 100%,
                0 100%
              );
            }
          }
        `}
      </style>
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
              ? "grid-pattern-active-why"
              : "grid-pattern-base-why"
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
            ? "url(#grid-pattern-active-why)"
            : "url(#grid-pattern-base-why)"
        }
      />
    </svg>
  );
};