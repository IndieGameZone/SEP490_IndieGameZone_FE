import NavLinks from "@/components/nav-links";
import ComputerButton from "./computer-button";
import computer from "@/assets/indiecomputer/computer.svg";
import rocket from "@/assets/indiecomputer/rocket.svg";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
const AboutUsPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlaying = () => {
    setIsPlaying((prev) => !prev);
  };
  return (
    <div>
      <NavLinks />
      <div className="grid grid-cols-2 max-w-screen overflow-hidden bg-zinc-900">
        <div></div>
        <div className="relative h-[500px] rounded">
          <img
            src={computer}
            alt=""
            className="left-30 top-20 absolute select-none pointer-events-none"
          />
          <ComputerButton
            className="absolute top-[88px] left-[136px]"
            onClick={togglePlaying}
          />
          <div className="w-[320px] h-[180px] flex justify-center items-center absolute left-[189px] top-[99px]">
            <FaPlay className="size-10 text-orange-100 animate-pulse"/>
          </div>
          {isPlaying && (
            <iframe
              src="/cl2doom.html"
              width="320px"
              height="180px"
              title="My HTML"
              loading="lazy"
              style={{ border: "none" }}
              className="absolute left-[189px] top-[99px]"
            />
          )}
          <img
            src={rocket}
            alt=""
            className="left-40 top-[234px] absolute select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
