import FaultTolerantImage from "@/components/fault-tolerant-image";
import { getBestSellingGames } from "@/lib/api/admin-dashboard-api";
import { Game } from "@/types/game";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Item = {
  game: Game;
  purchaseCount: number;
};
const BestSellingGames = () => {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const result = await getBestSellingGames();
    if (!result.error) {
      setItems(result.data);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold">Best selling games</h3>
      <div className="max-h-96 overflow-auto">
        {items
          .sort((a, b) => b.purchaseCount - a.purchaseCount)
          .map((entry, index) => {
            return (
              <div
                className="bg-white mt-2 rounded flex gap-3 highlight-hover"
                key={entry.game.id}
              >
                <Link to={`/admin/game/${entry.game.id}`}>
                  <FaultTolerantImage
                    src={entry.game.coverImage}
                    alt=""
                    className="w-[150px] bg-zinc-400 aspect-video object-contain"
                  />
                </Link>
                <div className="">
                  <Link to={`/admin/game/${entry.game.id}`}>
                    <h4 className="font-bold text-lg">
                      #{index + 1} {entry.game.name}
                    </h4>
                  </Link>
                  <p className="text-sm text-zinc-400">
                    {entry.game.category.name}
                  </p>

                  <p className="flex items-center gap-1">
                    <strong>Purchases:</strong> {entry.purchaseCount}
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BestSellingGames;
