"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import type { WatchlistItem } from "@/lib/types";


interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (videoId: string, videoTitle: string) => void;
  removeFromWatchlist: (videoId: string, videoTitle: string) => void;
  isInWatchlist: (videoId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const watchlistCollectionRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'watchlist') : null),
    [user, firestore]
  );
  
  const { data: watchlistItems } = useCollection<WatchlistItem>(watchlistCollectionRef);

  const watchlist = watchlistItems?.map(item => item.videoId) || [];

  const addToWatchlist = (videoId: string, videoTitle: string) => {
    if (!user || !firestore) return;
     const newWatchlistItem: Omit<WatchlistItem, 'id'> = {
        userId: user.uid,
        videoId: videoId,
        addedDate: serverTimestamp() as any,
     };
    addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'watchlist'), newWatchlistItem);
    toast({
      title: "Added to Watchlist",
      description: `"${videoTitle}" has been added to your list.`,
    });
  };

  const removeFromWatchlist = (videoId: string, videoTitle: string) => {
    if (!user || !firestore || !watchlistItems) return;
    const watchlistItem = watchlistItems.find(item => item.videoId === videoId);
    if(watchlistItem) {
        deleteDocumentNonBlocking(doc(firestore, 'users', user.uid, 'watchlist', watchlistItem.id));
        toast({
            title: "Removed from Watchlist",
            description: `"${videoTitle}" has been removed from your list.`,
        });
    }
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
