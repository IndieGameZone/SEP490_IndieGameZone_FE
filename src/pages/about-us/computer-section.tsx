import ComputerButton from "./computer-button";
import computer from "@/assets/indiecomputer/computer.svg";
import rocket from "@/assets/indiecomputer/rocket.svg";
import { useState } from "react";
import computerScreen from "@/assets/indiecomputer/computer-screen.gif";
const ComputerSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const togglePlaying = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="relative h-[420px]">
      <img
        src={computer}
        alt=""
        className="left-30 top-[94px] absolute select-none pointer-events-none scale-150"
      />
      <ComputerButton
        className="absolute top-[50px] left-[45px] scale-150"
        onClick={togglePlaying}
      />

      {isPlaying ? (
        <iframe
          src="/cl2doom.html"
          width="484px"
          height="270px"
          title="My HTML"
          loading="lazy"
          style={{ border: "none" }}
          className="absolute border-zinc-400 left-[123.5px] top-[64px]"
        />
      ) : (
        <div className="w-[484px] border-4 border-zinc-400 h-[270px] justify-center items-center flex absolute left-[123.5px] top-[64px]">
          <img src={computerScreen} alt="" />
        </div>
      )}
      <img
        src={rocket}
        alt=""
        className="left-24 top-[295px] scale-125 absolute select-none pointer-events-none"
      />
  
    </div>
  );
};

export default ComputerSection;
