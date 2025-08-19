import { Modal, Descriptions, Tag } from "antd";
import { Transaction, getReadableTransactionType } from "@/types/transaction";
import { formatDateTime } from "@/lib/date-n-time";
import CoinIcon from "@/components/coin-icon";
import { FaMoneyBillWave, FaUser, FaClock, FaInfoCircle } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

interface ViewDetailTransactionsModalProps {
  open: boolean;
  record: Transaction;
  onCancel: () => void;
}

const ViewDetailTransactionsModal = ({ open, record, onCancel }: ViewDetailTransactionsModalProps) => {
  const getStatusTag = (status: Transaction["status"]) => {
    const statusConfig = {
      Success: { color: "green", text: "Success" },
      Pending: { color: "orange", text: "Pending" },
      Failed: { color: "red", text: "Failed" },
    };
    const config = statusConfig[status] || statusConfig.Pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getAmountDisplay = () => (
    <span
      className={`text-lg font-semibold ${
        record.status === "Pending" ? "text-orange-500" : record.type === "Deposit" ? "text-green-500" : "text-red-500"
      }`}
    >
      {record.type === "Deposit" ? "+" : "-"}
      {record.amount?.toLocaleString("vi-VN")}
      <CoinIcon className="inline size-4 ms-1 mb-1" />
    </span>
  );

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg">
          <FaInfoCircle className="text-blue-500" />
          <span>Transaction Details</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <div className="mt-4 space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <FaMoneyBillWave className="text-lg text-blue-500" />
            <h3 className="text-lg font-semibold">Transaction Information</h3>
          </div>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Transaction ID">
              <span className="font-mono text-blue-500">TS-{record.orderCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Order Code">
              <span className="font-mono text-blue-500">ORD-{record.orderCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Amount">{getAmountDisplay()}</Descriptions.Item>
            <Descriptions.Item label="Status">{getStatusTag(record.status)}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <MdPayment className="text-lg text-green-500" />
            <h3 className="text-lg font-semibold">Payment Details</h3>
          </div>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Type">{getReadableTransactionType(record.type)}</Descriptions.Item>
            <Descriptions.Item label="Payment Method">{record.paymentMethod}</Descriptions.Item>
            <Descriptions.Item label="Description">{record.description || "No description provided"}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <FaUser className="text-lg text-purple-500" />
            <h3 className="text-lg font-semibold">Receiver User Information</h3>
          </div>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="User">{record.user?.userName || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Email">{record.user?.email || "N/A"}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <FaUser className="text-lg text-purple-500" />
            <h3 className="text-lg font-semibold">Purchase User Information</h3>
          </div>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="User">{record.purchaseUser?.userName || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Email">{record.purchaseUser?.email || "N/A"}</Descriptions.Item>
          </Descriptions>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <FaClock className="text-lg text-orange-500" />
            <h3 className="text-lg font-semibold">Time Information</h3>
          </div>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Created At">{formatDateTime(new Date(record.createdAt))}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default ViewDetailTransactionsModal;
