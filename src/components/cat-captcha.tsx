import { useCallback, useState } from "react";
import { IoMdInformationCircleOutline, IoMdRefresh } from "react-icons/io";
import { MdHeadphones } from "react-icons/md";

type Tile = {
  id: number;
  selected: boolean;
};

type CatCaptchaProps = {
  gridSize?: number;
};

// This is a parody CAPTCHA for entertainment purpose
export default function CatCaptcha({ gridSize = 10 }: CatCaptchaProps) {
  const [imageKey, setImageKey] = useState(Date.now());
  const [visible, setVisible] = useState(() => Math.random() < 0.05); 
  const handleSkip = () => setVisible(false);
  const totalTiles = gridSize * gridSize;

  const [tiles, setTiles] = useState<Tile[]>(
    Array.from({ length: totalTiles }, (_, i) => ({
      id: i,
      selected: false,
    }))
  );

  const toggleTile = useCallback((id: number) => {
    setTiles((prev) =>
      prev.map((tile) =>
        tile.id === id ? { ...tile, selected: !tile.selected } : tile
      )
    );
  }, []);

  const resetCaptcha = () => {
    setTiles(
      Array.from({ length: totalTiles }, (_, i) => ({
        id: i,
        selected: false,
      }))
    );
    setImageKey(Date.now());
  };

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(
      ". Select all squares with a cat. If there are none, click skip. Here is the description of the image: There is a cat in the image. If you don't see a cat in the image, please contact us to let us know there is no cat in the image. We will make sure there is a cat in the image."
    );
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  };
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-black/40 flex justify-center items-center">
      <div className="p-2 bg-white drop-shadow-2xl border border-zinc-200">
        <div className="p-5 bg-blue-400 text-white">
          <p>Select all squares with</p>
          <h2 className="font-bold text-4xl -mt-2">a cat</h2>
          <p>If there are none, click skip</p>
        </div>
        <div className="relative w-[400px] h-[400px] border overflow-hidden shadow-md">
          {/* the cat image! */}
          <img
            key={imageKey}
            src={`https://cataas.com/cat?key=${imageKey}`}
            alt="mysterious cat"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />

          {/* the button grid */}
          <div
            className="absolute top-0 left-0 w-full h-full grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {tiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => toggleTile(tile.id)}
                aria-label={`tile ${tile.id + 1}`}
                className={`border-white cursor-pointer transition-all duration-100 ${
                  tile.selected ? "border-3" : "border"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center py-2">
          <div className="flex gap-3">
            <button className="cursor-pointer" onClick={resetCaptcha}>
              <IoMdRefresh className="size-7 text-zinc-600" />
            </button>
            <button className="cursor-pointer" onClick={playAudio}>
              <MdHeadphones className="size-7 text-zinc-600" />
            </button>
            <button className="cursor-pointer">
              <IoMdInformationCircleOutline className="size-7 text-zinc-600" />
            </button>
          </div>
          <button
            type="button"
            className="px-7 py-2 cursor-pointer bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white duration-100"
            onClick={handleSkip}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
