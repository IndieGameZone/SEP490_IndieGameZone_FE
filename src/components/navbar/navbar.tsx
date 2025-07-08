import { Link, useNavigate } from "react-router-dom";
import MaxWidthWrapper from "../max-width-wrapper";
import logo from "@/assets/igz_ic.svg";
import {
  Button,
  GetProp,
  Input,
  Menu,
  MenuProps,
  Popover,
  Skeleton,
} from "antd";
import { IoIosNotifications, IoMdMore } from "react-icons/io";
import {
  FaBook,
  FaFacebookSquare,
  FaInfoCircle,
  FaQuestionCircle,
  FaTwitter,
} from "react-icons/fa";
import ProfileMenu from "./profile-menu";
import { MdOutlineInsertChart } from "react-icons/md";
import useProfileStore from "@/store/use-auth-store";
import { SearchProps } from "antd/es/input";

type MenuItem = GetProp<MenuProps, "items">[number];

const items: MenuItem[] = [
  {
    key: "1",
    icon: <FaBook />,
    label: "Nguyên tắc cộng đồng",
  },
  {
    key: "2",
    icon: <FaInfoCircle />,
    label: "Về chúng tôi",
  },
  {
    key: "3",
    icon: <FaQuestionCircle />,
    label: "Trợ giúp/Câu hỏi thường gặp",
  },
];

const popOverContent = (
  <div className="flex">
    <Menu style={{ width: 256 }} defaultSelectedKeys={["1"]} items={items} />
    <div className="w-[256px] bg-zinc-900 flex flex-col p-3">
      <div className="flex gap-3 flex-1">
        <Link to={"/"}>
          <FaFacebookSquare className="text-lg" />
        </Link>
        <Link to={"/"}>
          <FaTwitter className="text-lg" />
        </Link>
      </div>
      <div>
        <div className="flex gap-1 text-xs flex-wrap justify-center">
          <Link to={"/"}>Hổ trợ</Link>•<Link to={"/"}>Điều khoản sử dụng</Link>•
          <Link to={"/"}>Chính sách bảo mật </Link>•
          <Link to={"/"}>Chính sách Cookie</Link>
        </div>
        <div className="text-xs text-gray-400 text-center mt-1">
          Copyright © 2025 GSU25SE12 Team
        </div>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { profile, isRefreshingToken, loading } = useProfileStore();

  const handleGoToDashboard = () => {
    if (profile?.role.name == "Developer") {
      navigate("/dev/manage-games");
    } else if (profile?.role.name == "Admin") {
      navigate("/admin");
    } else if (profile?.role.name == "Moderator") {
      navigate("/moderator");
    }
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, _) => {
    if (value) {
      navigate(`/search?q=${value}`);
    }
  };

  const showDashboardButton =
    profile?.role.name == "Developer" ||
    profile?.role.name == "Admin" ||
    profile?.role.name == "Moderator";

  const isLoadingProfile = isRefreshingToken || loading;
  return (
    <div className="bg-zinc-900">
      <MaxWidthWrapper className="flex justify-between  p-5">
        <div className="flex justify-center items-center gap-2">
          <div
            onClick={() => {
              navigate("/");
            }}
            className="flex justify-center items-center gap-2 cursor-pointer"
          >
            <img src={logo} alt="IndeGameZone Logo" className="size-7" />
            <h1 className="font-bold text-xl">IndieGameZone</h1>
          </div>
          <Popover
            content={popOverContent}
            styles={{ body: { padding: 0, border: "1px solid black" } }}
            trigger={"click"}
          >
            <Button
              type="text"
              shape="circle"
              icon={<IoMdMore className="text-xl" />}
            />
          </Popover>
        </div>
        <div className="flex justify-center items-center gap-3">
          <div>
            <Input.Search
              placeholder="Search for game titles,...."
              allowClear
              onSearch={onSearch}
            />
          </div>
          {/* <DownloadProcessesButton /> */}
          {showDashboardButton && (
            <Button
              onClick={handleGoToDashboard}
              icon={<MdOutlineInsertChart />}
            >
              Dashboard
            </Button>
          )}

          {isLoadingProfile && <Skeleton.Avatar active={true} />}

          {!isLoadingProfile && profile && (
            <>
              <Button shape="circle" icon={<IoIosNotifications />}></Button>
              <ProfileMenu />
            </>
          )}

          {!isLoadingProfile && !profile && (
            <>
              <Button type="primary" onClick={() => navigate("/log-in")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/sign-up")}>Sign Up</Button>
            </>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
