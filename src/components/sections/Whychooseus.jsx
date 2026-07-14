import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame
} from "framer-motion";
import { FiZap, FiLayers } from "react-icons/fi";

const reasons = [
  {
    title: "Cost-Effective Solutions",
    description:
      "Efficient processes and lean operations that deliver value without compromising on standards.",
    icon: <FiZap className="text-[#00B2F9] w-[23px] h-[23px]" />
  },
  {
    title: "Flexible Manufacturing",
    description:
      "From small-batch prototyping to large-scale production — we scale with your needs.",
    icon: <FiLayers className="text-[#00B2F9] w-[22px] h-[22px]" />
  },
  {
    title: "Quality & Reliability",
    description:
      "Rigorous quality controls and proven processes engineered for long-term consistency.",
    icon: (
      <svg
        className="w-[26px] h-[25px] text-[#00B2F9]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3L19 6V11.5C19 16.1 16.1 20.2 12 21.5C7.9 20.2 5 16.1 5 11.5V6L12 3Z"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M8.5 12L10.8 14.3L15.8 9.3"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
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
      className="py-12 md:py-18 :pt-6 pb-20 md:pt-6 md:pb-20 lg:pt-5 lg:pb-20 bg-[#FFFFFF] overflow-hidden relative"
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

      <div className="responsive-container relative z-10">
        <div className="whychoose-shape bg-[#2A2E34] text-[#FFFFFF] rounded-[20px] p-8 sm:p-12 lg:p-16 w-full relative overflow-hidden">
          {/* Header */}
          <motion.div
            className="flex items-center gap-4 mb-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="w-[30px] h-[1px] bg-[#00B2F9]"></div>

            <span className="font-['Inter'] font-semibold text-[12px] md:text-[14px] lg:text-[16px] leading-[18px] tracking-[1.8px] uppercase text-[#00B2F9]">
              why choose us
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: "easeOut",
              delay: 0.1
            }}
            className="relative z-10"
          >
            <h2 className="font-['Space_Grotesk'] font-bold text-[25px] md:text-[33px] lg:text-[40px] leading-[1.2] lg:leading-[50px] lg:w-2/3">
              Three reasons partners stay with us.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mt-12 lg:mt-16 relative z-10">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.2 + index * 0.1
                }}
              >
                <div className="w-[46px] h-[46px] rounded-[10px] bg-[#00B2F91A] flex items-center justify-center mb-6">
                  {reason.icon}
                </div>

                <h3 className="font-['Space_Grotesk'] font-medium text-[17px] md:text-[18px] lg:text-[20px] leading-[28px] tracking-[-0.4px] mb-3 text-white">
                  {reason.title}
                </h3>

                <p className="font-['Dm_Sans'] font-normal text-[15px] md:text-[16px] lg:text-[18px] leading-[24px] text-[#A0A4AB]">
                  {reason.description}
                </p>
              </motion.div>
            ))}
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