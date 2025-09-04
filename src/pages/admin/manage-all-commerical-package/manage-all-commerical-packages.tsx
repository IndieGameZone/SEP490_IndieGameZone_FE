import { getAllCommercialPackages } from "@/lib/api/commercial-package-api";
import { CommercialPackage } from "@/types/commercial-package";
import {
  Button,
  Input,
  InputRef,
  Space,
  Table,
  TableColumnType,
  TableProps,
  Tag,
  message,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { CiEdit } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import DeleteCommercialPackage from "./delete-commerical";
import EditCommercial from "./edit-commercial";

type DataIndex = keyof CommercialPackage;

const ManageAllCommercialPackages = () => {
  const [commercialPackages, setCommercialPackages] = useState<
    CommercialPackage[]
  >([]);
  const [loading, setLoading] = useState(false);
  const searchInput = useRef<InputRef>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCommercialPackage, setSelectedCommercialPackage] =
    useState<CommercialPackage | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const fetchCommercialPackages = async () => {
    setLoading(true);
    try {
      const response = await getAllCommercialPackages();
      if (response.success) {
        setCommercialPackages(response.data);
      } else {
        messageApi.error(
          response.error || "Failed to fetch commercial packages"
        );
      }
    } catch (error) {
      console.error("Error fetching commercial packages:", error);
      messageApi.error("Failed to fetch commercial packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommercialPackages();
  }, []);

  const handleEdit = (record: CommercialPackage) => {
    setSelectedCommercialPackage(record);
    setEditModalOpen(true);
  };

  const handleDelete = (record: CommercialPackage) => {
    setSelectedCommercialPackage(record);
    setDeleteModalOpen(true);
  };

  const handleRefresh = () => {
    fetchCommercialPackages();
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<CommercialPackage> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<FaSearch />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
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
    filterIcon: (filtered: boolean) => (
      <FaSearch
        style={{ color: filtered ? "#FF6600" : undefined }}
        className="w-5"
      />
    ),
    onFilter: (value, record) => {
      if (!record[dataIndex]) return false;
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase());
    },
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

  const columns: TableProps<CommercialPackage>["columns"] = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      ...getColumnSearchProps("name"),
      render: (text: string) => (
        <div>
          <div className="font-semibold">{text || "N/A"}</div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (description: string) => description || "No description",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Homepage Banner", value: "HomepageBanner" },
        { text: "Category Banner", value: "CategoryBanner" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type: string) => (
        <Tag color={type === "HomepageBanner" ? "blue" : "purple"}>
          {type === "HomepageBanner" ? "Homepage Banner" : "Category Banner"}
        </Tag>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration || 0} days`,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${(price || 0).toLocaleString()} ₫`,
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
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
        <h1 className="text-2xl font-bold mb-4">Manage Commercial Packages</h1>
        <div className="mb-4 flex justify-between">
          <Button type="primary" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>

        <div className="">
          <Table<CommercialPackage>
            columns={columns}
            dataSource={commercialPackages}
            loading={loading}
            bordered
            rowKey={(record) => record.id || Math.random().toString()}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
          />
        </div>

        {selectedCommercialPackage && (
          <EditCommercial
            open={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedCommercialPackage(null);
            }}
            onSuccess={handleRefresh}
            commercialPackage={selectedCommercialPackage}
          />
        )}

        {selectedCommercialPackage && (
          <DeleteCommercialPackage
            open={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setSelectedCommercialPackage(null);
            }}
            onSuccess={handleRefresh}
            commercialPackage={selectedCommercialPackage}
          />
        )}
      </div>
    </>
  );
};

export default ManageAllCommercialPackages;
