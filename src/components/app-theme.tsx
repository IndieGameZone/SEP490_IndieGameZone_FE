import { ConfigProvider, theme as antdTheme } from "antd";
import clsx from "clsx";
import { ReactNode, useMemo } from "react";

interface AppThemeProps {
  theme?: "dark" | "light";
  children: ReactNode;
}

const AppTheme = ({ children, theme = "dark" }: AppThemeProps) => {
  const colorPrimary = "#FF6600";
  const borderRadius = 2;

  const themeConfig = useMemo(() => {
    return theme === "dark"
      ? {
          algorithm: antdTheme.darkAlgorithm,
          token: {
            colorPrimary,
            borderRadius,
            colorLink: "#FFF",
          },
        }
      : {
          algorithm: antdTheme.defaultAlgorithm,
          token: {
            colorPrimary,
            borderRadius,
          },
        };
  }, [theme]);

  return (
    <div className={clsx({ dark: theme === "dark" })}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </div>
  );
};

export default AppTheme;
