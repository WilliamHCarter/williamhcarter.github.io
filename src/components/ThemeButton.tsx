import { createSignal, createEffect, onCleanup } from "solid-js";

export default function ThemeButton() {
  const [theme, setTheme] = createSignal(localStorage.getItem("theme") ?? "light");

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  createEffect(() => {
    let currentTheme = theme();
    console.log("currentTheme:", currentTheme);
    if (currentTheme != null) {
      document.documentElement.setAttribute("data-theme", currentTheme);
      localStorage.setItem("theme", currentTheme);
      document.documentElement.classList.toggle("dark", currentTheme === "dark");
    }
  });

  return (
    <button
      class="flex items-center self-center justify-evenly p-2 gap-x-1.5 rounded-md w-10 h-10 shadow-sm border border-solid border-[#ffffff29] hover:bg-gray-50 bg-[#805ad5] dark:bg-[#f6ad54]"
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
    >
      <img src="/../moon.svg" alt="moon-icon" class=" w-5 h-5 m-2 self-center invert dark:hidden" />
      <img src="/../sun.svg" alt="sun-icon" class=" w-5 h-5 m-2 self-center hidden dark:block" />
    </button>
  );
}
