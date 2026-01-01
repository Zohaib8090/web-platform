"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Check } from "lucide-react";
import type { Video } from "@/lib/types";
import { Button } from "./ui/button";
import { useWatchlist } from "@/context/watchlist-provider";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const inWatchlist = isInWatchlist(video.id);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    if (inWatchlist) {
      removeFromWatchlist(video.id, video.title);
    } else {
      addToWatchlist(video.id, video.title);
    }
  };

  return (
    <Link href={`/watch/${video.id}`} className="group block overflow-hidden rounded-lg">
      <div className="relative aspect-video overflow-hidden rounded-md transition-transform duration-300 ease-in-out group-hover:scale-105">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          data-ai-hint={video.imageHint}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Play className="h-12 w-12 text-white/80" />
        </div>
        <div className="absolute bottom-2 right-2 flex flex-col items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleWatchlistToggle}
            className="h-9 w-9 bg-black/50 text-white hover:bg-black/70 hover:text-white"
            aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            {inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="truncate text-sm font-medium">{video.title}</h3>
        <p className="truncate text-xs text-muted-foreground">{video.duration}</p>
      </div>
    </Link>
  );
}
