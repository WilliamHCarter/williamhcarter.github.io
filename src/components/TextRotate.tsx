import {
  createSignal,
  createEffect,
  onCleanup,
  splitProps,
  mergeProps,
  createMemo,
} from "solid-js";
import { Motion, Presence, PresenceProps, MotionProps, Transition } from "@motionone/solid";

interface TextRotateProps {
  texts: string[];
  rotationInterval?: number;
  initial?: MotionProps["initial"];
  animate?: MotionProps["animate"];
  exit?: MotionProps["exit"];
  animatePresenceMode?: PresenceProps["mode"];
  animatePresenceInitial?: boolean;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number | "random";
  transition?: Transition;
  loop?: boolean;
  auto?: boolean;
  splitBy?: "words" | "characters" | "lines" | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  ref?: (element: HTMLSpanElement) => void;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

function classNames(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function TextRotate(props: TextRotateProps) {
  // Merge with defaults
  const merged = mergeProps(
    {
      transition: { type: "spring", damping: 25, stiffness: 300 },
      initial: { y: "100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "-120%", opacity: 0 },
      animatePresenceMode: "wait" as const,
      animatePresenceInitial: false,
      rotationInterval: 2000,
      staggerDuration: 0,
      staggerFrom: "first" as const,
      loop: true,
      auto: true,
      splitBy: "characters" as const,
    },
    props,
  );

  const [currentTextIndex, setCurrentTextIndex] = createSignal(0);

  // handy function to split text into characters with support for unicode and emojis
  const splitIntoCharacters = (text: string): string[] => {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), ({ segment }) => segment);
    }
    // Fallback for browsers that don't support Intl.Segmenter
    return Array.from(text);
  };

  const elements = createMemo(() => {
    const currentText = merged.texts[currentTextIndex()];
    if (merged.splitBy === "characters") {
      const text = currentText.split(" ");
      return text.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== text.length - 1,
      }));
    }
    return merged.splitBy === "words"
      ? currentText.split(" ").map((word, i, arr) => ({
          characters: [word],
          needsSpace: i !== arr.length - 1,
        }))
      : merged.splitBy === "lines"
        ? currentText.split("\n").map((line, i, arr) => ({
            characters: [line],
            needsSpace: i !== arr.length - 1,
          }))
        : currentText.split(merged.splitBy).map((part, i, arr) => ({
            characters: [part],
            needsSpace: i !== arr.length - 1,
          }));
  });

  const getStaggerDelay = (index: number, totalChars: number) => {
    const total = totalChars;
    if (merged.staggerFrom === "first") return index * merged.staggerDuration;
    if (merged.staggerFrom === "last") return (total - 1 - index) * merged.staggerDuration;
    if (merged.staggerFrom === "center") {
      const center = Math.floor(total / 2);
      return Math.abs(center - index) * merged.staggerDuration;
    }
    if (merged.staggerFrom === "random") {
      const randomIndex = Math.floor(Math.random() * total);
      return Math.abs(randomIndex - index) * merged.staggerDuration;
    }
    if (typeof merged.staggerFrom === "number") {
      return Math.abs(merged.staggerFrom - index) * merged.staggerDuration;
    }
    return index * merged.staggerDuration;
  };

  // Helper function to handle index changes and trigger callback
  const handleIndexChange = (newIndex: number) => {
    setCurrentTextIndex(newIndex);
    merged.onNext?.(newIndex);
  };

  const next = () => {
    const nextIndex =
      currentTextIndex() === merged.texts.length - 1
        ? merged.loop
          ? 0
          : currentTextIndex()
        : currentTextIndex() + 1;

    if (nextIndex !== currentTextIndex()) {
      handleIndexChange(nextIndex);
    }
  };

  const previous = () => {
    const prevIndex =
      currentTextIndex() === 0
        ? merged.loop
          ? merged.texts.length - 1
          : currentTextIndex()
        : currentTextIndex() - 1;

    if (prevIndex !== currentTextIndex()) {
      handleIndexChange(prevIndex);
    }
  };

  const jumpTo = (index: number) => {
    const validIndex = Math.max(0, Math.min(index, merged.texts.length - 1));
    if (validIndex !== currentTextIndex()) {
      handleIndexChange(validIndex);
    }
  };

  const reset = () => {
    if (currentTextIndex() !== 0) {
      handleIndexChange(0);
    }
  };

  // Expose methods via ref if provided
  if (props.ref) {
    const methods: TextRotateRef = {
      next,
      previous,
      jumpTo,
      reset,
    };

    props.ref({
      get next() {
        return methods.next;
      },
      get previous() {
        return methods.previous;
      },
      get jumpTo() {
        return methods.jumpTo;
      },
      get reset() {
        return methods.reset;
      },
    } as any);
  }

  // Auto rotation
  createEffect(() => {
    if (!merged.auto) return;

    const intervalId = setInterval(next, merged.rotationInterval);
    onCleanup(() => clearInterval(intervalId));
  });

  return (
    <Motion
      class={classNames("flex flex-wrap whitespace-pre-wrap", merged.mainClassName)}
      layout
      transition={merged.transition}
    >
      <span class="sr-only">{merged.texts[currentTextIndex()]}</span>

      <Presence mode={merged.animatePresenceMode} initial={merged.animatePresenceInitial}>
        <Motion
          key={currentTextIndex()}
          class={classNames("flex flex-wrap", merged.splitBy === "lines" && "flex-col w-full")}
          layout
          aria-hidden="true"
        >
          {() => {
            const elems = elements();
            return elems.map((wordObj, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);

              return (
                <span class={classNames("inline-flex", merged.splitLevelClassName)}>
                  {wordObj.characters.map((char, charIndex) => (
                    <Motion
                      initial={merged.initial}
                      animate={merged.animate}
                      exit={merged.exit}
                      transition={{
                        ...merged.transition,
                        delay: getStaggerDelay(
                          previousCharsCount + charIndex,
                          array.reduce((sum, word) => sum + word.characters.length, 0),
                        ),
                      }}
                      class={classNames("inline-block", merged.elementLevelClassName)}
                    >
                      {char}
                    </Motion>
                  ))}
                  {wordObj.needsSpace && <span class="whitespace-pre"> </span>}
                </span>
              );
            });
          }}
        </Motion>
      </Presence>
    </Motion>
  );
}
