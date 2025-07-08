import Loader from "@/components/loader";
import { useGlobalMessage } from "@/components/message-provider";
import useGameStore from "@/store/use-game-store";
import { Button, Menu, MenuProps, theme } from "antd";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaFolderOpen,
  FaImages,
  FaInfoCircle,
} from "react-icons/fa";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import UpdateGameFiles from "./game-files/update-game-files";
import UpdateGameInfo from "./update-game-info";
import UpdateGameMediaAssets from "./update-game-media-assets";
import useCategoryStore from "@/store/use-category-store";
import useTagStore from "@/store/use-tag-store";
import useAgeRestrictionStore from "@/store/use-age-restriction-store";
import useLanguageStore from "@/store/use-language-store";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  { key: "info", icon: <FaInfoCircle />, label: "Information" },
  { key: "media", icon: <FaImages />, label: "Media assets" },
  { key: "file", icon: <FaFolderOpen />, label: "Files" },
];
const { useToken } = theme;
const DevUpdateGamePage = () => {
  const { gameId } = useParams();
  const [selectedKey, setSelectedKey] = useState("info");
  const { fetchGameById, fetchGameFiles, game, loading, error, renderKey } =
    useGameStore();
  const navigate = useNavigate();
  const messageApi = useGlobalMessage();
  const { token } = useToken();
  const { fetchCategories } = useCategoryStore();
  const { fetchTags } = useTagStore();
  const { fetchAgeRestrictions } = useAgeRestrictionStore();
  const { fetchLanguages } = useLanguageStore();

  useEffect(() => {
    if (gameId) {
      fetchGameById(gameId);
      fetchGameFiles(gameId);
      fetchCategories();
      fetchTags();
      fetchAgeRestrictions();
      fetchLanguages();
      window.scrollTo({
        top: 0,
      });
    }
  }, [renderKey]);

  const handleGoBack = () => {
    if (game) navigate(`/dev/game/${game.id}`);
  };

  if (loading) return <Loader />;
  if (error) {
    if (error.includes("404")) {
      messageApi.error("Game not found!");
    } else {
      messageApi.error(error);
    }
    return <Navigate to={"/dev/manage-games"} />;
  }
  if (!game) return;
  if (!gameId) return <Navigate to={"/dev/manage-games"} />;

  return (
    <div>
      <div className="p-5 bg-zinc-800 border border-zinc-700 text-2xl flex gap-3 justify-between">
        <h1 className="font-bold text-2xl">Update "{game.name}"</h1>
        <Button type="text" icon={<FaArrowLeft />} onClick={handleGoBack}>
          Back to game page
        </Button>
      </div>
      <div className="grid grid-cols-12">
        <div
          className="col-span-3 pb-50 border-r border-r-zinc-700"
          style={{ background: token.colorBgContainer }}
        >
          <Menu
            defaultSelectedKeys={[selectedKey]}
            mode="inline"
            items={items}
            onClick={(e) => setSelectedKey(e.key)}
          />
        </div>
        <div className="col-span-9">
          {selectedKey === "info" && <UpdateGameInfo />}
          {selectedKey === "media" && <UpdateGameMediaAssets />}
          {selectedKey === "file" && <UpdateGameFiles />}
        </div>
      </div>
    </div>
  );
};

export default DevUpdateGamePage;
