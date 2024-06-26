import { HeroTypingText } from "@/components/HeroTypingText";
import ParallaxSection from "@/components/ParallaxScroll";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-between py-10 max-w-7xl px-2 mx-auto">
      <HeroTypingText></HeroTypingText>
      <ParallaxSection></ParallaxSection>
    </main>
  );
}
