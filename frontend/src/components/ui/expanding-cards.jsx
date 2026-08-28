import * as React from "react";
import { cn } from "@/lib/utils";

export const ExpandingCards = React.forwardRef(
  ({ className, items, defaultActiveIndex = null, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(defaultActiveIndex);
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const gridStyle = React.useMemo(() => {
      if (isDesktop) {
        if (activeIndex === null) {
          return { gridTemplateColumns: items.map(() => "1fr").join(" ") };
        }
        const columns = items
          .map((_, index) => (index === activeIndex ? "3.5fr" : "1fr"))
          .join(" ");
        return { gridTemplateColumns: columns };
      } else {
        if (activeIndex === null) {
          return { gridTemplateRows: items.map(() => "1fr").join(" ") };
        }
        const rows = items
          .map((_, index) => (index === activeIndex ? "4fr" : "1fr"))
          .join(" ");
        return { gridTemplateRows: rows };
      }
    }, [activeIndex, items.length, isDesktop]);

    const handleInteraction = (index) => {
      setActiveIndex(index);
    };

    const handleLeave = () => {
      setActiveIndex(null);
    };

    return (
      <ul
        className={cn(
          "w-full gap-3 sm:gap-4 lg:gap-6",
          "grid",
          "h-[450px] sm:h-[550px] md:h-[clamp(400px,38vw,550px)]",
          "transition-[grid-template-columns,grid-template-rows] duration-500 ease-out",
          className
        )}
        style={{
          ...gridStyle,
          ...(isDesktop
            ? { gridTemplateRows: "1fr" }
            : { gridTemplateColumns: "1fr" }
          )
        }}
        ref={ref}
        {...props}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            className={cn(
              "group relative cursor-pointer overflow-hidden rounded-[16px] lg:rounded-[20px] border border-[#DFE5EB]/30 bg-card text-card-foreground shadow-lg transition-all duration-300",
              "md:min-w-[60px] lg:min-w-[80px]",
              "min-h-[60px] sm:min-h-0 min-w-0"
            )}
            onMouseEnter={() => handleInteraction(index)}
            onMouseLeave={handleLeave}
            onFocus={() => handleInteraction(index)}
            onBlur={handleLeave}
            onClick={() => handleInteraction(index)}
            tabIndex={0}
            data-active={activeIndex === index}
          >
            <img
              src={item.imgSrc}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-data-[active=true]:scale-105 scale-110"
            />

            <article className="absolute inset-0 flex flex-col justify-end gap-2 p-4 sm:p-6 lg:p-8 z-20 text-white">

              {/* Inactive title — bottom-left, horizontal, always visible when not active */}
              <h3 className="font-['Space_Grotesk'] text-[13px] sm:text-[14px] lg:text-[17px] font-bold tracking-[1px] lg:tracking-[1.5px] text-white transition-all duration-500 ease-out group-data-[active=true]:opacity-0 group-data-[active=true]:pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {item.title}
              </h3>

              {/* Active state content — fades in on hover */}
              <div className="absolute inset-0 flex flex-col justify-end gap-1.5 sm:gap-2 p-4 sm:p-6 lg:p-8 opacity-0 transition-all duration-500 ease-out group-data-[active=true]:opacity-100 bg-gradient-to-t from-black/80 via-black/30 to-transparent">

                {/* Title */}
                <h3 className="font-['Space_Grotesk'] text-[17px] sm:text-xl lg:text-2xl font-bold text-white transform translate-y-4 transition-transform duration-500 ease-out group-data-[active=true]:translate-y-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="w-full max-w-sm font-['DM_Sans'] text-[12px] sm:text-sm text-white/90 tracking-wide font-light transform translate-y-4 transition-transform duration-500 ease-out group-data-[active=true]:translate-y-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] line-clamp-2 sm:line-clamp-none">
                  {item.description}
                </p>

                {/* Explore More */}
                <div className="mt-2 sm:mt-4 flex items-center gap-2 text-white font-['DM_Sans'] text-[13px] sm:text-[15px] font-normal transform translate-y-4 transition-all duration-500 ease-out group-data-[active=true]:translate-y-0 hover:translate-x-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  <span>Explore More</span>
                  <span className="text-[10px] sm:text-[12px]">▷</span>
                </div>
              </div>

            </article>
          </li>
        ))}
      </ul>
    );
  }
);
ExpandingCards.displayName = "ExpandingCards";
