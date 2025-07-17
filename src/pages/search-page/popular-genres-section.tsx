import GenreCard from "../home-page/genre-card";
import genre1 from "@/assets/category-action.webp";
import genre2 from "@/assets/category-adventure.webp";
import genre3 from "@/assets/category-puzzle.webp";
import genre4 from "@/assets/category-role-playing.webp";

const PopularGenresSection = () => {
  return (
    <div className="py-4">
      <h2 className="font-bold text-3xl py-2">Popular Genres</h2>
      <div className="grid grid-cols-4 gap-3">
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
    </div>
  );
};

export default PopularGenresSection;
