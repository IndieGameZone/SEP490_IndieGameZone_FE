import NavLinks from "@/components/nav-links";
import ComputerSection from "./computer-section";
import logo from "@/assets/indiegamezone-logo.svg";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Badge, Button } from "antd";
import { useEffect, useState } from "react";
import { getAboutUsStats } from "@/lib/api/user-api";
import { FaArrowRight } from "react-icons/fa";
import computerBackground from "@/assets/indiecomputer/computer-background.svg";
import { useNavigate } from "react-router-dom";
import { useKonamiCode } from "@/hooks/use-konami-code";
const AboutUsPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);
  
  useKonamiCode(() => {
    if (!document.querySelector('[data-chaos-style]')) {
      injectChaosStyles();
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  const fetchTotalUsers = async () => {
    const result = await getAboutUsStats();
    if (!result.error) {
      setTotalUsers(result.data.totalUsers);
      setTotalOnline(result.data.totalOnline);
    }
  };
  return (
    <div>
      <NavLinks />
      <div
        className="overflow-hidden bg-zinc-900 rounded relative"
        style={{
          background: `url(${computerBackground})`,
          backgroundSize: "cover",
        }}
      >
        <MaxWidthWrapper className="grid grid-cols-1 lg:grid-cols-2">
          <div className="pt-16 p-3">
            <img src={logo} alt="" />
            <p className="text-lg mt-2">
              Discover the Games You've Never Heard Of—But Should.
            </p>
            <div className="mt-3 flex gap-12">
              <div>
                <Badge
                  text={
                    <span className="uppercase text-xs text-zinc-400">
                      Total users
                    </span>
                  }
                  status="processing"
                />
                <p className="text-3xl">{totalUsers.toLocaleString()}</p>
              </div>
              <div>
                <Badge
                  text={
                    <span className="uppercase text-xs text-zinc-400">
                      Online
                    </span>
                  }
                  status="success"
                />
                <p className="text-3xl">{totalOnline.toLocaleString()}</p>
              </div>
            </div>
            <Button
              size="large"
              type="primary"
              className="mt-5"
              style={{ paddingInline: 30 }}
              icon={<FaArrowRight />}
              iconPosition="end"
              onClick={() => {navigate("/search")}}
            >
              Explore Now
            </Button>
          </div>
          <div className="hidden md:block">
            <ComputerSection />
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

export default AboutUsPage;

function injectChaosStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      transition: all 0.5s ease !important;
    }

    body {
      transform: rotate(3deg) scale(1.05);
      background: repeating-linear-gradient(
        45deg,
        #ff9ce3,
        #ff9ce3 10px,
        #ffe66d 10px,
        #ffe66d 20px
      ) !important;
    }

    h1, h2, h3, h4, p, span, div {
      transform: rotate(-5deg) skew(3deg, 2deg);
      color: #ff00cc !important;
      font-family: 'Comic Sans MS', cursive, sans-serif !important;
    }

    button, a {
      animation: floatyButton 2s infinite ease-in-out;
      background-color: #ff4081 !important;
      border-radius: one-hundred percent !important;
      transform: rotate(12deg) scale(1.2);
    }

    img {
      filter: hue-rotate(180deg) invert(1);
      transform: rotate(180deg) scaleX(-1);
    }

    @keyframes floatyButton {
      zero% { transform: translateY(zero) rotate(12deg); }
      fifty% { transform: translateY(-one point five rem) rotate(-12deg); }
      one-hundred% { transform: translateY(zero) rotate(12deg); }
    }
  `;
  style.setAttribute('data-chaos-style', 'true');
  document.head.appendChild(style);
}
