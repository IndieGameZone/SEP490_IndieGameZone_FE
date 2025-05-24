import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Menu, MenuProps, theme } from "antd";
import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const UserProfileContainer = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const items: MenuItem[] = [
    {
      key: "myGameGrp",
      label: "My Games",
      type: "group",
      children: [
        {
          key: "/account/library",
          label: "My Library",
          onClick: () => {
            navigate("/account/library");
          },
        },
        {
          key: "/account/ratings-and-reviews",
          label: "Ratings & Reviews",
          onClick: () => {
            navigate("/account/ratings-and-reviews");
          },
        },
      ],
    },
    {
      key: "accountSettingGrp",
      label: "Account Settings",
      type: "group",
      children: [
        {
          key: "/account/profile",
          label: "Profile",
          onClick: () => {
            navigate("/account/profile");
          },
        },
        {
          key: "/account/password",
          label: "Password",
          onClick: () => {
            navigate("/account/password");
          },
        },
      ],
    },
    {
      key: "paymentGrp",
      label: "Payment",
      type: "group",
      children: [
        {
          key: "/account/credit-card",
          label: "Credit Card",
          onClick: () => {
            navigate("/account/credit-card");
          },
        },
        {
          key: "/account/transction-history",
          label: "Transction History",
          onClick: () => {
            navigate("/account/transction-history");
          },
        },
      ],
    },
    {
      key: "contactGrp",
      label: "Contact",
      type: "group",
      children: [
        {
          key: "/account/email-notification",
          label: "Email Notifications",
          onClick: () => {
            navigate("/account/email-notification");
          },
        },
      ],
    },
    {
      key: "miscGrp",
      label: "Misc",
      type: "group",
      children: [
        {
          key: "/account/privacy",
          label: "Privacy",
          onClick: () => {
            navigate("/account/privacy");
          },
        },
        {
          key: "/account/delete-account",
          label: "Delete Account",
          onClick: () => {
            navigate("/account/delete-account");
          },
        },
      ],
    },
  ];
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <MaxWidthWrapper>
      <div className="mt-5 bg-zinc-800 rounded drop-shadow border-zinc-700 border">
        <div className="border-b border-zinc-700 p-5">
          <h1 className="font-bold text-2xl">My Account</h1>
        </div>
        <div className="grid grid-cols-12">
          <div
            className="col-span-2 min-h-72"
            style={{ background: colorBgContainer }}
          >
            <Menu
              selectedKeys={[location.pathname]}
              mode="inline"
              items={items}
            />
          </div>
          <div className="col-span-10" style={{ background: colorBgContainer }}>
            {children}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default UserProfileContainer;
