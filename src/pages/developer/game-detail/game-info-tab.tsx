import TiptapView from "@/components/tiptap/tiptap-view";
import { formatCurrencyVND } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import useGameStore from "@/store/use-game-store";
import { Badge, Button, Descriptions, DescriptionsProps, Tag } from "antd";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";

const GameInfoTab = () => {
  const { game } = useGameStore();
  const navigate = useNavigate();
  const handleViewGamePage = () => {
    navigate(`/game/${game?.id}`);
  };
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Game name",
      children: game?.name,
    },
    {
      key: "2",
      label: "Category",
      children: game?.category.name,
    },
    {
      key: "3",
      label: "Short description",
      children: game?.shortDescription,
      span: 2,
    },
    {
      key: "4",
      label: "Order time",
      children: "2018-04-24 18:00:00",
    },
    {
      key: "5",
      label: "Usage Time",
      children: "2019-04-24 18:00:00",
      span: 2,
    },
    {
      key: "6",
      label: "Status",
      children: <Badge status="processing" text="Running" />,
      span: 3,
    },
    {
      key: "7",
      label: "Negotiated Amount",
      children: "$80.00",
    },
    {
      key: "8",
      label: "Discount",
      children: "$20.00",
    },
    {
      key: "9",
      label: "Official Receipts",
      children: "$60.00",
    },
    {
      key: "10",
      label: "Config Info",
      children: (
        <>
          Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1
          <br />
        </>
      ),
    },
  ];
  return (
    <div className="bg-zinc-900 p-3 grid grid-cols-12 gap-5">
      <div className="col-span-12 flex gap-3 justify-end">
        <Button icon={<FaEye />} onClick={handleViewGamePage}>
          View game's page
        </Button>
        <Button icon={<FaPencilAlt />} type="primary">
          Update game
        </Button>
      </div>
      <div className="col-span-4">
        <h3 className="font-bold mb-2">Cover Image</h3>
        <img
          src={game?.coverImage}
          alt=""
          className="aspect-video object-contain bg-zinc-800 rounded"
        />
        <h3 className="font-bold mt-4">Game screenshots/images</h3>
        <div className="grid grid-cols-2 mt-2 gap-3">
          {game?.gameImages.map((image) => {
            return (
              <img
                src={image.image}
                key={`game-image-${image.id}`}
                alt=""
                className="aspect-video object-contain bg-zinc-800 rounded"
              />
            );
          })}
        </div>
        <h3 className="font-bold mt-4">Gameplay/trailer</h3>
        {game?.videoLink ? (
          <ReactPlayer
            className="react-player"
            url={game?.videoLink}
            width="100%"
            controls
          />
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>

      <div className="col-span-8 bg-zinc-800 p-3 rounded">
        <Descriptions title="User Info" bordered items={items} />
        <h3 className="font-bold">Game name</h3>
        <p className="text-2xl">{game?.name}</p>
        <h3 className="font-bold mt-2">Short description</h3>
        <p>{game?.shortDescription}</p>
        <h3 className="font-bold mt-2">Created date</h3>
        <p>{game && formatDate(new Date(game.createdAt))}</p>
        <h3 className="font-bold">Category</h3>
        <p className="text-orange-500 font-semibold">{game?.category.name}</p>
        <h3 className="font-bold">Tags</h3>
        <p className="text-orange-500 font-semibold">
          {game?.gameTags.map((tag) => (
            <Tag key={tag.tag.id} color="orange">
              {tag.tag.name}
            </Tag>
          ))}
        </p>

        <hr className="my-3" />
        <h3 className="font-bold">Game price</h3>
        <p className="text-xl">
          {game?.price != 0 ? formatCurrencyVND(game?.price ?? 0) : "Free"}
        </p>
        <h3 className="font-bold mt-2">Allow donation</h3>
        <p>{game?.allowDonation ? "Yes" : "No"}</p>
        <hr className="my-3" />
        <h3 className="font-bold">Desciption</h3>
        <TiptapView value={game?.description} />
      </div>
    </div>
  );
};

export default GameInfoTab;
