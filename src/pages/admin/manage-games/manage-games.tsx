import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Tag, Input, Card, Dropdown, Modal, message, Space, Image, Rate, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Text, Title } = Typography;

interface Game {
  id: string;
  title: string;
  developer: string;
  coverImage: string;
  price: number;
  discountPrice?: number;
  status: "approved" | "pending" | "rejected";
  rating: number;
  totalRatings: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  censorDate?: string;
  approvedBy?: string;
  description: string;
}

const mockGames: Game[] = [
  {
    id: "1",
    title: "Epic Adventure Quest",
    developer: "GameStudio Pro",
    coverImage: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=200&fit=crop",
    price: 59.99,
    discountPrice: 39.99,
    status: "approved",
    rating: 4.5,
    totalRatings: 1250,
    category: "Action",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-20T14:30:00Z",
    censorDate: "2024-02-01T09:00:00Z",
    approvedBy: "Admin John",
    description: "An epic adventure game with stunning graphics",
  },
  {
    id: "2",
    title: "Cyber Racing 2077",
    developer: "Future Games",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop",
    price: 49.99,
    status: "pending",
    rating: 4.2,
    totalRatings: 890,
    category: "Racing",
    createdAt: "2024-02-10T15:30:00Z",
    updatedAt: "2024-03-18T11:20:00Z",
    description: "Futuristic racing in a cyberpunk world",
  },
  {
    id: "3",
    title: "Mystic Legends",
    developer: "Indie Creator",
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop",
    price: 29.99,
    discountPrice: 19.99,
    status: "approved",
    rating: 4.8,
    totalRatings: 2100,
    category: "RPG",
    createdAt: "2024-01-05T08:15:00Z",
    updatedAt: "2024-03-15T16:45:00Z",
    censorDate: "2024-01-20T10:30:00Z",
    approvedBy: "Admin Sarah",
    description: "A magical RPG adventure with deep storyline",
  },
];

const ManageGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleEdit = (game: Game) => {
    message.info(`Edit game: ${game.title}`);
  };

  const handleDelete = (game: Game) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you want to delete game "${game.title}"?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setGames(games.filter((g) => g.id !== game.id));
        message.success(`Game "${game.title}" deleted successfully`);
      },
    });
  };

  const handleView = (game: Game) => {
    navigate(`/admin/game-detail/${game.id}`);
  };

  const handleApprove = (game: Game) => {
    Modal.confirm({
      title: "Approve Game",
      content: `Do you want to approve game "${game.title}"?`,
      okText: "Approve",
      okType: "primary",
      cancelText: "Cancel",
      onOk() {
        setGames(
          games.map((g) =>
            g.id === game.id
              ? { ...g, status: "approved" as const, censorDate: new Date().toISOString(), approvedBy: "Current Admin" }
              : g
          )
        );
        message.success(`Game "${game.title}" approved successfully`);
      },
    });
  };

  const handleReject = (game: Game) => {
    Modal.confirm({
      title: "Reject Game",
      content: `Do you want to reject game "${game.title}"?`,
      okText: "Reject",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setGames(games.map((g) => (g.id === game.id ? { ...g, status: "rejected" as const } : g)));
        message.success(`Game "${game.title}" rejected`);
      },
    });
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      approved: { color: "green", text: "Approved" },
      pending: { color: "orange", text: "Pending Review" },
      rejected: { color: "red", text: "Rejected" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Tag color={config.color} className="font-medium">
        {config.text}
      </Tag>
    );
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      Action: "red",
      Racing: "blue",
      RPG: "purple",
      Strategy: "green",
      Puzzle: "orange",
      Adventure: "cyan",
    };
    return colors[category] || "default";
  };

  const columns: ColumnsType<Game> = [
    {
      title: "Game Info",
      key: "gameInfo",
      render: (_, record: Game) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={record.coverImage}
              alt={record.title}
              width={80}
              height={60}
              className="rounded-lg object-cover shadow-sm"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FuCCSlkwkGCM7sLOzgUJSFthFdm/ZjaNkdXa3aBwmY+g3rBp7hl51T0+n6s39nmAk1M"
            />
            <div className="absolute -top-1 -right-1">
              <Tag color={getCategoryColor(record.category)}>{record.category}</Tag>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Title level={5} className="!mb-0 truncate" title={record.title}>
                {record.title}
              </Title>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
              <UserOutlined className="text-xs" />
              <Text type="secondary">{record.developer}</Text>
            </div>
            <div className="flex items-center gap-2">
              <Rate disabled defaultValue={record.rating} className="text-xs" />
              <Text type="secondary" className="text-xs">
                {record.rating} ({record.totalRatings} reviews)
              </Text>
            </div>
          </div>
        </div>
      ),
      width: 320,
    },
    {
      title: "Price",
      key: "price",
      render: (_, record: Game) => (
        <div className="text-right">
          {record.discountPrice ? (
            <div>
              <div className="text-lg font-bold text-green-600">${record.discountPrice}</div>
              <div className="text-sm text-gray-500 line-through">${record.price}</div>
              <Tag color="red">{Math.round((1 - record.discountPrice / record.price) * 100)}% OFF</Tag>
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-900">${record.price}</div>
          )}
        </div>
      ),
      sorter: (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: "Approved", value: "approved" },
        { text: "Pending", value: "pending" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
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
      render: (date: string) => (
        <div className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: "Censor Date",
      dataIndex: "censorDate",
      key: "censorDate",
      render: (date?: string) => (
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
      title: "Approved By",
      dataIndex: "approvedBy",
      key: "approvedBy",
      render: (approver?: string) => (
        <Text type="secondary" className="text-sm">
          {approver || "-"}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Game) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "View Details",
                icon: <EyeOutlined />,
                onClick: () => handleView(record),
              },
              {
                key: "edit",
                label: "Edit Game",
                icon: <EditOutlined />,
                onClick: () => handleEdit(record),
              },
              ...(record.status === "pending"
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
      game.title.toLowerCase().includes(searchLower) ||
      game.developer.toLowerCase().includes(searchLower) ||
      game.category.toLowerCase().includes(searchLower)
    );
  });

  const totalApproved = games.filter((g) => g.status === "approved").length;
  const totalPending = games.filter((g) => g.status === "pending").length;
  const totalRejected = games.filter((g) => g.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                <Image src="/igz_ic.svg" alt="Game Management Icon" width={40} height={40} className="rounded-full" />
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
                  <div className="text-2xl font-bold">{filteredGames.length}</div>
                  <div className="">Total Games</div>
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
                  <div className="text-orange-500">Pending Moderator Approval</div>
                </div>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-purple-500">Approved by AI</div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="mb-6 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 max-w-lg">
                <Input
                  placeholder="Search games by title, developer, or category..."
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
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 h-11 px-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Add New Game
                </Button>
                <Button
                  size="large"
                  onClick={() => setLoading(true)}
                  loading={loading}
                  className="h-11 px-6 rounded-lg font-medium"
                >
                  Refresh
                </Button>
              </Space>
            </div>
          </Card>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <Table<Game>
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
              scroll={{ x: 1200 }}
              rowClassName="hover:bg-blue-50/50 transition-colors duration-150"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageGames;
