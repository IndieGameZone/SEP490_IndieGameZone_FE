import { createWithdrawRequest } from "@/lib/api/withdraw-api";
import useAuthStore from "@/store/use-auth-store";
import { Form, InputNumber, message, Modal } from "antd";
import { useState } from "react";

interface AddCreateWithdrawRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateWithdrawRequestForm {
  Amount: number;
}

const CreateWithdrawRequest = ({ open, onClose, onSuccess }: AddCreateWithdrawRequestModalProps) => {
  const [form] = Form.useForm<CreateWithdrawRequestForm>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { profile } = useAuthStore();
  const handleSubmit = async (values: CreateWithdrawRequestForm) => {
    if (!profile?.id) {
      messageApi.error("You must be logged in to create a withdraw request");
      return;
    }
    if (!hasBankInformation()) {
      messageApi.warning(
        "Please update your bank account information in the Bank Information section before making a withdrawal request"
      );
      return;
    }

    try {
      setLoading(true);
      const result = await createWithdrawRequest(profile?.id, {
        Amount: values.Amount,
      });

      if (result.success) {
        messageApi.success("Withdraw request created successfully!");
        form.resetFields();
        onClose();
        onSuccess();
      } else {
        messageApi.error(result.error || "Failed to create withdraw request");
      }
    } catch (error) {
      messageApi.error("Failed to create withdraw request");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  const maxWithdrawAmount = profile?.balance ?? 0;
  const hasBankInformation = () => {
    return !!(
      profile?.bankInfo?.bankName &&
      profile?.bankInfo?.bankShortName &&
      profile?.bankAccountNumber &&
      profile?.bankAccountName
    );
  };

  return (
    <div>
      {contextHolder}
      <Modal
        title=" Withdraw Request"
        open={open}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        confirmLoading={loading}
        destroyOnHidden
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          <Form.Item
            label="Amount"
            name="Amount"
            rules={[
              { required: true, message: "Please input the amount!" },
              {
                type: "number",
                min: 1000,
                message: "Amount must be at least 1000!",
              },
            ]}
          >
            <InputNumber<number>
              className="w-full"
              style={{ width: "100%" }}
              placeholder="Enter points amount (e.g. 50.000)"
              max={maxWithdrawAmount}
              size="large"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              parser={(value) => (value ? parseInt(value.replace(/\./g, ""), 10) : 0)}
            />
          </Form.Item>
        </Form>
        
        <div>
          {!hasBankInformation() && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Please update your bank account information in the Bank Information section before making a withdrawal
              request.
            </div>
          )}
          <div className="flex flex-col gap-3">
            <div>
              <span className="font-semibold text-yellow-500">Your Bank Account Information</span>
              {!hasBankInformation() && <span className="ml-2 text-red-500">(Missing Information)</span>}
            </div>
          </div>
          <div className="flex flex-col gap-3  ">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Bank Name:</span>
                <span>{profile?.bankInfo.bankName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Bank Short Name:</span>
                <span>{profile?.bankInfo.bankShortName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Bank Account Number:</span>
                <span>{profile?.bankAccountNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Bank Account Name:</span>
                <span>{profile?.bankAccountName}</span>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800 border border-zinc-600 p-4 rounded my-4">
            <p className="text-sm text-orange-600 mb-1">Notes:</p>
            <p className="text-sm text-zinc-100">
              • Transaction will be processed within 5-10 minutes
              <br />
              • Transaction fee: Free
              <br />• Exchange rate: 1 point = 1 VND
            </p>
          </div>
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">Attention</span>
            </div>
            <p className="text-gray-300 text-sm">
              {" "}
              Please check Bank Information carefully, we will transfer money to you based on the account number, if you
              enter incorrect bank information we will not be responsible.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateWithdrawRequest;
