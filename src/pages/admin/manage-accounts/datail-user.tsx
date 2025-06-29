import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Tag,
  Button,
  Descriptions,
  Space,
  message,
  Spin,
  Row,
  Col,
  Typography,
  Badge,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  BankOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
  CodeOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { User } from "@/types/user";
import { getUserById } from "@/lib/api/user-api";
import { FaBan } from "react-icons/fa";

const { Title, Text, Paragraph } = Typography;

const DetailUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (id) {
      fetchUserDetail(id);
    }
  }, [id]);

  const fetchUserDetail = async (userId: string) => {
    setLoading(true);
    try {
      const response = await getUserById(userId);
      if (response.success) {
        setUser(response.data);
      } else {
        messageApi.error(`Failed to fetch user details: ${response.error}`);
        navigate("/admin/manage-accounts");
      }
    } catch (error) {
      messageApi.error("An unexpected error occurred while fetching user details");
      navigate("/admin/manage-accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    messageApi.info(`Edit user: ${user?.fullname || user?.userName}`);
  };

  const handleDelete = () => {
    const displayName = user?.fullname || user?.userName;
    messageApi.info(`Delete user: ${displayName}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case "Admin":
        return <CrownOutlined />;
      case "Developer":
        return <CodeOutlined />;
      case "Moderator":
        return <UserSwitchOutlined />;
      case "Player":
        return <TeamOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case "Admin":
        return "gold";
      case "Developer":
        return "purple";
      case "Moderator":
        return "pink";
      case "Player":
        return "blue";
      default:
        return "default";
    }
  };

  const stripHtmlTags = (html: string) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const getAvatarUrl = (user: User) => {
    const avatarUrl = user.avatar;

    if (!avatarUrl || avatarUrl.trim() === "") {
      return null;
    }

    return avatarUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        {contextHolder}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/manage-accounts")}
          className="mb-4"
        >
          Back to Accounts
        </Button>
        <Card>
          <div className="text-center py-8">
            <Text type="secondary">User not found</Text>
          </div>
        </Card>
      </div>
    );
  }

  const shouldShowBankingInfo =
    user.role.name === "Developer" || user.bankName || user.bankAccount;
  const avatarUrl = getAvatarUrl(user);
  const cleanBio = stripHtmlTags(user.bio || "");

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/manage-accounts")}
            className="mb-4 shadow-sm"
            size="large"
          >
            Back to Accounts
          </Button>
          <Title level={2} className="mb-0 text-gray-800">
            User Profile Details
          </Title>
        </div>

        <Card className="mb-6 shadow-lg border-0 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 -mx-6 -mt-6 mb-6"></div>
          <div className="flex flex-col md:flex-row items-start gap-6 -mt-20">
            <div className="flex flex-col items-center">
              <Avatar
                src={avatarUrl}
                icon={<UserOutlined />}
                size={140}
                className="shadow-2xl border-4 border-white mb-4"
              />
              <Space direction="vertical" className="text-center" size="small">
                <Badge
                  status={user.isActive ? "success" : "error"}
                  text={
                    <span className="font-medium">
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  }
                />
                {user.twoFactorEnabled && (
                  <Tag
                    color="purple"
                    icon={<SafetyOutlined />}
                    className="rounded-full"
                  >
                    2FA Secured
                  </Tag>
                )}
              </Space>
            </div>

            <div className="flex-1 mt-16 md:mt-0">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <div className="mt-4">
                  <Title level={2} className=" text-gray-800">
                    {user.fullname || user.userName}
                  </Title>
                  <Text type="secondary" className="text-xl font-medium">
                    @{user.userName}
                  </Text>
                  <div className="mt-1">
                    <Tag
                      color={getRoleColor(user.role.name)}
                      icon={getRoleIcon(user.role.name)}
                      className="font-medium text-sm px-3 py-1 rounded-full"
                    >
                      {user.role.name}
                    </Tag>
                  </div>
                </div>
                <Space size="middle" className="mt-4 md:mt-0">
                  <Button
                    type="primary"
                    icon={<FaBan />}
                    onClick={handleEdit}
                    size="large"
                    className="rounded-lg shadow-sm"
                  >
                    Ban Account
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                    size="large"
                    className="rounded-lg shadow-sm"
                  >
                    Delete
                  </Button>
                </Space>
              </div>

              {cleanBio && (
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <Text
                    strong
                    className="text-gray-600 text-sm uppercase tracking-wide"
                  >
                    About
                  </Text>
                  <Paragraph className="mt-2 mb-0 text-gray-700 leading-relaxed">
                    {cleanBio}
                  </Paragraph>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span className="text-lg font-semibold text-gray-800">
                  <MailOutlined className="mr-2 text-blue-500" />
                  Contact Information
                </span>
              }
              className="shadow-lg border-0 rounded-xl h-full"
            >
              <Descriptions
                column={1}
                size="middle"
                className="custom-descriptions"
              >
                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      <MailOutlined className="mr-2" />
                      Email Address
                    </span>
                  }
                >
                  <div className="flex items-center gap-3">
                    <Text className="text-gray-800">{user.email}</Text>
                    {user.emailConfirmed ? (
                      <Tooltip title="Email verified">
                        <CheckCircleOutlined className="text-green-500 text-lg" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Email not verified">
                        <CloseCircleOutlined className="text-red-500 text-lg" />
                      </Tooltip>
                    )}
                  </div>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      <PhoneOutlined className="mr-2" />
                      Phone Number
                    </span>
                  }
                >
                  <div className="flex items-center gap-3">
                    <Text className="text-gray-800">
                      {user.phoneNumber || (
                        <Text type="secondary">Not provided</Text>
                      )}
                    </Text>
                    {user.phoneNumber &&
                      (user.phoneNumberConfirmed ? (
                        <Tooltip title="Phone verified">
                          <CheckCircleOutlined className="text-green-500 text-lg" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Phone not verified">
                          <CloseCircleOutlined className="text-red-500 text-lg" />
                        </Tooltip>
                      ))}
                  </div>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      <CalendarOutlined className="mr-2" />
                      Date of Birth
                    </span>
                  }
                >
                  <Text className="text-gray-800">
                    {user.birthday ? (
                      new Date(user.birthday).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      <Text type="secondary">Not provided</Text>
                    )}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      <FacebookOutlined className="mr-2" />
                      Facebook Profile
                    </span>
                  }
                >
                  {user.facebookLink ? (
                    <a
                      href={user.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Facebook Profile
                    </a>
                  ) : (
                    <Text type="secondary">Not connected</Text>
                  )}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      <YoutubeOutlined className="mr-2" />
                      YouTube Channel
                    </span>
                  }
                >
                  {user.youtubeChannelLink ? (
                    <a
                      href={user.youtubeChannelLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      View YouTube Channel
                    </a>
                  ) : (
                    <Text type="secondary">Not connected</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <span className="text-lg font-semibold text-gray-800">
                  <SafetyOutlined className="mr-2 text-green-500" />
                  Account Security
                </span>
              }
              className="shadow-lg border-0 rounded-xl h-full"
            >
              <Descriptions column={1} size="middle">
                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Role & Permissions
                    </span>
                  }
                >
                  <Tag
                    color={getRoleColor(user?.role?.name)}
                    icon={getRoleIcon(user?.role?.name)}
                    className="font-medium px-3 py-1 rounded-full"
                  >
                    {user?.role?.name || "No Role"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Account Status
                    </span>
                  }
                >
                  <Tag
                    color={user.isActive ? "success" : "error"}
                    className="font-medium px-3 py-1 rounded-full"
                  >
                    {user.isActive ? "Active" : "Suspended"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Two-Factor Authentication
                    </span>
                  }
                >
                  <Tag
                    color={user.twoFactorEnabled ? "success" : "warning"}
                    className="font-medium px-3 py-1 rounded-full"
                  >
                    {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Account Lockout
                    </span>
                  }
                >
                  <Tag
                    color={user.lockoutEnabled ? "processing" : "default"}
                    className="font-medium px-3 py-1 rounded-full"
                  >
                    {user.lockoutEnabled ? "Protected" : "Standard"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Member Since
                    </span>
                  }
                >
                  <Text className="text-gray-800 font-medium">
                    {formatDate(user.joinedDate)}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span className="font-medium text-gray-600">
                      Last Activity
                    </span>
                  }
                >
                  <Text className="text-gray-800 font-medium">
                    {user.lastLogin
                      ? formatDate(user.lastLogin)
                      : "Never logged in"}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {shouldShowBankingInfo && (
            <Col xs={24}>
              <Card
                title={
                  <span className="text-lg font-semibold text-gray-800">
                    <BankOutlined className="mr-2 text-green-600" />
                    Banking & Payment Information
                    {user.role.name === "Developer" && (
                      <Tag color="purple" className="ml-2">
                        Developer Account
                      </Tag>
                    )}
                  </span>
                }
                className="shadow-lg border-0 rounded-xl"
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24} md={12}>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Text
                        strong
                        className="text-gray-600 text-sm uppercase tracking-wide block mb-2"
                      >
                        Bank Name
                      </Text>
                      <Text className="text-gray-800 text-lg">
                        {user.bankName || (
                          <Text type="secondary">Not provided</Text>
                        )}
                      </Text>
                    </div>
                  </Col>

                  <Col xs={24} md={12}>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Text
                        strong
                        className="text-gray-600 text-sm uppercase tracking-wide block mb-2"
                      >
                        Account Number
                      </Text>
                      <Text className="text-gray-800 text-lg font-mono">
                        {user.bankAccount || (
                          <Text type="secondary">Not provided</Text>
                        )}
                      </Text>
                    </div>
                  </Col>

                  {user.role.name === "Developer" && (
                    <Col xs={24}>
                      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                        <Text className="text-purple-700">
                          <SafetyOutlined className="mr-2" />
                          This user has Developer privileges and access to
                          payment processing features.
                        </Text>
                      </div>
                    </Col>
                  )}
                </Row>
              </Card>
            </Col>
          )}
        </Row>
      </div>

      <style>{`
        .custom-descriptions .ant-descriptions-item-label {
          width: 140px;
        }
        .custom-descriptions .ant-descriptions-item-content {
          padding-left: 16px;
        }
      `}</style>
    </div>
  );
};

export default DetailUser;
