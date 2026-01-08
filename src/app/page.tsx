import HeroSection from "@/components/hero-section";
import HomePageClient from "@/components/home-page-client";
import { getCategories, getFeaturedVideo, getStaticVideos } from "@/lib/data";

export default async function Home() {
  const staticVideos = getStaticVideos();
  const categories = getCategories();
  const featuredVideo = await getFeaturedVideo();

  if (!featuredVideo) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col">
      <HeroSection video={featuredVideo} />
      <HomePageClient
        staticVideos={staticVideos}
        categories={categories}
      />
    </div>
  );
}
