import { Avatar, Modal, Tag } from "antd";
import { ReportItem } from "@/types/report";
import { formatDateTime } from "@/lib/date-n-time";
import TiptapView from "@/components/tiptap/tiptap-view";

interface ViewDetailReportModalProps {
  open: boolean;
  record: ReportItem;
  onCancel: () => void;
}
function shortenText(text: string, maxLength = 100) {
  const plainText = text.replace(/<[^>]+>/g, "");
  return plainText.length > maxLength ? plainText.slice(0, maxLength) + "..." : plainText;
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
        <div className="bg-zinc-800 border border-zinc-600 p-4 rounded-lg">
          <h4 className="font-bold mb-3 text-orange-400">Report Information:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-zinc-400">Report Reason:</span> {record.reportReason?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium text-zinc-400">Report type:</span> {record.reportReason?.type || "N/A"}
            </div>
            <div>
              <span className="font-medium text-zinc-400">Report Message:</span> {record.message || "N/A"}
            </div>
            <div>
              <span className="font-medium text-zinc-400">Game Name:</span> {record.game?.name || "N/A"}
            </div>

            <div>
              <span className="font-medium text-zinc-400">Status:</span>{" "}
              <Tag
                color={
                  record.status === "Approved"
                    ? "green"
                    : record.status === "Rejected"
                    ? "red"
                    : record.status === "Pending"
                    ? "gold"
                    : "default"
                }
              >
                {record.status}
              </Tag>
            </div>
            <div>
              <span className="font-medium text-zinc-400">Created Date:</span>{" "}
              {record.createdAt ? formatDateTime(new Date(record.createdAt)) : "N/A"}
            </div>
          </div>
        </div>
        {record.post && (
          <div className="bg-zinc-800 border border-zinc-600 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-zinc-400">Post Title:</span> {record.post.title || "N/A"}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-400">Post content:</span>
                <div>{record.post?.content ? <TiptapView value={shortenText(record.post.content, 20)} /> : "N/A"}</div>
              </div>

              <div>
                <span className="font-medium text-zinc-400">Post Owner:</span> {record.post.user?.userName || "N/A"}
              </div>
              <div>
                <span className="font-medium text-zinc-400">Post Owner Email:</span> {record.post.user?.email || "N/A"}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-400">Post Owner Avatar:</span>{" "}
                {record.post.user?.avatar ? <Avatar src={record.post.user.avatar} /> : <Avatar>N/A</Avatar>}
              </div>
              <div>
                <span className="font-medium text-zinc-400">Post Create At:</span>{" "}
                {formatDateTime(new Date(record.post.createdAt)) || "N/A"}
              </div>
            </div>
          </div>
        )}
        {record.postComment && (
          <div className="bg-zinc-800 border border-zinc-600 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-zinc-400">Comment Content:</span>{" "}
                {record.postComment.content || "N/A"}
              </div>

              <div>
                <span className="font-medium text-zinc-400">Comment Owner User Name:</span>{" "}
                {record.postComment.user?.userName || "N/A"}
              </div>
              <div>
                <span className="font-medium text-zinc-400">Comment Owner Email:</span>{" "}
                {record.postComment.user?.email || "N/A"}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-zinc-400">Comment Owner Avatar:</span>{" "}
                {record.postComment.user?.avatar ? (
                  <Avatar src={record.postComment.user.avatar} />
                ) : (
                  <Avatar>N/A</Avatar>
                )}
              </div>
              <div>
                <span className="font-medium text-zinc-400">Comment Create At:</span>{" "}
                {formatDateTime(new Date(record.postComment.createdAt)) || "N/A"}
              </div>
            </div>
          </div>
        )}
        <div className="bg-zinc-800 border border-zinc-600 p-4 rounded-lg">
          <h4 className="font-medium text-orange-400 mb-3">Reporter Information:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-zinc-400">Reporter User Name:</span>{" "}
              {record.reportingUser?.userName || "N/A"}
            </div>
            <div>
              <span className="font-medium text-zinc-400">Reporter User Email:</span>{" "}
              {record.reportingUser?.email || "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-400">Reporter User Avatar:</span>{" "}
              {record.reportingUser?.avatar ? <Avatar src={record.reportingUser.avatar} /> : <Avatar>N/A</Avatar>}
            </div>
          </div>
        </div>
        <div className="bg-zinc-800 border border-zinc-600 p-4 rounded-lg">
          <h4 className="font-medium text-orange-400  mb-3">Report Reply:</h4>
          <div className="grid grid-cols-2 gap-4  text-sm">
            <div>
              <span className="font-medium">Report Response:</span> {record.reviewMessage || "N/A"}
            </div>
            <div>
              <span className="font-medium text-zinc-400">Handle At:</span>{" "}
              {record.updatedAt ? formatDateTime(new Date(record.updatedAt)) : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewDetailReportModal;
