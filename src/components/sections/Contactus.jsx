import React, { useState, useEffect, useRef } from "react";
import bgcontact from "../../assets/bg_contact.png";
import contactMap from "../../assets/contact-map.png";
import { FiMapPin } from "react-icons/fi";
import { useContactEnquiryForm } from "../../lib/contactForm";
import {
  ContactPhoneField,
  ContactPrivacyCheckbox,
  ContactFileUploader,
  ContactInlineCaptcha,
  SuccessPopupModal,
} from "../ContactFormFields";

const bgImage = bgcontact;

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

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const ContactSection = () => {
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
    handleFileChange,
    handleCaptchaChange,
    handleSubmit,
  } = useContactEnquiryForm();

  const [sectionRef, sectionInView] = useInView();

  const openGoogleMaps = () => {
    window.open(
      "https://maps.app.goo.gl/FwstsTFtcwtBAkmN6",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeSlideRight {
          from {
            opacity: 0;
            transform: translateX(-28px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeSlideLeft {
          from {
            opacity: 0;
            transform: translateX(28px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          70% {
            transform: scale(1.04);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .contact-heading {
          opacity: 0;
        }

        .contact-heading.visible {
          animation: fadeSlideRight 0.65s ease forwards;
        }

        .contact-subtext {
          opacity: 0;
        }

        .contact-subtext.visible {
          animation: fadeSlideRight 0.65s 0.15s ease forwards;
        }

        .contact-info-item {
          opacity: 0;
        }

        .contact-info-item.visible {
          animation: fadeSlideRight 0.55s ease forwards;
        }

        .contact-form-card {
          opacity: 0;
        }

        .contact-form-card.visible {
          animation: fadeSlideLeft 0.7s 0.1s ease forwards;
        }

        .contact-icon-wrap {
          transition:
            transform 0.3s ease,
            background-color 0.3s ease;
        }

        .contact-submit-btn {
          transition:
            background-color 0.3s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .contact-submit-btn:hover {
          box-shadow: none;
        }

        .contact-submit-btn:active {
          transform: scale(0.97) !important;
        }

        .contact-input {
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .contact-input:focus {
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
        }

        .contact-success-icon {
          animation: popIn 0.5s ease forwards;
        }

        .contact-success-text {
          animation: fadeSlideUp 0.5s 0.2s ease both;
        }

        .contact-success-btn {
          animation: fadeSlideUp 0.5s 0.35s ease both;
          transition:
            background-color 0.25s ease,
            color 0.25s ease,
            transform 0.2s ease;
        }

        .contact-success-btn:hover {
          transform: scale(1.03);
        }
      `}</style>

      <section
        id="contact"
        ref={sectionRef}
        className="relative py-[40px] lg:py-[60px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#20262C]/90 z-0" />

        <div className="responsive-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="w-full flex flex-col gap-3 justify-center items-start text-left text-[#FFFFFF] lg:min-h-[500px]">
              <div
                className={`flex items-center gap-4 mb-4 contact-heading${
                  sectionInView ? " visible" : ""
                }`}
              >
                <div className="w-[30px] h-[2px] bg-[#00B2F9]" />

                <span className="font-['Inter'] font-semibold text-[12px] md:text-[14px] lg:text-[16px] leading-[38px] tracking-[1.8px] uppercase text-[#00B2F9]">
                  Contact us
                </span>
              </div>

              <h2
                className={`font-['Space_Grotesk'] font-bold text-[25px] md:text-[33px] lg:text-[40px] leading-[1.2] text-[#FFFFFF] contact-heading${
                  sectionInView ? " visible" : ""
                }`}
                style={{ animationDelay: "0.1s" }}
              >
                Let’s build it together
              </h2>

              <p
                className={`mt-2 font-['DM_Sans'] font-medium text-[18px] md:text-[20px] lg:text-[22px] max-h-[550px] max-w-[630px] contact-subtext${
                  sectionInView ? " visible" : ""
                }`}
              >
                For inquiries, quotations or more information about our
                services reach out — we&apos;d love to hear from you.
              </p>

              <div className="mt-6 md:mt-[50px] space-y-5 w-full">
                {/* Address */}
                <div
                  className={`flex items-start gap-4 contact-info-item${
                    sectionInView ? " visible" : ""
                  }`}
                  style={{ animationDelay: "0.25s" }}
                >
                  <div className="contact-icon-wrap w-10 h-10 rounded-full bg-[#006591] flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-5 h-5 text-[#FFFFFF]" />
                  </div>

                  <div>
                    <h4 className="font-medium font-['Space_Grotesk'] text-[19px] md:text-[21px] lg:text-[24px] leading-[20px] text-[#FFFFFF]">
                      Address
                    </h4>

                    <p className="text-[17px] md:text-[19px] lg:text-[21px] font-['DM_Sans'] text-[#FFFFFF] leading-[29px] mt-2 lg:mt-4 mb-5 md:mb-6 lg:mb-[50px]">
                      NLP Technology Sdn. Bhd.
                      <br />
                      15, Jalan Pelepas 4/8, Taman Perindustrian Tanjong
                      Pelepas,
                      <br />
                      81550 Gelang Patah, Johor, Malaysia.
                    </p>
                  </div>
                </div>

                {/* Location Map */}
                <div
                  className={`w-full contact-info-item${
                    sectionInView ? " visible" : ""
                  }`}
                  style={{ animationDelay: "0.35s" }}
                >
                  <div
                    onClick={openGoogleMaps}
                    className="
                      w-full
                      h-[200px]
                      md:h-[280px]
                      lg:h-[370px]
                      rounded-[12px]
                      overflow-hidden
                      cursor-pointer
                      relative
                      group
                      transition-all
                      duration-300
                      hover:scale-[1.01]
                      hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]
                      border border-white/10
                    "
                  >
                    <img
                      src={contactMap}
                      alt="NLP Technology Location Map"
                      className="w-full h-full object-cover"
                    />
  {/* Company Badge */}
<div
  className="
    absolute
    top-3
    left-3
    flex
    items-start
    gap-2
    bg-white
    px-3
    py-3
    rounded-[8px]
    shadow-xl
    shadow-black/15
    border
    z-20
  "
>
  <div className="font-['DM_Sans']">
    <h1 className="text-[#2A2E34] font-semibold text-[10px] md:text-[14px] leading-tight">
      NLP Technology Sdn. Bhd.
    </h1>

    <p className="mt-2 text-gray-700 text-[9px] md:text-[12px] leading-relaxed">
      15, Jalan Pelepas 4/8, Taman <br />
      Perindustrian Tanjong Pelepas, <br />
      81550 Gelang Patah, Johor, Malaysia.
    </p>
  </div>
</div>
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
                          <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
                        </svg>

                        <span className="text-[#2A2E34] font-['DM_Sans'] font-semibold text-[13px]">
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
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="w-full flex justify-center lg:justify-end items-center">
              <div
                className={`w-full max-w-[660px] md:max-w-none lg:max-w-[660px] min-h-[436px] bg-[#FFFFFF] rounded-[10px] px-7 py-7 shadow-xl text-[#0B1C30] relative overflow-hidden contact-form-card${
                  sectionInView ? " visible" : ""
                }`}
              >
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 w-full"
                    noValidate
                  >
                    {/* Name and Company name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="home-contact-name"
                          className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                        >
                          Name <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          id="home-contact-name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          autoComplete="name"
                          className={`contact-input w-full h-[44px] px-4 rounded-[7px] border bg-[#FFFFFF] text-[14px] md:text-[15px] lg:text-[16px] outline-none font-['DM_Sans'] placeholder:text-[#BEC8D2] ${
                            errors.name
                              ? "border-red-500"
                              : "border-[#C9D3DF] focus:border-[#00B2F9]"
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
                          htmlFor="home-contact-address"
                          className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                        >
                          Company name <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="text"
                          id="home-contact-address"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="Your company name"
                          autoComplete="organization"
                          className={`contact-input w-full h-[44px] px-4 rounded-[7px] border bg-[#FFFFFF] outline-none font-['DM_Sans'] text-[14px] md:text-[15px] lg:text-[16px] placeholder:text-[#BEC8D2] ${
                            errors.address
                              ? "border-red-500"
                              : "border-[#C9D3DF] focus:border-[#00B2F9]"
                          }`}
                        />

                        {errors.address && (
                          <span className="text-red-500 text-[11px] font-['DM_Sans']">
                            {errors.address}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Phone and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <ContactPhoneField
                        idPrefix="home-contact"
                        form={form}
                        errors={errors}
                        onCountryChange={handlePhoneCountryChange}
                        onPhoneChange={handlePhoneChange}
                        selectClassName="pl-3 pr-9"
                      />

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="home-contact-email"
                          className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>

                        <input
                          type="email"
                          id="home-contact-email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Your email address"
                          autoComplete="email"
                          className={`contact-input w-full h-[44px] px-4 rounded-[7px] border bg-[#FFFFFF] text-[14px] md:text-[15px] lg:text-[16px] outline-none font-['DM_Sans'] placeholder:text-[#BEC8D2] ${
                            errors.email
                              ? "border-red-500"
                              : "border-[#C9D3DF] focus:border-[#00B2F9]"
                          }`}
                        />

                        {errors.email && (
                          <span className="text-red-500 text-[11px] font-['DM_Sans']">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Upload File */}
                    <ContactFileUploader
                      form={form}
                      errors={errors}
                      onFileChange={handleFileChange}
                    />

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="home-contact-message"
                        className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                      >
                        Message/ Enquiry <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        id="home-contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about your requirements (up to 600 words)"
                        className={`contact-input w-full min-h-[113px] px-4 py-3 rounded-[7px] border bg-[#FFFFFF] outline-none resize-none font-['DM_Sans'] text-[14px] md:text-[15px] lg:text-[16px] placeholder:text-[#BEC8D2] ${
                          errors.message
                            ? "border-red-500"
                            : "border-[#C9D3DF] focus:border-[#00B2F9]"
                        }`}
                      />

                      {errors.message && (
                        <span className="text-red-500 text-[11px] font-['DM_Sans']">
                          {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Inline CAPTCHA */}
                    <ContactInlineCaptcha
                      onVerify={handleCaptchaChange}
                      captchaVerified={form.captchaVerified}
                      errors={errors}
                    />

                    {/* Privacy Checkbox */}
                    <ContactPrivacyCheckbox
                      idPrefix="home-contact"
                      form={form}
                      errors={errors}
                      onChange={handlePrivacyChange}
                    />

                    {submitError && (
                      <p className="rounded-[7px] bg-red-50 px-4 py-3 font-['DM_Sans'] text-[13px] text-red-600">
                        {submitError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-2 w-full h-[48px] bg-[#00B2F9] hover:bg-[#0EA5E9] text-[#FFFFFF] rounded-[15px] font-medium font-['DM_Sans'] text-[17px] md:text-[18px] lg:text-[19px] flex items-center justify-center gap-2 hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? "Sending..." : "Send enquiry"}

                      {!submitting && (
                        <SendArrowIcon className="w-4 h-4 text-[#FFFFFF]" />
                      )}
                    </button>
                  </form>

                <SuccessPopupModal 
                  isOpen={submitted} 
                  onClose={() => setSubmitted(false)} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;