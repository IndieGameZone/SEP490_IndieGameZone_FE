import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "@/styles/loader-transition.scss"; 

const PageTransition: React.FC = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !loaderRef.current) {
      return;
    }

    const tl = gsap.timeline();

    tl.set(loaderRef.current, { opacity: 0, pointerEvents: "auto", zIndex: 9999 })
      .to(loaderRef.current, {
        duration: 0.5,
        opacity: 1,
        ease: "power2.out",
      })
      .to(loaderRef.current, {
        duration: 0.3,
        opacity: 0,
        ease: "power2.out",
        delay: 0.5,
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.pointerEvents = "none";
            loaderRef.current.style.zIndex = "-1";
          }
        },
      });

    return () => {
      tl.kill();
    };
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
