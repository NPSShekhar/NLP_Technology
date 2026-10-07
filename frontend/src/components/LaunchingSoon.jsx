import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./LaunchingSoon.css";

export default function LaunchingSoon() {
  const container = useRef(null);
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;
    const update = () => {
      clearInterval(timer);
      if (!preference.matches) timer = setInterval(() => setActive(index => 1 - index), 1500);
    };
    update();
    preference.addEventListener("change", update);
    return () => { clearInterval(timer); preference.removeEventListener("change", update); };
  }, []);

  useLayoutEffect(() => {
    const element = container.current;
    const measure = () => {
      const word = element.querySelectorAll(".launch-focus-word")[active];
      setFrame({ left: word.offsetLeft - 9, top: word.offsetTop - 9, width: word.offsetWidth + 18, height: word.offsetHeight + 18 });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active]);

  return <p role="status" className="mt-[34px] md:mt-[100px] text-[36px] font-semibold text-[#080808] md:text-5xl lg:text-[60px]">
    <span className="sr-only">Launching soon</span>
    <span ref={container} aria-hidden="true" className="launch-focus">
      {["Launching", "soon"].map((word, index) => <span key={word} className={`launch-focus-word ${active === index ? "is-focused" : ""}`}>{word}</span>)}
      {frame && <span className="launch-focus-frame" style={frame}><i /><i /><i /><i /></span>}
    </span>
  </p>;
}
