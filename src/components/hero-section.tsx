import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Button } from "./ui/button";
import type { Video } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type HeroSectionProps = {
  video: Video;
};

export default function HeroSection({ video }: HeroSectionProps) {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <section className="relative h-[60vh] w-full">
      <div className="absolute inset-0">
        <Image
          src={heroImage?.imageUrl || "https://picsum.photos/seed/hero/1280/720"}
          alt={video.title}
          fill
          className="object-cover"
          data-ai-hint={heroImage?.imageHint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 flex h-full max-w-screen-2xl flex-col justify-end pb-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            {video.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-foreground/80">
            {video.description}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <Link href={`/watch/${video.id}`} passHref>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlayCircle className="mr-2 h-6 w-6" />
                Play Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
