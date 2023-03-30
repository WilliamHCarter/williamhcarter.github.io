import { createSignal } from "solid-js";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen());
  };

  return (
    <>
      <button
        class="bg-transparent border border-[#E2E8F0] border-solid w-10 h-10 mr-4 cursor-pointer flex justify-center items-center p-0"
        onClick={toggleMenu}
      >
        <img src="/menu.svg" alt="Menu" class="pc:hidden w-4" />
      </button>
      {isOpen() && (
        <nav class="absolute top-full right-0 bg-white rounded shadow-md z-10">
          <ul class="list-none m-0 p-0">
            <li class="px-4 py-2">
              <a href="/" class="text-gray-700 hover:text-blue-600">
                Home
              </a>
            </li>
            <li class="px-4 py-2">
              <a href="/work" class="text-gray-700 hover:text-blue-600">
                Work
              </a>
            </li>
            <li class="px-4 py-2">
              <a href="/contact" class="text-gray-700 hover:text-blue-600">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
