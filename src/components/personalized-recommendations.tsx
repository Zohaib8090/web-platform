
"use client";

import { recommendVideos } from "@/ai/flows/personalized-recommendations";
import { getVideos } from "@/lib/data";
import type { Video } from "@/lib/types";
import VideoCarousel from "./video-carousel";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // Don't run on server
      if (typeof window === 'undefined') return;

      setIsLoading(true);
      setError(null);
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
        setError("We couldn't load your recommendations. Please try again later.");
        setRecommendedVideos([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (error) {
     return (
        <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              Recommended For You
            </h2>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
        </section>
     )
  }

  if (!recommendedVideos || recommendedVideos.length === 0) {
    return null;
  }

  return (
    <VideoCarousel title="Recommended For You" videos={recommendedVideos} />
  );
}
