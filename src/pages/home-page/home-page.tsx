import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Link } from "react-router-dom";
import FeaturedGameSection from "./featured-game-section";
import SpecialOffersSection from "./special-offers-section";
import { IoTimer } from "react-icons/io5";
import { MdAttachMoney, MdMoneyOff } from "react-icons/md";
import { FaTags } from "react-icons/fa";
import PersonalizedSection from "./personalized-section";
import genre1 from "@/assets/category-action.webp";
import genre2 from "@/assets/category-adventure.webp";
import genre3 from "@/assets/category-puzzle.webp";
import genre4 from "@/assets/category-role-playing.webp";
import GenreCard from "./genre-card";
import { lazy } from "react";
import NavLinks from "@/components/nav-links";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import HandleTransactionResult from "@/components/handle-transaction-result";
import HeroBanner from "./hero-banner";

const DisclaimerModal = lazy(() => import("../../components/disclaimer-modal"));

const HomePage = () => {
  return (
    <MaxWidthWrapper>
      <ScrollToTopButton />
      <DisclaimerModal />
      <HandleTransactionResult />
      <NavLinks />
      <FeaturedGameSection />
      <HeroBanner />
      <SpecialOffersSection />
      <section className="pb-9">
        <h2 className="text-2xl font-bold text-center my-5">Games Search</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to={"/search/latest"}
            className="cursor-box btn-1 font-bold drop-shadow relative"
          >
            <IoTimer className="absolute size-24 -right-7 text-zinc-500 -z-10" />
            Newly Released
          </Link>
          <Link
            to={"/search/sales"}
            className="cursor-box btn-1 font-bold drop-shadow relative"
          >
            <MdAttachMoney className="absolute size-24 -right-7 text-zinc-500 -z-10" />
            Special Offers
          </Link>
          <Link
            to={"/search?maxPrice=0"}
            className="cursor-box btn-1 font-bold drop-shadow relative"
          >
            <MdMoneyOff className="absolute size-24 -right-7 text-zinc-500 -z-10" />
            Free Games
          </Link>
          <Link
            to={"/tags"}
            className="cursor-box btn-1 font-bold drop-shadow relative"
          >
            <FaTags className="absolute size-24 -right-7 text-zinc-500 -z-10" />
            Browse Tags
          </Link>
        </div>
      </section>
      <PersonalizedSection />
      <section className="pb-20">
        <h2 className="text-2xl font-bold text-center my-5">
          Explore by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <GenreCard
            title="Action"
            to="/search?category=7a03afa3-2635-43bd-a58c-daeb80d3cef7"
            background={genre1}
          />
          <GenreCard
            title="Adventure"
            to="/search?category=dfeeb47a-7e69-4927-a65b-b803a8befe9f"
            background={genre2}
          />
          <GenreCard
            title="Puzzle"
            to="/search?category=bca8721b-c323-44a1-afcf-876e206ab035"
            background={genre3}
          />
          <GenreCard
            title="Role-Playing"
            to="/search?category=89a4e6d2-2cfe-4474-9b96-6d3595ad4705"
            background={genre4}
          />
        </div>
      </section>
    </MaxWidthWrapper>
  );
};

export default HomePage;
