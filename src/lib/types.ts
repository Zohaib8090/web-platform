export type Video = {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  videoUrl: string;
  imageHint: string;
  duration: string;
  uploaderId?: string;
};

export type Category = {
  id: string;
  name: string;
};

export type WatchlistItem = {
    id: string;
    userId: string;
    videoId: string;
    addedDate: any; // Using `any` for Firestore ServerTimestamp
}
