import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { BsBank2, BsCreditCard2Front, BsPerson } from "react-icons/bs";
import useAuthStore from "@/store/use-auth-store";

const BankInformationPage = () => {
  const { profile } = useAuthStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        bankName: profile.bankName || "",
        bankAccount: profile.bankAccount || "",
        accountName: profile.fullname || "",
      });
    }
  }, [profile, form]);

  const onFinish = async () => {
    setLoading(true);
  };

  return (
    <div className="min-h-screen bg-black p-4 flex items-center justify-center">
      <Card
        className="w-full max-w-md bg-gray-900 border-gray-700"
        styles={{
          body: { padding: "2rem" },
        }}
      >
        <div className="text-center mb-8">
          <BsBank2 className="text-4xl text-blue-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Bank Information</h1>
          <p className="text-gray-400">Enter your banking details securely</p>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
          <Form.Item
            name="bankName"
            label={<span className="text-white font-medium">Bank Name</span>}
            rules={[
              { required: true, message: "Please enter bank name" },
              { min: 2, message: "Bank name must be at least 2 characters" },
            ]}
          >
            <Input
              prefix={<BsBank2 className="text-gray-400" />}
              placeholder="Enter bank name"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-blue-400 focus:border-blue-400"
              size="large"
              defaultValue={profile?.bankName}
            />
          </Form.Item>

          <Form.Item
            name="bankAccount"
            label={<span className="text-white font-medium">Bank Account Number</span>}
            rules={[
              { required: true, message: "Please enter bank account number" },
              { pattern: /^\d{8,20}$/, message: "Account number must be 8-20 digits" },
            ]}
          >
            <Input
              prefix={<BsCreditCard2Front className="text-gray-400" />}
              placeholder="Enter account number"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-blue-400 focus:border-blue-400"
              size="large"
              maxLength={20}
              defaultValue={profile?.bankAccount}
            />
          </Form.Item>

          <Form.Item
            name="fullName"
            label={<span className="text-white font-medium">Account Name</span>}
            rules={[
              { required: true, message: "Please enter account name" },
              { min: 2, message: "Account name must be at least 2 characters" },
              { pattern: /^[a-zA-Z\s]+$/, message: "Account name can only contain letters and spaces" },
            ]}
          >
            <Input
              prefix={<BsPerson className="text-gray-400" />}
              placeholder="Enter account name"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-blue-400 focus:border-blue-400"
              size="large"
              defaultValue={profile?.fullname}
            />
          </Form.Item>

          <Form.Item className="mb-0 pt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 h-12 text-lg font-medium"
              size="large"
            >
              {loading ? "Saving..." : "Save Bank Information"}
            </Button>
          </Form.Item>
        </Form>

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
            We will rely on this information to transfer money. You need to write your account information correctly. If
            there is any error, we will not be responsible.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default BankInformationPage;
