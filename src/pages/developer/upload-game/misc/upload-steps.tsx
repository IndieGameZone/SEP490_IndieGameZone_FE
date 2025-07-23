import { Steps } from "antd";

const steps = [
  {
    title: "Basic Game Info",
    description: "Provide the game title, genre, and a short description.",
  },
  {
    title: "Upload Media Assets",
    description:
      "Add screenshots, cover images, and other promotional visuals.",
  },
  {
    title: "Upload Game Files",
    description: "Upload the playable build or installer for your game.",
  },
  {
    title: "Review and Submit",
    description:
      "Double-check all information and media, then click submit for review.",
  },
];

const items = steps.map((item) => ({
  key: item.title,
  title: item.title,
  description: item.description,
}));

const UploadSteps = ({ current }: { current: number }) => {
  return <Steps current={current} items={items} direction="vertical" />;
};

export default UploadSteps;
