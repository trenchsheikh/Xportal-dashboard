import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LiveAgentConsoleWrapper } from '@/features/xportal/components/live-agent-console-wrapper';

export const metadata = {
  title: 'Live Agent Console - Xportal'
};

export default async function AgentConsolePage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Live Agent Console'
            description="Monitor your agents in real-time: see what they're thinking, their holdings, and live P&L"
          />
        </div>
        <Separator />
        <LiveAgentConsoleWrapper />
      </div>
    </PageContainer>
  );
}
