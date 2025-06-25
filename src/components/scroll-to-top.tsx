import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ smooth = false }: { smooth?: boolean }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "instant",
    });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
