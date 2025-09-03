import { getGamesByDeveloperId } from "@/lib/api/game-api";
import useAuthStore from "@/store/use-auth-store";
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
  const { profile } = useAuthStore();

  useEffect(() => {
    (async () => {
      if (!profile) {
        setOptions([]);
        return;
      }
      setFetching(true);
      const result = await getGamesByDeveloperId(profile.id);
      setFetching(false);
      if (!result.error) {
        const games: Game[] = result.data.games;
        const availableGames = games.filter(
          (game) =>
            game.visibility == "Public" && game.censorStatus == "Approved"
        );
        const formattedOptions = availableGames.map((game: Game) => ({
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
  }, [profile]);

  const throttledFetch = useMemo(
    () =>
      throttle(async (value: string) => {
        if (!profile) return;
        if (!value.trim()) return;
        setFetching(true);
        const result = await getGamesByDeveloperId(profile.id, {
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
