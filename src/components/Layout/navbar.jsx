import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/nlp_logo.jpg";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products & services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = () => {
    setIsOpen(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  };

  return (
    <>
      <header
        style={{ overflow: "visible" }}
        className="fixed top-0 left-0 z-50 isolate w-full h-[60px] sm:h-[68px] lg:h-[73px] bg-[#FFFFFF] border-b border-transparent transition-all duration-300"
      >
        <div className="responsive-container relative z-10 h-full flex items-center justify-between">
          <Link
            to="/"
            onClick={handleMenuClick}
            className="flex items-center flex-shrink-0"
          >
            <img
              src={logo}
              alt="NLP Logo"
              className="w-[120px] sm:w-[150px] md:w-[170px] h-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.02] mix-blend-multiply"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-['DM_Sans'] text-[16px] font-normal leading-[24px]">
            {menuItems.map((item) => {
              const isCurrent = hoveredItem
                ? hoveredItem === item.name
                : location.pathname === item.href;

              const textColor =
                hoveredItem === item.name
                  ? "text-[#006591]"
                  : location.pathname === item.href &&
                      (!hoveredItem || hoveredItem === item.name)
                    ? "text-[#006591]"
                    : "text-[#3E4850]";

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleMenuClick}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`relative pb-1 transition-colors duration-300 font-['DM_Sans'] text-[16px] font-normal leading-[24px] ${textColor}`}
                >
                  {item.name}

                  <span
                    className={`absolute left-0 bottom-[-4px] h-[2px] transition-all duration-300 bg-[#006591] ${
                      isCurrent ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Get Started Button */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <button
              onClick={() => {
                navigate("/contact", {
                  state: { scrollTo: "contact-form-section" },
                });
              }}
              className="inline-flex items-center justify-center px-6 h-[44px] rounded-[15px] bg-[#00B2F9] text-[#FFFFFF] font-['DM_Sans'] text-[16px] md:text-[17px] lg:text-[18px] font-medium leading-[24px] hover:bg-[#0EA5E9] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((previous) => !previous)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full focus:outline-none hover:bg-gray-100 transition-colors"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <div className="relative w-5 h-[14px] flex flex-col justify-between">
              <span
                className={`w-full h-[2px] bg-gray-800 rounded transition-transform duration-300 origin-[0%_0%] ${
                  isOpen
                    ? "rotate-45 translate-x-[2px] translate-y-[-1px]"
                    : ""
                }`}
              ></span>

              <span
                className={`w-full h-[2px] bg-gray-800 rounded transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>

              <span
                className={`w-full h-[2px] bg-gray-800 rounded transition-transform duration-300 origin-[0%_100%] ${
                  isOpen
                    ? "-rotate-45 translate-x-[2px] translate-y-[1px]"
                    : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`lg:hidden fixed top-[60px] sm:top-[68px] left-0 z-50 w-full bg-[#FFFFFF] border-b border-[#E5E7EB] shadow-xl transition-all duration-300 ease-in-out origin-top ${
            isOpen
              ? "opacity-100 scale-y-100 visible"
              : "opacity-0 scale-y-0 invisible pointer-events-none"
          }`}
        >
          <nav className="flex flex-col px-6 py-6 gap-4 font-['DM_Sans']">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleMenuClick}
                  className={`py-2 border-b border-gray-50 last:border-b-0 transition-colors duration-200 ${
                    isActive
                      ? "text-[#006591] font-semibold border-[#006591]"
                      : "text-[#3E4850] hover:text-[#0EA5E9]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);

                navigate("/contact", {
                  state: { scrollTo: "contact-form-section" },
                });
              }}
              className="mt-4 flex items-center justify-center text-[16px] md:text-[17px] lg:text-[18px] w-full h-[44px] rounded-[15px] bg-[#00B2F9] text-[#FFFFFF] font-medium hover:bg-[#0EA5E9] transition-all active:scale-95"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}