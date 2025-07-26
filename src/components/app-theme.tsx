import { ConfigProvider, theme as antdTheme } from "antd";
import { ReactNode, useEffect, useMemo } from "react";

interface AppThemeProps {
  theme?: "dark" | "light";
  children: ReactNode;
}

const AppTheme = ({ children, theme = "dark" }: AppThemeProps) => {
  const colorPrimary = "#FF6600";
  const borderRadius = 2;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};

export default AppTheme;
