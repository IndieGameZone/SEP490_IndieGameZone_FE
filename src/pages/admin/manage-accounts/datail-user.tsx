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
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  BankOutlined,
  FacebookOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { User } from "@/types/user";
import { getUserById } from "@/lib/api/user-api";

const { Title, Text } = Typography;

const DetailUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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
        message.error(`Failed to fetch user details: ${response.error}`);
        navigate("/admin/manage-accounts");
      }
    } catch (error) {
      message.error("An unexpected error occurred while fetching user details");
      console.error("Fetch user detail error:", error);
      navigate("/admin/manage-accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    message.info(`Edit user: ${user?.fullname || user?.userName}`);
  };

  const handleDelete = () => {
    const displayName = user?.fullname || user?.userName;
    message.info(`Delete user: ${displayName}`);
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
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/manage-accounts")} className="mb-4">
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/manage-accounts")} className="mb-4">
            Back to Accounts
          </Button>
          <Title level={2} className="mb-0">
            User Details
          </Title>
        </div>

        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-center">
              <Avatar src={user.avatar} icon={<UserOutlined />} size={120} className="shadow-lg mb-4" />
              <Space direction="vertical" className="text-center">
                <Badge status={user.isActive ? "success" : "error"} text={user.isActive ? "Active" : "Inactive"} />
                {user.twoFactorEnabled && (
                  <Tag color="purple" icon={<SafetyOutlined />}>
                    2FA Enabled
                  </Tag>
                )}
              </Space>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <Title level={3} className="mb-1">
                    {user.fullname || user.userName}
                  </Title>
                  <Text type="secondary" className="text-lg">
                    @{user.userName}
                  </Text>
                  <div className="mt-2">
                    <Tag
                      color={
                        user.role.name === "Admin"
                          ? "gold"
                          : user.role.name === "Player"
                          ? "blue"
                          : user.role.name === "Moderator"
                          ? "pink"
                          : user.role.name === "Developer"
                          ? "purple"
                          : "default"
                      }
                      className="font-medium"
                    >
                      {user.role.name}
                    </Tag>
                  </div>
                </div>
                <Space>
                  <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                    Edit User
                  </Button>
                  <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                    Delete
                  </Button>
                </Space>
              </div>

              {user.bio && (
                <div className="mb-4">
                  <Text>{user.bio}</Text>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Contact Information" className="shadow-sm">
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <span>
                      <MailOutlined className="mr-2" />
                      Email
                    </span>
                  }
                >
                  <div className="flex items-center gap-2">
                    <Text>{user.email}</Text>
                    {user.emailConfirmed ? (
                      <Tooltip title="Email verified">
                        <CheckCircleOutlined className="text-green-500" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Email not verified">
                        <CloseCircleOutlined className="text-red-500" />
                      </Tooltip>
                    )}
                  </div>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <PhoneOutlined className="mr-2" />
                      Phone
                    </span>
                  }
                >
                  <div className="flex items-center gap-2">
                    <Text>{user.phoneNumber || "Not provided"}</Text>
                    {user.phoneNumber &&
                      (user.phoneNumberConfirmed ? (
                        <Tooltip title="Phone verified">
                          <CheckCircleOutlined className="text-green-500" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Phone not verified">
                          <CloseCircleOutlined className="text-red-500" />
                        </Tooltip>
                      ))}
                  </div>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <CalendarOutlined className="mr-2" />
                      Birthday
                    </span>
                  }
                >
                  <Text>
                    {user.birthday
                      ? new Date(user.birthday).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not provided"}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <FacebookOutlined className="mr-2" />
                      Facebook
                    </span>
                  }
                >
                  {user.facebookLink ? (
                    <a
                      href={user.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </a>
                  ) : (
                    <Text type="secondary">Not provided</Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Account Information" className="shadow-sm">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="User ID">
                  <Text code>{user.id}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag
                    color={
                      user?.role?.name === "Admin"
                        ? "gold"
                        : user?.role?.name === "Player"
                        ? "blue"
                        : user?.role?.name === "Moderator"
                        ? "pink"
                        : user?.role?.name === "Developer"
                        ? "purple"
                        : "default"
                    }
                  >
                    {user?.role?.name || "No Role"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag color={user.isActive ? "green" : "red"}>{user.isActive ? "Active" : "Inactive"}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Two-Factor Auth">
                  <Tag color={user.twoFactorEnabled ? "green" : "red"}>
                    {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Lockout Enabled">
                  <Tag color={user.lockoutEnabled ? "green" : "red"}>{user.lockoutEnabled ? "Yes" : "No"}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Joined Date">
                  <Text>{formatDate(user.joinedDate)}</Text>
                </Descriptions.Item>

                <Descriptions.Item label="Last Login">
                  <Text>{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {(user.bankName || user.bankAccount) && (
            <Col xs={24}>
              <Card
                title={
                  <span>
                    <BankOutlined className="mr-2" />
                    Banking Information
                  </span>
                }
                className="shadow-sm"
              >
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Bank Name">
                    <Text>{user.bankName || "Not provided"}</Text>
                  </Descriptions.Item>

                  <Descriptions.Item label="Account Number">
                    <Text>{user.bankAccount || "Not provided"}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default DetailUser;
