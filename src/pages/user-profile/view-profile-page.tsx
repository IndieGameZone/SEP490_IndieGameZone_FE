import Loader from "@/components/loader";
import { useGlobalMessage } from "@/components/message-provider";
import TiptapView from "@/components/tiptap/tiptap-view";
import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
import { useCopyCurrentLink } from "@/hooks/use-copy-current-link";
import { useHashState } from "@/hooks/use-hash-state";
import { getUserObtainedAchievements } from "@/lib/api/achievements-api";
import { getUserSocial } from "@/lib/api/user-api";
import useAuthStore from "@/store/use-auth-store";
import useFollowStore from "@/store/use-follow-store";
import useUserStore from "@/store/use-user-store";
import { Achievement } from "@/types/achievements";
import { Button, Dropdown, MenuProps, Tabs, TabsProps, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { BsFileEarmarkPost } from "react-icons/bs";
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
import ViewUserGames from "./view-user-games";
import ViewUserPosts from "./view-user-posts";
interface UserSocialStats {
  numberOfPost: number;
  numberOfFollower: number;
  numberOfFollowee: number;
}
const ViewProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { fetchUserById, loading, error, user } = useUserStore();
  const [selectedTab, setSelectedTab] = useHashState("posts");
  const { copyLink } = useCopyCurrentLink();
  const { profile } = useAuthStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);
  const [socialStats, setSocialStats] = useState<UserSocialStats>({
    numberOfPost: 0,
    numberOfFollower: 0,
    numberOfFollowee: 0,
  });
  const [loadingSocial, setLoadingSocial] = useState(false);

  const {
    followDeveloper,
    checkIsFollowed,
    getFollowerCount,
    isFollowed,
    loading: followLoading,
  } = useFollowStore();
  const messageApi = useGlobalMessage();

  const tabItems: TabsProps["items"] = [
    ...(user?.role.name === "Developer"
      ? [
          {
            key: "games",
            label: (
              <div className="flex gap-2 items-center">
                <FaGamepad />
                Games
              </div>
            ),
            children: <ViewUserGames />,
          },
        ]
      : []),
    {
      key: "posts",
      label: (
        <div className="flex gap-2 items-center">
          <BsFileEarmarkPost />
          Posts
        </div>
      ),
      children: <ViewUserPosts />,
    },
  ];
  const fetchSocialStats = async () => {
    if (!userId) return;

    setLoadingSocial(true);
    try {
      const response = await getUserSocial(userId);
      if (response.success) {
        setSocialStats(response.data);
      } else {
        console.error("Failed to fetch social stats:", response.error);
      }
    } catch (error) {
      console.error("Failed to fetch social stats:", error);
    } finally {
      setLoadingSocial(false);
    }
  };
  useEffect(() => {
    const loadAchievements = async () => {
      if (!userId) return;

      setLoadingAchievements(true);
      try {
        const response = await getUserObtainedAchievements(userId);
        if (response.success) {
          setAchievements(response.data);
        } else {
          console.error("Failed to fetch achievements:", response.error);
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setLoadingAchievements(false);
      }
    };

    loadAchievements();
  }, [userId]);

  useEffect(() => {
    const checkFollow = async () => {
      if (profile?.id && userId) {
        await checkIsFollowed(profile.id, userId);
      }
    };

    checkFollow();
  }, [profile?.id, userId]);

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    } else {
      navigate("/");
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getFollowerCount(userId);
      fetchSocialStats();
    }
  }, [userId]);

  const items: MenuProps["items"] = [
    {
      label: <div>Copy link to user</div>,
      icon: <FaLink />,
      key: "0",
      onClick: () => copyLink(),
    },
    {
      label: <div>Report user</div>,
      key: "1",
      icon: <FaFlag />,
    },
  ];

  const handleFollowClick = async () => {
    if (!profile?.id) {
      messageApi.error("Please login to follow developers");
      return;
    }
    if (!userId) return;

    await followDeveloper(profile.id, userId);
    fetchSocialStats();
  };

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
      <div className="md:grid grid-cols-12 gap-3">
        <div className="col-span-4">
          <div className="bg-zinc-900 border border-zinc-700 flex flex-col items-center p-5 rounded hover:border-orange-500 duration-300">
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
                <p className="text-2xl font-bold">
                  {loadingSocial ? (
                    <span className="text-sm">...</span>
                  ) : (
                    socialStats.numberOfFollowee
                  )}
                </p>
                <p className="text-sm text-zinc-500">Following</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold">
                  {loadingSocial ? (
                    <span className="text-sm">...</span>
                  ) : (
                    socialStats.numberOfFollower
                  )}
                </p>
                <p className="text-sm text-zinc-500">Followers</p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold">
                  {loadingSocial ? (
                    <span className="text-sm">...</span>
                  ) : (
                    socialStats.numberOfPost
                  )}
                </p>
                <p className="text-sm text-zinc-500">Posts</p>
              </div>
            </div>

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
              <div className="flex mt-3 w-full">
                <Button
                  style={{ flex: 1 }}
                  type={isFollowed ? "default" : "primary"}
                  onClick={handleFollowClick}
                  loading={followLoading}
                  disabled={profile?.id === userId}
                >
                  {isFollowed ? "Following" : "Follow"}
                </Button>
                <Dropdown menu={{ items }}>
                  <Button icon={<IoMdMore />}></Button>
                </Dropdown>
              </div>
            )}

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

            <div className="w-full">
              {loadingAchievements ? (
                <div className="flex justify-center">
                  <Loader type="inline" />
                </div>
              ) : (
                achievements.length > 0 && (
                  <>
                    <hr className="border-zinc-600 my-3 w-full" />
                    <h4 className="font-semibold">Achievements</h4>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {achievements.map((achievement) => (
                        <div key={achievement.id}>
                          <Tooltip placement="bottom" title={achievement.name}>
                            <img
                              src={achievement.image}
                              alt=""
                              className="w-16 h-16 rounded-full object-cover border-2"
                            />
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>

        <div className="col-span-8 mt-3 md:mt-0">
          <Tabs
            type="card"
            items={tabItems}
            activeKey={selectedTab}
            onChange={(value) => setSelectedTab(value)}
            tabBarStyle={{ margin: 0 }}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ViewProfilePage;
