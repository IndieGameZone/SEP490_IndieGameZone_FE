import { formatCurrencyVND } from "@/lib/currency";
import { Game, GameCensorStatus } from "@/types/game";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { Image, Rate, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import ActionMenu from "./action-menu";
import { CategoryTag, ModerationStatusTag } from "@/components/status-tags";
import { Link } from "react-router-dom";

const { Text, Title } = Typography;

const columns: ColumnsType<Game> = [
  {
    title: "Game Info",
    key: "gameInfo",
    render: (_, record: Game) => (
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1 items-center">
          <Image
            src={record.coverImage}
            alt={record.name}
            width={80}
            height={60}
            className="rounded-lg object-cover shadow-sm"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FuCCSlkwkGCM7sLOzgUJSFthFdm/ZjaNkdXa3aBwmY+g3rBp7hl51T0+n6s39nmAk1C"
          />
          <CategoryTag category={record.category} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/admin/game/${record.id}`}>
              <Title level={5} className="!mb-0 truncate" title={record.name}>
                {record.name}
              </Title>
            </Link>
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <Text
              type="secondary"
              className="truncate"
              title={record.shortDescription}
            >
              {record.shortDescription || "No description available"}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Rate
              disabled
              defaultValue={record.averageRating || 0}
              className="text-xs"
            />
            <Text type="secondary" className="text-xs">
              {(record.averageRating || 0).toFixed(1)} (
              {record.numberOfReviews || 0} reviews)
            </Text>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {(record.gameTags || []).slice(0, 3).map((gameTag, index) => (
              <Tag key={gameTag?.tag?.id || index} className="text-xs">
                {gameTag?.tag?.name || "Unknown"}
              </Tag>
            ))}
            {(record.gameTags || []).length > 3 && (
              <Tag className="text-xs">
                +{(record.gameTags || []).length - 3} more
              </Tag>
            )}
          </div>
        </div>
      </div>
    ),
    width: 400,
  },
  {
    title: "Price",
    key: "price",
    render: (_, record: Game) => (
      <div className="">
        {record.price == 0 ? (
          <div className="text-lg font-bold text-green-600">Free</div>
        ) : (record.discount || 0) > 0 ? (
          <div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrencyVND(record.priceAfterDiscount ?? 0)}
            </div>
            <div className="text-sm text-gray-500 line-through">
              {formatCurrencyVND(record.price ?? 0)}
            </div>
            <Tag color="red">{record.discount}% OFF</Tag>
          </div>
        ) : (
          <div className="text-lg font-bold text-gray-900">
            {formatCurrencyVND(record.price ?? 0)}
          </div>
        )}
      </div>
    ),
    sorter: (a, b) => (a.priceAfterDiscount || 0) - (b.priceAfterDiscount || 0),
  },
  {
    title: "Status",
    dataIndex: "censorStatus",
    key: "censorStatus",
    render: (status: GameCensorStatus) => (
      <ModerationStatusTag status={status} />
    ),
    filters: [
      { text: "Approved", value: "Approved" },
      { text: "Pending Manual Review", value: "PendingManualReview" },
      { text: "Pending AI Review", value: "PendingAiReview" },
      { text: "Rejected", value: "Rejected" },
    ],
    onFilter: (value, record) => record.censorStatus === value,
  },
  {
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => (
      <div className="text-sm text-gray-600">
        <div className="flex items-center gap-1 mb-1">
          <CalendarOutlined className="text-xs" />
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    ),
    sorter: (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  },
  {
    title: "Updated",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (date: string | null) => (
      <div className="text-sm text-gray-600">
        {date
          ? new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </div>
    ),
    sorter: (a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateA - dateB;
    },
  },
  {
    title: "Censor Date",
    dataIndex: "censoredAt",
    key: "censoredAt",
    render: (date: string | null) => (
      <div className="text-sm text-gray-600">
        {date
          ? new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "-"}
      </div>
    ),
  },
  {
    title: "Approve By",
    dataIndex: "censorBy",
    key: "censorBy",
    render: (censorBy: string | null) => (
      <div className="text-sm text-gray-600">
        {censorBy ? (
          <div className="flex items-center gap-1">
            <UserOutlined className="text-xs" />
            {censorBy}
          </div>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record: Game) => <ActionMenu record={record} />,
    width: 80,
    fixed: "right",
  },
];

export default columns;
