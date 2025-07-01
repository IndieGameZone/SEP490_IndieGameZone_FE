import React, { createContext, useContext } from "react";
import { message } from "antd";

const MessageContext = createContext<ReturnType<
  typeof message.useMessage
> | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const messageApiTuple = message.useMessage();

  return (
    <MessageContext.Provider value={messageApiTuple}>
      {messageApiTuple[1]}
      {children}
    </MessageContext.Provider>
  );
};

export const useGlobalMessage = () => {
  const context = useContext(MessageContext);
  if (!context)
    throw new Error("useGlobalMessage must be used within a MessageProvider");
  return context[0]; 
};
