import React, { useState } from "react";
import logo from "../../assets/nlp_logo.jpg";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

const menuItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Capabilities", href: "#capabilities" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [hoveredItem, setHoveredItem] = useState(null);

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

  const handleNavClick = (e, item) => {
    setActiveItem(item.name);
    if (item.name === "Home") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header 
        onMouseMove={handleMouseMove}
        className="fixed top-0 left-0 z-50 w-full h-[60px] sm:h-[68px] lg:h-[75px] bg-[#FFFFFF] backdrop-blur-md border-b border-transparent transition-all duration-300"
      >
        {/* Grid Background Overlay Container */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Base Grid Background */}
          <div className="absolute inset-0 opacity-100">
            <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} active={false} />
          </div>

          {/* Hover Active Grid Layer */}
          <motion.div 
            className="absolute inset-0 opacity-100"
            style={{ maskImage, WebkitMaskImage: maskImage }}
          >
            <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} active={true} />
          </motion.div>
        </div>

        <div className="responsive-container relative z-10 h-full flex items-center justify-between">
          <a href="#home" className="flex items-center flex-shrink-0" onClick={(e) => handleNavClick(e, { name: "Home" })}>
            <img
              src={logo}
              alt="NLP Logo"
              className="w-[150px] h-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-[1.02] mix-blend-multiply"
            />
          </a>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-['DM_Sans'] text-[16px] font-normal leading-[24px]">
            {menuItems.map((item) => {
              const isCurrent = hoveredItem ? hoveredItem === item.name : activeItem === item.name;
              const textColor = hoveredItem === item.name
                ? "text-[#0EA5E9]"
                : activeItem === item.name && (!hoveredItem || hoveredItem === item.name)
                  ? "text-[#006591]"
                  : "text-[#3E4850]";
              const underlineColor = activeItem === item.name ? "bg-[#006591]" : "bg-[#0EA5E9]";

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`relative pb-1 transition-colors duration-300 font-['DM_Sans'] text-[16px] font-normal leading-[24px] ${textColor}`}
                >
                  {item.name}
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] transition-all duration-300 ${underlineColor} ${
                      isCurrent ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Get Started Button */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <button
              onClick={() => {
                setActiveItem("Contact");
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="inline-flex items-center justify-center px-6 h-[44px] rounded-[15px] bg-[#2A2E34] text-white font-['DM_Sans'] text-[16px] font-normal leading-[24px] hover:bg-[#0EA5E9] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full focus:outline-none hover:bg-gray-100 transition-colors"
            aria-label="Toggle Menu"
          >
            <div className="relative w-5 h-[14px] flex flex-col justify-between">
              <span
                className={`w-full h-[2px] bg-gray-800 rounded transition-transform duration-300 origin-[0%_0%] ${
                  isOpen ? "rotate-45 translate-x-[2px] translate-y-[-1px]" : ""
                }`}
              ></span>
              <span
                className={`w-full h-[2px] bg-gray-800 rounded transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`w-full h-[2px] bg-gray-800 rounded transition-transform duration-300 origin-[0%_100%] ${
                  isOpen ? "-rotate-45 translate-x-[2px] translate-y-[1px]" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-white border-b border-[#E5E7EB] shadow-xl transition-all duration-300 ease-in-out origin-top ${
            isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col px-6 py-6 gap-4 font-['DM_Sans'] text-[16px]">
            {menuItems.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setIsOpen(false);
                    setActiveItem(item.name);
                  }}
                  className={`py-2 border-b border-gray-50 last:border-b-0 transition-colors duration-200 ${
                    isActive
                      ? "text-[#006591] font-semibold border-[#006591]"
                      : "text-[#3E4850] hover:text-[#0EA5E9]"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveItem("Contact");
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="mt-4 flex items-center justify-center w-full h-[44px] rounded-[15px] bg-[#2A2E34] text-white font-medium hover:bg-[#0EA5E9] transition-all active:scale-95"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>
      
    </>
  );
}

const GridPattern = ({ offsetX, offsetY, active }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={active ? "grid-pattern-active-nav" : "grid-pattern-base-nav"}
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
            strokeWidth="1"
            className={active ? "text-[#0EA5E9]/[0.25]" : "text-[#2A2E34]/[0.03]"}
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={active ? "url(#grid-pattern-active-nav)" : "url(#grid-pattern-base-nav)"} />
    </svg>
  );
};
