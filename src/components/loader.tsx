const Loader = ({ type = "screen" }: { type?: "screen" | "inline" }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        type == "screen" ? "h-screen" : ""
      }`}
    >
      <div className="border-t-transparent border-solid border-4 border-orange-500 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
};

export default Loader;
