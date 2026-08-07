import React, { useEffect } from "react";
import Navbar from "../components/Layout/navbar";
import Footer from "../components/Layout/Footer";
import heroBg from "../assets/about_herobg.png";
import img1 from "../assets/Aboutusimg1.png";
import cap1 from "../assets/Aboutusimg2.png";
import cap2 from "../assets/Aboutusimg3.png";
import teamImg from "../assets/Teamimg1.png";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";

export default function Aboutpage() {


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
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] font-['inter']">
      <Navbar />

      <main className="flex-grow pt-[60px] sm:pt-[68px] lg:pt-[75px]">
        {/* Hero Section */}
        <section className="relative h-[250px] md:h-[350px] lg:h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 mix-blend-multiply bg-[linear-gradient(90deg,rgba(26,32,41,0.85)_0%,rgba(26,32,41,0.65)_50%,rgba(26,32,41,0.35)_100%)]"></div>

            <img
              src={heroBg}
              alt="About Hero"
              className="w-full h-full object-cover"
            />
          </div>

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.85,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-20 text-center text-[#FFFFFF] mt-8"
          >
            <h1 className="font-['Space_Grotesk'] font-medium text-[32px] md:text-[42px] lg:text-[48px] leading-tight mb-2">
              About us
            </h1>

            <p className="text-[15px] md:text-[16px] lg:text-[18px] font-['DM_Sans'] font-normal text-[#FFFFFF]">
              <span
                onClick={() =>
                  (window.location.href = "/")
                }
                className="cursor-pointer hover:underline"
              >
                Home
              </span>{" "}
              / About us
            </p>
          </motion.div>
        </section>

        <section
          id="about-details"
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden py-16 md:py-20"
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-100">
              <AboutGridPattern
                offsetX={gridOffsetX}
                offsetY={gridOffsetY}
                active={false}
              />
            </div>

            <motion.div
              className="absolute inset-0 opacity-100"
              style={{
                maskImage,
                WebkitMaskImage: maskImage,
              }}
            >
              <AboutGridPattern
                offsetX={gridOffsetX}
                offsetY={gridOffsetY}
                active={true}
              />
            </motion.div>
          </div>

          <div className="responsive-container relative z-10">
            {/* Intro Section */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.18,
                  },
                },
              }}
              className="flex flex-col md:flex-col lg:flex-row gap-10 lg:gap-16 items-center mb-16 md:mb-24"
            >
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    x: -30,
                  },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  },
                }}
                className="w-full md:w-full flex flex-col justify-center"
              >
                <span className="text-[#00B2F9] font-bold text-[12px] md:text-[14px] lg:text-[16px] tracking-[1.5px] uppercase mb-4 md:mb-5 lg:mb-6 flex items-center gap-2">
                  <span className="w-[30px] h-[2px] bg-[#00B2F9]"></span>

                  ABOUT NLP TECHNOLOGY
                </span>

                <h2 className="font-['Space_Grotesk'] font-bold text-[25px] md:text-[33px] lg:text-[38px] text-[#2A2E34] leading-[1.2] mb-6 md:mb-7 lg:mb-8">
                  A reliable manufacturing partner —
                  engineered in Malaysia
                </h2>

                <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-['DM_Sans'] text-[#3E4850] leading-relaxed mb-4">
                  NLP Technology Sdn. Bhd. is a
                  Malaysia-based contract manufacturing
                  company for the semiconductor,
                  electronics, and advanced technology
                  sectors. We provide reliable,
                  high-quality manufacturing solutions
                  tailored to our customers&apos; needs —
                  from small-batch production to
                  large-scale manufacturing.
                </p>

                <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-['DM_Sans'] text-[#3E4850] leading-relaxed">
                  Strategically located in Malaysia, our
                  facilities are equipped with advanced
                  technologies and managed by an
                  experienced team committed to high
                  standards of quality and long-term
                  partnerships with local and
                  international customers.
                </p>
              </motion.div>

              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    x: 30,
                  },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  },
                }}
                className="group w-full md:w-full h-[300px] md:h-[310px] lg:h-[500px] rounded-[24px] overflow-hidden"
              >
                <img
                  src={img1}
                  alt="Factory"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </motion.div>
            </motion.div>

            {/* Mission & Vision Grid */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-24"
            >
              <div className="order-2 lg:order-1 group h-[200px] md:h-[250px] lg:h-[275px] rounded-[24px] overflow-hidden">
                <img
                  src={cap1}
                  alt="Cleanroom"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>

              <div className="order-1 lg:order-2 bg-[#E1E5EAC2] rounded-[24px] p-8 md:p-12 flex flex-col justify-center h-[200px] md:h-[250px] lg:h-[275px]">
                <span className="text-[#00B2F9] font-bold text-[12px] md:text-[14px] lg:text-[16px] tracking-[1.5px] uppercase mb-4 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-[#00B2F9]"></span>

                  OUR MISSION
                </span>

                <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#3E4850] font-['DM_Sans'] leading-relaxed">
                  To empower our customers by delivering
                  reliable, high-quality manufacturing
                  services that drive innovation, cost
                  reduction and accelerated time to
                  market.
                </p>
              </div>

              <div className="order-3 lg:order-3 bg-[#E1E5EAC2] rounded-[24px] p-8 md:p-12 flex flex-col justify-center h-[200px] md:h-[250px] lg:h-[275px]">
                <span className="text-[#00B2F9] font-bold text-[12px] md:text-[14px] lg:text-[16px] tracking-[1.5px] uppercase mb-4 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-[#00B2F9]"></span>

                  OUR VISION
                </span>

                <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-['DM_Sans'] text-[#3E4850] leading-relaxed">
                  To be a competitive manufacturing
                  partner in Asia, recognised for
                  quality, integrity and long-term
                  customer partnerships.
                </p>
              </div>

              <div className="order-4 lg:order-4 group h-[200px] md:h-[250px] lg:h-[275px] rounded-[24px] overflow-hidden">
                <img
                  src={cap2}
                  alt="Equipment"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>

              <div className="order-6 lg:order-5 group h-[200px] md:h-[250px] lg:h-[275px] rounded-[24px] overflow-hidden">
                <img
                  src={teamImg}
                  alt="Our Team"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>

              <div className="order-5 lg:order-6 bg-[#E1E5EAC2] rounded-[24px] p-8 md:p-12 flex flex-col justify-center h-[200px] md:h-[250px] lg:h-[275px]">
                <span className="text-[#00B2F9] font-bold text-[12px] md:text-[14px] lg:text-[16px] tracking-[1.5px] uppercase mb-4 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-[#00B2F9]"></span>

                  OUR TEAM
                </span>

                <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-['DM_Sans'] text-[#3E4850] leading-relaxed">
                  Our team is led by experienced engineers with
                  strong technical background, ensuring that every
                  project is executed with industrial precision and
                  technical mastery.
                </p>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="bg-gradient-to-r from-[#275A73] to-[#4AAAD9] rounded-[24px] p-12 md:p-15 text-center flex flex-col items-center justify-center"
            >
              <h2 className="font-['Space_Grotesk'] font-bold text-[26px] md:text-[35px] lg:text-[44px] text-[#FFFFFF] leading-tight mb-8">
                Ready to build with a partner
                <br className="hidden md:block" />{" "}
                you can rely on?
              </h2>

              <Link
                to="/contact#contact-form-section"
                className="inline-flex items-center justify-center px-5 md:px-7 lg:px-8 h-[45px] md:h-[46px] lg:h-[50px] rounded-[15px] bg-[#2A2E34] text-[#FFFFFF] font-['DM_Sans'] text-[15px] md:text-[16px] lg:text-[18px] font-medium leading-[24px] hover:bg-[#3E4850] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md"
              >
                Get in touch
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const AboutGridPattern = ({
  offsetX,
  offsetY,
  active,
}) => {
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