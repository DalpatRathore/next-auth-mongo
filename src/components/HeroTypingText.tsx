"use client";

import { TypewriterEffect } from "./ui/typewriter-effect";

export function HeroTypingText() {
  const words = [
    {
      text: "Build",
    },
    {
      text: "awesome",
    },
    {
      text: "apps",
    },
    {
      text: "with",
    },
    {
      text: "Aceternity.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center mb-2 rounded-lg border border-gray-100 py-8 w-full shadow">
      <p className="text-neutral-600 dark:text-neutral-200 text-base  mb-2 italic">
        The road to freedom starts from here
      </p>
      <TypewriterEffect words={words} />
    </div>
  );
}
