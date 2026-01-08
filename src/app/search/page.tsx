
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SearchX, Film, ServerCrash, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Media {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Type: 'movie' | 'series' | 'episode';
}

type Server = {
  name: string;
  urlTemplate: string;
  status: 'HD' | 'Fast' | 'Stable';
};

const servers: Server[] = [
  { name: 'Server 1', urlTemplate: 'https://vidsrc.me/embed/{type}?imdb={id}', status: 'HD' },
  { name: 'Server 2', urlTemplate: 'https://vidsrc.to/embed/{type}/{id}', status: 'Fast' },
  { name: 'Server 3', urlTemplate: 'https://embed.su/embed/{type}?imdb={id}', status: 'Stable' },
  { name: 'Server 4', urlTemplate: 'https://vidsrc.pro/embed/{type}/{id}', status: 'HD' },
  { name: 'Server 5', urlTemplate: 'https://www.2embed.cc/embed/{id}', status: 'Fast' },
  { name: 'VidLink', urlTemplate: 'https://vidlink.to/embed?imdb={id}', status: 'HD' },
  { name: 'AutoEmbed', urlTemplate: 'https://autoembed.to/{type}/imdb/{id}', status: 'Fast' }
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const [playerUrl, setPlayerUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchMedia = async () => {
        setIsLoading(true);
        setError(null);
        setMedia([]);
        setSelectedMedia(null);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch search results.');
          }
          const data = await response.json();
          if (data.Response === "False") {
            setMedia([]);
          } else {
            const validMedia = data.Search.filter(
              (item: Media) => item.Poster && item.Poster !== 'N/A' && item.imdbID && item.imdbID.startsWith('tt')
            );
            setMedia(validMedia);
            if (validMedia.length > 0) {
              handleMediaSelect(validMedia[0]);
            }
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMedia();
    } else {
      setMedia([]);
      setSelectedMedia(null);
    }
  }, [query]);

  useEffect(() => {
    if (selectedMedia) {
      setIsPlayerLoading(true);
      const sanitizedId = selectedMedia.imdbID.startsWith('tt') ? selectedMedia.imdbID : `tt${selectedMedia.imdbID}`;
      
      let url = selectedServer.urlTemplate;
      const typeForUrl = selectedMedia.Type === 'series' ? 'tv' : 'movie';

      url = url.replace('{type}', typeForUrl).replace('{id}', sanitizedId);

      // Special handling for series to add season/episode for servers that support it
      if (selectedMedia.Type === 'series' && (selectedServer.name === 'Server 1' || selectedServer.name === 'Server 3')) {
         url += `&season=1&episode=1`;
      }
      
      setPlayerUrl(url);

    } else {
      setPlayerUrl('');
    }
  }, [selectedMedia, selectedServer]);

  const handleServerChange = (server: Server) => {
    setSelectedServer(server);
  };
  
  const handleMediaSelect = (item: Media) => {
    setSelectedMedia(item);
    setSelectedServer(servers[0]);
  }

  return (
    <>
      <div className="container mx-auto min-h-[calc(100vh-12rem)] max-w-screen-2xl py-8">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">
          {query ? `Search Results for "${query}"` : 'Search for movies and series'}
        </h1>

        {selectedMedia ? (
          <div className="mb-8">
              <div className="relative overflow-hidden rounded-lg border bg-card shadow-2xl shadow-accent/10">
                  <div className="aspect-video w-full bg-black">
                      {isPlayerLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <Loader2 className="h-16 w-16 animate-spin text-accent" />
                          </div>
                      )}
                      <iframe
                        key={playerUrl}
                        src={playerUrl}
                        title="Media Player"
                        className={cn("h-full w-full", isPlayerLoading ? "opacity-0" : "opacity-100 transition-opacity duration-500")}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onLoad={() => setIsPlayerLoading(false)}
                      ></iframe>
                  </div>
              </div>
              <div className="mt-6">
                  <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">Server Switcher</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                  {servers.map((server) => (
                      <Button
                          key={server.name}
                          variant="outline"
                          onClick={() => handleServerChange(server)}
                          className={cn(
                              "group relative justify-center border-2 border-transparent bg-secondary/60 py-6 text-base font-semibold transition-all duration-200 hover:border-accent",
                              selectedServer.name === server.name && "border-accent bg-accent/10 text-accent shadow-[0_0_15px] shadow-accent/40"
                          )}
                          >
                          {server.name}
                          <Badge variant={selectedServer.name === server.name ? "destructive" : "secondary"} className="absolute -top-2 -right-2 rounded-full border border-background px-2 py-0.5 text-xs font-bold">
                            {server.status}
                          </Badge>
                      </Button>
                  ))}
                  </div>
              </div>
          </div>
        ) : (
          query && !isLoading && !error && media.length > 0 && (
              <div className="mb-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card py-20 text-center">
                  <Film className="h-16 w-16 text-muted-foreground/50" />
                  <h2 className="mt-6 text-xl font-semibold">Select a Movie or Show</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Click on any title below to start watching.</p>
              </div>
          )
        )}

        {isLoading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-card py-20 text-center">
              <ServerCrash className="h-16 w-16 text-destructive/80" />
              <h2 className="mt-6 text-xl font-semibold">An Error Occurred</h2>
              <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        )}
        
        {!isLoading && !error && media.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {media.map((item) => (
              <Card
                key={item.imdbID}
                className={cn("cursor-pointer overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-accent/20 bg-card border-border/60",
                  selectedMedia?.imdbID === item.imdbID && "ring-2 ring-accent shadow-xl shadow-accent/30 scale-105"
                )}
                onClick={() => handleMediaSelect(item)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={item.Poster}
                      alt={item.Title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3">
                    <h3 className="truncate font-semibold">{item.Title}</h3>
                    <p className="text-sm text-muted-foreground">{item.Year}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && media.length === 0 && query && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-20 text-center">
              <SearchX className="h-16 w-16 text-muted-foreground/50" />
              <h2 className="mt-6 text-xl font-semibold">No Results Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">Your search for "{query}" did not return any results. Please try another search.</p>
          </div>
        )}
      </div>
      <footer className="w-full py-4 text-center">
        <p className="text-sm text-muted-foreground">Open Source Project by Zohaib</p>
      </footer>
    </>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-accent"/></div>}>
            <SearchResults />
        </Suspense>
    )
}
