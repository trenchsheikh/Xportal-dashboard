import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CreateAgentWizard } from '@/features/xportal/components/create-agent-wizard';

export const metadata = {
  title: 'Create Agent - Xportal'
};

export default async function CreateAgentPage() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Create Agent'
            description='Deploy a new autonomous AI trading agent with custom strategies, risk parameters, and market preferences'
          />
        </div>
        <Separator />
        <CreateAgentWizard />
      </div>
    </PageContainer>
  );
}
