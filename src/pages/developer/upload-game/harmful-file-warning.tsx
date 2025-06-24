import virusImage from "@/assets/website-virus.png";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const HarmfulFileWarning = ({ errorMessage }: { errorMessage: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center pb-20">
      <img src={virusImage} className="size-48 mt-10" alt="" />
      <h1 className="mt-10 text-3xl font-bold text-red-500">⚠ ATTENTION ⚠</h1>
      <p className="text-center text-amber-200">
        We detected possible harmful materials in {errorMessage}.<br /> Please
        make sure your file does not contain any malicious code!
      </p>
      <Button
        danger
        className="mt-5"
        onClick={() => navigate("/dev/manage-games")}
      >
        I understand!
      </Button>
    </div>
  );
};

export default HarmfulFileWarning;
