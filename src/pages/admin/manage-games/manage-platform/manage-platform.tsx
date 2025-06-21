import { Button, Input, InputRef, Space, Table, TableColumnType, TableProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";

import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { FaSearch } from "react-icons/fa";

import { Platform } from "@/types/platform";
import usePlatformStore from "@/store/use-platform-store";
import AddPlatform from "./add-platform";
import EditPlatform from "./edit-platform";
import DeletePlatform from "./delete-platform";

type DataIndex = keyof Platform;
const ManagePlatforms = () => {
  const searchInput = useRef<InputRef>(null);
  const { loading, fetchPlatforms, platforms } = usePlatformStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleEdit = (record: Platform) => {
    setSelectedPlatform(record);
    setEditModalOpen(true);
  };

  const handleDelete = (record: Platform) => {
    setSelectedPlatform(record);
    setDeleteModalOpen(true);
  };

  const handleRefresh = () => {
    fetchPlatforms();
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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Platform> => ({
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
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
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

  const columns: TableProps<Platform>["columns"] = [
    {
      title: "Platform Name",
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

  useEffect(() => {
    fetchPlatforms();
  }, []);

  return (
    <div className="px-5">
      <div className="mb-3 flex justify-between py-3">
        <h1 className="text-3xl font-bold mb-5">Manage Platforms</h1>
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          Add New Platform
        </Button>
      </div>
      <div className="">
        <Table<Platform> columns={columns} dataSource={platforms} loading={loading} bordered />
      </div>

      <AddPlatform open={addModalOpen} onClose={() => setAddModalOpen(false)} onSuccess={handleRefresh} />

      <EditPlatform
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPlatform(null);
        }}
        onSuccess={handleRefresh}
        platform={selectedPlatform}
      />

      <DeletePlatform
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPlatform(null);
        }}
        onSuccess={handleRefresh}
        platform={selectedPlatform}
      />
    </div>
  );
};

export default ManagePlatforms;
