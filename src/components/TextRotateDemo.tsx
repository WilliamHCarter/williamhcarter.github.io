import { createSignal } from "solid-js";
import TextRotate from "./TextRotate";

export default function TextRotateDemo() {
  const [isClient, setIsClient] = createSignal(false);

  if (typeof window !== "undefined") {
    setTimeout(() => setIsClient(true), 0);
  }

  return (
    <div class="flex flex-row items-center justify-center">
      <p class="flex whitespace-pre">
        {isClient() ? (
          <TextRotate
            texts={["Software", "Systems", "ML", "Full Stack"]}
            mainClassName="pc:text-2xl px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg z-10 backdrop-blur-sm bg-[#ffffff60] dark:bg-dnav"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2500}
          />
        ) : (
          // Fallback for server-side rendering
          <span class="pc:text-2xl text-white px-2 sm:px-2 md:px-3 bg-[#ffffff60] overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg">
            Software
          </span>
        )}
        <span class="pc:text-2xl pt-0.5 sm:pt-1 md:pt-2"> Engineer </span>
      </p>
    </div>
  );
}
