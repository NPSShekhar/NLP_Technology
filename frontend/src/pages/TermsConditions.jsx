import React, { useEffect } from "react";
import Navbar from "../components/Layout/navbar";
import Footer from "../components/Layout/Footer";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
      <Navbar />

      <main className="flex-grow pt-[60px] sm:pt-[68px] lg:pt-[75px]">
        {/* Hero Section */}
        <section 
          className="relative h-[200px] md:h-[250px] lg:h-[280px] flex flex-col items-center justify-center text-center text-[#FFFFFF] px-4"
          style={{ background: "linear-gradient(90deg, #275A73 0%, #4AAAD9 100%)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-['Space_Grotesk'] font-medium text-[32px] md:text-[42px] lg:text-[48px] leading-tight mb-2">
              Terms & Conditions
            </h1>

            <p className="text-[15px] md:text-[16px] lg:text-[18px] font-['DM_Sans'] font-normal text-[#FFFFFF]">
              <Link to="/" className="hover:text-[#FFFFFF] hover:underline transition-colors">Home</Link> / Terms & Conditions
            </p>
          </motion.div>
        </section>

        {/* Content Section */}
        <section
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden py-12 md:py-16 lg:py-20"
        >
          {/* Base Grid Background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-100">
              <TermsGridPattern
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
              <TermsGridPattern
                offsetX={gridOffsetX}
                offsetY={gridOffsetY}
                active={true}
              />
            </motion.div>
          </div>

          <div className="responsive-container relative z-10 flex flex-col gap-8 md:gap-10">
            
            {/* Use of the Website */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Use of the Website
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                This website is provided for general information about NLP Technology, our services, products, and capabilities. You agree to use this website only for lawful purposes and in a manner that does not interfere with its operation or restrict others from using it.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Intellectual Property
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                All content on this website, including text, graphics, images, logos, icons, documents, and other materials, is the property of NLP Technology unless otherwise stated. No content may be copied, reproduced, modified, or distributed without prior written permission.
              </p>
            </div>

            {/* Products & Services */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Products & Services
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                The information provided about our products and services is for general reference only. Specifications, features, and availability may change without prior notice. We reserve the right to modify or discontinue any product or service at our discretion.
              </p>
            </div>

            {/* Enquiries */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Enquiries
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                Any information submitted through our contact forms, quotation requests, or other communication channels must be accurate and complete. Submission of an enquiry does not create a contractual relationship between you and NLP Technology.
              </p>
            </div>

            {/* Third-Party Links */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Third-Party Links
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                Our website may contain links to third-party websites for your convenience. NLP Technology is not responsible for the content, privacy practices, or availability of these external websites.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Limitation of Liability
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                While we strive to ensure the information on this website is accurate and up to date, NLP Technology makes no warranties regarding its completeness or accuracy. We shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of this website.
              </p>
            </div>

            {/* Privacy */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Privacy
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                Your use of this website is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
              </p>
            </div>

            {/* Changes to These Terms */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Changes to These Terms
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                NLP Technology reserves the right to update or revise these Terms & Conditions at any time without prior notice. Any changes will be effective immediately upon publication on this page.
              </p>
            </div>

            {/* Governing Law */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Governing Law
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                These Terms & Conditions shall be governed by and interpreted in accordance with the laws of Malaysia. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the Malaysian courts.
              </p>
            </div>

            {/* Contact Us */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Contact Us
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                If you have any questions regarding these Terms & Conditions, please contact us through the Contact Us page or using the contact information provided on our website.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const TermsGridPattern = ({ offsetX, offsetY, active }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={
            active
              ? "grid-pattern-active-terms"
              : "grid-pattern-base-terms"
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
            ? "url(#grid-pattern-active-terms)"
            : "url(#grid-pattern-base-terms)"
        }
      />
    </svg>
  );
};
