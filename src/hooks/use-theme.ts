import { useEffect } from "react";

/** The site always uses the dark theme, regardless of device setting. */
export function useTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  }, []);
}
