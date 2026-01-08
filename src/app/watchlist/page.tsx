"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { useWatchlist } from "@/context/watchlist-provider";
import { getVideos } from "@/lib/data";
import VideoCard from "@/components/video-card";
import { ListVideo } from "lucide-react";
import type { Video } from "@/lib/types";

export default function WatchlistPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { watchlist } = useWatchlist();
  const [watchlistVideos, setWatchlistVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);
  
  useEffect(() => {
    const fetchWatchlistVideos = async () => {
      if(isLoggedIn) {
        setIsLoading(true);
        const allVideos = await getVideos();
        const videos = allVideos.filter(video => watchlist.includes(video.id));
        setWatchlistVideos(videos);
        setIsLoading(false);
      }
    }
    fetchWatchlistVideos();
  }, [watchlist, isLoggedIn])


  if (!isLoggedIn) {
    return null; // or a loading spinner
  }
  
  if (isLoading) {
    return <div className="container max-w-screen-2xl py-8"><h1 className="mb-8 text-3xl font-bold tracking-tight">My Watchlist</h1><p>Loading...</p></div>
  }

  return (
    <div className="container max-w-screen-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">My Watchlist</h1>
      {watchlistVideos.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {watchlistVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
            <ListVideo className="h-16 w-16 text-muted-foreground/50" />
            <h2 className="mt-6 text-xl font-semibold">Your Watchlist is Empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">Add movies and shows to your watchlist to see them here.</p>
        </div>
      )}
    </div>
  );
}
