import React, { useState } from "react";
import { Table, Button, Card, Modal, Input, message, Tag } from "antd";
import { FaCoins, FaPlus, FaEye, FaDownload, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";

interface Transaction {
  id: string;
  type: "topup" | "purchase";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  date: string;
  method: "bank_transfer" | "ewallet" | "points" | "credit_card";
}

const ManageTransactions = () => {
  const [currentPoints, setCurrentPoints] = useState(15000);
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  const [transactions] = useState<Transaction[]>([
    {
      id: "TXN001",
      type: "topup",
      amount: 50000,
      description: "Bank transfer top-up",
      status: "completed",
      date: "2024-06-27 14:30:00",
      method: "bank_transfer",
    },
    {
      id: "TXN002",
      type: "purchase",
      amount: -15000,
      description: "React Advanced Course Purchase",
      status: "completed",
      date: "2024-06-26 09:15:00",
      method: "points",
    },
    {
      id: "TXN003",
      type: "topup",
      amount: 30000,
      description: "E-wallet top-up",
      status: "pending",
      date: "2024-06-25 16:45:00",
      method: "ewallet",
    },
    {
      id: "TXN004",
      type: "purchase",
      amount: -8000,
      description: "Learning materials purchase",
      status: "completed",
      date: "2024-06-24 11:20:00",
      method: "points",
    },
  ]);

  const handleTopUp = (values: { amount: string }) => {
    const amount = parseInt(values.amount.replace(/,/g, ""));
    setCurrentPoints((prev) => prev + amount);
    message.success(`Successfully topped up ${amount.toLocaleString("vi-VN")} points!`);
    setIsTopUpModalVisible(false);
  };

  const formatVND = (value: string) => {
    const number = value.replace(/[^0-9]/g, "");
    if (!number) return "";
    return parseInt(number).toLocaleString("vi-VN");
  };

  const parseVND = (value: string) => {
    return value.replace(/,/g, "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseVND(e.target.value);
    if (!isNaN(parseInt(rawValue)) || rawValue === "") {
      setTopUpAmount(formatVND(rawValue));
    }
  };

  const getStatusTag = (status: Transaction["status"]) => {
    const statusConfig: Record<Transaction["status"], { color: string; text: string }> = {
      completed: { color: "green", text: "Completed" },
      pending: { color: "orange", text: "Pending" },
      failed: { color: "red", text: "Failed" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "topup":
        return <FaArrowUp className="text-green-500" />;
      case "purchase":
        return <FaArrowDown className="text-red-500" />;
      default:
        return <FaCoins className="text-gray-500" />;
    }
  };

  const getAmountColor = (amount: number) => {
    return amount > 0 ? "text-green-600" : "text-red-600";
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (text: string) => <span className="font-mono text-blue-400">{text}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 80,
      align: "center" as const,
      render: (type: Transaction["type"]) => (
        <div className="flex justify-center">{getTypeIcon(type)}</div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      align: "right" as const,
      render: (amount: number) => (
        <span className={`font-semibold ${getAmountColor(amount)}`}>
          {amount > 0 ? "+" : ""}
          {amount.toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: 130,
      render: (method: Transaction["method"]) => {
        const methodNames: Record<Transaction["method"], string> = {
          bank_transfer: "Bank Transfer",
          ewallet: "E-Wallet",
          points: "Points",
          credit_card: "Credit Card",
        };
        return methodNames[method] || method;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center" as const,
      render: (status: Transaction["status"]) => getStatusTag(status),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 160,
      render: (date: string) => (
        <div className="text-sm">
          <div>{date.split(" ")[0]}</div>
          <div className="text-gray-500">{date.split(" ")[1]}</div>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: Transaction) => (
        <div className="flex justify-center gap-2">
          <Button
            type="text"
            icon={<FaEye className="text-blue-400" />}
            onClick={() => message.info(`Viewing details for ${record.id}`)}
          />
          <Button
            type="text"
            icon={<FaDownload className="text-green-400" />}
            onClick={() => message.info(`Downloading receipt for ${record.id}`)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <MdAccountBalanceWallet className="text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-medium mb-1">Current Balance</h2>
                <p className="text-3xl font-bold flex items-center gap-2">
                  <FaCoins className="text-yellow-300" />
                  {currentPoints.toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<FaPlus />}
              className="bg-white text-blue-600 border-0 hover:bg-blue-50 font-semibold px-6"
              onClick={() => setIsTopUpModalVisible(true)}
            >
              Top Up
            </Button>
          </div>
        </Card>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2 text-white">
            <FaCoins className="text-blue-400" />
            <span>Transaction History</span>
          </div>
        }
        className="shadow-sm border-gray-600"
        style={{ backgroundColor: "#000000" }}
        headStyle={{ backgroundColor: "#000000", borderBottom: "1px solid #333", color: "white" }}
        bodyStyle={{ backgroundColor: "#000000", padding: "24px" }}
      >
        <Table<Transaction>
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} transactions`,
          }}
          scroll={{ x: 1000 }}
          className="transaction-table"
          style={{
            backgroundColor: "#000000",
            color: "white",
          }}
          components={{
            header: {
              cell: (props: any) => (
                <th {...props} style={{ backgroundColor: "#111111", color: "white", borderBottom: "1px solid #333" }} />
              ),
            },
            body: {
              row: (props: any) => (
                <tr {...props} style={{ backgroundColor: "#111111", color: "white" }} className="hover:bg-gray-800" />
              ),
              cell: (props: any) => (
                <td {...props} style={{ backgroundColor: "#111111", color: "white", borderBottom: "1px solid #333" }} />
              ),
            },
          }}
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <FaPlus className="text-blue-600" />
            <span>Top Up Points</span>
          </div>
        }
        open={isTopUpModalVisible}
        onCancel={() => {
          setIsTopUpModalVisible(false);
          setTopUpAmount("");
        }}
        footer={null}
        width={480}
      >
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Points Amount</label>
            <Input
              placeholder="Enter points amount (e.g. 50,000)"
              prefix={<FaCoins className="text-gray-400" />}
              size="large"
              value={topUpAmount}
              onChange={handleInputChange}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-blue-600 mb-1">💡 Notes:</p>
            <p className="text-sm text-gray-600">
              • Transaction will be processed within 5-10 minutes
              <br />
              • Transaction fee: Free
              <br />• Exchange rate: 1 point = 1 VND
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              onClick={() => {
                setIsTopUpModalVisible(false);
                setTopUpAmount("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<FaPlus />}
              className="bg-blue-600"
              onClick={() => {
                const parsedAmount = parseVND(topUpAmount);
                if (parsedAmount && !isNaN(parseInt(parsedAmount)) && parseInt(parsedAmount) > 0) {
                  handleTopUp({ amount: parsedAmount });
                  setTopUpAmount("");
                } else {
                  message.error("Please enter a valid amount!");
                }
              }}
            >
              Confirm Top Up
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageTransactions;