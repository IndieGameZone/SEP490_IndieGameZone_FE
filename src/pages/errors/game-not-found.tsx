import researchImage from "@/assets/research.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const GameNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-zinc-900 shadow-xl rounded-2xl p-8 max-w-md border border-orange-500 flex flex-col items-center">
        <img src={researchImage} alt="" width={200} />
        <h1 className="text-3xl font-bold text-red-600 mb-2">Game Not Found</h1>
        <p className="mb-6 text-zinc-200">
          We couldn't find the game you're looking for.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
};

export default GameNotFound;
