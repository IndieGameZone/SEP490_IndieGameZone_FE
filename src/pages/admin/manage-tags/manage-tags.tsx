import { Tag } from "@/types/tag";
import { Button, Input, InputRef, Space, Table, TableColumnType, TableProps, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import AddTag from "./add-tags";
import EditTag from "./edit-tags";
import DeleteTag from "./delete-tags";
import useTagStore from "@/store/use-tag-store";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { FaSearch } from "react-icons/fa";

type DataIndex = keyof Tag;
const ManageTags = () => {
  const searchInput = useRef<InputRef>(null);
  const { loading, fetchPostTags, fetchGameTags, postTags, gameTags } = useTagStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleEdit = (record: Tag) => {
    setSelectedTag(record);
    setEditModalOpen(true);
  };

  const handleDelete = (record: Tag) => {
    setSelectedTag(record);
    setDeleteModalOpen(true);
  };

  const handleRefresh = () => {
    fetchGameTags();
    fetchPostTags();
  };
  useEffect(() => {
    fetchGameTags();
    fetchPostTags();
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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Tag> => ({
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

  const columns: TableProps<Tag>["columns"] = [
    {
      title: "Tag Name",
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
      key: "game",
      label: "Game Tags",
      children: (
        <div>
          <Table<Tag> columns={columns} dataSource={gameTags} loading={loading} bordered rowKey={(x) => x.name} />
        </div>
      ),
    },
    {
      key: "post",
      label: "Post Tags",
      children: (
        <div>
          <Table<Tag> columns={columns} dataSource={postTags} loading={loading} bordered rowKey={(x) => x.name} />
        </div>
      ),
    },
  ];

  return (
    <div className="px-5">
      <div className="mb-3 flex justify-between py-3">
        <h1 className="text-3xl font-bold mb-5">Manage Tags</h1>
        <Button type="primary" onClick={() => setAddModalOpen(true)}>
          Add New Tags
        </Button>
      </div>
      <Tabs defaultActiveKey="game" items={items} />

      <AddTag open={addModalOpen} onClose={() => setAddModalOpen(false)} onSuccess={handleRefresh} />

      <EditTag
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTag(null);
        }}
        onSuccess={handleRefresh}
        tag={selectedTag}
      />

      <DeleteTag
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTag(null);
        }}
        onSuccess={handleRefresh}
        tag={selectedTag}
      />
    </div>
  );
};

export default ManageTags;
