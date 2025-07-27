import { Input, message } from "antd";
import { useSearchParams } from "react-router-dom";
import MaxWidthWrapper from "@/components/wrappers/max-width-wrapper";
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
import ScrollToTopButton from "@/components/buttons/scroll-to-top-button";
import useWishlistStore from "@/store/use-wish-list-store";
import useAuthStore from "@/store/use-auth-store";
import useIsMobile from "@/hooks/use-is-mobile";
import MobileFilterPanel from "./mobile-filter-panel";
import SortPanel from "./sort-panel";
import Masonry from "react-masonry-css";
import useCategoryStore from "@/store/use-category-store";

const PAGE_SIZE = 9;
const SearchPage = () => {
  const isMobile = useIsMobile();
  const [messageApi, contextHolder] = message.useMessage();
  const [games, setGames] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { fetchWishlistGameIds } = useWishlistStore();
  const { selectedCategory } = useCategoryStore();
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
    window.scrollTo({
      top: 0,
    });
  }, []);

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
    const category = searchParams.get("category") ?? "";

    setIsLoading(true);
    const result = await searchGames({
      Languages: languages,
      pageNumber: page,
      pageSize: PAGE_SIZE,
      Platforms: platforms,
      price: maxPrice,
      Tags: tags,
      searchTerm: query,
      Category: category,
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
                <span>
                  {games.length} results match your search{" "}
                  {selectedCategory && (
                    <span>
                      {" "}
                      in{" "}
                      <span className="font-semibold text-orange-300">
                        {selectedCategory.name}
                      </span>{" "}
                      category
                    </span>
                  )}
                  .
                </span>
              </div>
            </div>
          ) : (
            <div className="hidden md:block">
              <PopularGenresSection />
            </div>
          )}
        </div>
      </MaxWidthWrapper>
      {isMobile ? <MobileFilterPanel /> : <FilterPanel />}
      <SortPanel />
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
            style={{ overflow: "visible" }}
          >
            <Masonry
              breakpointCols={{
                default: 3,
                1280: 3,
                768: 2,
                500: 1,
              }}
              className="flex gap-6"
              columnClassName="space-y-6"
            >
              {games.length > 0 &&
                games.map((game) => (
                  <div key={game.id}>
                    <GameCard game={game} />
                  </div>
                ))}
            </Masonry>
            {!isLoading && games.length === 0 && (
              <div className="col-span-full flex flex-col items-center py-10 gap-5">
                <img src={notFoundIcon} />
                <div className="text-zinc-500 font-semibold text-lg">
                  No games found
                </div>
              </div>
            )}
          </InfiniteScroll>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default SearchPage;
