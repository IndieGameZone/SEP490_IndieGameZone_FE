import { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Radio,
  message,
  RadioChangeEvent,
} from "antd";

import { Game, GameCensorStatus } from "@/types/game";
import useGameStore from "@/store/use-game-store";
import Loader from "@/components/loader";

import getColumns from "./columns";
import GamesStatistics from "./games-statistics";
import { useSearchParams } from "react-router-dom";
import { getGamesAsAdmin } from "@/lib/api/game-api";
import { parseNumber } from "@/types/parsers";
import { SearchProps } from "antd/es/input";
import { IoRefresh } from "react-icons/io5";

const censorStatusMap: Record<GameCensorStatus, string> = {
  Approved: "Approved",
  PendingManualReview: "Pending Review",
  PendingAIReview: "Pending AI Review",
  Rejected: "Rejected",
};

const DEFAULT_PAGE_SIZE = 10;

const ManageGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");
  const [selectedCensorStatus, setSelectedCensorStatus] = useState(
    searchParams.get("censorStatus")
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();

  const { renderKey, rerender } = useGameStore();

  const fetchGames = async (
    current?: number,
    pageSize?: number,
    q?: string,
    censorStatus?: GameCensorStatus
  ) => {
    setLoading(true);
    const result = await getGamesAsAdmin({
      censorStatus: censorStatus,
      pageNumber: current,
      pageSize: pageSize,
      searchTerm: q,
    });
    setLoading(false);
    if (result.error) {
      messageApi.error("Failed to fetch games from server!");
      return;
    }
    const paginationHeader = result.data.headers["x-pagination"];
    const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
    if (pagination) {
      setPagination({
        current: pagination.CurrentPage,
        pageSize: pagination.PageSize,
        total: pagination.TotalCount,
      });
    }
    setGames(result.data.games);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
    const query = searchParams.get("q") ?? undefined;
    const pageNumber = parseNumber(searchParams.get("page"));
    const pageSize = parseNumber(searchParams.get("pageSize"));
    const censorStatus =
      (searchParams.get("censorStatus") as GameCensorStatus) ?? "";
    setSelectedCensorStatus(censorStatus);
    fetchGames(pageNumber, pageSize, query, censorStatus);
  }, [renderKey, searchParams]);

  const radioOptions = useMemo(() => {
    const censorStatusOptions = Object.keys(censorStatusMap).map((x) => ({
      value: x,
      label: censorStatusMap[x as GameCensorStatus],
    }));
    return [{ value: "", label: "All" }, ...censorStatusOptions];
  }, []);

  const onSearch: SearchProps["onSearch"] = (value, _e, _) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
    setSearchValue(value);
  };

  const handleClearSearchInput = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    params.delete("page");
    setSearchParams(params);
  };

  const handleFilterCensorStatus = (e: RadioChangeEvent) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value == "") {
      params.delete("censorStatus");
    } else {
      params.set("censorStatus", e.target.value);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());
    setSearchParams(params);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {contextHolder}
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <GamesStatistics />
          <div className="shadow bg-zinc-200 border border-zinc-300 p-3">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 max-w-lg">
                <Input.Search
                  placeholder="Search games by name, description, category, or tags..."
                  onSearch={onSearch}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  allowClear
                  onClear={handleClearSearchInput}
                />
              </div>
              <Space>
                <Button
                  onClick={rerender}
                  loading={loading}
                  className="h-11 px-6 rounded-lg font-medium"
                  icon={<IoRefresh />}
                >
                  Refresh
                </Button>
              </Space>
            </div>
            <div className="mt-3">
              <Radio.Group
                options={radioOptions}
                onChange={handleFilterCensorStatus}
                value={selectedCensorStatus}
              />
            </div>
          </div>
          <div className="shadow overflow-hidden">
            <Table<Game>
              columns={getColumns(rerender)}
              dataSource={games}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: pagination.pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                current: pagination.current,
                total: pagination.total,
                // showTotal: (total, range) =>
                //   `${range[0]}-${range[1]} of ${total} games${
                //     searchText ? ` (filtered from ${pagination.total})` : ""
                //   }`,
                className: "px-4 py-4",
                onChange: handlePageChange,
              }}
              className="overflow-x-auto"
              scroll={{ x: 1400 }}
              rowClassName="hover:bg-blue-50/50 transition-colors duration-150"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGames;
