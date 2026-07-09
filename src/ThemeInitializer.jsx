import { useEffect } from "react";
import { useUIStore } from "./store/uiStore";

function ThemeInitializer() {
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  useEffect(() => {
    setTheme(theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      if (theme === "system") {
        setTheme("system");
      }
    };

    media.addEventListener("change", handler);

    return () => media.removeEventListener("change", handler);
  }, [theme, setTheme]);

  return null;
}

export default ThemeInitializer;