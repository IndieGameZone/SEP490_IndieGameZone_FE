import React, { useState, useEffect } from "react";
import { Table, Button, Input, Card, Space } from "antd";

import { Game } from "@/types/game";
import useGameStore from "@/store/use-game-store";
import Loader from "@/components/loader";

import { SearchOutlined } from "@ant-design/icons";
import columns from "./columns";
import GamesStatistics from "./games-statistics";

const ManageGames: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { fetchAllGamesAdmin, loading, renderKey, rerender, games } =
    useGameStore();

  useEffect(() => {
    fetchAllGamesAdmin();
  }, [renderKey]);

  const filteredGames = games.filter((game) => {
    const searchLower = searchText.toLowerCase();
    return (
      (game.name || "").toLowerCase().includes(searchLower) ||
      (game.shortDescription || "").toLowerCase().includes(searchLower) ||
      (game.category?.name || "").toLowerCase().includes(searchLower) ||
      (game.gameTags || []).some((gameTag) =>
        (gameTag?.tag?.name || "").toLowerCase().includes(searchLower)
      )
    );
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <GamesStatistics />
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
                  onClick={rerender}
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
                  `${range[0]}-${range[1]} of ${total} games${
                    searchText ? ` (filtered from ${games.length})` : ""
                  }`,
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