import Loader from "@/components/loader";
import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import TiptapView from "@/components/tiptap/tiptap-view";
import useUserStore from "@/store/use-user-store";
import { Button, Dropdown, MenuProps, Tabs, TabsProps } from "antd";
import { useEffect } from "react";
import { CiUser } from "react-icons/ci";
import {
  FaFacebook,
  FaFlag,
  FaGamepad,
  FaLink,
  FaYoutube,
} from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import ViewUserPosts from "./view-user-posts";
import ViewUserGames from "./view-user-games";
import { BsFileEarmarkPost } from "react-icons/bs";
import useAuthStore from "@/store/use-auth-store";

const ViewProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { fetchUserById, loading, error, user } = useUserStore();
  const { profile } = useAuthStore();
  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex gap-2 items-center">
          <BsFileEarmarkPost />
          Posts
        </div>
      ),
      children: <ViewUserPosts />,
    },
    {
      key: "2",
      label: (
        <div className="flex gap-2 items-center">
          <FaGamepad />
          Games
        </div>
      ),
      children: <ViewUserGames />,
    },
  ];

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    } else {
      navigate("/");
    }
  }, []);

  const items: MenuProps["items"] = [
    {
      label: <div>Copy link to user</div>,
      icon: <FaLink />,
      key: "0",
    },
    {
      label: <div>Report user</div>,
      key: "1",
      icon: <FaFlag />,
    },
  ];

  if (!userId) {
    return <Navigate to={`/`} />;
  }
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-zinc-800 shadow-xl rounded-2xl p-8 max-w-md text-center border border-orange-500">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            User Not Found
          </h1>
          <p className="mb-6">We couldn't find the user you're looking for.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }
  return (
    <MaxWidthWrapper className="py-5">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-4 bg-zinc-900 border border-zinc-700 flex flex-col items-center py-5 px-10 rounded hover:border-orange-500 duration-300">
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt=""
                className="bg-zinc-700 size-36 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="bg-zinc-700 size-36 rounded-full flex justify-center items-center border-2 border-white">
                <CiUser className="size-16" />
              </div>
            )}
            {user?.role.name == "Developer" && (
              <div className="absolute right-1/2 translate-x-1/2 bottom-2 bg-orange-600 text-sm px-2 rounded drop-shadow">
                Dev
              </div>
            )}
          </div>
          <div className="text-xl font-semibold mt-2">{user?.userName}</div>
          <div className="text-sm text-zinc-500">{user?.email}</div>
          <div className="flex justify-center mt-2 gap-5">
            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-zinc-500">Following</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-zinc-500">Followers</p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-zinc-500">Posts</p>
            </div>
          </div>

          {user?.bio && (
            <>
              <hr className="border-zinc-600 my-3 w-full" />
              <TiptapView value={user?.bio} />
            </>
          )}
          {(user?.facebookLink || user?.youtubeChannelLink) && (
            <hr className="border-zinc-600 my-3 w-full" />
          )}
          {user?.facebookLink && (
            <Link
              to={user.facebookLink}
              className="flex items-center w-full gap-2"
            >
              <FaFacebook />
              <p className="hover:underline">
                {user.facebookLink.split("/").pop()}
              </p>
            </Link>
          )}
          {user?.youtubeChannelLink && (
            <Link
              to={user.youtubeChannelLink}
              className="flex items-center w-full gap-2"
            >
              <FaYoutube />
              <p className="hover:underline">
                {user.youtubeChannelLink.split("/").pop()}
              </p>
            </Link>
          )}
          {profile?.id == userId ? (
            <div className="flex w-full mt-3">
              <Button
                className="flex-1"
                onClick={() => {
                  navigate("/account/profile");
                }}
              >
                Edit profile
              </Button>
            </div>
          ) : (
            <div className="flex w-full gap-2 mt-3">
              <Button className="flex-1">Follow</Button>
              <Dropdown menu={{ items }}>
                <Button icon={<IoMdMore />}></Button>
              </Dropdown>
            </div>
          )}
        </div>
        <div className="col-span-8">
          <Tabs type="card" items={tabItems} />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewProfilePage;
