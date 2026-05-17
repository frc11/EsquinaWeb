import Hero from "@/components/sections/home/Hero";

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-320px)] min-h-[50vh] w-full items-center justify-center overflow-hidden">
      <Hero />
    </div>
  );
}