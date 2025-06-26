import ScrollToTop from "react-scroll-to-top";
import { FaChevronUp } from "react-icons/fa";

export default function ScrollToTopButton() {
  return (
    <ScrollToTop
      smooth
      top={200}
      component={
        <div className="flex items-center justify-center bg-orange-600 w-12 h-12 rounded-full shadow-lg transition duration-300 drop-shadow">
          <FaChevronUp className="text-whites text-xl" />
        </div>
      }
      style={{ background: "none" }}
    />
  );
}
