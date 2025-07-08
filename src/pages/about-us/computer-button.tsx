import React, { ButtonHTMLAttributes, useState } from "react";
import computerButton from "@/assets/indiecomputer/computer-button.svg";
import computerButtonHover from "@/assets/indiecomputer/computer-button-hover.svg";
import computerButtonActive from "@/assets/indiecomputer/computer-button-active.svg";

type ComputerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ComputerButton: React.FC<ComputerButtonProps> = ({
  children,
  ...props
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);

  let backgroundImage = computerButton;
  if (isActive) {
    backgroundImage = computerButtonActive;
  } else if (isHover) {
    backgroundImage = computerButtonHover;
  }

  return (
    <button
      className="cursor-pointer"
      {...props}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        cursor: "pointer",
      }}
    >
      <img src={backgroundImage} alt="" />
    </button>
  );
};

export default ComputerButton;
