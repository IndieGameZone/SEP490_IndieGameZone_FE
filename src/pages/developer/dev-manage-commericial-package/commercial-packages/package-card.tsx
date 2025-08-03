import { formatCurrencyVND } from "@/lib/currency";
import { CommercialPackage } from "@/types/commercial-package";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const PackageCard = ({ data }: { data: CommercialPackage }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 items-center bg-zinc-900 border border-zinc-700 drop-shadow rounded p-5 hover:border-orange-500 duration-300">
      <p className="text-xl font-bold text-center">{data.name}</p>
      <p className="text-center text-sm text-zinc-500">{data.description}</p>
      <p className="text-xl font-semibold text-orange-500">
        {data.duration} day(s)
      </p>
      <p className="text-lg">{formatCurrencyVND(data.price)}</p>
      <Button
        type="primary"
        onClick={() => {
          navigate(`/dev/commercial-package/${data.id}`);
        }}
      >
        Register
      </Button>
    </div>
  );
};

export default PackageCard;
