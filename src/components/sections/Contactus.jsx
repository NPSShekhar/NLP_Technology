import React, { useState, useEffect, useRef } from "react";
import bgcontact from "../../assets/bg_contact.png";
import { FiMail, FiMapPin } from "react-icons/fi";

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
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sectionRef, sectionInView] = useInView();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    });
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

        @keyframes iconPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
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
                <div className="w-[28px] h-[1px] bg-[#00B2F9]" />

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
                className={`mt-2 font-['DM_Sans'] font-medium text-[17px] md:text-[18px] lg:text-[20px] max-h-[550px] max-w-[630px] contact-subtext${
                  sectionInView ? " visible" : ""
                }`}
              >
                For inquiries, quotations or more information about our
                services reach out — we&apos;d love to hear from you.
              </p>

              <div className="mt-10 space-y-7">
                {/* Email */}
                <div
                  className={`flex items-start gap-4 contact-info-item${
                    sectionInView ? " visible" : ""
                  }`}
                  style={{ animationDelay: "0.35s" }}
                >
                  <div className="contact-icon-wrap w-10 h-10 rounded-full bg-[#006591] flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-5 h-5 text-[#FFFFFF]" />
                  </div>

                  <div>
                    <h4 className="font-['Space_Grotesk'] font-medium text-[17px] md:text-[18px] lg:text-[19px] leading-[20px] text-[#FFFFFF]">
                      Email
                    </h4>

                    <p className="text-[15px] md:text-[16px] lg:text-[17px] font-['DM_Sans'] text-[#FFFFFF] leading-[20px] mt-2">
                      <a href="mailto:enquiry@nlptec.com">
                        enquiry@nlptec.com
                      </a>
                    </p>
                  </div>
                </div>

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
                    <h4 className="font-medium font-['Space_Grotesk'] text-[17px] md:text-[18px] lg:text-[19px] leading-[20px] text-[#FFFFFF]">
                      Address
                    </h4>

                    <p className="text-[15px] md:text-[16px] lg:text-[17px] font-['DM_Sans'] text-[#FFFFFF] leading-[24px] mt-2">
                      NLP Technology Sdn. Bhd.
                      <br />
                      15, Jalan Pelepas 4/8, Taman Perindustrian Tanjong
                      Pelepas,
                      <br />
                      81550 Gelang Patah, Johor, Malaysia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="w-full flex justify-center lg:justify-end items-center">
              <div
                className={`w-full max-w-[660px] min-h-[436px] bg-[#FFFFFF] rounded-[10px] px-7 py-7 shadow-xl text-[#0B1C30] relative overflow-hidden contact-form-card${
                  sectionInView ? " visible" : ""
                }`}
              >
                {submitted ? (
                  <div className="min-h-[380px] text-center flex flex-col items-center justify-center">
                    <div className="contact-success-icon w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
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
                    </div>

                    <h3 className="contact-success-text font-['Space_Grotesk'] font-bold text-2xl text-[#1E293B]">
                      Request Sent!
                    </h3>

                    <p className="contact-success-text mt-3 font-['DM_Sans'] text-sm text-[#64748B] max-w-[320px]">
                      Thank you for reaching out. Our engineering team will
                      review your details and contact you within one business
                      day.
                    </p>

                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="contact-success-btn mt-8 px-6 py-2 border border-[#0EA5E9] text-[#0EA5E9] rounded-md text-sm font-medium hover:bg-[#0EA5E9] hover:text-white font-['DM_Sans']"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 w-full"
                  >
                    {/* Name and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="name"
                          className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                        >
                          Name
                        </label>

                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
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
                          htmlFor="email"
                          className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                        >
                          Email
                        </label>

                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Your email address"
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

                    {/* Phone and Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="phone"
                          className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                        >
                          Phone
                        </label>

                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          className={`contact-input w-full h-[44px] px-4 rounded-[7px] border bg-[#FFFFFF] outline-none font-['DM_Sans'] text-[14px] md:text-[15px] lg:text-[16px] placeholder:text-[#BEC8D2] ${
                            errors.phone
                              ? "border-red-500"
                              : "border-[#C9D3DF] focus:border-[#00B2F9]"
                          }`}
                        />

                        {errors.phone && (
                          <span className="text-red-500 text-[11px] font-['DM_Sans']">
                            {errors.phone}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label
                          htmlFor="address"
                          className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                        >
                          Address
                        </label>

                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="Your company address"
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

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="message"
                        className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
                      >
                        Message/ Enquiry
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about your requirements ( up to 600 words )"
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

                    <button
                      type="submit"
                      className="mt-2 w-full h-[48px] bg-[#00B2F9] hover:bg-[#0EA5E9] text-[#FFFFFF] rounded-[8px] font-medium font-['DM_Sans'] text-[17px] md:text-[18px] lg:text-[19px] flex items-center justify-center gap-2 hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md"
                    >
                      Send enquiry
                      <SendArrowIcon className="w-4 h-4 text-[#FFFFFF]" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;