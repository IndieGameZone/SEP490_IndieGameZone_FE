import { useEffect, useRef, useState } from "react";
import CatBackRightLeg from "@/assets/indiecat/cat_back_right_leg.svg";
import CatBody from "@/assets/indiecat/cat_body.svg";
import CatEyesNormal from "@/assets/indiecat/cat_eyes_normal.svg";
import CatEyesPanic from "@/assets/indiecat/cat_eyes_panic.svg";
import CatEyesWink from "@/assets/indiecat/cat_eyes_wink.svg";
import CatFrontLeftLeg from "@/assets/indiecat/cat_front_left_leg.svg";
import CatFrontRightLeg from "@/assets/indiecat/cat_front_right_leg.svg";
import CatLeftEar from "@/assets/indiecat/cat_left_ear.svg";
import CatMouthNormal from "@/assets/indiecat/cat_mouth_normal.svg";
import CatMouthWide from "@/assets/indiecat/cat_mouth_wide.svg";
import CatRightEar from "@/assets/indiecat/cat_right_ear.svg";
import CatTailDown from "@/assets/indiecat/cat_tail_down.svg";
import CatTailUp from "@/assets/indiecat/cat_tail_up.svg";

type Emotion = "normal" | "winking" | "panic";

const IndieCat = ({ size = 50 }: { size?: number }) => {
  const [emo, setEmo] = useState<Emotion>("normal");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInteracting = useRef(false);

  // Configuration for different emotions
  const emotionConfig = {
    normal: {
      eyes: { src: CatEyesNormal, top: "40%", left: "58%" },
      mouth: { src: CatMouthNormal, top: "59%", left: "81%" },
      tail: {
        src: CatTailUp,
        top: "48%",
        left: "-25%",
        transformOrigin: "93.5% 92.4%",
      },
    },
    winking: {
      eyes: { src: CatEyesWink, top: "41%", left: "58%" },
      mouth: { src: CatMouthNormal, top: "59%", left: "81%" },
      tail: {
        src: CatTailUp,
        top: "48%",
        left: "-25%",
        transformOrigin: "93.5% 92.4%",
      },
    },
    panic: {
      eyes: { src: CatEyesPanic, top: "41%", left: "58%" },
      mouth: { src: CatMouthWide, top: "59%", left: "81%" },
      tail: {
        src: CatTailDown,
        top: "76%",
        left: "-25%",
        transformOrigin: "93.5% 6.5%",
      },
    },
  };

  // Fixed body parts configuration
  const bodyParts: any = [
    {
      src: CatRightEar,
      animation: {
        normal: "earFloatNormal",
        winking: "earFloatNormal",
        panic: "earFloatPanic",
      },
      style: {
        transformOrigin: "72.3% 49.7%",
        position: "absolute",
        top: "15%",
        left: "30%",
        zIndex: 3,
      },
    },
    {
      src: CatLeftEar,
      animation: {
        normal: "earFloatNormal",
        winking: "earFloatNormal",
        panic: "earFloatPanic",
      },
      style: {
        transformOrigin: "50.5% 63.9%",
        position: "absolute",
        top: "-7%",
        left: "70%",
      },
    },
    {
      src: CatFrontRightLeg,
      animation: {
        normal: "legFloatNormal",
        winking: "legFloatNormal",
        panic: "frontRightLegFloatPanic",
      },
      style: {
        transformOrigin: "35.6% 26.6%",
        position: "absolute",
        top: "91%",
        left: "55%",
        zIndex: 3,
      },
    },
    {
      src: CatFrontLeftLeg,
      animation: {
        normal: "legFloatNormal",
        winking: "legFloatNormal",
        panic: "frontLeftLegFloatPanic",
      },
      style: {
        transformOrigin: "19.2% 50%",
        position: "absolute",
        top: "71%",
        left: "91%",
        zIndex: 1,
      },
    },
    {
      src: CatBackRightLeg,
      animation: {
        normal: "legFloatNormal",
        winking: "legFloatNormal",
        panic: "backRightLegFloatPanic",
      },
      style: {
        transformOrigin: "60.4% 35.4%",
        position: "absolute",
        top: "89%",
        left: "9%",
        zIndex: 3,
      },
    },
  ];

  const currentEmotion = emotionConfig[emo];
  const baseImageClass = "pointer-events-none select-none";

  const handleMouseEnter = () => {
    isInteracting.current = true;
    if (emo !== "panic") setEmo("winking");
  };

  const handleMouseLeave = () => {
    isInteracting.current = false;
    setEmo("normal");
  };

  const handleMouseDown = () => {
    isInteracting.current = true;
    setEmo("panic");
  };

  const handleMouseUp = () => {
    setEmo("winking");
  };

  // Get animation class for tail based on emotion
  const getTailAnimation = () => {
    switch (emo) {
      case "normal":
        return "tailFloatNormal";
      case "winking":
        return "tailFloatNormal";
      case "panic":
        return "tailFloatPanic";
      default:
        return "tailFloatNormal";
    }
  };

  useEffect(() => {
    // Random wink every 5-10 seconds
    const randomWink = () => {
      if (!isInteracting.current) {
        setEmo("winking");
        setTimeout(() => {
          setEmo("normal");
        }, 300);
      }
    };

    intervalRef.current = setInterval(() => {
      randomWink();
    }, Math.random() * 5000 + 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div >
      <style>
        {`
        @keyframes earFloatNormal {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        
        @keyframes earFloatWinking {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes earFloatPanic {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes legFloatNormal {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes legFloatWinking {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes frontRightLegFloatPanic {
          0%, 100% { transform: rotate(6deg); }
          25% { transform: rotate(16deg); }
          50% { transform: rotate(4deg); }
          75% { transform: rotate(14deg); }
        }

        @keyframes frontLeftLegFloatPanic {
          0%, 100% { transform: rotate(22deg); }
          25% { transform: rotate(10deg); }
          50% { transform: rotate(22deg); }
          75% { transform: rotate(10deg); }
        }

        @keyframes backRightLegFloatPanic {
          0%, 100% { transform: rotate(-10deg); }
          25% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
          75% { transform: rotate(0deg); }
        }
        
        @keyframes tailFloatNormal {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes tailFloatWinking {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(4deg); }
        }
        
        @keyframes tailFloatPanic {
          0%, 100% { transform: rotate(-8deg); }
          25% { transform: rotate(8deg); }
          50% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
      `}
      </style>

      {/* Cat container with scaling */}
      <div
        className="relative inline-block cursor-grab active:cursor-grabbing rounded-[50%]"
        style={{
          transform: `scale(${size / 100})`,
          transformOrigin: "center center",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Invisible spacer for layout */}
        <img
          src={CatBody}
          alt=""
          className="opacity-0 pointer-events-none select-none"
        />

        {/* Main body */}
        <img
          src={CatBody}
          alt=""
          className={baseImageClass}
          style={{
            position: "absolute",
            zIndex: 2,
            top: 0,
          }}
        />

        {/* Eyes */}
        <img
          src={currentEmotion.eyes.src}
          alt=""
          className={baseImageClass}
          style={{
            position: "absolute",
            top: currentEmotion.eyes.top,
            left: currentEmotion.eyes.left,
            zIndex: 3,
          }}
        />

        {/* Mouth */}
        <img
          src={currentEmotion.mouth.src}
          alt=""
          className={baseImageClass}
          style={{
            position: "absolute",
            top: currentEmotion.mouth.top,
            left: currentEmotion.mouth.left,
            zIndex: 3,
          }}
        />

        {/* Body parts with animations */}
        {bodyParts.map((part: any, index: number) => (
          <img
            key={index}
            src={part.src}
            alt=""
            className={baseImageClass}
            style={{
              ...part.style,
              animation: `${part.animation[emo]} ${
                emo === "panic" ? "1s" : "3s"
              } ease-in-out infinite`,
            }}
          />
        ))}

        {/* Tail with animation */}
        <img
          src={currentEmotion.tail.src}
          alt=""
          className={baseImageClass}
          style={{
            transformOrigin: currentEmotion.tail.transformOrigin,
            position: "absolute",
            top: currentEmotion.tail.top,
            left: currentEmotion.tail.left,
            zIndex: 1,
            animation: `${getTailAnimation()} ${
              emo === "panic" ? "3s" : "4s"
            } ease-in-out infinite`,
          }}
        />
      </div>
    </div>
  );
};

export default IndieCat;
