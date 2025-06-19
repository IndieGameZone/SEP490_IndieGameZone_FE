import GenreCard from "../home-page/genre-card";
import genre1 from "@/assets/genre-1.jpg";
import genre2 from "@/assets/genre-2.jpg";
import genre3 from "@/assets/genre-3.jpg";
import genre4 from "@/assets/genre-4.jpg";

const PopularGenresSection = () => {
  return (
    <div className="py-4">
      <h2 className="font-bold text-3xl py-2">Popular Genres</h2>
      <div className="grid grid-cols-4 gap-3">
        <GenreCard
          title="Open world"
          to="/search?genre=1"
          background={genre1}
        />
        <GenreCard title="Adventure" to="/search?genre=2" background={genre2} />
        <GenreCard
          title="Action RPG"
          to="/search?genre=3"
          background={genre3}
        />
        <GenreCard title="FPS" to="/search?genre=4" background={genre4} />
      </div>
    </div>
  );
};

export default PopularGenresSection;
