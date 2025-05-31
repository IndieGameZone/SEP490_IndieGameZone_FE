import { Spin } from "antd";

const Loader = ({ theme = "dark" }: { theme?: "dark" | "light" }) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spin tip="Loading" size="large">
        <div className="p-16 rounded bg-zinc-500/20 border-orange-500 border-2"></div>
      </Spin>
    </div>
  );
};

export default Loader;
