import React from "react";
import logo from "../../assets/nlp_logo.jpg";
import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#EEF0F2] text-[#2A2E34] border-t border-[#DFE5EB]">
      <div className="responsive-container py-10 sm:py-12 lg:py-16 pb-6 lg:pb-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* Company */}
          <div className="sm:col-span-2 lg:col-span-1 max-w-sm">
            <img
              src={logo}
              alt="NLP Technology"
              className="h-10 sm:h-12 mb-6 object-contain mix-blend-multiply"
            />

            <p className="font-['DM_Sans'] text-[#626A75] text-[16px] md:text-[18px] lg:text-[20px] leading-7">
              Malaysia-based contract manufacturing partner for the semiconductor, electronics and advanced technology sectors.
            </p>

            <div className="flex gap-3 sm:gap-4 mt-6">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#0EA5E9] flex items-center justify-center text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={16} />
              </a>

              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#0EA5E9] flex items-center justify-center text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={16} />
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#0EA5E9] flex items-center justify-center text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white transition-all duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={16} />
              </a>
            </div>
          </div>

        <div className="sm:justify-self-start lg:justify-self-center">
  <h3 className="font-['Space_Grotesk'] font-bold text-[18px] md:text-[20px] lg:text-[22px] mb-5 sm:mb-6 text-[#2A2E34]">
    Quick Links
  </h3>

  <ul className="space-y-3 font-['DM_Sans'] text-[#626A75] text-[16px] md:text-[18px] lg:text-[20px]">
    <li>
      <Link
        to="/about"
        className="hover:text-[#0EA5E9] hover:underline transition-colors duration-300"
      >
        About us
      </Link>
    </li>

    <li>
      <Link
        to="/services"
        className="hover:text-[#0EA5E9] hover:underline transition-colors duration-300"
      >
        Products & services
      </Link>
    </li>

    <li>
      <Link
        to="/contact"
        className="hover:text-[#0EA5E9] hover:underline transition-colors duration-300"
      >
        Contact us
      </Link>
    </li>
  </ul>
</div>

          {/* Services */}
          <div className="sm:justify-self-start lg:justify-self-center">
            <h3 className="font-['Space_Grotesk'] font-bold text-[18px] md:text-[20px] lg:text-[22px] mb-5 sm:mb-6 text-[#2A2E34]">
              Solutions
            </h3>

            <ul className="space-y-3 font-['DM_Sans'] text-[#626A75] text-[16px] md:text-[18px] lg:text-[20px]">
              <li className="hover:text-[#0EA5E9] transition-colors cursor-default">Contract Manufacturing & ECM</li>
              <li className="hover:text-[#0EA5E9] transition-colors cursor-default">After Sales & Service Support</li>
              <li className="hover:text-[#0EA5E9] transition-colors cursor-default">Spare Parts Support</li>
              
            </ul>
          </div>

        </div>

      {/* Bottom Bar */}
<div className="border-t border-[#D9D9D9] mt-8 pt-6 lg:pt-4 flex flex-col lg:flex-row justify-between items-center gap-4">

  <p className="font-['DM_Sans'] text-[#626A75] text-[15px] md:text-[17px] lg:text-[20px] text-center lg:text-left leading-6">
    © {new Date().getFullYear()} NLP Technology. All rights reserved.{" "}
    <br className="sm:hidden" />
    Powered by{" "}
    <a
      href="https://netopsys.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#FF5A4E] hover:underline font-medium"
    >
      Netopsys AI Private Limited
    </a>
    .
  </p>

  <p className="font-['DM_Sans'] text-[#626A75] text-[16px] md:text-[17px] lg:text-[20px] leading-8 text-center lg:text-left">
    Privacy Policy
  </p>

  <button
    onClick={scrollTop}
    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2A2E34] hover:bg-[#0EA5E9] hover:scale-[1.04] flex items-center justify-center text-white active:scale-95 transition-all shadow-lg flex-shrink-0"
    aria-label="Scroll to Top"
  >
    <ArrowUp size={18} />
  </button>

</div>
      </div>
    </footer>
  );
};

export default Footer;
