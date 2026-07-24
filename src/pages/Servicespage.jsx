import React, { useEffect, useState } from "react";
import Navbar from "../components/Layout/navbar";
import Footer from "../components/Layout/Footer";
import heroBg from "../assets/service_herobg.png";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";

export default function Servicespage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5001";

        const response = await fetch(`${apiUrl}/api/services`, {
          method: "GET",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch services"
          );
        }

        setServices(
          Array.isArray(data.services) ? data.services : []
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Services fetch error:", error);
          setError(error.message || "Unable to load services");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] font-['Inter']">
      <Navbar />

      <main className="flex-grow pt-[60px] sm:pt-[68px] lg:pt-[75px]">
        {/* Hero Section */}
        <section className="relative h-[250px] md:h-[350px] lg:h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 mix-blend-multiply bg-[linear-gradient(90deg,rgba(26,32,41,0.85)_0%,rgba(26,32,41,0.65)_50%,rgba(26,32,41,0.35)_100%)]"></div>

            <img
              src={heroBg}
              alt="Services Hero"
              className="w-full h-full object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-20 text-center text-[#FFFFFF] mt-8"
          >
            <h1 className="font-['Space_Grotesk'] font-medium text-[32px] md:text-[42px] lg:text-[48px] leading-tight mb-2">
              Product & Services
            </h1>

            <p className="text-[15px] md:text-[16px] lg:text-[18px] font-['DM_Sans'] font-normal text-[#FFFFFF] ">
              <span
                onClick={() => (window.location.href = "/")}
                className="cursor-pointer hover:underline"
              >
                Home
              </span>{" "}
              / Product & Services
            </p>
          </motion.div>
        </section>

        {/* Content Section */}
        <section
          id="services-details"
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden py-16 md:py-20"
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-100">
              <ServicesGridPattern
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
              <ServicesGridPattern
                offsetX={gridOffsetX}
                offsetY={gridOffsetY}
                active={true}
              />
            </motion.div>
          </div>

          <div className="responsive-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="text-center mb-16 md:mb-20 lg:mb-24"
            >
              <h2 className="font-['Space_Grotesk'] font-bold text-[25px] md:text-[36px] lg:text-[40px] text-[#2A2E34] mb-4">
                From prototype to full-scale production and beyond
              </h2>

              <p className="text-[15px] md:text-[19px] lg:text-[20px] font-['DM_Sans'] text-[#64748B] max-w-[600px] mx-auto leading-relaxed">
                A complete contract-manufacturing offering, backed by service
                and parts support that keep your operation running.
              </p>
            </motion.div>

            {loading && (
              <p className="text-center text-[16px] font-['DM_Sans'] text-[#64748B]">
                Loading services...
              </p>
            )}

            {!loading && error && (
              <p className="text-center text-[16px] font-['DM_Sans'] text-red-500">
                {error}
              </p>
            )}

            {!loading && !error && services.length === 0 && (
              <p className="text-center text-[16px] font-['DM_Sans'] text-[#64748B]">
                No services available.
              </p>
            )}

            {!loading && !error && services.length > 0 && (
              <div className="flex flex-col gap-8 md:gap-12 lg:gap-13">
                {services.map((service, index) => {
                  const imageLeft = index % 2 === 0;

                  const serviceNumber = String(
                    index + 1
                  ).padStart(2, "0");

                  return (
                    <motion.div
                      key={service.id}
                      initial={{
                        opacity: 0,
                        y: 40,
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
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                      className="bg-[#EEF6FD] rounded-[24px] p-6 md:p-10 flex flex-col lg:flex-row gap-8 md:gap-12 items-center"
                    >
                      {/* Image */}
                      <div
                        className={`group w-full lg:w-[45%] h-[240px] md:h-[300px] lg:h-[380px] rounded-[16px] overflow-hidden order-1 ${
                          imageLeft
                            ? "lg:order-1"
                            : "lg:order-2"
                        }`}
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        />
                      </div>

                      {/* Text Content */}
                      <div
                        className={`w-full lg:w-[55%] h-auto flex flex-col justify-center order-2 ${
                          imageLeft
                            ? "lg:order-2"
                            : "lg:order-1"
                        }`}
                      >
                        <span className="font-['Space_Grotesk'] font-bold text-[40px] md:text-[56px] lg:text-[66px] text-[#ced1d3] leading-none mb-6">
                          {serviceNumber}
                        </span>

                        <h3 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34] mb-4 leading-tight">
                          {service.title}
                        </h3>

                        <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-['DM_Sans'] text-[#6B7280] leading-relaxed mb-6">
                          {service.description}
                        </p>

                        <span className="inline-flex items-center gap-2 text-[14px] font-semibold tracking-[1px] text-[#00B2F9]">
  <span className="block w-6 h-[2px] bg-[#00B2F9] flex-shrink-0"></span>
  {service.link_text}
</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const ServicesGridPattern = ({
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
              ? "grid-pattern-active-services"
              : "grid-pattern-base-services"
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
            ? "url(#grid-pattern-active-services)"
            : "url(#grid-pattern-base-services)"
        }
      />
    </svg>
  );
};