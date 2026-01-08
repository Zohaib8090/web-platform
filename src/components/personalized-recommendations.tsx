"use client";

import { recommendVideos } from "@/ai/flows/personalized-recommendations";
import { getVideos } from "@/lib/data";
import type { Video } from "@/lib/types";
import VideoCarousel from "./video-carousel";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

interface PersonalizedRecommendationsProps {
  viewingHistory: string[];
}

export default function PersonalizedRecommendations({
  viewingHistory,
}: PersonalizedRecommendationsProps) {
  const [recommendedVideos, setRecommendedVideos] = useState<Video[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const output = await recommendVideos({
          viewingHistory,
          numRecommendations: 10,
        });
        
        const allVideos = await getVideos();
        const videos = output.recommendations
          .map((recTitle) =>
            allVideos.find(
              (v) => v.title.toLowerCase() === recTitle.toLowerCase()
            )
          )
          .filter((v): v is Video => v !== undefined);

        setRecommendedVideos(videos);
      } catch (error) {
        console.error("Error fetching personalized recommendations:", error);
        setRecommendedVideos([]); // Set to empty array on error to avoid constant retries
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [viewingHistory]);

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">
          Recommended For You
        </h2>
        <div className="flex space-x-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1/5">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!recommendedVideos || recommendedVideos.length === 0) {
    return null;
  }

  return (
    <VideoCarousel title="Recommended For You" videos={recommendedVideos} />
  );
}
