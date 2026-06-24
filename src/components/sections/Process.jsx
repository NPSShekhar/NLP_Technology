import React, { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Design",
    description:
      "Mechanical, electrical, software & automation design",
  },
  {
    number: "02",
    title: "Procurement",
    description:
      "Best-cost sourcing with quality control and OTD",
  },
  {
    number: "03",
    title: "Assembly",
    description:
      "Clean-room assembly by skilled production teams",
  },
  {
    number: "04",
    title: "Testing",
    description:
      "Rigorous functional and quality assurance testing",
  },
  {
    number: "05",
    title: "Shipment",
    description:
      "Packaging, logistics and global delivery support",
  },
];

const Process = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="bg-[linear-gradient(270deg,_#2A2E34_0%,_#3E4850_42.79%,_#2A2E34_98.08%)] py-12 lg:py-20"
    >
      <div className="responsive-container">
        <div className="text-center">
          <h2 className="font-['Space_Grotesk'] text-[25px] sm:text-[36px] lg:text-[40px] font-bold text-white">
            From Brief to Delivery
          </h2>
          <p className="font-['DM_Sans'] mt-3 sm:mt-4 text-white text-[14px] sm:text-[15px] lg:text-[16px] max-w-xl lg:max-w-2xl mx-auto leading-[24px] sm:leading-[25px]">
            Our methodical approach ensures consistency from first sketch to final delivery.
          </p>
        </div>
        {/* Timeline */}
        <div className="relative mt-14 sm:mt-16 lg:mt-20" style={{ perspective: "1200px" }}>
          <div className="relative grid grid-cols-1 sm:grid-cols-1 md:grid-cols-5 gap-8 sm:gap-10">
            {steps.map((step, index) => (
              <div key={step.number} className="text-center relative">
                <div
                  className="font-['Space_Grotesk'] relative z-10 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 border-[#0EA5E9] flex items-center justify-center mx-auto text-white font-bold text-base sm:text-lg shadow-lg hover:bg-[#0EA5E9] transition-colors duration-300 cursor-pointer"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "rotateY(0deg) scale(1)"
                      : "rotateY(90deg) scale(0.5)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: "700ms",
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transitionDelay: `${index * 200}ms`,
                  }}
                >
                  {step.number}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-7 lg:top-8 left-[calc(50%+28px)] lg:left-[calc(50%+32px)] w-[calc(100%-20px)] lg:w-[calc(100%-24px)] h-[2px] bg-[#0EA5E9]"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: "opacity 400ms",
                      transitionDelay: `${index * 200 + 300}ms`,
                    }}
                  />
                )}
                <h3
                  className="font-['Space_Grotesk'] mt-4 sm:mt-5 lg:mt-6 text-white text-lg sm:text-xl font-semibold"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(12px)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: "500ms",
                    transitionDelay: `${index * 200 + 150}ms`,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="font-['DM_Sans'] mt-2 sm:mt-3 text-white text-[11px] sm:text-[12px] leading-[18px] sm:leading-5"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(12px)",
                    transitionProperty: "opacity, transform",
                    transitionDuration: "500ms",
                    transitionDelay: `${index * 200 + 250}ms`,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
