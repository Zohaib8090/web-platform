

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

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
}

const servers = [
  { name: 'Primary Server', urlTemplate: 'https://vidsrc.me/embed/movie?imdb={id}' },
  { name: 'Server 2', urlTemplate: 'https://vidsrc.to/embed/movie/{id}' },
  { name: 'Server 3 (su)', urlTemplate: 'https://embed.su/movie?imdb={id}' },
];

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState(servers[0].urlTemplate);
  const [playerUrl, setPlayerUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchMovies = async () => {
        setIsLoading(true);
        setError(null);
        setMovies([]);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (!response.ok) {
            throw new Error('Failed to fetch search results.');
          }
          const data = await response.json();
          if (data.Response === "False") {
            setMovies([]);
            setSelectedMovieId(null);
          } else {
            // Filter for movies with both a valid poster and a valid imdbID
            const validMovies = data.Search.filter(
              (movie: Movie) => movie.Poster && movie.Poster !== 'N/A' && movie.imdbID && movie.imdbID.startsWith('tt')
            );
            setMovies(validMovies);
            if (validMovies.length > 0) {
              setSelectedMovieId(validMovies[0].imdbID);
            } else {
              setSelectedMovieId(null);
            }
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMovies();
    } else {
      setMovies([]);
      setSelectedMovieId(null);
    }
  }, [query]);

  useEffect(() => {
    if (selectedMovieId) {
      // Ensure the ID has the 'tt' prefix, although OMDb usually provides it.
      const sanitizedId = selectedMovieId.startsWith('tt') ? selectedMovieId : `tt${selectedMovieId}`;
      setPlayerUrl(selectedServer.replace('{id}', sanitizedId));
    } else {
      setPlayerUrl('');
    }
  }, [selectedMovieId, selectedServer]);

  const handleServerChange = (urlTemplate: string) => {
    setSelectedServer(urlTemplate);
  };
  
  const handleMovieSelect = (movie: Movie) => {
    if(movie.imdbID){
        setSelectedMovieId(movie.imdbID);
        // Reset to primary server when a new movie is selected
        setSelectedServer(servers[0].urlTemplate);
    } else {
        setSelectedMovieId(null);
    }
  }

  return (
    <div className="container mx-auto max-w-screen-2xl py-8">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">
        {query ? `Search Results for "${query}"` : 'Search for a movie'}
      </h1>

      {selectedMovieId && playerUrl ? (
        <div className="mb-8">
            <div className="overflow-hidden rounded-lg border shadow-lg">
                <div className="aspect-video w-full bg-black">
                    <iframe
                    key={playerUrl} // Re-renders iframe when URL changes
                    src={playerUrl}
                    title="Movie Player"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Server Switcher:</h3>
                <div className="flex flex-wrap gap-2">
                {servers.map((server) => (
                    <Button
                    key={server.name}
                    variant={selectedServer === server.urlTemplate ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleServerChange(server.urlTemplate)}
                    className={cn(
                        selectedServer === server.urlTemplate && "bg-accent hover:bg-accent/90 text-accent-foreground"
                    )}
                    >
                    {server.name}
                    </Button>
                ))}
                </div>
            </div>
        </div>
      ) : (
        query && !isLoading && (
            <div className="mb-8 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card py-20 text-center">
                <ServerCrash className="h-16 w-16 text-muted-foreground/50" />
                <h2 className="mt-6 text-xl font-semibold">Source Not Found</h2>
                <p className="mt-2 text-sm text-muted-foreground">A playable source could not be found for the selected media.</p>
            </div>
        )
      )}


      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-[255px] w-[170px] rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-center text-destructive">{error}</p>}
      
      {!isLoading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <Card
              key={movie.imdbID}
              className="cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              onClick={() => handleMovieSelect(movie)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3]">
                  {movie.Poster && movie.Poster !== 'N/A' ? (
                     <Image
                        src={movie.Poster}
                        alt={movie.Title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary">
                        <Film className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="truncate font-semibold">{movie.Title}</h3>
                  <p className="text-sm text-muted-foreground">{movie.Year}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && movies.length === 0 && query && (
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
