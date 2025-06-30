import { BsFiletypeExe } from "react-icons/bs";
import {
  FaAndroid,
  FaRegFile,
  FaRegFileArchive,
  FaRegFileImage,
} from "react-icons/fa";
import { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;

const extensionIconMap: Record<string, React.ElementType> = {
  jpg: FaRegFileImage,
  png: FaRegFileImage,
  webp: FaRegFileImage,
  exe: BsFiletypeExe,
  apk: FaAndroid,
  rar: FaRegFileArchive,
  zip: FaRegFileArchive,
};

type FileIconProps = {
  fileExtension: string;
} & IconProps;

const FileIcon = ({ fileExtension, ...props }: FileIconProps) => {
  const normalizedExt = fileExtension.toLowerCase();
  const IconComponent = extensionIconMap[normalizedExt] || FaRegFile;

  return <IconComponent {...props} />;
};

export default FileIcon;
