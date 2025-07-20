import { ReactElement, ReactNode } from "react";

type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (children: ReactNode) => ReactElement;
  children: ReactNode;
};

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) => {
  return condition ? wrapper(children) : <>{children}</>;
};

export default ConditionalWrapper;
