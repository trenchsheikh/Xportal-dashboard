import { NextResponse } from 'next/server';
import {
  fetchPolymarketMarkets,
  transformPolymarketMarket
} from '@/lib/polymarket';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET() {
  try {
    // Fetch markets from Polymarket
    const polymarketMarkets = await fetchPolymarketMarkets(50);

    // Transform to our Market type
    const markets = polymarketMarkets.map(transformPolymarketMarket);

    return NextResponse.json({
      markets,
      count: markets.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in markets API route:', error);
    return NextResponse.json(
      {
        markets: [],
        count: 0,
        error: 'Failed to fetch markets',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
