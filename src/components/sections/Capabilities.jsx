import React, { useState, useEffect, useRef } from "react";
import img from "../../assets/capimg1.png";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame
} from "framer-motion";

const competencies = [
  {
    title: "Experienced & Skilled Engineering Team",
    description:
      "Led by engineers with strong technical backgrounds — dedicated and committed to delivering reliable manufacturing solutions.",
  },
  {
    title: "Flexible & Scalable Solutions",
    description:
      "Manufacturing that flexes from prototype runs to full production volume — scaling cleanly as your demand grows.",
  },
];

export default function Capabilities() {
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
      id="capabilities"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="py-12 lg:py-24 bg-[#FFFFFF] text-[#2A2E34] overflow-hidden relative"
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

      <div className="navbar-align-outer relative z-10">
        <div className="navbar-align-inner">
          <div className="grid grid-cols-1 lg:grid-cols-[560px_1fr] gap-12 lg:gap-[120px] items-center w-full">
            {/* Left Column: Image */}
            <motion.div
              className="w-full flex justify-center order-2 lg:order-1"
              initial={{ opacity: 0, x: -40 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            >
              <div className="w-[430px] lg:w-full max-w-[520px] aspect-[4/5] rounded-[20px] overflow-hidden shadow-lg group">
                <img
                  src={img}
                  alt="Core Competencies"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
            </motion.div>

            {/* Right Column: Content */}
            <motion.div
              className="w-full flex flex-col items-center lg:items-start order-1 lg:order-2"
              initial={{ opacity: 0, x: 40 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-[30px] h-[1px] bg-[#00B2F9]"></div>

                <span className="font-['Inter'] lg:items-start font-semibold text-[12px] md:text-[14px] lg:text-[16px] leading-[20px] tracking-[1.8px] uppercase text-[#00B2F9]">
                  Core Competencies
                </span>
              </div>

              <h2 className="font-['Space_Grotesk'] font-bold text-[25px] md:text-[32px] lg:text-[40px] leading-[1.2] lg:leading-[60px] tracking-[-0.96px] text-[#2A2E34] mb-12 max-w-[570px]">
                Capability you can build a roadmap on
              </h2>

            <div className="flex flex-col gap-8 w-full max-w-[700px]">
                {competencies.map((item, index) => (
                  <div
                    key={index}
                    className="p-6 min-h-[150px] flex flex-col justify-center rounded-[8px] border-l-[4px] border-[#0EA5E9] bg-[#F5F5F5] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-100 hover:bg-white hover:border-[#0284C7] cursor-pointer"
                  >
                    <h3 className="font-['Space_Grotesk'] font-medium text-[17px] md:text-[19px] lg:text-[20px] leading-[28px] tracking-[-0.36px] text-[#2A2E34] mb-4">
                      {item.title}
                    </h3>

                    <p className="font-['Dm_Sans'] font-normal text-[15px] md:text-[17px] lg:text-[18px] leading-[22px] text-[#2A2E34] max-w-[557px]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
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
          id={
            active
              ? "grid-pattern-active-capabilities"
              : "grid-pattern-base-capabilities"
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
                : "text-[#2A2E34]/[0.05]"
            }
          />
        </motion.pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill={
          active
            ? "url(#grid-pattern-active-capabilities)"
            : "url(#grid-pattern-base-capabilities)"
        }
      />
    </svg>
  );
};

