import PageContainer from '@/components/layout/page-container';
import XportalOverview from '@/features/xportal/components/xportal-overview';

export default function OverviewPage() {
  return (
    <PageContainer scrollable={false}>
      <XportalOverview />
    </PageContainer>
  );
}
