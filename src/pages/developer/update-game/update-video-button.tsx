import { Button, Modal } from "antd";
import { useState } from "react";
import { FaPen } from "react-icons/fa";

const UpdateVideoButton = ({ url }: { url: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    console.log(url)
  };

  return (
    <>
      <Button onClick={showModal} className="mt-2" icon={<FaPen />}>
        Edit gameplay/trailer link
      </Button>
      <Modal
        title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default UpdateVideoButton;
