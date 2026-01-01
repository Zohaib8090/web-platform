import { recommendVideos } from "@/ai/flows/personalized-recommendations";
import { getVideos } from "@/lib/data";
import type { Video } from "@/lib/types";
import VideoCarousel from "./video-carousel";

interface PersonalizedRecommendationsProps {
  viewingHistory: string[];
}

export default async function PersonalizedRecommendations({
  viewingHistory,
}: PersonalizedRecommendationsProps) {
  try {
    const output = await recommendVideos({
      viewingHistory,
      numRecommendations: 10,
    });

    const allVideos = getVideos();

    // The AI might recommend videos we don't have in our mock data.
    // We'll find videos in our library that match the recommendations.
    const recommendedVideos = output.recommendations
      .map((recTitle) =>
        allVideos.find((v) => v.title.toLowerCase() === recTitle.toLowerCase())
      )
      .filter((v): v is Video => v !== undefined);
      
    if (recommendedVideos.length === 0) return null;

    return (
      <VideoCarousel title="Recommended For You" videos={recommendedVideos} />
    );
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    return null;
  }
}
