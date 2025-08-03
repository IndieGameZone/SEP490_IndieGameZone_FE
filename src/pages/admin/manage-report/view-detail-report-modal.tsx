import { Modal } from "antd";
import { ReportItem } from "@/types/report";
import { formatDateTime } from "@/lib/date-n-time";

interface ViewDetailReportModalProps {
  open: boolean;
  record: ReportItem;
  onCancel: () => void;
}

const ViewDetailReportModal = ({ open, record, onCancel }: ViewDetailReportModalProps) => {
  return (
    <Modal
      title={<span className="text-lg font-semibold">Report Details</span>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <div className="mt-4 space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Basic Information:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Report ID:</span> {record.id}
            </div>
            <div>
              <span className="font-medium">Status:</span>{" "}
              <span className={`
                ${record.status === "Approved" ? "text-green-600" : ""}
                ${record.status === "Rejected" ? "text-red-600" : ""}
                ${record.status === "Pending" ? "text-yellow-600" : ""}
              `}>
                {record.status}
              </span>
            </div>
            <div>
              <span className="font-medium">Created Date:</span>{" "}
              {record.createdAt ? formatDateTime(new Date(record.createdAt)) : "N/A"}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {record.updatedAt ? formatDateTime(new Date(record.updatedAt)) : "N/A"}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Reporter Information:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Reporter:</span>{" "}
              {record.reportingUser?.userName || "N/A"}
            </div>
            <div>
              <span className="font-medium">Reported User:</span>{" "}
              {record.reportingUser?.userName || "N/A"}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-3">Report Content:</h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium">Report Type:</span>{" "}
              {record.reportReason?.type || "N/A"}
            </div>
            <div>
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                {record.message || "No description provided"}
              </p>
            </div>
          </div>
        </div>

        {record.status !== "Pending" && record.reviewMessage && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Review Information:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Review Message:</span>
                <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                  {record.reviewMessage}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewDetailReportModal;