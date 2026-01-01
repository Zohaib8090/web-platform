import type { Video } from "@/lib/types";
import VideoCard from "./video-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VideoCarouselProps {
  title: string;
  videos: Video[];
}

export default function VideoCarousel({ title, videos }: VideoCarouselProps) {
  if (videos.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem
              key={video.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
            >
              <VideoCard video={video} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-12" />
        <CarouselNext className="mr-12" />
      </Carousel>
    </section>
  );
}
