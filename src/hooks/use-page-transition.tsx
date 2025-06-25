import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

export const usePageTransition = () => {
  const navigate = useNavigate();

  return (path: string) => {
    const tl = gsap.timeline();
    tl.to(
      CSSRulePlugin.getRule("body:before"),
      { duration: 0.2, cssRule: { top: "50%" }, ease: "power2.out" },
      "close"
    )
      .to(
        CSSRulePlugin.getRule("body:after"),
        { duration: 0.2, cssRule: { bottom: "50%" }, ease: "power2.out" },
        "close"
      )
      .call(() => {
        navigate(path); 
      })
      .to(".loader", { duration: 0.5, opacity: 1 })
      .to(
        CSSRulePlugin.getRule("body:before"),
        { duration: 0.2, cssRule: { top: "0%" }, ease: "power2.out" },
        "open"
      )
      .to(
        CSSRulePlugin.getRule("body:after"),
        { duration: 0.2, cssRule: { bottom: "0%" }, ease: "power2.out" },
        "open"
      )
      .to(".loader", { duration: 0.2, opacity: 0 }, "-=0.2");
  };
};
