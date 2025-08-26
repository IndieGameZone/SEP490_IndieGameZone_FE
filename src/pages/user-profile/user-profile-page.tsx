import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormProps,
  Input,
  Radio,
  message,
} from "antd";
import UploadAvatar from "./upload-avatar";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/use-auth-store";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import moment, { Moment } from "moment";
import { RuleObject } from "antd/es/form";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { updateUser } from "@/lib/api/user-api";
import { isValidYouTubeChannelUrl } from "@/lib/url";
import { FaFacebookSquare, FaYoutube } from "react-icons/fa";

type FieldType = {
  username: string;
  email: string;
  fullName: string;
  birthday: Moment;
  accountType: "Developer" | "Player";
  showAdultContent: boolean;
  bio?: string;
  facebookLink?: string;
  youtubeChannelLink?: string;
};

const validateBirthday = (_: any, value: Moment) => {
  if (!value) {
    return Promise.reject("Please select your birthday");
  }

  const today = moment();
  const minDate = today.clone().subtract(120, "years");

  if (value.isAfter(today)) {
    return Promise.reject("Birthday cannot be in the future");
  }

  if (value.isBefore(minDate)) {
    return Promise.reject("Birthday must be within the last 120 years");
  }

  return Promise.resolve();
};

const validateFacebookUrl = async (_: RuleObject, value: string) => {
  if (!value) return Promise.resolve();

  try {
    const url = new URL(value);
    if (!/^https?:\/\/(www\.)?facebook\.com\//.test(url.href)) {
      return Promise.reject("Please enter a valid Facebook URL");
    }
    return Promise.resolve();
  } catch {
    return Promise.reject("Please enter a valid URL");
  }
};

const validateYoutubeUrl = async (_: RuleObject, value: string) => {
  if (!value) return Promise.resolve();
  if (!isValidYouTubeChannelUrl(value)) {
    return Promise.reject("Please enter a valid Youtube URL");
  }
  return Promise.resolve();
};

const UserProfilePage = () => {
  const { profile, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = useForm<FieldType>();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!profile) return;
    setLoading(true);
    const result = await updateUser(profile.id, {
      avatar: profile.avatar,
      bio: values.bio,
      birthday: values.birthday.format("YYYY-MM-DD"),
      facebookLink: values.facebookLink,
      youtubeChannelLink: values.youtubeChannelLink,
      fullName: values.fullName,
    });
    if (result.error) {
      messageApi.error("Failed to update profile. Please try again.");
    } else {
      messageApi.success("Update profile successfully.");
      setTimeout(() => {
        fetchProfile();
      }, 1000);
    }
    setLoading(false);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        accountType: profile.role.name == "Developer" ? "Developer" : "Player",
        bio: profile.bio,
        birthday: profile.birthday ? moment(profile.birthday) : undefined,
        email: profile.email,
        facebookLink: profile.facebookLink,
        fullName: profile.fullname,
        username: profile.userName,
        youtubeChannelLink: profile.youtubeChannelLink,
      });
    }
  }, [profile]);

  return (
    <div className="p-5">
      {contextHolder}
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
          name="edit-profile-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          form={form}
        >
          <Form.Item<FieldType>
            name="username"
            label={<div className="font-bold">Username</div>}
            rules={[{ required: true, message: "Please enter your username!" }]}
            style={{ marginBottom: 15 }}
            extra="Shown next to your profile image"
          >
            <Input
              className="max-w-[600px]"
              placeholder="Enter your username"
              disabled
            />
          </Form.Item>
          <Form.Item<FieldType>
            name="email"
            label={<div className="font-bold">Email</div>}
            rules={[{ required: true, message: "Please enter your email!" }]}
            style={{ marginBottom: 15 }}
            extra="Used to log in and recover your password"
          >
            <Input
              className="max-w-[600px]"
              placeholder="Enter your email"
              disabled
            />
          </Form.Item>
          <div className="max-w-[600px] mb-3">
            <Form.Item<FieldType>
              name="fullName"
              label={<p className="font-bold">Full name</p>}
              style={{ marginBottom: 15 }}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>
          </div>
          <Form.Item
            label={<p className="font-bold">Birthday</p>}
            name="birthday"
            rules={[{ validator: validateBirthday }]}
          >
            <DatePicker className="max-w-[600px]" format="DD-MM-YYYY" />
          </Form.Item>

          <div className="max-w-[600px]">
            <Form.Item<FieldType>
              name="accountType"
              label={<p className="font-bold">Account type</p>}
              initialValue={"Player"}
              rules={[
                { required: true, message: "Please select your account type!" },
              ]}
            >
              <Radio.Group disabled>
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
            <Form.Item<FieldType>
              name="bio"
              label={<p className="font-bold">Bio</p>}
              extra="Briefly introduce yourself"
            >
              <TiptapEditor type="minimal" />
            </Form.Item>
          </div>
          <Form.Item<FieldType>
            label={
              <div className="flex gap-2 items-center font-bold">
                <FaFacebookSquare />
                Facebook Profile Link
              </div>
            }
            name="facebookLink"
            className="max-w-[600px]"
            rules={[{ validator: validateFacebookUrl }]}
            extra="Link to your Facebook account (optional)"
          >
            <Input placeholder="https://www.facebook.com/your.profile" />
          </Form.Item>
          <Form.Item<FieldType>
            label={
              <div className="flex gap-2 items-center font-bold">
                <FaYoutube />
                Youtube Channel Link
              </div>
            }
            name="youtubeChannelLink"
            className="max-w-[600px]"
            rules={[{ validator: validateYoutubeUrl }]}
            extra="Link to your Youtube channel (optional)"
          >
            <Input placeholder="https://www.youtube.com/@handle" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserProfilePage;
