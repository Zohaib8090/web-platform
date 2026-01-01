"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { getVideoById, getVideosByCategory } from "@/lib/data";
import VideoCarousel from "@/components/video-carousel";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useWatchlist } from "@/context/watchlist-provider";

type WatchPageProps = {
  params: {
    id: string;
  };
};

export default function WatchPage({ params }: WatchPageProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const video = getVideoById(params.id);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // Or a loading spinner
  }

  if (!video) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Video not found</h1>
      </div>
    );
  }
  
  const inWatchlist = isInWatchlist(video.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(video.id, video.title);
    } else {
      addToWatchlist(video.id, video.title);
    }
  };


  const relatedVideos = getVideosByCategory(video.category).filter(
    (v) => v.id !== video.id
  );

  return (
    <div className="flex flex-col">
      <div className="aspect-video w-full bg-black">
        <video
          className="h-full w-full"
          controls
          autoPlay
          src={video.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="container max-w-screen-2xl py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
                <h1 className="text-4xl font-bold">{video.title}</h1>
                <p className="mt-2 text-lg text-muted-foreground">{video.description}</p>
                 <p className="mt-2 text-sm text-muted-foreground">Duration: {video.duration}</p>
            </div>
            <div>
                 <Button variant="outline" onClick={handleWatchlistToggle} className="w-full md:w-auto">
                    {inWatchlist ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
            </div>
        </div>

        {relatedVideos.length > 0 && (
          <div className="mt-16">
            <VideoCarousel title="More in this Category" videos={relatedVideos} />
          </div>
        )}
      </div>
    </div>
  );
}
