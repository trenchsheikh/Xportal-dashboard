'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LiveAgentConsole } from './live-agent-console';

function LiveAgentConsoleContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent') || undefined;

  return <LiveAgentConsole initialAgentId={agentId} />;
}

export function LiveAgentConsoleWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LiveAgentConsoleContent />
    </Suspense>
  );
}
