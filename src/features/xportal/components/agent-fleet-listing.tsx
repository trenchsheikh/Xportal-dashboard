'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import type { Agent, RiskTier } from '@/types/xportal';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconRobot,
  IconEye,
  IconPause,
  IconPlayerPlay,
  IconChartLine
} from '@tabler/icons-react';
import { mockAgents } from '@/lib/mock-data';
import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Progress } from '@/components/ui/progress';

// Calculate performance score (0-100) based on multiple factors
function calculatePerformanceScore(agent: Agent): number {
  // Factors:
  // - ROI: 40% weight (normalized to 0-100, assuming max ROI of 50%)
  // - Win Rate: 30% weight
  // - Drawdown: 20% weight (lower is better, max drawdown penalty of -20%)
  // - Activity: 10% weight (based on trades24h, normalized)

  const roiScore = Math.min(Math.max((agent.roi / 50) * 100, 0), 100) * 0.4;
  const winRateScore = agent.winRate * 0.3;
  const drawdownScore = Math.max(100 + agent.maxDrawdown * 2, 0) * 0.2; // Convert drawdown to positive score
  const activityScore = Math.min((agent.trades24h / 20) * 100, 100) * 0.1;

  const totalScore = roiScore + winRateScore + drawdownScore + activityScore;
  return Math.round(Math.max(0, Math.min(100, totalScore)));
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-blue-600 dark:text-blue-400';
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function getScoreBadgeVariant(
  score: number
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  if (score >= 40) return 'outline';
  return 'destructive';
}

function RiskTierBadge({ tier }: { tier: RiskTier }) {
  const variants: Record<RiskTier, 'default' | 'secondary' | 'destructive'> = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive'
  };

  return (
    <Badge variant={variants[tier]} className='text-xs'>
      {tier}
    </Badge>
  );
}

function StatusBadge({ status }: { status: Agent['status'] }) {
  const variants: Record<Agent['status'], 'default' | 'secondary' | 'outline'> =
    {
      Active: 'default',
      Paused: 'secondary',
      'In Review': 'outline'
    };

  return (
    <Badge variant={variants[status]} className='text-xs'>
      {status}
    </Badge>
  );
}

export function AgentFleetListing() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'Active' | 'Paused' | 'In Review'
  >('all');

  const toggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? {
              ...agent,
              status: agent.status === 'Active' ? 'Paused' : 'Active'
            }
          : agent
      )
    );
  };

  const filteredAgents =
    filterStatus === 'all'
      ? agents
      : agents.filter((a) => a.status === filterStatus);

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    const scoreA = calculatePerformanceScore(a);
    const scoreB = calculatePerformanceScore(b);
    return scoreB - scoreA; // Sort by score descending
  });

  return (
    <div className='space-y-6'>
      {/* Filter Bar */}
      <div className='flex items-center gap-2'>
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setFilterStatus('all')}
        >
          All ({agents.length})
        </Button>
        <Button
          variant={filterStatus === 'Active' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setFilterStatus('Active')}
        >
          Active ({agents.filter((a) => a.status === 'Active').length})
        </Button>
        <Button
          variant={filterStatus === 'Paused' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setFilterStatus('Paused')}
        >
          Paused ({agents.filter((a) => a.status === 'Paused').length})
        </Button>
      </div>

      {/* Agent Cards Grid */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {sortedAgents.map((agent) => {
          const performanceScore = calculatePerformanceScore(agent);
          const currentValue = agent.allocatedUsdc + agent.pnl;

          return (
            <Card key={agent.id} className='transition-shadow hover:shadow-lg'>
              <CardHeader className='pb-3'>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-1 items-start gap-3'>
                    <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                      <IconRobot className='text-primary h-5 w-5' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <CardTitle className='truncate text-base font-semibold'>
                        {agent.name}
                      </CardTitle>
                      <p className='text-muted-foreground mt-0.5 text-xs'>
                        {agent.strategy}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-1'>
                    <StatusBadge status={agent.status} />
                    <RiskTierBadge tier={agent.riskTier} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Performance Score */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs font-medium'>
                      Performance Score
                    </span>
                    <Badge
                      variant={getScoreBadgeVariant(performanceScore)}
                      className='text-xs font-semibold'
                    >
                      {performanceScore}/100
                    </Badge>
                  </div>
                  <Progress value={performanceScore} className='h-2' />
                </div>

                {/* Key Metrics */}
                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>ROI</div>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        agent.roi >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {agent.roi >= 0 ? (
                        <IconTrendingUp className='h-3 w-3' />
                      ) : (
                        <IconTrendingDown className='h-3 w-3' />
                      )}
                      {agent.roi >= 0 ? '+' : ''}
                      {agent.roi.toFixed(2)}%
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>P&L</div>
                    <div
                      className={`text-sm font-semibold ${
                        agent.pnl >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {agent.pnl >= 0 ? '+' : ''}
                      {agent.pnl.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })}
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>
                      Win Rate
                    </div>
                    <div className='text-sm font-semibold'>
                      {agent.winRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>
                      24h Trades
                    </div>
                    <div className='text-sm font-semibold'>
                      {agent.trades24h}
                    </div>
                  </div>
                </div>

                {/* Account Value */}
                <div className='bg-muted/50 rounded-md border p-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Account Value
                    </span>
                    <span className='text-sm font-semibold tabular-nums'>
                      {currentValue.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })}
                    </span>
                  </div>
                  <div className='mt-1 flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Allocated
                    </span>
                    <span className='text-xs tabular-nums'>
                      {agent.allocatedUsdc.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 border-t pt-2'>
                  <div className='flex flex-1 items-center gap-2'>
                    <Switch
                      checked={agent.status === 'Active'}
                      onCheckedChange={() => toggleAgentStatus(agent.id)}
                    />
                    <span className='text-muted-foreground text-xs'>
                      {agent.status === 'Active' ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <Button variant='outline' size='sm' asChild>
                    <Link href={`/dashboard/agents/console?agent=${agent.id}`}>
                      <IconEye className='mr-1 h-4 w-4' />
                      View
                    </Link>
                  </Button>
                </div>

                {/* Created Date */}
                <div className='text-muted-foreground pt-1 text-center text-xs'>
                  Created{' '}
                  {formatDistanceToNow(new Date(agent.createdAt), {
                    addSuffix: true
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedAgents.length === 0 && (
        <div className='text-muted-foreground py-12 text-center'>
          <IconRobot className='mx-auto mb-4 h-12 w-12 opacity-50' />
          <p className='text-sm'>No agents found with the selected filter</p>
        </div>
      )}
    </div>
  );
}
