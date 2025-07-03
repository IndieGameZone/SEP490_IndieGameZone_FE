import Loader from "@/components/loader";
import useAuthStore from "@/store/use-auth-store";
import { Button, Input, Pagination, Select, message } from "antd";
import { useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import GameCard from "./game-card";
import { getGamesByDeveloperId } from "@/lib/api/game-api";
import { Game } from "@/types/game";
import { parseNumber } from "@/types/parsers";

const sortOptions = [
  {
    value: "most-popular",
    label: "Most popular",
  },
  {
    value: "latest",
    label: "Latest",
  },
];

const PAGE_SIZE = 9;

const DevManageGamesPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [games, setGames] = useState<Game[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const [isNewDev, setIsNewDev] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  });

  const checkNewDev = async (devId: string) => {
    const result = await getGamesByDeveloperId(devId, {
      pageNumber: 1,
      pageSize: 1,
    });
    setIsNewDev(result.data.games?.length == 0);
  };

  const fetchGames = async (devId: string, current: number = 1, q?: string) => {
    setLoading(true);
    const result = await getGamesByDeveloperId(devId, {
      pageNumber: current,
      pageSize: PAGE_SIZE,
      searchTerm: q,
    });
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to fetch games from server!");
      return;
    }
    const paginationHeader = result.data.headers["x-pagination"];
    const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
    if (pagination) {
      setPagination({
        current: pagination.CurrentPage,
        pageSize: PAGE_SIZE,
        total: pagination.TotalCount,
      });
    }
    setGames(result.data.games);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("q", value);
    setSearchParams(params);
  };
  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.delete("page");
    setSearchParams(params);
  };

  const handlePageChange = (page: number, _: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  useEffect(() => {
    if (profile) {
      const pageNumber = parseNumber(searchParams.get("page"));
      const query = searchParams.get("q") ?? undefined;
      fetchGames(profile.id, pageNumber, query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (profile) {
      checkNewDev(profile.id);
    }
  }, []);

  if (isNewDev) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center">
        <p className="text-4xl font-semibold">Are you a developer?</p>
        <p className="text-xl"> Upload your first game</p>
        <Button
          icon={<FaUpload />}
          type="primary"
          className="mt-5"
          onClick={() => navigate("/dev/upload-game")}
        >
          Upload a new game
        </Button>
      </div>
    );
  }
  return (
    <div className="min-h-[70vh] p-5">
      {contextHolder}
      <div className="flex justify-between ">
        <h1 className="text-2xl font-bold">Your Games</h1>
        <Button
          icon={<FaUpload />}
          type="primary"
          onClick={() => navigate("/dev/upload-game")}
        >
          Upload a new game
        </Button>
      </div>
      <div className="mb-5 py-2 flex justify-between">
        <Input.Search
          placeholder="Search for game titles..."
          style={{ width: 300 }}
          onSearch={handleSearch}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
          onClear={handleClearSearch}
        />
        <div className="flex items-center text-zinc-500 gap-2">
          <p className="text-sm">Sort by: </p>
          <Select
            defaultValue="latest"
            style={{ width: 150 }}
            options={sortOptions}
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : pagination.total > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-5">
            {games.map((game, index: number) => {
              return <GameCard game={game} key={`dev-game-${index}`} />;
            })}
          </div>
          <div className="py-3">
            <Pagination
              align="center"
              defaultCurrent={pagination.current}
              total={pagination.total}
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <div className="min-h-[70vh] flex flex-col justify-center items-center">
          <p className="text-2xl font-semibold text-center">
            No games found for your search.
          </p>
          <Button type="link" onClick={handleClearSearch}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
};

export default DevManageGamesPage;
