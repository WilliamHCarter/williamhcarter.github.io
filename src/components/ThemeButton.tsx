import { createSignal, createEffect } from "solid-js";

export default function ThemeButton() {
  const isClient = typeof window !== 'undefined';

  // Set default theme based on user preference or localStorage
  const [theme, setTheme] = createSignal(
    isClient 
      ? localStorage.getItem("theme") 
        || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light")
      : "light"  // Default to light on the server
  );

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  // This effect takes care of syncing theme changes to the DOM and localStorage
  createEffect(() => {
    if (isClient) {
      const currentTheme = theme();
      document.documentElement.setAttribute("data-theme", currentTheme);
      document.documentElement.classList.toggle("dark", currentTheme === "dark");
      localStorage.setItem("theme", currentTheme);
    }
  });

  return (
    <button
      class="flex items-center self-center justify-evenly p-2 gap-x-1.5 rounded-md w-10 h-10 shadow-sm border border-solid border-[#ffffff29] hover:bg-gray-50 bg-[#805ad5] dark:bg-[#f6ad54]"
      aria-label="Toggle Dark Mode"
      onClick={toggleTheme}
    >
      {theme() === "light" ? (
        <img src="/../moon.svg" alt="moon-icon" class=" w-5 h-5 m-2 self-center invert" />
      ) : (
        <img src="/../sun.svg" alt="sun-icon" class=" w-5 h-5 m-2 self-center " />
      )}
    </button>
  );
}
