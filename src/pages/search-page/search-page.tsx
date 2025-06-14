import { useState } from "react";
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
const SearchPage = () => {
  const [activeTab, setActiveTab] = useState("Most popular");

  const tabs = [
    "Most popular",
    "Hot & Trending",
    "Best",
    "Best Seller",
    "Latest",
  ];

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
          />
        </div>
        <div>
          <div className="py-4">
            <span className=" font-bold text-3xl">Popular Genres</span>
          </div>
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
            <GenreCard title="FPS" to="/search?genre=4" background={genre4} />
          </div>
          <div className="py-2">
            <div className="py-4 flex flex-col gap-1.5">
              <span className="text-xl text-gray-400 font-semibold">
                Search results for <span className="text-orange-300">SEARCH KEY</span>
              </span>
              <span className="">
                200,000 results match your search. 20,000 titles have been
                hidden based on your interests.
              </span>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
      <SearchCard />
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <GameCard key={`game-card-${i}`} />
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default SearchPage;
