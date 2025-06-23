import { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import warningImage from "@/assets/warning.png";
import Cookies from "js-cookie";

const DisclaimerModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const hasSeenDisclaimer = Cookies.get("hasSeenDisclaimer");

    if (!hasSeenDisclaimer) {
      setIsModalVisible(true);
    }
  }, []);

  const handleOk = () => {
    Cookies.set("hasSeenDisclaimer", "true", { expires: 365 });
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Disclaimer"
      open={isModalVisible}
      onOk={handleOk}
      closable={false}
      footer={[
        <Button key="ok" type="primary" onClick={handleOk}>
          I Understand
        </Button>,
      ]}
    >
      <div className="flex justify-center">
        <img src={warningImage} alt="warning sign" width={100} />
      </div>
      <p className="mt-5">
        This website is part of a <strong>university project</strong> and is not
        intended for commercial use. All data presented here is for educational
        purposes only.
      </p>
    </Modal>
  );
};

export default DisclaimerModal;
