import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Link } from "react-router-dom";
import FeaturedGameSection from "./featured-game-section";
import SpecialOffersSection from "./special-offers-section";
import { IoTimer } from "react-icons/io5";
import { MdAttachMoney, MdMoneyOff } from "react-icons/md";
import { FaTags } from "react-icons/fa";
import PersonalizedSection from "./personalized-section";
import genre1 from "@/assets/genre-1.jpg";
import genre2 from "@/assets/genre-2.jpg";
import genre3 from "@/assets/genre-3.jpg";
import genre4 from "@/assets/genre-4.jpg";
import GenreCard from "./genre-card";
import { lazy } from "react";
import NavLinks from "@/components/nav-links";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import HandleTransactionResult from "@/components/handle-transaction-result";

const DisclaimerModal = lazy(() => import("../../components/disclaimer-modal"));

const HomePage = () => {
  return (
    <MaxWidthWrapper>
      <ScrollToTopButton />
      <DisclaimerModal />
      <HandleTransactionResult />
      <NavLinks />
      <FeaturedGameSection />
      <SpecialOffersSection />
      <section className="pb-9">
        <h2 className="text-2xl font-bold text-center my-5">Games Search</h2>
        <div className="grid grid-cols-4 gap-3">
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
      </section>
    </MaxWidthWrapper>
  );
};

export default HomePage;
