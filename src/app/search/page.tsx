
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SearchX, Film } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
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
          const moviesWithPosters = data.results.filter((movie: Movie) => movie.poster_path);
          setMovies(moviesWithPosters);
          if (moviesWithPosters.length > 0) {
            setSelectedMovieId(moviesWithPosters[0].id);
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

  const playerUrl = selectedMovieId ? `https://vidsrc.me/embed/movie?tmdb=${selectedMovieId}` : '';

  return (
    <div className="container mx-auto max-w-screen-2xl py-8">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">
        {query ? `Search Results for "${query}"` : 'Search for a movie'}
      </h1>

      {selectedMovieId && (
        <div className="mb-8 overflow-hidden rounded-lg border shadow-lg">
          <div className="aspect-video w-full bg-black">
            <iframe
              key={selectedMovieId}
              src={playerUrl}
              title="Movie Player"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
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
              key={movie.id}
              className="cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              onClick={() => setSelectedMovieId(movie.id)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[2/3]">
                  {movie.poster_path ? (
                     <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
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
                  <h3 className="truncate font-semibold">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">{movie.release_date?.split('-')[0] || 'N/A'}</p>
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
