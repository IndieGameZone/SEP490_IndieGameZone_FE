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
const AboutUsPage = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOnline, setTotalOnline] = useState(0);
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
        <MaxWidthWrapper className="grid grid-cols-1 md:grid-cols-2">
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
