import { useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  Space,
  Typography,
  Checkbox,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { formatCurrencyVND } from "@/lib/currency";
import useGameStore from "@/store/use-game-store";
import { useGlobalMessage } from "@/components/message-provider";
import { createGameDiscount } from "@/lib/api/game-api";

const { Title, Text } = Typography;

interface DiscountFormValues {
  discountValue: number;
  endDate: Dayjs;
}

function computeDiscountedPrice(basePrice: number, discountValue: number) {
  if (basePrice <= 0 || discountValue <= 0) return basePrice;
  const pct = Math.min(95, Math.max(1, discountValue));
  return Math.max(0, basePrice * (1 - pct / 100));
}

const disabledPast = (current: Dayjs) =>
  current && current < dayjs().startOf("day");

export default function GameDiscountPage() {
  const [form] = Form.useForm<DiscountFormValues>();
  const { game, rerender } = useGameStore();
  const message = useGlobalMessage();
  const [loading, setLoading] = useState(false);

  const basePrice = game?.price;

  const discountValue = Form.useWatch("discountValue", form) as
    | number
    | undefined;

  const previewPrice = useMemo(() => {
    console.log(basePrice);
    if (typeof basePrice === "number" && typeof discountValue === "number") {
      return computeDiscountedPrice(basePrice, discountValue);
    }
    return undefined;
  }, [basePrice, discountValue]);

  const onFinish = async (values: DiscountFormValues) => {
    if (!game) return;
    setLoading(true);
    const result = await createGameDiscount(game?.id, {
      endDate: values.endDate.format("YYYY-MM-DD"),
      percentage: values.discountValue,
    });
    if (!result.error) {
      message.success("Discount created!");
      rerender();
    } else {
      message.error("Failed to create discount! Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8 bg-zinc-900">
      <Space direction="vertical" size="large" className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Title level={3} className="!mb-0">
              Add Game Discount
            </Title>
            <Text type="secondary">Set a promo for your game</Text>
          </div>
        </div>

        <Card title="Discount Policy" className="border-pink-200">
          <div className="grid gap-2 text-sm">
            <p className="mb-1">
              • Minimum price after discount: <b>{formatCurrencyVND(10_000)}</b>
              .
            </p>
            <p className="mb-1">
              • Percentage discounts must be between <b>1%</b> and <b>95%</b>.
            </p>
            <p className="mb-1">
              • Schedule must not overlap with another active discount for the
              same game.
            </p>
            <p className="mb-1">
              • Game price much not be changed more than once per 28 days.
            </p>
          </div>
        </Card>

        {/* Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{}}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Item
                name="endDate"
                label="Discount End Date"
                rules={[
                  {
                    required: true,
                    message: "Please select an end date",
                  },
                ]}
                extra={"Discounts start right away once created."}
              >
                <DatePicker
                  className="w-full"
                  disabledDate={disabledPast}
                  format="DD-MM-YYYY"
                />
              </Form.Item>

              <Form.Item
                name="discountValue"
                label="Discount (%)"
                rules={[
                  {
                    required: true,
                    message: "Please enter discount percentage",
                  },
                  {
                    type: "number",
                    min: 1,
                    max: 95,
                    message: "Discount must be between 1% and 95%",
                  },
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={1}
                  max={95}
                  addonAfter="%"
                />
              </Form.Item>
            </div>

            {/* Live Preview */}
            <Space direction="vertical" className="w-full">
              <Text strong>Preview</Text>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1">
                  <p>Base: </p>
                  <p className="text-2xl">{formatCurrencyVND(basePrice)}</p>
                </div>

                {typeof discountValue === "number" && (
                  <div className="flex-1">
                    <p>Discount: </p>
                    <p className="text-2xl">{`${discountValue}%`}</p>
                  </div>
                )}
                {typeof previewPrice === "number" && (
                  <div>
                    <p>Estimated Final: </p>
                    <p className="text-2xl">
                      {formatCurrencyVND(previewPrice)}
                    </p>
                  </div>
                )}
              </div>
              <Text type="secondary">
                This is an estimate. Taxes, regional pricing, and fees may
                apply.
              </Text>
            </Space>

            {/* Policy Agreement */}
            <Form.Item
              name="agreePolicy"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, v) =>
                    v
                      ? Promise.resolve()
                      : Promise.reject("Please agree to the policy"),
                },
              ]}
            >
              <Checkbox>
                I have read and agree to the Discount Policy above
              </Checkbox>
            </Form.Item>

            <Space className="w-full justify-end">
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Discount
              </Button>
            </Space>
          </Form>
        </Card>
      </Space>
    </div>
  );
}
