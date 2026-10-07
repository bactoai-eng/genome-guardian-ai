import { useEffect } from "react";

export function useTheme() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const root = document.documentElement;
      root.classList.toggle("light", !preference.matches);
      root.classList.toggle("dark", preference.matches);
      root.style.colorScheme = preference.matches ? "dark" : "light";
    };
    apply();
    preference.addEventListener("change", apply);
    return () => preference.removeEventListener("change", apply);
  }, []);
}
