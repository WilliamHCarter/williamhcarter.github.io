import { createSignal } from "solid-js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen());
  };

  const menuItems = [
    { label: "About", href: "#" },
    { label: "Work", href: "#" },
    { label: "Resume", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Github", href: "#" },

  ];

  return (
    <>
      <button
        class={`inline-flex w-full justify-center gap-x-1.5 rounded-md w-10 h-10 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-ghl hover:bg-gray-50 ${classNames(
          isOpen() ? "z-20" : ""
        )}`}
        onClick={toggleMenu}
      >
        <img src="menu.svg" class="w-6 h-6 mt-2 mb-2 center" />
      </button>

      <div
        class={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md  bg-offw shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-in-out transform ${
          isOpen() ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div class="py-1">
          {menuItems.map((item) => {
            const menuItemClass =
              "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900";
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
