import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "antd";
import GenreCard from "../home-page/genre-card";
import genre1 from "@/assets/genre-1.jpg";
import genre2 from "@/assets/genre-2.jpg";
import genre3 from "@/assets/genre-3.jpg";
import genre4 from "@/assets/genre-4.jpg";
import SearchCard from "./search-card";
import GameCard from "./game-card";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { FaFilter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { searchGames, GameSearchResponse } from "@/lib/api/game-api";
import Loader from "@/components/loader";
import useDebounce from "@/hooks/useDebounce";
import notFoundIcon from "@/assets/not-found-icon.svg";

interface FilterData {
  price?: number;
  Tags?: string[];
  Languages?: string[];
  Platforms?: string[];
  showSpecialOffers?: boolean;
}

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("Most popular");
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterData>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastGameRef = useRef<HTMLDivElement | null>(null);

  const tabs = [
    "Most popular",
    "Hot & Trending",
    "Best",
    "Best Seller",
    "Latest",
  ];
  const { debouncedValue: debouncedSearchTerm, isDebouncing } = useDebounce(
    searchTerm,
    1000
  );

  const fetchGames = async (page: number, resetGames = false) => {
    setIsLoading(true);
    try {
      const params = {
        searchTerm: debouncedSearchTerm,
        pageNumber: page,
        pageSize,
        price: filters.price,
        Tags: filters.Tags,
        Languages: filters.Languages,
        Platforms: filters.Platforms,
      };
      // console.log("Final params sent to API:", JSON.stringify(params, null, 2));
      const { data, error } = await searchGames(params);
      // console.log("API response:", JSON.stringify(data, null, 2));
      if (error) throw new Error(error);
      const newGames = Array.isArray(data)
        ? data
        : (data as GameSearchResponse).items || [];
      if (resetGames) {
        setGames(newGames);
      } else {
        setGames((prevGames) => [...prevGames, ...newGames]);
      }
      setHasMore(newGames.length === pageSize);
    } catch (error) {
      // console.error("Error fetching games:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const memoizedFetchGames = useCallback(fetchGames, [
    debouncedSearchTerm,
    filters,
  ]);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (lastGameRef.current) {
      observer.observe(lastGameRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, hasMore]);

  useEffect(() => {
    setGames([]);
    setPageNumber(1);
    setHasMore(true);
    fetchGames(1, true);
  }, [debouncedSearchTerm, filters]);

  useEffect(() => {
    if (pageNumber > 1) {
      memoizedFetchGames(pageNumber, false);
    }
  }, [pageNumber, memoizedFetchGames]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = useCallback((filterData: FilterData) => {
    // console.log("Filter changed:", filterData);
    setFilters(filterData);
  }, []);

  return (
    <div className="pb-10">
      <MaxWidthWrapper>
        <div className="flex justify-center items-center gap-5 p-5 font-bold text-xl">
          <Link to={"/"} className="hover-underline text-gray-500">
            Discover
          </Link>
          <Link to={"/search"} className="hover-underline">
            Search
          </Link>
          <Link to={"/forum"} className="hover-underline text-gray-500">
            Forum
          </Link>
        </div>
        <div className="flex justify-center">
          <Input.Search
            placeholder="Search for game titles, genres, tags, developers,..."
            style={{ width: 700 }}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          {searchTerm ? (
            <div className="py-2">
              <div className="py-4 flex flex-col gap-1.5">
                <span className="text-xl text-gray-400 font-semibold">
                  Search results for{" "}
                  <span className="text-orange-300">
                    {searchTerm}
                  </span>
                </span>
                <span>{games.length} results match your search.</span>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <h2 className="font-bold text-3xl py-2">Popular Genres</h2>
              <div className="grid grid-cols-4 gap-3">
                <GenreCard
                  title="Open world"
                  to="/search?genre=1"
                  background={genre1}
                />
                <GenreCard
                  title="Adventure"
                  to="/search?genre=2"
                  background={genre2}
                />
                <GenreCard
                  title="Action RPG"
                  to="/search?genre=3"
                  background={genre3}
                />
                <GenreCard
                  title="FPS"
                  to="/search?genre=4"
                  background={genre4}
                />
              </div>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
      <SearchCard onFilterChange={handleFilterChange} />
      <MaxWidthWrapper className="flex gap-3">
        <div className="flex items-center gap-2">
          <FaFilter />
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(isDebouncing || isLoading) && (
              <div className="col-span-full flex justify-center items-center">
                <Loader />
              </div>
            )}
            {!isDebouncing &&
              !isLoading &&
              games.length > 0 &&
              games.map((game, index) => (
                <div
                  key={game.id}
                  ref={index === games.length - 1 ? lastGameRef : null}
                >
                  <GameCard game={game} />
                </div>
              ))}
            {!isDebouncing && !isLoading && !hasMore && games.length > 0 && (
              <div className="col-span-full text-center text-zinc-500 py-10">
                No more games to load
              </div>
            )}
            {!isDebouncing && !isLoading && games.length === 0 && (
              <div className="col-span-full flex flex-col items-center py-10 gap-5">
                <img src={notFoundIcon} />
                <div className="text-zinc-500 font-semibold text-lg">
                  No games found matching your criteria
                </div>
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default SearchPage;
