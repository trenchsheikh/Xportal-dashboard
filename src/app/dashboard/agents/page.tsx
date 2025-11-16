import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AgentFleetListing } from '@/features/xportal/components/agent-fleet-listing';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const metadata = {
  title: 'Agent Fleet - Xportal'
};

export default async function AgentsPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Agent Fleet'
            description='Manage your autonomous AI trading agents'
          />
          <Link
            href='/dashboard/agents/create'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Create Agent
          </Link>
        </div>
        <Separator />
        <AgentFleetListing />
      </div>
    </PageContainer>
  );
}
