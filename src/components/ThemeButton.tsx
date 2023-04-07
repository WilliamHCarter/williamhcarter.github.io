import { createEffect, createSignal } from "solid-js";

export default function ThemeButton() {
  const [theme, setTheme] = createSignal<string>(localStorage.getItem("theme") ?? "light");

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
    let currentTheme = localStorage.getItem("theme");
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
      class="flex items-center self-center justify-evenly p-2 gap-x-1.5 rounded-md w-10 h-10 shadow-sm  border border-solid border-[#ffffff29] hover:bg-gray-50 bg-[#805ad5] dark:bg-[#f6ad54]"
      onClick={toggleTheme}
    >
      {theme() === "light" ? (
        <img src="moon.svg" class=" w-5 h-5 m-2 self-center invert" />
      ) : (
        <img src="sun.svg" class=" w-5 h-5 m-2 self-center " />
      )}
    </button>
  );
}
