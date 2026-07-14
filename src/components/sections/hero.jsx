import React from "react";
import { Link } from "react-router-dom";
import heroVideo from "../../assets/hero_video.mp4";
import { useNavigate } from "react-router-dom";


export default function Hero() {
  const navigate = useNavigate();

  // NEW: controls the page-load entrance animation
  const [mounted, setMounted] = React.useState(false);

  // NEW: trigger entrance animation right after the component mounts (page opens)
  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-[100vh] lg:min-h-[700px] flex flex-col justify-center text-[#FFFFFF] overflow-visible perspective-[1000px] pt-[60px]"
    >
      {/* Background Video with Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(26, 32, 41, 0.95) 0%, rgba(26, 32, 41, 0.8) 50%, rgba(26, 32, 41, 0.4) 100%)",
          }}
        ></div>
      </div>

      {/* Hero Content Container */}
      <div className="responsive-container relative z-10 h-full flex flex-col justify-center py-10 sm:py-16 lg:py-[120px]">
        {/* Left Column: Heading + Buttons */}
        <div className="w-full lg:w-[65%] xl:w-[60%] flex flex-col text-left justify-end lg:justify-center lg:text-left translate-y-[125px] sm:translate-y-[185px]  lg:translate-y-0">
          {/* NEW: keyframes for the automatic word-by-word heading animation */}
          <style>{`
            @keyframes heroWordIn {
              0% {
                opacity: 0;
                transform: translateY(30px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .hero-word {
              display: inline-block;
              opacity: 0;
              animation: heroWordIn 0.7s ease-out forwards;
            }
          `}</style>

          <h1
            className={`font-['Space_Grotesk'] font-bold text-[39px] sm:text-[62px] md:text-[65px] lg:text-[76px] leading-[1.2] lg:leading-[1.1] tracking-[-1.44px] pb-[38px] sm:pb-[50px] lg:pb-[60px] select-none text-[#FFFFFF] transition-all ease-out duration-700 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="hero-word" style={{ animationDelay: "0.1s" }}>
              Driving
            </span>{" "}
            <span className="hero-word" style={{ animationDelay: "0.25s" }}>
              Innovation
            </span>
            <br className="hidden sm:block" />{" "}
            <span className="hero-word" style={{ animationDelay: "0.4s" }}>
              Through
            </span>{" "}
            <span
              className="text-[#0EA5E9] hero-word"
              style={{ animationDelay: "0.55s" }}
            >
              Precision
            </span>
            <br className="hidden sm:block" />{" "}
            <span
              className="text-[#0EA5E9] hero-word"
              style={{ animationDelay: "0.7s" }}
            >
              Manufacturing
            </span>
          </h1>

          {/* Action Buttons */}
          <div
            className={`flex flex-row items-start justify-start gap-4 sm:gap-6 pb-[20px] lg:pb-[40px] transition-all ease-out duration-700 delay-200 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                navigate("/contact", {
                  state: { scrollTo: "contact-form-section" },
                });
              }}
              className="flex items-center justify-center px-8 md:px-8 lg:px-[40px] h-[45px] md:h-[50px] lg:h-[53px] rounded-[15px] bg-[#00B2F9] font-['DM_Sans'] text-[16px] md:text-[18px] lg:text-[19px] font-medium text-[#FFFFFF] hover:bg-[#0EA5E9] hover:scale-[1.04] transition-all duration-300 ease-out active:scale-95 shadow-md w-auto"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}