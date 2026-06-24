import React, { useState, useEffect, useRef } from "react";
import bgcontact from "../../assets/bg_contact.png";
import {
  MapPin,
  Mail,
  Clock,
  Globe,
} from "lucide-react";

const bgImage = bgcontact;

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
};

const ContactSection = () => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sectionRef, sectionInView] = useInView();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.company.trim()) newErrors.company = "Company is required";
    if (!form.email.trim()) {
      newErrors.email = "Work email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.message.trim()) newErrors.message = "Project description is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    setForm({ name: "", company: "", email: "", message: "" });
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.15); }
        }
        .contact-heading { opacity: 0; }
        .contact-heading.visible {
          animation: fadeSlideRight 0.65s ease forwards;
        }
        .contact-subtext { opacity: 0; }
        .contact-subtext.visible {
          animation: fadeSlideRight 0.65s 0.15s ease forwards;
        }
        .contact-info-item { opacity: 0; }
        .contact-info-item.visible {
          animation: fadeSlideRight 0.55s ease forwards;
        }
        .contact-form-card { opacity: 0; }
        .contact-form-card.visible {
          animation: fadeSlideLeft 0.7s 0.1s ease forwards;
        }
        .contact-icon-wrap {
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        .contact-info-item:hover .contact-icon-wrap {
          animation: iconPulse 0.5s ease;
          background-color: rgba(14,165,233,0.75);
        }
        .contact-submit-btn {
          transition: background-color 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .contact-submit-btn:hover {
          box-shadow: none;
        }
        .contact-submit-btn:active {
          transform: scale(0.97) !important;
        }
        .contact-input {
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .contact-input:focus {
          box-shadow: 0 0 0 3px rgba(14,165,233,0.15);
        }
        .contact-success-icon {
          animation: popIn 0.5s ease forwards;
        }
        .contact-success-text {
          animation: fadeSlideUp 0.5s 0.2s ease both;
        }
        .contact-success-btn {
          animation: fadeSlideUp 0.5s 0.35s ease both;
          transition: background-color 0.25s ease, color 0.25s ease, transform 0.2s ease;
        }
        .contact-success-btn:hover {
          transform: scale(1.03);
        }
      `}</style>

      <section
        id="contact"
        ref={sectionRef}
        className="relative py-12 lg:py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#2A2E34CC]/80 z-0" />

        <div className="responsive-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-stretch">

            {/* Left Content */}
            <div className="w-full h-full flex flex-col justify-start items-start text-left text-white">
              <h2
                className={`font-['Space_Grotesk'] text-[25px] sm:text-[36px] lg:text-[40px] font-bold contact-heading${sectionInView ? " visible" : ""}`}
              >
                Ready to Start a Project?
              </h2>

              <p
                className={`mt-3 font-['DM_Sans'] text-[#BEC8D2] leading-7 text-[14px] sm:text-[15px] lg:text-[16px] max-w-lg contact-subtext${sectionInView ? " visible" : ""}`}
              >
                Tell us about your manufacturing needs and our team will be in
                touch within one business day.
              </p>

              <div className="mt-8 space-y-6">

                {/* Location */}
                <div
                  className={`flex items-start gap-4 contact-info-item${sectionInView ? " visible" : ""}`}
                  style={{ animationDelay: "0.25s" }}
                >
                  <div className="contact-icon-wrap w-10 h-10 rounded-full bg-[#0EA5E9]/50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-[#FFFFFF]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] font-medium text-[15px] sm:text-[16px]">
                      Johor Facility
                    </h4>
                    <p className="font-['DM_Sans'] text-[#BEC8D2] text-[13px] sm:text-sm leading-6 mt-1">
                      Plot 45, Industrial Zone B, <br />
                      <span>Tanjong Pelepas, 81560 Johor, Malaysia</span>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div
                  className={`flex items-start gap-4 contact-info-item${sectionInView ? " visible" : ""}`}
                  style={{ animationDelay: "0.35s" }}
                >
                  <div className="contact-icon-wrap w-10 h-10 rounded-full bg-[#0EA5E9]/50 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-[#FFFFFF]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] font-medium text-[15px] sm:text-[16px]">
                      Email
                    </h4>
                    <p className="font-['DM_Sans'] text-[#BEC8D2] text-[13px] sm:text-sm leading-6 mt-1 hover:text-[#0EA5E9] transition-colors">
                      <a href="mailto:solutions@nlptechnology.com">solutions@nlptechnology.com</a>
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div
                  className={`flex items-start gap-4 contact-info-item${sectionInView ? " visible" : ""}`}
                  style={{ animationDelay: "0.45s" }}
                >
                  <div className="contact-icon-wrap w-10 h-10 rounded-full bg-[#0EA5E9]/50 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-[#FFFFFF]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] font-medium text-[15px] sm:text-[16px]">
                      Business Hours
                    </h4>
                    <p className="font-['DM_Sans'] text-[#BEC8D2] text-[13px] sm:text-sm leading-6 mt-1">
                      Mon - Fri: 08:00 - 18:00 (GMT+8)
                    </p>
                  </div>
                </div>

                {/* Global Presence */}
                <div
                  className={`flex items-start gap-4 contact-info-item${sectionInView ? " visible" : ""}`}
                  style={{ animationDelay: "0.55s" }}
                >
                  <div className="contact-icon-wrap w-10 h-10 rounded-full bg-[#0EA5E9]/50 flex items-center justify-center flex-shrink-0">
                    <Globe className="text-[#FFFFFF]" size={20} />
                  </div>
                  <div>
                    <h4 className="font-['Space_Grotesk'] font-medium text-[15px] sm:text-[16px]">
                      Global Presence
                    </h4>
                    <p className="font-['DM_Sans'] text-[#BEC8D2] text-[13px] sm:text-sm leading-6 mt-1">
                      Serving EMEA, APAC, and North America
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="w-full h-full flex flex-col justify-start items-start">
              <div
                className={`w-full max-w-2xl md-mx-auto bg-white rounded-[12px] p-6 sm:p-8 lg:p-10 shadow-2xl text-[#1E293B] relative overflow-hidden flex flex-col justify-between contact-form-card${sectionInView ? " visible" : ""}`}
              >
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center my-auto">
                  <div className="contact-success-icon w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="contact-success-text font-['Space_Grotesk'] font-bold text-2xl text-[#1E293B]">Request Sent!</h3>
                  <p className="contact-success-text mt-3 font-['DM_Sans'] text-sm text-[#64748B] max-w-[320px]" style={{ animationDelay: "0.3s" }}>
                    Thank you for reaching out. Our engineering team will review your details and contact you within one business day.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="contact-success-btn mt-8 px-6 py-2 border border-[#0EA5E9] text-[#0EA5E9] rounded-md text-sm font-medium hover:bg-[#0EA5E9] hover:text-white font-['DM_Sans']"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 flex flex-col justify-between h-full">
                  <div className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      {/* Full Name */}
                      <div>
                        <label htmlFor="name" className="block text-[#1E293B] font-['DM_Sans'] font-medium text-[13px] sm:text-sm mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`contact-input w-full border rounded-[8px] px-4 py-3 outline-none font-['DM_Sans'] text-[13px] sm:text-sm focus:border-[#0EA5E9] transition ${
                            errors.name ? "border-red-500 ring-1 ring-red-500" : "border-[#DFE5EB]"
                          }`}
                        />
                        {errors.name && <span className="text-red-500 text-xs mt-1 font-['DM_Sans'] block">{errors.name}</span>}
                      </div>

                      {/* Company */}
                      <div>
                        <label htmlFor="company" className="block text-[#1E293B] font-['DM_Sans'] font-medium text-[13px] sm:text-sm mb-1.5">
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          className={`contact-input w-full border rounded-[8px] px-4 py-3 outline-none font-['DM_Sans'] text-[13px] sm:text-sm focus:border-[#0EA5E9] transition ${
                            errors.company ? "border-red-500 ring-1 ring-red-500" : "border-[#DFE5EB]"
                          }`}
                        />
                        {errors.company && <span className="text-red-500 text-xs mt-1 font-['DM_Sans'] block">{errors.company}</span>}
                      </div>
                    </div>

                    {/* Work Email */}
                    <div>
                      <label htmlFor="email" className="block text-[#1E293B] font-['DM_Sans'] font-medium text-[13px] sm:text-sm mb-1.5">
                        Work Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@company.com"
                        className={`contact-input w-full border rounded-[8px] px-4 py-3 outline-none font-['DM_Sans'] text-[13px] sm:text-sm focus:border-[#0EA5E9] transition ${
                          errors.email ? "border-red-500 ring-1 ring-red-500" : "border-[#DFE5EB]"
                        }`}
                      />
                      {errors.email && <span className="text-red-500 text-xs mt-1 font-['DM_Sans'] block">{errors.email}</span>}
                    </div>

                    {/* Project Description */}
                    <div>
                      <label htmlFor="message" className="block text-[#1E293B] font-['DM_Sans'] font-medium text-[13px] sm:text-sm mb-1.5">
                        Project Description
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your requirements..."
                        className={`contact-input w-full border rounded-[8px] px-4 py-3 outline-none resize-none font-['DM_Sans'] text-[13px] sm:text-sm focus:border-[#0EA5E9] transition ${
                          errors.message ? "border-red-500 ring-1 ring-red-500" : "border-[#DFE5EB]"
                        }`}
                      />
                      {errors.message && <span className="text-red-500 text-xs mt-1 font-['DM_Sans'] block">{errors.message}</span>}
                    </div>
                  </div>

                  <div className="pt-2 sm:pt-4">
                    <button
                      type="submit"
                      className="contact-submit-btn w-full bg-[#2A2E34] hover:bg-[#0EA5E9] hover:scale-[1.02] text-white py-3.5 sm:py-4 rounded-[12px] font-['DM_Sans'] font-bold text-[14px] sm:text-[15px] flex items-center justify-center gap-2"
                    >
                      Send Request
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5">
                        <path d="M3 20L21 12L3 4L6 11L14 12L6 13L3 20Z" fill="white" />
                      </svg>
                    </button>
                  </div>
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
