import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SettingsView } from '@/features/xportal/components/settings-view';

export const metadata = {
  title: 'Settings - Xportal'
};

export default async function SettingsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Settings'
            description='Manage your preferences and global risk limits'
          />
        </div>
        <Separator />
        <SettingsView />
      </div>
    </PageContainer>
  );
}
