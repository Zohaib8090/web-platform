import { getVideos, getCategories, getFeaturedVideo } from "@/lib/data";
import PersonalizedRecommendations from "@/components/personalized-recommendations";
import HeroSection from "@/components/hero-section";
import HomePageClient from "@/components/home-page-client";

export default async function Home() {
  const videos = await getVideos();
  const categories = getCategories();
  const featuredVideo = await getFeaturedVideo();

  // A hardcoded viewing history to get personalized recommendations
  const viewingHistory = [
    "The Matrix",
    "Blade Runner 2049",
    "Attack on Titan",
  ];

  if (!featuredVideo) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col">
      <HeroSection video={featuredVideo} />
      <HomePageClient
        videos={videos}
        categories={categories}
        recommendationsSlot={
          <PersonalizedRecommendations viewingHistory={viewingHistory} />
        }
      />
    </div>
  );
}
