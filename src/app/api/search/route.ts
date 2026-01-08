
import { NextRequest, NextResponse } from 'next/server';

const OMDb_API_KEY = process.env.OMDB_API_KEY;
const OMDb_API_URL = 'https://www.omdbapi.com/';

export async function GET(request: NextRequest) {
  if (!OMDb_API_KEY) {
    return NextResponse.json({ message: 'OMDb API key is not configured.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ message: 'Search query is required.' }, { status: 400 });
  }

  try {
    const omdbResponse = await fetch(
      `${OMDb_API_URL}?apikey=${OMDb_API_KEY}&s=${encodeURIComponent(query)}&type=movie`
    );

    if (!omdbResponse.ok) {
      const errorData = await omdbResponse.text();
      console.error('OMDb API Error:', errorData);
      return NextResponse.json({ message: 'Failed to fetch data from OMDb.' }, { status: omdbResponse.status });
    }

    const data = await omdbResponse.json();
    
    if (data.Response === "False") {
      return NextResponse.json({ Search: [], Response: "True" });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
