import { createEffect, createSignal } from "solid-js";

export default function ThemeButton() {
  const [theme, setTheme] = createSignal<string>(localStorage.getItem("theme") ?? "light");

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
    let currentTheme = localStorage.getItem("theme")
    if (currentTheme != null) {
      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem("theme", currentTheme);
    }
  };

  createEffect(() => {
    const isDark = theme() === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme());
  });

  return (
    <button
      class="flex items-center justify-evenly p-2 gap-x-1.5 rounded-md w-10 shadow-sm ring-1 ring-inset ring-ghl hover:bg-gray-50"
      onClick={toggleTheme}
    >
      {theme() === "light" ? "🌙" : "🌞"}
    </button>
  );
}
