import { Button, Modal } from "antd";
import DragDropStringSorter from "./drag-drop-string-sorter";
import { useState } from "react";

const UpdateScreenshotsButton = ({
  screenshots,
}: {
  screenshots: string[];
}) => {
  const [imageUrls, setImageUrls] = useState(screenshots);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button onClick={showModal}>Edit screenshots</Button>
      <Modal
        title="Edit screentshots"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <DragDropStringSorter
          items={screenshots}
          onSorted={(newOrder) => console.log("Sorted:", newOrder)}
        />
      </Modal>
    </>
  );
};

export default UpdateScreenshotsButton;
