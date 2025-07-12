import { searchGames } from "@/lib/api/game-api";
import { Game } from "@/types/game";
import { Select, SelectProps } from "antd";
import throttle from "lodash/throttle";
import { useEffect, useMemo, useState } from "react";
const SelectGameInput = ({
  setSelectGameId,
}: {
  setSelectGameId: (gameId: string) => void;
}) => {
  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    (async () => {
      setFetching(true);
      const result = await searchGames();
      setFetching(false);
      if (!result.error) {
        const formattedOptions = result.data.games.map((game: Game) => ({
          value: game.id,
          label: game.name,
          desc:
            game.shortDescription.length == 0
              ? "No description"
              : game.shortDescription,
        }));
        setOptions(formattedOptions);
      }
    })();
  }, []);

  const throttledFetch = useMemo(
    () =>
      throttle(async (value: string) => {
        if (!value.trim()) return;
        setFetching(true);
        const result = await searchGames({
          searchTerm: value,
        });
        setFetching(false);
        if (!result.error) {
          const formattedOptions = result.data.games.map((game: Game) => ({
            value: game.id,
            label: game.name,
            desc: game.shortDescription,
          }));
          setOptions(formattedOptions);
        }
      }, 1000),
    []
  );

  const handleSearch = (value: string) => {
    throttledFetch(value);
  };

  const handleSelectGame = (e: any) => {
    setSelectGameId(e.value);
  };

  return (
    <Select
      showSearch
      labelInValue
      placeholder="select a game..."
      filterOption={false}
      onSearch={handleSearch}
      onSelect={handleSelectGame}
      notFoundContent={fetching ? "Searching..." : "No game found yet!"}
      style={{ width: "100%" }}
      options={options}
      optionRender={(option) => (
        <div>
          <div className="font-semibold">{option.data.label}</div>
          <p className="text-wrap text-sm text-zinc-400">{option.data.desc}</p>
        </div>
      )}
    />
  );
};

export default SelectGameInput;
