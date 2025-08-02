import { useState, useEffect } from "react";
import { Form, Input, Button, Card, message, Select, Spin } from "antd";
import { BsBank2, BsCreditCard2Front, BsPerson, BsHash } from "react-icons/bs";
import { BankInfo } from "@/types/bank-info";
import useAuthStore from "@/store/use-auth-store";
import { updateBankInfo } from "@/lib/api/user-api";

interface BankResponse {
  code: string;
  desc: string;
  data: BankInfo[];
}

const BankInformationPage = () => {
  const { profile, fetchProfile } = useAuthStore();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState<BankInfo[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);

  const fetchBanks = async () => {
    setLoadingBanks(true);
    try {
      const response = await fetch("https://api.vietqr.io/v2/banks");
      const data: BankResponse = await response.json();

      if (data.code === "00" && data.data) {
        setBanks(data.data);
      } else {
        message.error("Failed to load bank list");
      }
    } catch (error) {
      message.error("Failed to load bank list");
    } finally {
      setLoadingBanks(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if (profile && banks.length > 0) {
      let foundBank = null;

      if (profile.bankInfo?.bankCode) {
        foundBank = banks.find((b) => b.code === profile.bankInfo.bankCode);
        if (foundBank) {
          setSelectedBank(foundBank);
        }
      }

      form.setFieldsValue({
        bankName: foundBank ? foundBank.code : "",
        code: profile.bankInfo?.bankCode || "",
        bin: profile.bankInfo?.bankBin || "",
        shortName: profile.bankInfo?.bankShortName || foundBank?.shortName || "",
        bankAccountNumber: profile.bankAccountNumber || "",
        accountName: profile.bankAccountName || "",
      });
    }
  }, [profile, banks, form]);

  const handleBankSelect = (value: string) => {
    const bank = banks.find((b) => b.code === value);
    if (bank) {
      setSelectedBank(bank);
      form.setFieldsValue({
        code: bank.code,
        bin: bank.bin,
        shortName: bank.shortName || bank.short_name,
      });
    }
  };

  const onFinish = async (values: any) => {
    if (!profile) return;

    setLoading(true);
    try {
      const bankInfoData = {
        bankName: selectedBank?.name || "",
        bankAccountName: values.accountName,
        bankAccountNumber: values.bankAccountNumber,
        bankCode: values.code,
        bankBin: values.bin,
        bankShortName: values.shortName,
      };

      const result = await updateBankInfo(profile.id, bankInfoData);

      if (result.success) {
        message.success("Bank information saved successfully!");
        await fetchBanks();
        await fetchProfile();
      } else {
        message.error(result.error || "Failed to save bank information");
      }
    } catch (error) {
      message.error("Failed to save bank information");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Please log in to view this page</span>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black p-4 flex items-center justify-center">
        <Card
          className="w-full max-w-lg bg-gray-900 border-gray-700"
          styles={{
            body: { padding: "2rem" },
          }}
        >
          <div className="text-center mb-8">
            <BsBank2 className="text-4xl text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Bank Information</h1>
            <p className="text-gray-400">Enter your banking details securely</p>
          </div>

          <div className="mb-4 p-2 bg-gray-900 rounded text-xs text-gray-300 flex items-center justify-center">
            <span>Only </span>
            {banks.length} Banks Supported Here{" "}
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
            <Form.Item
              name="bankName"
              label={<span className="text-white font-medium">Bank Name</span>}
              rules={[{ required: true, message: "Please select a bank" }]}
            >
              <Select
                placeholder="Select your bank"
                size="large"
                loading={loadingBanks}
                showSearch
                filterOption={(input, option) => {
                  const label = option?.label?.toString() || "";
                  return label.toLowerCase().includes(input.toLowerCase());
                }}
                className="bank-select"
                onChange={handleBankSelect}
                options={banks.map((bank) => ({
                  value: bank.code,
                  label: bank.name,
                  key: bank.code,
                }))}
                notFoundContent={
                  loadingBanks ? <Spin size="small" /> : banks.length === 0 ? "No banks loaded" : "No banks found"
                }
              />
            </Form.Item>

            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                name="code"
                label={<span className="text-white font-medium">Bank Code</span>}
                rules={[{ required: true, message: "Bank code is required" }]}
              >
                <Input
                  prefix={<BsHash className="text-gray-400" />}
                  placeholder="Bank code"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-blue-400 focus:border-blue-400"
                  size="large"
                  readOnly
                />
              </Form.Item>

              <Form.Item
                name="bin"
                label={<span className="text-white font-medium">BIN</span>}
                rules={[{ required: true, message: "BIN is required" }]}
              >
                <Input
                  prefix={<BsHash className="text-gray-400" />}
                  placeholder="BIN"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-blue-400 focus:border-blue-400"
                  size="large"
                  readOnly
                />
              </Form.Item>

              <Form.Item
                name="shortName"
                label={<span className="text-white font-medium">Short Name</span>}
                rules={[{ required: true, message: "Short name is required" }]}
              >
                <Input
                  placeholder="Short name"
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-blue-400 focus:border-blue-400"
                  size="large"
                  readOnly
                />
              </Form.Item>
            </div>

            <Form.Item
              name="bankAccountNumber"
              label={<span className="text-white font-medium">Bank Account Number</span>}
              rules={[
                { required: true, message: "Please enter bank account number" },
                {
                  pattern: /^\d{8,20}$/,
                  message: "Account number must be 8-20 digits",
                },
              ]}
            >
              <Input
                prefix={<BsCreditCard2Front className="text-gray-400" />}
                placeholder="Enter account number"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-blue-400 focus:border-blue-400"
                size="large"
                maxLength={20}
              />
            </Form.Item>

            <Form.Item
              name="accountName"
              label={<span className="text-white font-medium">Account Name</span>}
              rules={[
                { required: true, message: "Please enter account name" },
                { min: 2, message: "Account name must be at least 2 characters" },
              ]}
            >
              <Input
                prefix={<BsPerson className="text-gray-400" />}
                placeholder="Enter account name"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-blue-400 focus:border-blue-400"
                size="large"
                style={{ textTransform: "uppercase" }}
                onChange={(e) => {
                  const uppercaseValue = e.target.value.toUpperCase();
                  form.setFieldValue("accountName", uppercaseValue);
                }}
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
              We will rely on this information to transfer money. You need to write your account information correctly.
              If there is any error, we will not be responsible.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default BankInformationPage;
