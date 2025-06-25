import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import CSSRulePlugin from "gsap/CSSRulePlugin";
import "@/styles/loader-transition.scss";

const PageTransition: React.FC = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(CSSRulePlugin);
    const tl = gsap.timeline();

    const beforeRule = CSSRulePlugin.getRule("body:before");
    const afterRule = CSSRulePlugin.getRule("body:after");

    if (beforeRule && afterRule) {
      tl.to(
        beforeRule,
        { duration: 0.2, cssRule: { top: "50%" }, ease: "power2.out" },
        "close"
      )
        .to(
          afterRule,
          { duration: 0.2, cssRule: { bottom: "50%" }, ease: "power2.out" },
          "close"
        )
        .to(loaderRef.current, { duration: 0.5, opacity: 1 })
        .to(
          beforeRule,
          { duration: 0.2, cssRule: { top: "0%" }, ease: "power2.out" },
          "open"
        )
        .to(
          afterRule,
          { duration: 0.2, cssRule: { bottom: "0%" }, ease: "power2.out" },
          "open"
        )
        .to(loaderRef.current, { duration: 0.2, opacity: 0 }, "-=0.2");
    }
  }, []);

  return (
    <div className="loader" ref={loaderRef}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`bar${i + 1}`} />
      ))}
    </div>
  );
};

export default PageTransition;
