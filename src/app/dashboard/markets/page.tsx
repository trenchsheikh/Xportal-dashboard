import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { MarketsListing } from '@/features/xportal/components/markets-listing';
import { Suspense } from 'react';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export const metadata = {
  title: 'Markets - Xportal'
};

export default async function MarketsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Markets'
            description='Browse and inspect prediction markets on Circle Arc'
          />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={10} filterCount={3} />
          }
        >
          <MarketsListing />
        </Suspense>
      </div>
    </PageContainer>
  );
}
