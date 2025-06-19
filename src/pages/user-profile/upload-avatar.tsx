import { uploadFile } from "@/lib/api/file-api";
import { updateUser } from "@/lib/api/user-api";
import useAuthStore from "@/store/use-auth-store";
import { Avatar, Button, Upload, message } from "antd";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaUpload } from "react-icons/fa";

const UploadAvatar = () => {
  const [imageUrl, setImageUrl] = useState("");
  const { profile, rerender } = useAuthStore();
  const handleBeforeUpload = async (file: File) => {
    if (!profile) return;
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
      return Upload.LIST_IGNORE;
    }
    var url = imageUrl;
    if (!url) {
      const result = await uploadFile(file);
      if (result.error) {
        message.error("Failed to upload image. Please try again.");
        return false;
      } else {
        setImageUrl(result.data);
        url = result.data;
      }
    }

    const updateAvatarResult = await updateUser(profile.id, {
      birthday: profile.birthday,
      fullName: profile.fullName ?? "",
      avatar: url,
      bankAccount: profile.bankAccount,
      bankName: profile.bankName,
      bio: profile.bio,
      facebookLink: profile.facebookLink,
    });
    if (updateAvatarResult.error) {
      message.error("Failed to upload image. Please try again.");
    } else {
      message.success("Update avatar successfully!");
      setTimeout(() => {
        rerender();
      }, 1000);
    }
    return false;
  };
  return (
    <div>
      <div className="flex gap-3">
        {profile?.avatar ? (
          <Avatar size={100} src={profile.avatar} />
        ) : (
          <Avatar size={100} icon={<CiUser />} />
        )}
        <Upload
          beforeUpload={handleBeforeUpload}
          showUploadList={false}
          accept=".png,.jpeg,.jpg"
        >
          <button className="size-[100px] flex justify-center items-center border border-zinc-500 hover:border-orange-500 cursor-pointer rounded-full duration-300 hover:text-orange-500">
            <FaUpload className="size-8" />
          </button>{" "}
        </Upload>
      </div>
      <Upload
        beforeUpload={handleBeforeUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Button className="mt-3">Upload Image</Button>
      </Upload>
      <p className="py-1 text-zinc-500 text-sm">Supported format: JPG, PNG</p>
    </div>
  );
};

export default UploadAvatar;
