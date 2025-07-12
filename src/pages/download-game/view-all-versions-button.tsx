import useGameStore from "@/store/use-game-store";
import { Button, Modal } from "antd";
import { useState } from "react";
import { FaFileCircleQuestion } from "react-icons/fa6";
import DownloadCard from "./download-card";
import usePlatformStore from "@/store/use-platform-store";

const ViewAllVersionButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getDefaultPlatforms } = usePlatformStore();
  const { gameFiles } = useGameStore();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const defaultPlatform = getDefaultPlatforms();
  return (
    <>
      <Button type="text" onClick={showModal}>
        (View all versions)
      </Button>
      <Modal
        title="All game versions"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={() => (
          <>
            <Button onClick={handleCancel}>Close</Button>
          </>
        )}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "70%",
          xl: "70%",
          xxl: "70%",
        }}
      >
        {gameFiles.length ? (
          gameFiles.map((x, index: number) => (
            <DownloadCard
              file={x}
              key={`view-all-file-${index}`}
              defaultPlatforms={defaultPlatform}
            />
          ))
        ) : (
          <div className="flex justify-center items-center flex-col py-24 text-gray-500">
            <FaFileCircleQuestion className="size-28" />
            <p className="italic">This game has no files yet.</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewAllVersionButton;
