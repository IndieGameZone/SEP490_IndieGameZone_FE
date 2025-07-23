import { FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

const UploadGuideLine = () => {
  return (
    <div className="mb-5">
      <div className="bg-zinc-800 p-3 rounded-lg flex items-center">
        <div className="p-3">
          <FaBook className="size-8" />
        </div>
        <div className="flex-1 border-l px-3 border-zinc-600">
          <p className="font-bold">Make sure everyone can find your page</p>
          <div>
            Review our{" "}
            <Link
              to={"/quality-guidelines"}
              className="underline text-orange-500"
            >
              quality guidelines
            </Link>{" "}
            before posting your project
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadGuideLine;
