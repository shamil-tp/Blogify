import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full
      bg-slate-200 text-slate-900
      dark:bg-slate-800 dark:text-slate-100
      shadow-md transition hover:scale-105"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
