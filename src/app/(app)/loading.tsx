import { SunMark } from "@/components/sun-mark";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <SunMark className="size-12 animate-sun-shine text-primary/50" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
