import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Tag, Input, Card, Dropdown, Modal, message, Space, Image, Rate, Typography, Spin } from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getAllGamesAdmin } from "@/lib/api/game-api";

const { Text, Title } = Typography;

interface GameListItem {
  id: string;
  name: string;
  coverImage: string;
  price: number;
  priceAfterDiscount: number;
  shortDescription: string;
  censorStatus: "Approved" | "Rejected" | "PendingAiReview" | "PendingManualReview";
  createdAt: string;
  censoredAt: string | null;
  updatedAt: string | null;
  averageRating: number;
  numberOfReviews: number;
  discount: number;
  gameTags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
  category: {
    id: string;
    name: string;
  };
}

const ManageGames: React.FC = () => {
  const [games, setGames] = useState<GameListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await getAllGamesAdmin();

      if (response.success && response.data) {
        setGames(response.data);
      } else {
        message.error(response.error || "Failed to fetch games");
      }
    } catch (error) {
      console.error("Error fetching games:", error);
      message.error("An error occurred while fetching games");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (game: GameListItem) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you want to delete game "${game.name}"?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setGames(games.filter((g) => g.id !== game.id));
        message.success(`Game "${game.name}" deleted successfully`);
      },
    });
  };

  const handleView = (game: GameListItem) => {
    navigate(`/admin/game-detail/${game.id}`);
  };

  const handleApprove = (game: GameListItem) => {
    Modal.confirm({
      title: "Approve Game",
      content: `Do you want to approve game "${game.name}"?`,
      okText: "Approve",
      okType: "primary",
      cancelText: "Cancel",
      onOk() {
        setGames(
          games.map((g) =>
            g.id === game.id ? { ...g, censorStatus: "Approved" as const, censoredAt: new Date().toISOString() } : g
          )
        );
        message.success(`Game "${game.name}" approved successfully`);
      },
    });
  };

  const handleReject = (game: GameListItem) => {
    Modal.confirm({
      title: "Reject Game",
      content: `Do you want to reject game "${game.name}"?`,
      okText: "Reject",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setGames(games.map((g) => (g.id === game.id ? { ...g, censorStatus: "Rejected" as const } : g)));
        message.success(`Game "${game.name}" rejected`);
      },
    });
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      Approved: { color: "green", text: "Approved" },
      PendingManualReview: { color: "orange", text: "Pending Review" },
      PendingAiReview: { color: "blue", text: "Pending AI Review" },
      Rejected: { color: "red", text: "Rejected" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PendingManualReview;
    return (
      <Tag color={config.color} className="font-medium">
        {config.text}
      </Tag>
    );
  };

  const getCategoryColor = (() => {
    const antdTagColors = [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
    ];

    const colors: { [key: string]: string } = {};

    const getRandomAntdColor = (): string => {
      const randomIndex = Math.floor(Math.random() * antdTagColors.length);
      return antdTagColors[randomIndex];
    };

    return (category: string): string => {
      if (colors[category]) {
        return colors[category];
      }
      const newColor = getRandomAntdColor();
      colors[category] = newColor;
      return newColor;
    };
  })();

  const formatPrice = (price: number): string => {
    return price.toLocaleString("vi-VN") + " VND";
  };

  const columns: ColumnsType<GameListItem> = [
    {
      title: "Game Info",
      key: "gameInfo",
      render: (_, record: GameListItem) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={record.coverImage}
              alt={record.name}
              width={80}
              height={60}
              className="rounded-lg object-cover shadow-sm"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FuCCSlkwkGCM7sLOzgUJSFthFdm/ZjaNkdXa3aBwmY+g3rBp7hl51T0+n6s39nmAk1C"
            />
            <div className="absolute -top-1 -right-1">
              <Tag color={getCategoryColor(record.category?.name || 'Unknown')}>{record.category?.name || 'Unknown'}</Tag>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Title level={5} className="!mb-0 truncate" title={record.name}>
                {record.name}
              </Title>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <Text type="secondary" className="truncate" title={record.shortDescription}>
                {record.shortDescription || "No description available"}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Rate disabled defaultValue={record.averageRating || 0} className="text-xs" />
              <Text type="secondary" className="text-xs">
                {(record.averageRating || 0).toFixed(1)} ({record.numberOfReviews || 0} reviews)
              </Text>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {(record.gameTags || []).slice(0, 3).map((gameTag, index) => (
                <Tag key={gameTag?.tag?.id || index} className="text-xs">
                  {gameTag?.tag?.name || 'Unknown'}
                </Tag>
              ))}
              {(record.gameTags || []).length > 3 && <Tag className="text-xs">+{(record.gameTags || []).length - 3} more</Tag>}
            </div>
          </div>
        </div>
      ),
      width: 400,
    },
    {
      title: "Price",
      key: "price",
      render: (_, record: GameListItem) => (
        <div className="text-right">
          {(record.discount || 0) > 0 ? (
            <div>
              <div className="text-lg font-bold text-green-600">{formatPrice(record.priceAfterDiscount || 0)}</div>
              <div className="text-sm text-gray-500 line-through">{formatPrice(record.price || 0)}</div>
              <Tag color="red">{record.discount}% OFF</Tag>
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-900">{formatPrice(record.price || 0)}</div>
          )}
        </div>
      ),
      sorter: (a, b) => (a.priceAfterDiscount || 0) - (b.priceAfterDiscount || 0),
    },
    {
      title: "Status",
      dataIndex: "censorStatus",
      key: "censorStatus",
      render: (status: string) => getStatusTag(status),
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
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
      render: (_, record: GameListItem) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                icon: <EyeOutlined />,
                onClick: () => handleView(record),
              },

              ...(record.censorStatus === "PendingManualReview" || record.censorStatus === "PendingAiReview"
                ? [
                    {
                      type: "divider" as const,
                    },
                    {
                      key: "approve",
                      label: "Approve",
                      icon: <CheckCircleOutlined className="text-green-500" />,
                      onClick: () => handleApprove(record),
                    },
                    {
                      key: "reject",
                      label: "Reject",
                      icon: <CloseCircleOutlined className="text-red-500" />,
                      onClick: () => handleReject(record),
                    },
                  ]
                : []),
              {
                type: "divider" as const,
              },
              {
                key: "delete",
                label: "Delete Game",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDelete(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
      width: 80,
      fixed: "right",
    },
  ];

  const filteredGames = games.filter((game) => {
    const searchLower = searchText.toLowerCase();
    return (
      (game.name || "").toLowerCase().includes(searchLower) ||
      (game.shortDescription || "").toLowerCase().includes(searchLower) ||
      (game.category?.name || "").toLowerCase().includes(searchLower) ||
      (game.gameTags || []).some((gameTag) => (gameTag?.tag?.name || '').toLowerCase().includes(searchLower))
    );
  });

  const totalApproved = games.filter((g) => g.censorStatus === "Approved").length;
  const totalPending = games.filter(
    (g) => g.censorStatus === "PendingManualReview" || g.censorStatus === "PendingAiReview"
  ).length;
  const totalRejected = games.filter((g) => g.censorStatus === "Rejected").length;
  const totalPendingAI = games.filter((g) => g.censorStatus === "PendingAiReview").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div>
                <img src="/igz_ic.svg" width={50} />
              </div>
              <div>
                <Title
                  level={2}
                  className="!mb-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Game Management
                </Title>
                <Text type="secondary" className="text-base">
                  Manage and moderate games in platform
                </Text>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">{games.length}</div>
                  <div className="text-blue-500">Total Games</div>
                </div>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalApproved}</div>
                  <div className="text-green-500">Approved</div>
                </div>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-red-500 to-red-600 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalRejected}</div>
                  <div className="text-red-500">Rejected</div>
                </div>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalPending}</div>
                  <div className="text-orange-500">Pending Manual Review</div>
                </div>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalPendingAI}</div>
                  <div className="text-purple-500">Pending AI Review</div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="mb-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 max-w-lg">
                <Input
                  placeholder="Search games by name, description, category, or tags..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full h-11 rounded-lg border-gray-200"
                  size="large"
                  allowClear
                />
              </div>
              <Space>
                <Button
                  size="large"
                  onClick={fetchGames}
                  loading={loading}
                  className="h-11 px-6 rounded-lg font-medium"
                >
                  Refresh
                </Button>
              </Space>
            </div>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <Table<GameListItem>
              columns={columns}
              dataSource={filteredGames}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} games${searchText ? ` (filtered from ${games.length})` : ""}`,
                className: "px-4 py-4",
              }}
              className="overflow-x-auto"
              scroll={{ x: 1400 }}
              rowClassName="hover:bg-blue-50/50 transition-colors duration-150"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageGames;