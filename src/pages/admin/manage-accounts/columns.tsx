import { Tag, Avatar, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { User } from "@/types/user";
import ActionMenu from "./action-menu";
import { FaUser, FaCrown, FaCode, FaUserEdit, FaUsers } from "react-icons/fa";

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

const getRoleIcon = (roleName: string) => {
  switch (roleName) {
    case "Admin":
      return <FaCrown />;
    case "Developer":
      return <FaCode />;
    case "Moderator":
      return <FaUserEdit />;
    case "Player":
      return <FaUsers />;
    default:
      return <FaUser />;
  }
};

const columns: ColumnsType<User> = [
  {
    title: "User",
    dataIndex: "fullName",
    key: "fullName",
    render: (text: string | undefined, record: User) => {
      const displayName = text || record.userName;
      const hasFullName = Boolean(text);

      return (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatar} icon={<FaUser />} size={40} className="shadow-sm" />
          <div>
            <div className="font-medium text-gray-900">
              {displayName}
              {!hasFullName && (
                <Tooltip title="No full name provided">
                  <span className="text-gray-400 text-xs ml-1">(username)</span>
                </Tooltip>
              )}
            </div>
            <div className="text-sm text-gray-500">@{record.userName}</div>
          </div>
        </div>
      );
    },
    width: 280,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email: string, record: User) => (
      <div>
        <div className="text-sm">{email}</div>
        <Tag color={record.emailConfirmed ? "green" : "orange"} className="mt-1 text-xs">
          {record.emailConfirmed ? "Verified" : "Unverified"}
        </Tag>
      </div>
    ),
  },
  {
    title: "Role",
    dataIndex: ["role", "name"],
    key: "role",
    render: (role: string) => (
      <Tag
        color={getRoleColor(role)}
        className="inline-flex items-center gap-2 font-medium text-sm px-3 py-2 rounded-full border-0"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          minHeight: '32px'
        }}
      >
        <span className="flex items-center justify-center w-4 h-4">
          {getRoleIcon(role)}
        </span>
        <span>{role}</span>
      </Tag>
    ),
    width: 120,
  },
  {
    title: "Status",
    dataIndex: "isActive",
    key: "isActive",
    render: (isActive: boolean, record: User) => (
      <div className="space-y-1">
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
        {record.twoFactorEnabled && (
          <Tag color="purple" className="text-xs">
            2FA
          </Tag>
        )}
      </div>
    ),
  },
    {
    title: "Account Status",
    dataIndex: "isActive",
    key: "isActive",
    render: (isActive: boolean, record: User) => (
      <div className="space-y-1">
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
        {record.twoFactorEnabled && (
          <Tag color="purple" className="text-xs">
            2FA
          </Tag>
        )}
      </div>
    ),
  },
  {
    title: "Joined Date",
    dataIndex: "joinedDate",
    key: "joinedDate",
    render: (date: string) => (
      <div className="text-sm text-gray-600">
        {new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
  },
  {
    title: "Last Login",
    dataIndex: "lastLogin",
    key: "lastLogin",
    render: (date: string) => (
      <div className="text-sm text-gray-600">
        {date
          ? new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Never"}
      </div>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record: User) => <ActionMenu record={record} />,
    width: 80,
  },
];

export default columns;