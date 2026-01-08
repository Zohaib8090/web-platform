"use client";

import { useEffect, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getVideoById, getVideosByCategory } from "@/lib/data";
import VideoCarousel from "@/components/video-carousel";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useWatchlist } from "@/context/watchlist-provider";
import { useAuth } from "@/context/auth-provider";
import type { Video } from "@/lib/types";

type WatchPageProps = {
  params: {
    id: string;
  };
};

function WatchPageContent({ video, relatedVideos }: { video: Video, relatedVideos: Video[] }) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(video.id);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(video.id, video.title);
    } else {
      addToWatchlist(video.id, video.title);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="aspect-video w-full bg-black">
        <video
          className="h-full w-full"
          controls
          autoPlay
          src={video.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="container max-w-screen-2xl py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold">{video.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{video.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">Duration: {video.duration}</p>
          </div>
          <div>
            <Button variant="outline" onClick={handleWatchlistToggle} className="w-full md:w-auto">
              {inWatchlist ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
            </Button>
          </div>
        </div>

        {relatedVideos.length > 0 && (
          <div className="mt-16">
            <VideoCarousel title="More in this Category" videos={relatedVideos} />
          </div>
        )}
      </div>
    </div>
  );
}


function WatchPage({ params }: WatchPageProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [video, setVideo] = useEffectState<Video | null | undefined>(undefined);
  const [relatedVideos, setRelatedVideos] = useEffectState<Video[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const fetchVideoData = async () => {
      const videoData = await getVideoById(params.id);
      setVideo(videoData);
      if (videoData) {
        const related = await getVideosByCategory(videoData.category);
        setRelatedVideos(related.filter((v) => v.id !== videoData.id));
      }
    };
    fetchVideoData();
  }, [params.id]);


  if (!isLoggedIn) {
    return null; // Or a loading spinner
  }
  
  if (video === undefined) {
     return <div className="flex h-screen items-center justify-center"><h1 className="text-2xl font-bold">Loading...</h1></div>;
  }

  if (!video) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Video not found</h1>
      </div>
    );
  }

  return <WatchPageContent video={video} relatedVideos={relatedVideos} />;
}


// A helper hook because React.use can't be used in the same component as useEffect
function useEffectState<T>(initialValue: T): [T, (newValue: T) => void] {
    const [state, setState] = use(
        (async () => {
            return {
                value: initialValue,
                setValue: (newValue: T) => {
                    // This is a dummy function, the real one is below
                },
            };
        })()
    );
    const [value, setValue] = useState(state.value);
    state.setValue = setValue;
    return [value, setValue];
}

export default function WatchPageWrapper(props: WatchPageProps) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><h1 className="text-2xl font-bold">Loading...</h1></div>}>
      <WatchPage {...props} />
    </Suspense>
  )
}
