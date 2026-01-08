"use client";

import React, { useMemo } from "react";
import type { Video, Category } from "@/lib/types";
import { useSearch } from "@/context/search-provider";
import VideoCarousel from "./video-carousel";

interface HomePageClientProps {
  videos: Video[];
  categories: Category[];
  recommendationsSlot: React.ReactNode;
}

export default function HomePageClient({
  videos,
  categories,
  recommendationsSlot,
}: HomePageClientProps) {
  const { searchQuery } = useSearch();

  const filteredVideos = useMemo(() => {
    if (!searchQuery) {
      return videos;
    }
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, videos]);

  const videosByCategory = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      videos: filteredVideos.filter((video) => video.category === category.id),
    })).filter(category => category.videos.length > 0);
  }, [categories, filteredVideos]);

  return (
    <div className="container max-w-screen-2xl py-8">
      <div className="space-y-12">
        {searchQuery ? (
          videosByCategory.length > 0 ? (
            videosByCategory.map((category) => (
              <VideoCarousel
                key={category.id}
                title={category.name}
                videos={category.videos}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <h2 className="text-2xl font-semibold">No results found</h2>
                <p className="text-muted-foreground mt-2">Try searching for something else.</p>
            </div>
          )
        ) : (
          <>
            {recommendationsSlot}
            {categories.map((category) => (
              <VideoCarousel
                key={category.id}
                title={category.name}
                videos={videos.filter((video) => video.category === category.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
