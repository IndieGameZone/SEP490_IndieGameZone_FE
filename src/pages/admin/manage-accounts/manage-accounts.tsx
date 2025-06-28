import React, { useState, useEffect } from "react";

import { Table, Button, Input, Card } from "antd";
import { User } from "@/types/user";

import {

  FaPlus,
  FaSearch,

} from "react-icons/fa";
import columns from "./columns";
import useUserStore from "@/store/use-user-store";

const ManageAccounts: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { fetchAllAccounts, loading, renderKey, rerender, users } = useUserStore();

  useEffect(() => {
    fetchAllAccounts();
  }, [renderKey]);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchText.toLowerCase();
    const fullName = user.fullname || "";
    const email = user.email || "";
    const userName = user.userName || "";

    return (
      fullName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      userName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Accounts</h1>
          <p className="text-gray-600">
            Total users: {filteredUsers.length} {searchText && `(filtered from ${users.length})`}
          </p>
        </div>

        <Card className="mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search users by name, email, or username..."
                prefix={<FaSearch className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
                size="large"
                allowClear
              />
            </div>
            <div className="flex gap-3">
              <Button type="primary" icon={<FaPlus />} size="large" className="bg-blue-600 hover:bg-blue-700">
                Add User
              </Button>
              <Button size="large" onClick={rerender} loading={loading}>
                Refresh
              </Button>
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <Table<User>
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            }}
            className="overflow-x-auto"
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>
    </div>
  );
};

export default ManageAccounts;
