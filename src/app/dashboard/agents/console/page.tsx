import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { LiveAgentConsoleWrapper } from '@/features/xportal/components/live-agent-console-wrapper';

export const metadata = {
  title: 'Live Agent Console - Xportal'
};

export default async function AgentConsolePage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Live Agent Console'
            description='Real-time monitoring of your AI agents: watch their decision-making process, track positions, and monitor live performance'
          />
        </div>
        <Separator />
        <LiveAgentConsoleWrapper />
      </div>
    </PageContainer>
  );
}
