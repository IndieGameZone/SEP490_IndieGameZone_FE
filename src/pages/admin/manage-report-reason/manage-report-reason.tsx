import { Button, Input, InputRef, Space, Table, TableColumnType, TableProps, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { FaSearch } from "react-icons/fa";

import { ReportReason } from "@/types/report-reason";
import useReportReasonStore from "@/store/use-report-reason-store";
import AddReportReason from "./add-report-reason";
import EditReportReason from "./edit-report-reason";
import DeleteReportReason from "./delete-report-reason";

type DataIndex = keyof ReportReason;

const ManageReportReason = () => {
  const searchInput = useRef<InputRef>(null);
  const {
    loading,
    gameReportReasons,
    postReportReasons,
    commentReportReasons,
    reviewReportReasons,
    fetchGameReportReasons,
    fetchPostReportReasons,
    fetchCommentReportReasons,
    fetchReviewReportReasons,
  } = useReportReasonStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState<ReportReason | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleEdit = (record: ReportReason) => {
    setSelectedReportReason(record);
    setEditModalOpen(true);
  };

  const handleDelete = (record: ReportReason) => {
    setSelectedReportReason(record);
    setDeleteModalOpen(true);
  };
  const handleRefresh = () => {
    fetchGameReportReasons();
    fetchPostReportReasons();
    fetchCommentReportReasons();
    fetchReviewReportReasons();
  };
  useEffect(() => {
    fetchGameReportReasons();
    fetchPostReportReasons();
    fetchCommentReportReasons();
    fetchReviewReportReasons();
  }, []);

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<ReportReason> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<FaSearch />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={close}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <FaSearch style={{ color: filtered ? "#FF6600" : undefined }} className="w-5" />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps<ReportReason>["columns"] = [
    {
      title: "Report Reason",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button shape="circle" onClick={() => handleEdit(record)}>
            <CiEdit />
          </Button>
          <Button shape="circle" onClick={() => handleDelete(record)} danger>
            <MdOutlineDeleteForever />
          </Button>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: "Game",
      label: "Game Reports",
      children: (
        <div>
          <Table<ReportReason> columns={columns} dataSource={gameReportReasons} loading={loading} bordered />
        </div>
      ),
    },
    {
      key: "Post",
      label: "Post Reports",
      children: (
        <div>
          <Table<ReportReason> columns={columns} dataSource={postReportReasons} loading={loading} bordered />
        </div>
      ),
    },
    {
      key: "Comment",
      label: "Comment Reports",
      children: (
        <div>
          <Table<ReportReason> columns={columns} dataSource={commentReportReasons} loading={loading} bordered />
        </div>
      ),
    },
    {
      key: "Review",
      label: "Review Reports",
      children: (
        <div>
          <Table<ReportReason> columns={columns} dataSource={reviewReportReasons} loading={loading} bordered />
        </div>
      ),
    },
  ];
  return (
    <div className="px-5">
      <div className="mb-3 flex justify-between py-3">
        <h1 className="text-3xl font-bold mb-5">Manage Report Reasons</h1>
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          Add New Report Reason
        </Button>
      </div>
      <Tabs defaultActiveKey="game" items={items} />

      <AddReportReason open={addModalOpen} onClose={() => setAddModalOpen(false)} onSuccess={handleRefresh} />

      <EditReportReason
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedReportReason(null);
        }}
        onSuccess={handleRefresh}
        reportReason={selectedReportReason}
      />

      <DeleteReportReason
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedReportReason(null);
        }}
        onSuccess={handleRefresh}
        reportReason={selectedReportReason}
      />
    </div>
  );
};

export default ManageReportReason;
