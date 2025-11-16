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
      <div className='flex w-full flex-col'>
        <div className='mb-4 flex items-center justify-between'>
          <Heading
            title='Create Agent'
            description='Configure a new autonomous AI trading agent'
          />
        </div>
        <Separator className='mb-4' />
        <CreateAgentWizard />
      </div>
    </PageContainer>
  );
}
