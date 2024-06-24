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
      text: "Dalpat",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Rathore.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center mb-2 rounded-lg border border-gray-100 py-8 w-full shadow">
      <TypewriterEffect words={words} />
    </div>
  );
}
