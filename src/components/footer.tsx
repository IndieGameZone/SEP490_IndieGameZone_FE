import { FaFacebookSquare, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import MaxWidthWrapper from "./wrappers/max-width-wrapper";

const Footer = () => {
  return (
    <div className="bg-zinc-950 drop-shadow">
      <MaxWidthWrapper className="p-5 flex flex-col items-center gap-2">
        <div className="flex gap-3">
          <Link to={"/"}>
            <FaFacebookSquare className="text-lg" />
          </Link>
          <Link to={"/"}>
            <FaTwitter className="text-lg" />
          </Link>
        </div>
        <div className="flex gap-1 text-xs">
          <Link to={"/"}>Support</Link>•<Link to={"/"}>Terms of use</Link>•
          <Link to={"/"}>Privacy policy </Link>•
          <Link to={"/"}>Cookie Policy</Link>
        </div>
        <div className="text-xs text-gray-400">Copyright © 2025 GSU25SE12 Team</div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Footer;
