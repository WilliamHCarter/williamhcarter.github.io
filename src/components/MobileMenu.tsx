import { createSignal } from "solid-js";

function classNames(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen());
  };

  interface MenuItem {
    label: string;
    href: string;
  }

  const menuItems: MenuItem[] = [
    { label: "About", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Resume", href: "/WillCarterResume.pdf" },
    { label: "Contact", href: "/contact" },
    { label: "Github", href: "https://github.com/WilliamHCarter" },
  ];

  return (
    <>
      <button
        class={`inline-flex justify-center gap-x-1.5 rounded-md w-10 h-10 dark:bg-[#ffffff16] border border-solid border-[#e2e8f0] dark:border-[#ffffff29] hover:bg-gray-50 ${classNames(
          isOpen() ? "z-20" : "z-0"
        )}`}
        aria-label="Menu"
        onClick={toggleMenu}
      >
        <img src="/../menu.svg" alt="menu" class=" w-5 h-5 m-2 self-center dark:invert" />
      </button>

      <div
        class={`absolute right-0 z-10 mt-12 bg-offw dark:bg-[#2D3748] w-56 origin-top-right rounded-md  shadow-lg  border border-solid border-[#ffffff29] focus:outline-none transition-all duration-200 ease-in-out transform ${
          isOpen() ? "opacity-100 scale-100" : "opacity-0 hidden scale-95"
        }`}
      >
        <div class="py-1">
          {menuItems.map((item) => {
            const menuItemClass =
              "block px-4 py-2 text-sm text-gray-700 dark:text-offw hover:bg-gray-100 hover:text-gray-900";
            return (
              <a href={item.href} class={menuItemClass}>
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
