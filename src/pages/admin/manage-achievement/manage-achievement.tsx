import { Button, Input, InputRef, Space, Table, TableColumnType, TableProps, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { FaSearch } from "react-icons/fa";
import { Achievement } from "@/types/achievements";
import { getAllAchievements } from "@/lib/api/achievements";
import EditAchievement from "./edit-achievement";
import DeleteAchievement from "./delete-achievement";

type DataIndex = keyof Achievement;

const ManageAchievement = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const searchInput = useRef<InputRef>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await getAllAchievements();
      if (response.success) {
        setAchievements(response.data);
      } else {
        messageApi.error(response.error || "Failed to fetch achievements");
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      messageApi.error("Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleEdit = (record: Achievement) => {
    setSelectedAchievement(record);
    setEditModalOpen(true);
  };

  const handleDelete = (record: Achievement) => {
    setSelectedAchievement(record);
    setDeleteModalOpen(true);
  };

  const handleRefresh = () => {
    fetchAchievements();
  };

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Achievement> => ({
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
            close
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

  const columns: TableProps<Achievement>["columns"] = [
    {
      title: "Achievement Name",
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

  return (
    <>
      {contextHolder}
      <div className="px-5">
        <div className="">
          <Table<Achievement> columns={columns} dataSource={achievements} loading={loading} bordered rowKey="id" />
        </div>

        <EditAchievement
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAchievement(null);
          }}
          onSuccess={handleRefresh}
          achievement={selectedAchievement}
        />
        <DeleteAchievement
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedAchievement(null);
          }}
          onSuccess={handleRefresh}
          achievement={selectedAchievement}
        />
      </div>
    </>
  );
};

export default ManageAchievement;
