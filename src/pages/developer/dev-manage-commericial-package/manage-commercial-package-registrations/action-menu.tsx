import { Button, Modal, message } from "antd";
import { useState } from "react";
import { MdCancel } from "react-icons/md";
import { CommercialPackage } from "@/types/commercial-package";
import { cancelCommercialPackageRegistration } from "@/lib/api/commercial-package-api";

interface ActionMenuProps {
  record: CommercialPackage;
  onSuccess?: () => void;
}

const ActionMenu = ({ record, onSuccess }: ActionMenuProps) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!record.id) {
      message.error("Registration ID not found");
      return;
    }

    setLoading(true);
    try {
      const response = await cancelCommercialPackageRegistration(record.id);

      if (response.success) {
        message.success("Registration cancelled successfully");
        onSuccess?.();
      } else {
        throw new Error(response.error || "Failed to cancel registration");
      }
    } catch (error: any) {
      message.error(error.message || "Failed to cancel registration");
    } finally {
      setLoading(false);
    }
  };

  const showCancelConfirm = () => {
    Modal.confirm({
      title: "Cancel Registration",
      content: "Are you sure you want to cancel this registration? This action cannot be undone.",
      okText: "Yes, Cancel",
      okButtonProps: {
        danger: true,
        loading: loading,
      },
      cancelText: "No",
      onOk: handleCancel,
    });
  };

  if (record.status?.toLowerCase() !== "pending") {
    return null;
  }

  return (
    <Button danger type="primary" icon={<MdCancel className="mr-2" />} onClick={showCancelConfirm} loading={loading}>
      Cancel
    </Button>
  );
};

export default ActionMenu;
