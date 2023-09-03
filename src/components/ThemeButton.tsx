import { createSignal, createEffect, onMount } from "solid-js";
export default function ThemeButton() {
  const [theme, setTheme] = createSignal(localStorage.getItem("theme") ?? "light");

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === "light" ? "dark" : "light");
  };

  // Update theme on button toggle
  createEffect(() => {
    const currentTheme = theme();
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  });

  // Event listener for system theme change
  onMount(() => {
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

    // If theme isn't set in localStorage, use system preference
    if (!localStorage.getItem("theme")) {
      const prefersDark = systemPreference.matches ?? false;
      setTheme(prefersDark ? "dark" : "light");
    }

    // If system prefs change, adjust theme regardless of user choice
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    systemPreference.addEventListener("change", handleMediaChange);
    return () => systemPreference.removeEventListener("change", handleMediaChange);
  });

  return (
    <button
      class="flex items-center justify-evenly rounded-md w-10 h-10 shadow-sm border border-solid border-[#ffffff29] hover:bg-gray-50 bg-[#805ad5] dark:bg-[#f6ad54]"
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
    >
      <img src="/../moon.svg" alt="moon-icon" class=" w-5 h-5 m-2 self-center invert dark:hidden" />
      <img src="/../sun.svg" alt="sun-icon" class=" w-5 h-5 m-2 self-center hidden dark:block" />
    </button>
  );
}
