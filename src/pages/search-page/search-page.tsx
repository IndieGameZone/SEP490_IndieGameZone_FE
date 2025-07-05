import { Input, message } from "antd";
import { useSearchParams } from "react-router-dom";
import { MdOutlineSort } from "react-icons/md";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import GameCard from "./game-card";
import PopularGenresSection from "./popular-genres-section";
import notFoundIcon from "@/assets/not-found-icon.svg";
import { useEffect, useState } from "react";
import FilterPanel from "./filter-panel";
import { SearchProps } from "antd/es/input";
import NavLinks from "@/components/nav-links";
import { searchGames } from "@/lib/api/game-api";
import { parseNumber, parseStringArray } from "@/types/parsers";
import { LuRefreshCcw } from "react-icons/lu";
import { Game } from "@/types/game";
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import useWishlistStore from "@/store/use-wish-list-store";
import useAuthStore from "@/store/use-auth-store";

const tabs = [
  "Most popular",
  "Hot & Trending",
  "Best",
  "Best Seller",
  "Latest",
];

const PAGE_SIZE = 9;
const SearchPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [activeTab, setActiveTab] = useState("Most popular");
  const [games, setGames] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { fetchWishlistGameIds } = useWishlistStore();
  const { profile } = useAuthStore();

  const onSearch: SearchProps["onSearch"] = (value, _e, _) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
    setSearchValue(value);
  };

  useEffect(() => {
    if (profile) {
      fetchWishlistGameIds(profile.id);
    }
  }, [profile]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setInitialLoad(true);
    setGames([]);
  }, [searchParams]);

  useEffect(() => {
    if (initialLoad) {
      fetchGames(1);
      setInitialLoad(false);
    }
  }, [initialLoad]);

  const fetchGames = async (currentPage: number) => {
    const query = searchParams.get("q") ?? undefined;
    const maxPrice = parseNumber(searchParams.get("maxPrice"));
    const tags = parseStringArray(searchParams.get("tags"));
    const languages = parseStringArray(searchParams.get("languages"));
    const platforms = parseStringArray(searchParams.get("platforms"));

    setIsLoading(true);
    const result = await searchGames({
      Languages: languages,
      pageNumber: page,
      pageSize: PAGE_SIZE,
      Platforms: platforms,
      price: maxPrice,
      Tags: tags,
      searchTerm: query,
    });
    if (result.error) {
      messageApi.error("Failed to fetch games");
      setHasMore(false);
    } else {
      const newGames: Game[] = result.data.games;
      const paginationHeader = result.data.headers["x-pagination"];
      const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;

      if (currentPage === 1) {
        setGames(newGames);
      } else {
        setGames((prev) => [...prev, ...newGames]);
      }
      setHasMore(pagination?.HasNext ?? false);
      setPage(currentPage + 1);
    }
    setIsLoading(false);
  };

  const fetchMore = () => fetchGames(page);

  const handleClearSearchInput = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.delete("page");
  };

  return (
    <div className="pb-10">
      {contextHolder}
      <ScrollToTopButton />
      <MaxWidthWrapper>
        <NavLinks />
        <div className="flex justify-center">
          <Input.Search
            placeholder="Search for game titles, genres, tags, developers,..."
            style={{ width: 700 }}
            size="large"
            onSearch={onSearch}
            allowClear
            onClear={handleClearSearchInput}
          />
        </div>
        <div>
          {searchValue ? (
            <div className="py-2">
              <div className="py-4 flex flex-col gap-1.5">
                <span className="text-xl text-gray-400 font-semibold">
                  Search results for{" "}
                  <span className="text-orange-300">{searchValue}</span>
                </span>
                <span>{games.length} results match your search.</span>
              </div>
            </div>
          ) : (
            <PopularGenresSection />
          )}
        </div>
      </MaxWidthWrapper>
      <FilterPanel />
      <MaxWidthWrapper className="flex gap-3">
        <div className="flex items-center gap-2">
          <MdOutlineSort />
          <span className="text-xs">Sort by</span>
        </div>
        {tabs.map((tab) => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer transition-all duration-200 border-b-2 p-2 ${
              activeTab === tab
                ? "text-orange-600 border-orange-600"
                : "text-zinc-500 hover:text-gray-200 border-transparent"
            }`}
          >
            {tab}
          </span>
        ))}
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <hr className="border-b border-zinc-700 mb-5"></hr>
        <div>
          <InfiniteScroll
            dataLength={games.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={
              <div className="col-span-full flex justify-center py-10">
                <LuRefreshCcw className="animate-spin-reverse size-16" />
              </div>
            }
            endMessage={
              <p className="text-center my-4 text-sm text-zinc-500">
                No more games
              </p>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {games.length > 0 &&
                games.map((game) => (
                  <div key={game.id}>
                    <GameCard game={game} />
                  </div>
                ))}

              {!isLoading && games.length === 0 && (
                <div className="col-span-full flex flex-col items-center py-10 gap-5">
                  <img src={notFoundIcon} />
                  <div className="text-zinc-500 font-semibold text-lg">
                    No games found
                  </div>
                </div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default SearchPage;
