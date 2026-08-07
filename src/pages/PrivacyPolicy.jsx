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

export default function PrivacyPolicy() {
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
              Privacy policy
            </h1>

            <p className="text-[15px] md:text-[16px] lg:text-[18px] font-['DM_Sans'] font-normal text-[#FFFFFF]">
              <Link to="/" className="hover:text-[#FFFFFF] hover:underline transition-colors">Home</Link> / Privacy policy
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
              <PrivacyGridPattern
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
              <PrivacyGridPattern
                offsetX={gridOffsetX}
                offsetY={gridOffsetY}
                active={true}
              />
            </motion.div>
          </div>

          <div className="responsive-container relative z-10 flex flex-col gap-8 md:gap-10">
            
            {/* Data */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Data
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                When visitors leave any information in the website we collect the data shown in the forms and also the visitor's IP address and browser user agent string to help spam detection.
              </p>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here:{" "}
                <a 
                  href="https://automattic.com/privacy/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#00B2F9] hover:underline"
                >
                  https://automattic.com/privacy/
                </a>.
              </p>
            </div>

            {/* Cookies */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Cookies
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                If you fill a form on our website you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you visit us more than one time. These cookies will last for one year.
              </p>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                We will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
              </p>
            </div>

            {/* Embedded content from other websites */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Embedded content from other websites
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                Articles on this website may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
              </p>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
              </p>
            </div>

            {/* Media & Copyright */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Media & Copyright
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                We use free Unsplash.com images on this website. License terms for use are at{" "}
                <a 
                  href="https://unsplash.com/license" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#00B2F9] hover:underline"
                >
                  https://unsplash.com/license
                </a>. We also use photographs with permission. All persons portrayed have authorized the use of their images on this website.
              </p>
            </div>

            {/* Your acceptance of these terms */}
            <div className="flex flex-col gap-3">
              <h2 className="font-['Space_Grotesk'] font-bold text-[22px] md:text-[26px] text-[#2A2E34]">
                Your acceptance of these terms
              </h2>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
              </p>
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850] leading-relaxed">
                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us.
              </p>
            </div>

            <div className="border-t border-[#E2E8F0] pt-6 mt-4">
              <p className="font-['DM_Sans'] text-[15px] md:text-[18px] lg:text-[20px] text-[#3E4850]">
                This page was last updated on 5th august, 2026
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const PrivacyGridPattern = ({ offsetX, offsetY, active }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={
            active
              ? "grid-pattern-active-privacy"
              : "grid-pattern-base-privacy"
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
            ? "url(#grid-pattern-active-privacy)"
            : "url(#grid-pattern-base-privacy)"
        }
      />
    </svg>
  );
};
