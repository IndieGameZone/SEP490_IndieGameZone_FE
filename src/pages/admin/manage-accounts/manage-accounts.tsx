import React, { useState, useEffect } from "react";

import { Table, Button, Input, Card } from "antd";
import { User } from "@/types/user";

import { FaPlus, FaSearch } from "react-icons/fa";
import columns from "./columns";
import useUserStore from "@/store/use-user-store";
import AddUserModal from "./add-user-modal";
import { useFilters } from "@/hooks/use-filters";
import { FaArrowRotateLeft } from "react-icons/fa6";

type AccountFilters = {
  page: number;
  pageSize: number;
};

const ManageAccounts: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { fetchAllAccounts, loading, renderKey, rerender, users, pagination } =
    useUserStore();
  const { filters, setFilters } = useFilters<AccountFilters>({
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchAllAccounts({ PageNumber: filters.page, PageSize: filters.pageSize });
  }, [renderKey, filters.page, filters.pageSize]);

  const filteredUsers = users.filter((user) => {
    if (!searchText || searchText.length == 0) return true;
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

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleUserAddSuccess = () => {
    rerender();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Accounts
          </h1>
          <p className="text-gray-600">
            Total users: {filteredUsers.length}{" "}
            {searchText && `(filtered from ${pagination.totalCount})`}
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
                allowClear
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="primary"
                icon={<FaPlus />}
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleAddUser}
              >
                Add User
              </Button>
              <Button
                onClick={rerender}
                loading={loading}
                icon={<FaArrowRotateLeft />}
              >
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
              pageSize: filters.pageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (_, range) =>
                `${range[0]}-${range[1]} of ${pagination.totalCount} users`,
              onChange(page, pageSize) {
                setFilters({
                  page: page,
                  pageSize: pageSize,
                });
              },
              total: pagination.totalCount,
              current: pagination.currentPage,
            }}
            className="overflow-x-auto"
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onSuccess={handleUserAddSuccess}
      />
    </div>
  );
};

export default ManageAccounts;
