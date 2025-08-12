import FaultTolerantImage from "@/components/fault-tolerant-image";
import { useGlobalMessage } from "@/components/message-provider";
import { getOrderById } from "@/lib/api/order-api";
import { formatCurrencyVND } from "@/lib/currency";
import { Order } from "@/types/order";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface OrderDetailsModalProps {
  orderId: string | null;
  open: boolean;
  handleCancel?: () => void;
}
const OrderDetailsModal = ({
  orderId,
  open,
  handleCancel,
}: OrderDetailsModalProps) => {
  const [orderDetail, setOrderDetail] = useState<Order>();
  const [isLoading, setIsLoading] = useState(false);
  const messageApi = useGlobalMessage();

  const fetchOrderDetail = async () => {
    if (!orderId) return;
    setIsLoading(true);
    const result = await getOrderById(orderId);
    setIsLoading(false);
    if (result.error) {
      messageApi.error("Failed to load order detail! Please try again.");
    } else {
      setOrderDetail(result.data);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  return (
    <Modal
      title="Order details"
      closable
      open={open}
      onCancel={handleCancel}
      footer={null}
      loading={isLoading}
    >
      <h2 className="text-xl font-semibold">
        Order code: {orderDetail?.transaction.orderCode}
      </h2>
      <p className="text-zinc-400 mb-2">
        Type:{" "}
        {orderDetail?.commercialPackage
          ? "Commercial Package Registration"
          : "Game Purchase"}
      </p>
      {orderDetail?.commercialPackage && (
        <>
          <h4 className="mb-1 font-semibold">Commerical Package:</h4>
          <div className="bg-zinc-800 p-3 rounded">
            <Link
              to={`/dev/commercial-package/${orderDetail?.commercialPackage.id}`}
            >
              <p className="text-lg font-semibold">
                {orderDetail.commercialPackage.name}
              </p>
            </Link>
            <p>
              <span className="font-semibold">Start date: </span>
              {orderDetail.commercialRegistrationStartDate &&
                new Date(
                  orderDetail.commercialRegistrationStartDate
                ).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">End date: </span>
              {orderDetail.commercialRegistrationEndDate &&
                new Date(
                  orderDetail.commercialRegistrationEndDate
                ).toLocaleDateString()}
            </p>
          </div>
        </>
      )}
      <h4 className="mb-1 font-semibold">Game:</h4>
      <div className="rounded bg-zinc-800 p-2 flex gap-2">
        <Link to={`/dev/game/${orderDetail?.game.id}`}>
          <FaultTolerantImage
            src={orderDetail?.game.coverImage ?? ""}
            className="w-28 aspect-video"
          />
        </Link>

        <div className="flex-1">
          <Link to={`/dev/game/${orderDetail?.game.id}`}>
            <p className="font-semibold text-lg">{orderDetail?.game.name}</p>
          </Link>
          <p className="text-sm text-zinc-500">
            {orderDetail?.game.category?.name ?? "undefined"}
          </p>
          <p>{formatCurrencyVND(orderDetail?.game?.price)}</p>
        </div>
      </div>
      <h4 className="mb-1 mt-5 font-semibold ">Order Summary</h4>
      <div className="flex justify-between">
        <span className="text-zinc-400">Subtotal</span>
        <span className="font-semibold">
          {formatCurrencyVND(orderDetail?.amount)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-zinc-400">Discount</span>
        <span className="font-semibold">{formatCurrencyVND(0)}</span>
      </div>
      <hr className="my-2 border-zinc-500" />
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>{formatCurrencyVND(orderDetail?.amount)}</span>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
