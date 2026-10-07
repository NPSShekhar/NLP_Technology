import LaunchingSoon from "../components/LaunchingSoon";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket } from "lucide-react";
import logo from "../assets/nlp_logo.jpg";
import background from "../assets/launch-countdown-background.png";
import {
  HOME_ROUTE,
  currentLaunchState,
  prepareLaunchCelebration,
} from "../lib/launch";

export default function LaunchingPage() {
  const navigate = useNavigate();
  const [{ phase, seconds }, setSchedule] = useState(currentLaunchState);
  const navigating = useRef(false);
  const canLaunch = phase === "ready";
  const units = [
    ...(seconds >= 60 ? [{ label: "Mins", value: Math.floor(seconds / 60) }] : []),
    { label: "Secs", value: seconds % 60 },
  ];

  useEffect(() => {
    const update = () => setSchedule(currentLaunchState());
    const interval = setInterval(update, 250);
    document.addEventListener("visibilitychange", update);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const launch = () => {
    if (!canLaunch || navigating.current) return;
    navigating.current = true;

    navigate(HOME_ROUTE, {
      replace: true,
      state: { launchCelebration: prepareLaunchCelebration() },
    });
  };

  return (
    <main data-testid="launch-page" className="relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-[#eff8ff] px-5 pb-8 pt-[clamp(48px,14.8vh,140px)] text-center font-['DM_Sans',sans-serif] text-[#020719] sm:px-8">
      <img src={background} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center" />
      <header className="mb-[40px] md:mb-[50px]  flex justify-center">
        <img src={logo} alt="NLP Technology" className="w-[clamp(190px,17vw,250px)] mix-blend-multiply" />
      </header>
      <section aria-labelledby="launch-heading" className="flex w-full max-w-[1100px] flex-col items-center">
       
        <h1
  id="launch-heading"
  className="m-0 font-['DM_Sans',sans-serif] text-[clamp(45px,7vw,100px)] font-bold leading-[1.1] tracking-[-.055em]"
>
  We’re Ready to { " "}
  

   <span className="text-[#00B2F9]">Launch</span>
  
</h1>
        <p className="mb-1 mt-3 md:mb-[17px] md:mt-7 max-w-[820px] text-[clamp(21px,2vw,30px)] leading-[1.22] tracking-[-.025em] text-[#384e83]">
          Engineered for next-generation semiconductor and<br className="hidden sm:block" />  electronics manufacturing.
        </p>
        {phase === "soon" ? <LaunchingSoon /> : <div role="timer" aria-label={units.map(({ label, value }) => `${value} ${label}`).join(', ')} className="mt-[clamp(24px,3.3vh,34px)] flex justify-center gap-2.5 sm:gap-4">
          {units.map(({ label, value }) => (
            <div key={label} className="flex h-[88px] w-[75px] flex-col items-center justify-center rounded-[16px] border border-[#b6e0ff] bg-white/40 sm:h-[clamp(108px,8vw,134px)] sm:w-[clamp(100px,8.5vw,143px)] sm:rounded-[21px]">
              <span data-testid="launch-clock-card" className="text-[34px] font-bold leading-none tabular-nums tracking-[-.045em] text-[#00B2F9] sm:text-[clamp(42px,3.5vw,59px)]">{String(value).padStart(2, "0")}</span>
              <span className="mt-1.5 text-[13px] tracking-[.055em] text-[#384e83] sm:text-[21px]">{label}</span>
            </div>
          ))}
        </div>}
        <div className="mt-7 md:mt-10 flex min-h-[48px] justify-center">
          {phase !== "soon" && seconds <= 59 && (
            <button onClick={launch} disabled={!canLaunch} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#00B2F9] px-12 py-5 text-[25px] font-bold text-white shadow-[0_8px_24px_#0062ff33] transition disabled:cursor-not-allowed disabled:opacity-60 enabled:hover:bg-[#099cd6] enabled:active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0062ff] motion-reduce:transition-none">
              Launch Website <Rocket size={24} aria-hidden="true" />
            </button>
          )}
        </div>
        <span className="sr-only" role="status">{canLaunch ? "Launch Website is now available." : phase === "soon" ? "" : "Countdown running. Launch Website will be available at the scheduled launch time."}</span>
      </section>
    </main>
  );
}
