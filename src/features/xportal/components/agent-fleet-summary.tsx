'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import type { Agent, RiskTier } from '@/types/xportal';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

interface AgentFleetSummaryProps {
  agents: Agent[];
}

function RiskTierBadge({ tier }: { tier: RiskTier }) {
  const variants: Record<RiskTier, 'default' | 'secondary' | 'destructive'> = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive'
  };

  return <Badge variant={variants[tier]}>{tier}</Badge>;
}

export function AgentFleetSummary({ agents }: AgentFleetSummaryProps) {
  const activeAgents = agents.filter((a) => a.status === 'Active').length;
  const pausedAgents = agents.filter((a) => a.status === 'Paused').length;
  const totalAllocated = agents.reduce((sum, a) => sum + a.allocatedUsdc, 0);
  const totalTrades24h = agents.reduce((sum, a) => sum + a.trades24h, 0);

  // Top 3 agents by ROI
  const topAgents = [...agents].sort((a, b) => b.roi - a.roi).slice(0, 3);

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Agent Fleet</h3>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader>
            <CardDescription>Total Agents</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums'>
              {agents.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active Agents</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums'>
              {activeAgents}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Total Allocated</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums'>
              {totalAllocated.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>24h Trades</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums'>
              {totalTrades24h}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
          <CardDescription>Top 3 agents by ROI</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Risk Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className='font-medium'>{agent.name}</TableCell>
                  <TableCell>{agent.strategy}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1'>
                      {agent.roi >= 0 ? (
                        <IconTrendingUp className='h-4 w-4 text-green-600' />
                      ) : (
                        <IconTrendingDown className='h-4 w-4 text-red-600' />
                      )}
                      <span
                        className={
                          agent.roi >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }
                      >
                        {agent.roi >= 0 ? '+' : ''}
                        {agent.roi.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RiskTierBadge tier={agent.riskTier} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
