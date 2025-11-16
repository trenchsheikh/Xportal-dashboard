import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { MarketDetailView } from '@/features/xportal/components/market-detail-view';
import { notFound } from 'next/navigation';
import { mockMarkets } from '@/lib/mock-data';

export const metadata = {
  title: 'Market Details - Xportal'
};

export default async function MarketDetailPage({
  params
}: {
  params: Promise<{ marketId: string }>;
}) {
  const { marketId } = await params;
  const market = mockMarkets.find((m) => m.id === marketId);

  if (!market) {
    notFound();
  }

  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading title={market.title} description={market.description} />
        </div>
        <Separator />
        <MarketDetailView market={market} />
      </div>
    </PageContainer>
  );
}
