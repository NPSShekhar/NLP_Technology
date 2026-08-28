import React, { useEffect, useState } from "react";
import logo from "../../assets/nlp_logo.jpg";
import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const PLATFORM_ICONS = {
  linkedin: FaLinkedinIn,
  twitter: FaTwitter,
  youtube: FaYoutube,
  facebook: FaFacebookF,
  instagram: FaInstagram,
};

const PLATFORM_LABELS = {
  linkedin: "LinkedIn",
  twitter: "Twitter",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
};

const PLATFORM_CLASSES = {
  linkedin: "text-[#0EA5E9] hover:bg-[#0EA5E9]",
  twitter: " text-[#1DA1F2] hover:bg-[#0EA5E9]",
  youtube: " text-[#FF0000] hover:bg-[#0EA5E9]",
  facebook: " text-[#1877F2] hover:bg-[#0EA5E9]",
  instagram: "text-[#E4405F] hover:bg-[#0EA5E9]",
};

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([]);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchSocialLinks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/social-links`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch social links"
          );
        }

        setSocialLinks(
          Array.isArray(data.social_links) ? data.social_links : []
        );
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          console.error("Footer social links fetch error:", fetchError);
        }
      }
    };

    fetchSocialLinks();

    return () => {
      controller.abort();
    };
  }, []);

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

            <p className="font-['DM_Sans'] text-[#2A2E34] text-[16px] md:text-[18px] lg:text-[20px] leading-7">
              Malaysia-based contract manufacturing partner for the semiconductor, electronics and advanced technology sectors.
            </p>

            {socialLinks.length > 0 && (
              <div className="flex gap-3 sm:gap-4 mt-6">
                {socialLinks.map((link) => {
                  const Icon = PLATFORM_ICONS[link.platform];

                  if (!Icon) {
                    return null;
                  }

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-xl  hover:text-white transition-all duration-300 ${
                        PLATFORM_CLASSES[link.platform] || "border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]"
                      }`}
                      aria-label={
                        PLATFORM_LABELS[link.platform] || link.platform
                      }
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

        <div className="sm:justify-self-start lg:justify-self-center">
  <h3 className="font-['Space_Grotesk'] font-bold text-[18px] md:text-[20px] lg:text-[22px] mb-5 sm:mb-6 text-[#2A2E34]">
    Quick Links
  </h3>

  <ul className="space-y-3 font-['DM_Sans'] text-[#3E4850] text-[16px] md:text-[18px] lg:text-[20px]">
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
        Products & Services
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

            <ul className="space-y-3 font-['DM_Sans'] text-[#3E4850] text-[16px] md:text-[18px] lg:text-[20px]">
              <li className="hover:text-[#0EA5E9] transition-colors cursor-default">Contract Manufacturing & ECM</li>
              <li className="hover:text-[#0EA5E9] transition-colors cursor-default">After Sales & Service Support</li>
              <li className="hover:text-[#0EA5E9] transition-colors cursor-default">Spare Parts Support</li>
              
            </ul>
          </div>

        </div>

      {/* Bottom Bar */}
<div className="border-t border-[#D9D9D9] mt-8 pt-6 lg:pt-4 flex flex-col lg:flex-row justify-between items-center gap-8">

  <p className="font-['DM_Sans'] text-[#3E4850] text-[15px] md:text-[17px] lg:text-[18px] text-center lg:text-left leading-6">
    © {new Date().getFullYear()} NLP Technology. All rights reserved.{" "}
    <br className="sm:hidden" />
    Powered by{" "}
    <a
      href="https://netopsys.net"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#FF5A4E] hover:underline font-medium"
    >
      Netopsys Pte. Ltd, Singapore.
    </a>
    
  </p>

<p className="w-full lg:w-auto flex items-center justify-center lg:justify-end lg:ml-auto gap-3 font-['DM_Sans'] text-[#3E4850] text-[16px] md:text-[17px] lg:text-[18px] leading-8">
  <Link to="/privacy-policy" className="hover:text-[#0EA5E9] hover:underline transition-colors">Privacy Policy</Link>
  <span>|</span>
  <Link to="/terms-and-conditions" className="hover:text-[#0EA5E9] hover:underline transition-colors">Terms &amp; Conditions</Link>
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
