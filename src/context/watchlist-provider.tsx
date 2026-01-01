"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (videoId: string, videoTitle: string) => void;
  removeFromWatchlist: (videoId: string, videoTitle: string) => void;
  isInWatchlist: (videoId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem("watchlist");
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to parse watchlist from localStorage", error);
      setWatchlist([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    } catch (error) {
      console.error("Failed to save watchlist to localStorage", error);
    }
  }, [watchlist]);

  const addToWatchlist = (videoId: string, videoTitle: string) => {
    if (!watchlist.includes(videoId)) {
      setWatchlist((prev) => [...prev, videoId]);
      toast({
        title: "Added to Watchlist",
        description: `"${videoTitle}" has been added to your list.`,
      });
    }
  };

  const removeFromWatchlist = (videoId: string, videoTitle: string) => {
    setWatchlist((prev) => prev.filter((id) => id !== videoId));
    toast({
      title: "Removed from Watchlist",
      description: `"${videoTitle}" has been removed from your list.`,
    });
  };

  const isInWatchlist = (videoId: string) => {
    return watchlist.includes(videoId);
  };

  const value = { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
