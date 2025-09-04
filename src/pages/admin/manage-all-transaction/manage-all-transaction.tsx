import { Transaction } from "@/types/transaction";
import { Table, Input, Select, DatePicker, Button, Card } from "antd";
import { useState, useEffect, useMemo } from "react";
import { getAllTransactions } from "@/lib/api/payment-api";
import { getAllTransactionColumns } from "./columns";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { IoRefresh } from "react-icons/io5";
import { useFilters } from "@/hooks/use-filters";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
type TransactionFilter = {
  page: number;
  pageSize: number;
};

const ManageAllTransaction = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    string | undefined
  >(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const { filters, setFilters } = useFilters<TransactionFilter>({
    page: 1,
    pageSize: 10,
  });

  const [pagination, setPagination] = useState<{
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }>({
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchAllTransactions = async () => {
      setLoading(true);
      try {
        const response = await getAllTransactions({
          PageNumber: filters.page,
          PageSize: filters.pageSize,
        });
        if (!response.error) {
          setTransactions(response.data);
          const paginationHeader = response.headers["x-pagination"];
          const pagination = paginationHeader
            ? JSON.parse(paginationHeader)
            : null;
          setPagination({
            currentPage: pagination.CurrentPage,
            pageSize: pagination.PageSize,
            totalCount: pagination.TotalCount,
          });
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTransactions();
  }, [filters.page, filters.pageSize]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchMatch =
        !searchText ||
        transaction.orderCode?.toString().includes(searchText.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        transaction.user?.userName
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        transaction.user?.email
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        transaction.paymentMethod
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

      const statusMatch = !statusFilter || transaction.status === statusFilter;

      const typeMatch = !typeFilter || transaction.type === typeFilter;

      const paymentMethodMatch =
        !paymentMethodFilter ||
        transaction.paymentMethod === paymentMethodFilter;

      const dateMatch =
        !dateRange ||
        (dayjs(transaction.createdAt).isAfter(dateRange[0].startOf("day")) &&
          dayjs(transaction.createdAt).isBefore(dateRange[1].endOf("day")));

      return (
        searchMatch &&
        statusMatch &&
        typeMatch &&
        paymentMethodMatch &&
        dateMatch
      );
    });
  }, [
    transactions,
    searchText,
    statusFilter,
    typeFilter,
    paymentMethodFilter,
    dateRange,
  ]);

  const uniqueStatuses = [...new Set(transactions.map((t) => t.status))];
  const uniqueTypes = [...new Set(transactions.map((t) => t.type))];
  const uniquePaymentMethods = [
    ...new Set(transactions.map((t) => t.paymentMethod)),
  ];

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setTypeFilter(undefined);
    setPaymentMethodFilter(undefined);
    setDateRange(null);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await getAllTransactions();
      if (!response.error) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center text-3xl font-semibold mb-5">
        Manage System Transactions
      </h1>
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Search
                placeholder="Search by Order Code, Description, User Name, Email..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
                prefix={<SearchOutlined />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Select
              placeholder="Filter by Status"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: "100%" }}
            >
              {uniqueStatuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Type"
              value={typeFilter}
              onChange={setTypeFilter}
              allowClear
              style={{ width: "100%" }}
            >
              {uniqueTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Filter by Payment Method"
              value={paymentMethodFilter}
              onChange={setPaymentMethodFilter}
              allowClear
              style={{ width: "100%" }}
            >
              {uniquePaymentMethods.map((method) => (
                <Option key={method} value={method}>
                  {method}
                </Option>
              ))}
            </Select>

            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]]);
                } else {
                  setDateRange(null);
                }
              }}
              style={{ width: "100%" }}
              placeholder={["Start Date", "End Date"]}
            />

            <Button
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
              style={{ width: "100%" }}
            >
              Clear Filters
            </Button>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </span>
            <Button
              icon={<IoRefresh />}
              onClick={refreshData}
              loading={loading}
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </Card>
      <div>
        <Table
          dataSource={filteredTransactions}
          columns={getAllTransactionColumns(refreshData)}
          rowKey="id"
          loading={loading}
          bordered
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (_, range) =>
              `${range[0]}-${range[1]} of ${pagination.totalCount} items`,
            onChange(page, pageSize) {
              setFilters({
                page: page,
                pageSize: pageSize,
              });
            },
            pageSizeOptions: ["10", "20", "50", "100"],
            current: pagination.currentPage,
            total: pagination.totalCount
          }}
        />
      </div>
    </div>
  );
};

export default ManageAllTransaction;
