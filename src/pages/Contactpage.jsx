import React, { useEffect } from "react";
import Navbar from "../components/Layout/navbar";
import Footer from "../components/Layout/Footer";
import { FiMail, FiMapPin } from "react-icons/fi";
import heroBg from "../assets/contact_herobg.png";
import contactMap from "../assets/contact-map.png";
import { useLocation } from "react-router-dom";
import { useContactEnquiryForm } from "../lib/contactForm";
import {
  ContactPhoneField,
  ContactPrivacyCheckbox,
} from "../components/ContactFormFields";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";

const SendArrowIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 681 605"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="
        M46 62
        L648 315
        L46 568
        Z

        M109 156
        L486 315
        L110 475
        L108 473
        L109 362
        L298 315
        L109 268
        Z
      "
    />
  </svg>
);

export default function Contactpage() {
  const location = useLocation();

  const {
    form,
    errors,
    submitted,
    submitting,
    submitError,
    setSubmitted,
    handleChange,
    handlePhoneCountryChange,
    handlePhoneChange,
    handlePrivacyChange,
    handleSubmit,
  } = useContactEnquiryForm();

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
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else if (location.state?.scrollTo === "contact-form-section") {
      const timer = setTimeout(() => {
        const section = document.getElementById(
          "contact-form-section"
        );

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  }, [location]);

  const openGoogleMaps = () => {
    window.open(
      "https://maps.app.goo.gl/FwstsTFtcwtBAkmN6",
      "_blank",
      "noopener,noreferrer"
    );
  };

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
              alt="Contact Hero"
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
              Contact us
            </h1>

            <p className="text-[15px] md:text-[16px] lg:text-[18px] font-['DM_Sans'] font-normal text-[#FFFFFF]">
              <span
                onClick={() => (window.location.href = "/")}
                className="cursor-pointer hover:underline"
              >
                Home
              </span>{" "}
              / Contact
            </p>
          </motion.div>
        </section>

        {/* Content Section */}
        <section
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden py-16 md:py-20"
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-100">
              <ContactGridPattern
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
              <ContactGridPattern
                offsetX={gridOffsetX}
                offsetY={gridOffsetY}
                active={true}
              />
            </motion.div>
          </div>

          <div
            id="contact-form-section"
            className="responsive-container relative z-10 scroll-mt-[90px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="text-center mb-[30px] md:mb-[45px] lg:mb-[65px]"
            >
              <h2 className="font-['Space_Grotesk'] font-bold text-[25px] md:text-[33px] lg:text-[40px] text-[#2A2E34] mb-4">
                Let's build something precise, together
              </h2>

              <p className="text-[15px] md:text-[18px] lg:text-[20px] font-['DM_Sans'] text-[#64748B] max-w-[700px] mx-auto leading-relaxed">
                For inquiries, quotations, or more information about our
                services, please reach out — we'd love to hear from you.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.18,
                    delayChildren: 0.15,
                  },
                },
              }}
              className="bg-[#EEF6FD] rounded-[20px] p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-16"
            >
              {/* Left Info Panel */}
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
                className="bg-[#2A2E34] text-[#FFFFFF] rounded-[16px] p-8 md:p-10 w-full lg:w-[50%] flex flex-col gap-[50px]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#006591] flex items-center justify-center flex-shrink-0 mt-1">
                    <FiMail className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="font-medium font-['Space_Grotesk'] text-[15px] md:text-[18px] lg:text-[19px] mb-1">
                      Email
                    </h3>

                    <p className="text-[13px] md:text-[16px] lg:text-[17px] font-['DM_Sans'] text-[#FFFFFF]">
                      enquiry@nlptec.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 flex-grow">
                  <div className="w-10 h-10 rounded-full bg-[#006591] flex items-center justify-center flex-shrink-0 mt-1">
                    <FiMapPin className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="font-medium font-['Space_Grotesk'] text-[15px] md:text-[18px] lg:text-[19px] mb-1">
                      Address
                    </h3>

                    <p className="text-[12px] md:text-[16px] lg:text-[17px] font-['DM_Sans'] text-[#FFFFFF] leading-relaxed">
                      NLP Technology Sdn. Bhd.
                      <br />
                      15, Jalan Pelepas 4/8, Taman
                      <br />
                      Perindustrian Tanjong Pelepas,
                      <br />
                      81550 Gelang Patah, Johor, Malaysia.
                    </p>
                  </div>
                </div>

                {/* Map Image */}
                <div
                  onClick={openGoogleMaps}
                  className="
                    w-full
                    h-[200px]
                    rounded-[12px]
                    overflow-hidden
                    cursor-pointer
                    relative
                    group
                    transition-all
                    duration-300
                    hover:scale-[1.02]
                    hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]
                  "
                >
                  <img
                    src={contactMap}
                    alt="NLP Technology Location Map"
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C8.14 2 5 5.14 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.14 15.86 2 12 2Z"
                          fill="#FF0000"
                        />

                        <circle
                          cx="12"
                          cy="9"
                          r="3"
                          fill="#FFFFFF"
                        />
                      </svg>

                      <span className="text-[#2A2E34] font-['DM_Sans'] font-semibold text-[10px] md:text-[13px] lg:text-[13px]">
                        Open in Google Maps
                      </span>

                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 13v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3"
                          stroke="#2A2E34"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <polyline
                          points="15 3 21 3 21 9"
                          stroke="#2A2E34"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <line
                          x1="10"
                          y1="14"
                          x2="21"
                          y2="3"
                          stroke="#2A2E34"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Form Panel */}
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
                className="w-full lg:w-[50%] h-full flex flex-col justify-center"
              >
                {submitted ? (
                  <div className="w-full min-h-[579px] bg-[#FFFFFF] rounded-[10px] px-7 py-7 pt-[70px] shadow-xl text-[#0B1C30] relative overflow-hidden">
                    <div className="min-h-[380px] text-center flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6"
                      >
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="font-['Space_Grotesk'] font-bold text-[24px] md:text-[26px] lg:text-[27px] text-[#1E293B]"
                      >
                        Request Sent!
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-4 font-['DM_Sans'] text-[14px] md:text-[15px] lg:text-[17px] text-[#64748B] max-w-[320px]"
                      >
                        Thank you for reaching out. Our team will
                        review your details and contact you within one business
                        day.
                      </motion.p>

                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="mt-8 px-6 py-2 border border-[#0EA5E9] text-[#0EA5E9] rounded-md text-[14px] md:text-[15px] lg:text-[16px] font-medium hover:bg-[#0EA5E9] hover:text-white hover:scale-[1.03] transition-all duration-200 font-['DM_Sans']"
                      >
                        Submit Another Request
                      </motion.button>
                    </div>
                  </div>
                ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 w-full"
                  noValidate
                >
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-page-name"
                        className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                      >
                        Name{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        id="contact-page-name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        autoComplete="name"
                        className={`h-[44px] px-4 font-['DM_Sans'] rounded-[8px] border bg-[#FFFFFF] text-[14px] md:text-[15px] lg:text-[16px] outline-none transition-colors ${
                          errors.name
                            ? "border-red-500"
                            : "border-gray-200 focus:border-[#00B2F9]"
                        }`}
                      />

                      {errors.name && (
                        <span className="text-red-500 text-[11px] font-['DM_Sans']">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-page-email"
                        className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                      >
                        Email{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="email"
                        id="contact-page-email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        autoComplete="email"
                        className={`h-[44px] px-4 font-['DM_Sans'] rounded-[8px] border bg-[#FFFFFF] text-[14px] md:text-[15px] lg:text-[16px] outline-none transition-colors ${
                          errors.email
                            ? "border-red-500"
                            : "border-gray-200 focus:border-[#00B2F9]"
                        }`}
                      />

                      {errors.email && (
                        <span className="text-red-500 text-[11px] font-['DM_Sans']">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone and Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <ContactPhoneField
                      idPrefix="contact-page"
                      form={form}
                      errors={errors}
                      onCountryChange={handlePhoneCountryChange}
                      onPhoneChange={handlePhoneChange}
                      selectClassName="pl-3 pr-9 rounded-[8px]"
                      inputClassName="rounded-[8px]"
                    />

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="contact-page-address"
                        className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                      >
                        Address{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        id="contact-page-address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Your company address"
                        autoComplete="street-address"
                        className={`h-[44px] px-4 font-['DM_Sans'] rounded-[8px] border bg-[#FFFFFF] text-[14px] md:text-[15px] lg:text-[16px] outline-none transition-colors ${
                          errors.address
                            ? "border-red-500"
                            : "border-gray-200 focus:border-[#00B2F9]"
                        }`}
                      />

                      {errors.address && (
                        <span className="text-red-500 text-[11px] font-['DM_Sans']">
                          {errors.address}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2 w-full">
                    <label
                      htmlFor="contact-page-message"
                      className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                    >
                      Message/ Enquiry{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      id="contact-page-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements (up to 600 words)"
                      rows="8"
                      className={`px-4 py-3 font-['DM_Sans'] rounded-[8px] border bg-[#FFFFFF] text-[14px] md:text-[15px] lg:text-[16px] outline-none transition-colors resize-none ${
                        errors.message
                          ? "border-red-500"
                          : "border-gray-200 focus:border-[#00B2F9]"
                      }`}
                    />

                    {errors.message && (
                      <span className="text-red-500 text-[11px] font-['DM_Sans']">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <ContactPrivacyCheckbox
                    idPrefix="contact-page"
                    form={form}
                    errors={errors}
                    onChange={handlePrivacyChange}
                  />

                  {submitError && (
                    <p className="rounded-[8px] bg-red-50 px-4 py-3 font-['DM_Sans'] text-[14px] text-red-600">
                      {submitError}
                    </p>
                  )}


                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-3 w-full h-[54px] bg-[#00B2F9] hover:bg-[#0EA5E9] text-[#FFFFFF] rounded-[8px] font-medium font-['DM_Sans'] text-[17px] md:text-[18px] lg:text-[19px] flex items-center justify-center gap-2 hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Sending..."
                      : "Send enquiry"}

                    {!submitting && (
                      <SendArrowIcon className="w-4 h-4 text-[#FFFFFF]" />
                    )}
                  </button>
                </form>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const ContactGridPattern = ({
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
              ? "grid-pattern-active-contact"
              : "grid-pattern-base-contact"
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
            ? "url(#grid-pattern-active-contact)"
            : "url(#grid-pattern-base-contact)"
        }
      />
    </svg>
  );
};