import useGameStore from "@/store/use-game-store";
import { Button, Modal } from "antd";
import { useState } from "react";
import { FaFileCircleQuestion } from "react-icons/fa6";
import usePlatformStore from "@/store/use-platform-store";
import FileCard from "./file-card";

const ViewAllVersionButton = ({
  darkTheme = true,
}: {
  darkTheme?: boolean;
}) => {
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
      >
        {gameFiles.length ? (
          <div className="space-y-2">
            {gameFiles.map((x, index: number) => (
              <FileCard
                file={x}
                key={`view-all-file-${index}`}
                defaultPlatforms={defaultPlatform}
                darkTheme={darkTheme}
              />
            ))}
          </div>
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
