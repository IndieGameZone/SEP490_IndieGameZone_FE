import { ReactNode } from "react";
import UploadSteps from "./upload-steps";

const StepLayout = ({
  children,
  current,
  title,
}: {
  children: ReactNode;
  current: number;
  title: string;
}) => {
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-8">
        <h2 className="text-2xl mb-3">{title}</h2>
        {children}
      </div>
      <div className="col-span-4">
        <UploadSteps current={current} />
      </div>
    </div>
  );
};

export default StepLayout;
