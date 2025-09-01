import { Anchor } from "antd";

const TableOfContents = () => (
  <div className="col-span-4">
    <div className="sticky top-20">
      <h3 className="font-semibold text-xl mb-3">In this article</h3>
      <Anchor
        affix={false}
        items={[
          {
            key: "part-1",
            href: "#part-1",
            title: "What this integration does",
          },
          {
            key: "part-2",
            href: "#part-2",
            title: "Unity sample",
          },
          {
            key: "part-3",
            href: "#part-3",
            title: "Walkthrough of the Unity sample internals",
          },
          {
            key: "part-4",
            href: "#part-4",
            title: "Security & design considerations",
          },
          {
            key: "part-5",
            href: "#part-5",
            title: "Adapting to other engines & platforms",
          },
          {
            key: "part-6",
            href: "#part-6",
            title: "Example improvements",
          },
        ]}
      />
    </div>
  </div>
);

export default TableOfContents;
