
import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = 'https://api.themoviedb.org/3/search/movie';

export async function GET(request: NextRequest) {
  if (!TMDB_API_KEY) {
    return NextResponse.json({ message: 'TMDB API key is not configured.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ message: 'Search query is required.' }, { status: 400 });
  }

  try {
    const tmdbResponse = await fetch(
      `${TMDB_API_URL}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
    );

    if (!tmdbResponse.ok) {
      const errorData = await tmdbResponse.json();
      console.error('TMDB API Error:', errorData);
      return NextResponse.json({ message: 'Failed to fetch data from TMDB.' }, { status: tmdbResponse.status });
    }

    const data = await tmdbResponse.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
