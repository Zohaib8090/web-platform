
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SearchX, Film, ServerCrash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
};

const servers: Server[] = [
  { name: 'Server 1', urlTemplate: 'https://vidsrc.me/embed/{type}?imdb={id}' },
  { name: 'Server 2', urlTemplate: 'https://vidsrc.to/embed/{type}/{id}' },
  { name: 'Server 3', urlTemplate: 'https://embed.su/embed/{type}?imdb={id}' },
  { name: 'Server 4', urlTemplate: 'https://vidsrc.pro/embed/{type}/{id}' },
  { name: 'Server 5', urlTemplate: 'https://www.2embed.cc/embed/{id}' },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [media, setMedia] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [selectedServer, setSelectedServer] = useState(servers[0]);
  const [playerUrl, setPlayerUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
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
            throw new Error('Failed to fetch search results.');
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
              setSelectedMedia(validMedia[0]);
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
      // Ensure the ID has the 'tt' prefix.
      const sanitizedId = selectedMedia.imdbID.startsWith('tt') ? selectedMedia.imdbID : `tt${selectedMedia.imdbID}`;
      
      let url = selectedServer.urlTemplate;
      
      if (selectedMedia.Type === 'series') {
        // Handle server-specific series URL formats
        if (selectedServer.urlTemplate.includes('{type}')) {
             url = url.replace('{type}', 'tv');
        }
        // Special case for servers that might not use the `type` parameter
        // For series, add season and episode params
        if (selectedServer.name.startsWith("Server 1") || selectedServer.name.startsWith("Server 3")) {
             url += `&season=1&episode=1`
        }
      } else {
         if (selectedServer.urlTemplate.includes('{type}')) {
            url = url.replace('{type}', 'movie');
         }
      }
      
      setPlayerUrl(url.replace('{id}', sanitizedId));

    } else {
      setPlayerUrl('');
    }
  }, [selectedMedia, selectedServer]);

  const handleServerChange = (server: Server) => {
    setSelectedServer(server);
  };
  
  const handleMediaSelect = (item: Media) => {
    setSelectedMedia(item);
    // Reset to primary server when new media is selected
    setSelectedServer(servers[0]);
  }

  return (
    <div className="container mx-auto max-w-screen-2xl py-8">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">
        {query ? `Search Results for "${query}"` : 'Search for movies and series'}
      </h1>

      {selectedMedia ? (
        <div className="mb-8">
            <div className="overflow-hidden rounded-lg border bg-card shadow-lg">
                <div className="aspect-video w-full bg-black">
                    <iframe
                    key={playerUrl} // Re-renders iframe when URL changes
                    src={playerUrl}
                    title="Media Player"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">Server Switcher</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {servers.map((server) => (
                    <Button
                    key={server.name}
                    variant={selectedServer.name === server.name ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleServerChange(server)}
                    className={cn(
                        "transition-all duration-200",
                        selectedServer.name === server.name && "bg-accent hover:bg-accent/90 text-accent-foreground shadow-[0_0_10px] shadow-accent/50"
                    )}
                    >
                    {server.name}
                    </Button>
                ))}
                </div>
            </div>
        </div>
      ) : (
        query && !isLoading && !error && (
            <div className="mb-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card py-20 text-center">
                <ServerCrash className="h-16 w-16 text-muted-foreground/50" />
                <h2 className="mt-6 text-xl font-semibold">Source Not Found</h2>
                <p className="mt-2 text-sm text-muted-foreground">A playable source could not be found for the selected media, or your search yielded no results.</p>
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

      {error && <p className="text-center text-destructive">{error}</p>}
      
      {!isLoading && !error && media.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {media.map((item) => (
            <Card
              key={item.imdbID}
              className="cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg bg-card border-border/60"
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
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><h1 className="text-2xl font-bold">Loading...</h1></div>}>
            <SearchResults />
        </Suspense>
    )
}
