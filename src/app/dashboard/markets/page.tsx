import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PolymarketMarketsListing } from '@/features/xportal/components/polymarket-markets-listing';
import { Suspense } from 'react';
import {
  fetchPolymarketMarkets,
  transformPolymarketMarket
} from '@/lib/polymarket';
import './polymarket-styles.css';

export const metadata = {
  title: 'Markets - Xportal'
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function MarketsPage() {
  // Fetch initial markets server-side
  let initialMarkets = [];
  try {
    const polymarketMarkets = await fetchPolymarketMarkets(50);
    initialMarkets = polymarketMarkets.map(transformPolymarketMarket);
  } catch (error) {
    console.error('Error fetching initial markets:', error);
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Markets'
            description='Browse live prediction markets from Polymarket - powered by AI agents'
          />
        </div>
        <Separator />
        <Suspense fallback={<div className='p-4'>Loading markets...</div>}>
          <PolymarketMarketsListing initialMarkets={initialMarkets} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
