import Link from "next/link";
import { PlaySquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-xl font-bold tracking-tight text-white",
        className
      )}
    >
      <PlaySquare className="h-6 w-6 text-accent" />
      <span>StreamVerse</span>
    </Link>
  );
}
