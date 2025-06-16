import { Button, Checkbox, Form, FormProps, Input, Radio } from "antd";
import UploadAvatar from "./upload-avatar";
import Tiptap from "@/components/tiptap/tiptap-editor";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/use-auth-store";
type FieldType = {
  username?: string;
  displayName?: string;
  website?: string;
  accountType: "Developer" | "Player";
  showAdultContent: boolean;
  bio: string;
};

const UserProfilePage = () => {
  const { profile } = useAuthStore();
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="p-5">
      <h1 className="font-bold text-2xl">Profile</h1>
      <div className="mb-3">
        <Link
          to={`/profile/${profile?.id}`}
          className="text-sm text-zinc-500 hover:text-zinc-200 duration-300"
        >
          (View my profile)
        </Link>
      </div>
      <div>
        <p className="font-bold">Profile image</p>
        <p className="text-sm text-gray-400">
          Shown next to your name when you take an action on the site (square
          dimensions)
        </p>
      </div>
      <div className="mt-3">
        <UploadAvatar />
      </div>
      <div className="mt-3">
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <div>
            <p className="mb-1 font-bold">
              Username <span className="font-normal">(*)</span>
            </p>
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                className="max-w-[600px]"
                placeholder="Enter your username"
              />
            </Form.Item>
          </div>

          <div className="max-w-[600px] mb-3">
            <p className="mb-1 font-bold">Display name</p>
            <Form.Item<FieldType>
              name="displayName"
              style={{ marginBottom: 5 }}
            >
              <Input placeholder="Enter your display name" />
            </Form.Item>
            <p className="text-sm text-gray-400">
              Name to be shown in place of your username, leave blank to default
              to username
            </p>
          </div>

          <div className="max-w-[600px]">
            <p className="mb-1 font-bold">Account type</p>
            <Form.Item<FieldType>
              name="accountType"
              initialValue={"Player"}
              rules={[
                { required: true, message: "Please select your account type!" },
              ]}
            >
              <Radio.Group>
                <Radio value="Player"> Player </Radio>
                <Radio value="Developer"> Developer </Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <p className="font-bold">Content</p>
          <p className="text-sm text-gray-400 mb-2">
            How content on IndieGameZone is shown to you
          </p>
          <Form.Item<FieldType>
            name="showAdultContent"
            className="max-w-[600px]"
            valuePropName="checked"
          >
            <Checkbox>Show content marked as adult in search & browse</Checkbox>
          </Form.Item>
          <div className="max-w-[600px]">
            <p className="mb-1 font-bold">Bio</p>
            <Form.Item<FieldType> name="bio">
              <Tiptap />
            </Form.Item>
          </div>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserProfilePage;
