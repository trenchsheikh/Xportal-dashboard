'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPortfolio, mockAgents } from '@/lib/mock-data';
import {
  formatCompactCurrency,
  formatPercent,
  formatCompactNumber
} from '@/lib/utils';
import {
  IconRobot,
  IconPlus,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowRight,
  IconEye,
  IconChartLine,
  IconTarget,
  IconShield,
  IconTrophy,
  IconChartBar
} from '@tabler/icons-react';
import Link from 'next/link';

export default function XportalOverview() {
  const { totalValue, realizedPnl, unrealizedPnl, openPositions } =
    mockPortfolio;
  const totalPnl = realizedPnl + unrealizedPnl;
  const totalPnlPercent = (totalPnl / (totalValue - totalPnl)) * 100;

  const activeAgents = mockAgents.filter((a) => a.status === 'Active');
  const totalAgents = mockAgents.length;
  const totalAllocated = mockAgents.reduce(
    (sum, a) => sum + a.allocatedUsdc,
    0
  );
  const totalTrades24h = mockAgents.reduce((sum, a) => sum + a.trades24h, 0);
  const totalTrades7d = mockAgents.reduce((sum, a) => sum + a.trades7d, 0);

  // Calculate statistics
  const avgRoi = mockAgents.reduce((sum, a) => sum + a.roi, 0) / totalAgents;
  const avgWinRate =
    mockAgents.reduce((sum, a) => sum + a.winRate, 0) / totalAgents;
  const avgMaxDrawdown =
    mockAgents.reduce((sum, a) => sum + Math.abs(a.maxDrawdown), 0) /
    totalAgents;
  const bestAgent = [...mockAgents].sort((a, b) => b.roi - a.roi)[0];
  const worstAgent = [...mockAgents]
    .filter((a) => a.status === 'Active')
    .sort((a, b) => a.roi - b.roi)[0];
  const totalPnlAgents = mockAgents.reduce((sum, a) => sum + a.pnl, 0);
  const avgPositionSize = totalAllocated / (openPositions || 1);

  return (
    <div className='flex h-full flex-col overflow-hidden'>
      {/* Header Section */}
      <div className='mb-3 flex items-center justify-between border-b pb-3'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Portfolio Overview
          </h1>
          <p className='text-muted-foreground text-sm'>
            AI-powered prediction market portfolio
          </p>
        </div>
        <Badge variant='outline' className='gap-1.5 px-3 py-1.5 text-sm'>
          <IconRobot className='h-4 w-4' />
          {activeAgents.length} Active Agents
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className='grid flex-1 grid-cols-12 gap-3 overflow-hidden'>
        {/* Left Column - Main Metrics */}
        <div className='col-span-12 flex flex-col gap-3 overflow-hidden lg:col-span-8'>
          {/* Portfolio Value Card */}
          <Card className='flex-shrink-0'>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <p className='text-muted-foreground mb-1 text-sm'>
                    Total Portfolio Value
                  </p>
                  <div className='flex items-baseline gap-4'>
                    <h2 className='text-3xl font-bold'>
                      {formatCompactCurrency(totalValue)}
                    </h2>
                    <div className='flex items-center gap-1.5'>
                      {totalPnl >= 0 ? (
                        <IconTrendingUp className='h-5 w-5 text-green-600 dark:text-green-400' />
                      ) : (
                        <IconTrendingDown className='h-5 w-5 text-red-600 dark:text-red-400' />
                      )}
                      <span
                        className={`text-base font-semibold ${
                          totalPnl >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatCompactCurrency(totalPnl, { showSign: true })}{' '}
                        {formatPercent(totalPnlPercent, { showSign: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant='outline' className='px-2.5 py-1 text-sm'>
                  {openPositions} open
                </Badge>
              </div>

              {/* Simplified Performance Summary */}
              <div className='mt-4 flex items-center gap-6 border-t pt-4'>
                <div className='flex items-center gap-2'>
                  <IconChartLine className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground text-xs'>
                    Realized
                  </span>
                  <span className='text-sm font-semibold text-green-600 dark:text-green-400'>
                    {formatCompactCurrency(realizedPnl, { showSign: true })}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <IconChartBar className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground text-xs'>
                    Unrealized
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      unrealizedPnl >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatCompactCurrency(unrealizedPnl, { showSign: true })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className='grid flex-1 grid-cols-2 gap-3 overflow-hidden lg:grid-cols-4'>
            {/* Trading Performance */}
            <Card className='flex-shrink-0'>
              <CardContent className='p-4'>
                <div className='mb-3 flex items-center gap-2'>
                  <IconTarget className='text-muted-foreground h-4 w-4' />
                  <p className='text-sm font-semibold'>Trading Performance</p>
                </div>
                <div className='space-y-2.5'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Win Rate
                    </span>
                    <span className='text-sm font-semibold'>
                      {formatPercent(avgWinRate)}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Avg ROI
                    </span>
                    <span className='text-sm font-semibold text-green-600 dark:text-green-400'>
                      {formatPercent(avgRoi, { showSign: true })}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Recent Trades
                    </span>
                    <span className='text-sm font-semibold'>
                      {formatCompactNumber(totalTrades24h)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Metrics */}
            <Card className='flex-shrink-0'>
              <CardContent className='p-4'>
                <div className='mb-3 flex items-center gap-2'>
                  <IconShield className='text-muted-foreground h-4 w-4' />
                  <p className='text-sm font-semibold'>Risk & Performance</p>
                </div>
                <div className='space-y-2.5'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Max Drawdown
                    </span>
                    <span className='text-sm font-semibold text-red-600 dark:text-red-400'>
                      {formatPercent(-avgMaxDrawdown)}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Position Size
                    </span>
                    <span className='text-sm font-semibold'>
                      {formatCompactCurrency(avgPositionSize)}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Capital Used
                    </span>
                    <span className='text-sm font-semibold'>
                      {formatPercent((totalAllocated / totalValue) * 100)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Performer */}
            <Card className='flex-shrink-0'>
              <CardContent className='p-4'>
                <div className='mb-3 flex items-center gap-2'>
                  <IconTrophy className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
                  <p className='text-sm font-semibold'>Best Performer</p>
                </div>
                <div className='space-y-2.5'>
                  <div className='flex items-center justify-between'>
                    <span className='truncate text-sm font-medium'>
                      {bestAgent.name}
                    </span>
                    <Badge
                      variant='outline'
                      className='ml-2 px-1.5 py-0.5 text-xs'
                    >
                      {bestAgent.strategy}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>ROI</span>
                    <span className='text-sm font-semibold text-green-600 dark:text-green-400'>
                      {formatPercent(bestAgent.roi, { showSign: true })}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>P&L</span>
                    <span className='text-sm font-semibold text-green-600 dark:text-green-400'>
                      {formatCompactCurrency(bestAgent.pnl, { showSign: true })}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-xs'>
                      Win Rate
                    </span>
                    <span className='text-sm font-semibold'>
                      {formatPercent(bestAgent.winRate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Needs Attention */}
            {worstAgent && (
              <Card className='flex-shrink-0'>
                <CardContent className='p-4'>
                  <div className='mb-3 flex items-center gap-2'>
                    <IconTrendingDown className='text-muted-foreground h-4 w-4' />
                    <p className='text-sm font-semibold'>Needs Attention</p>
                  </div>
                  <div className='space-y-2.5'>
                    <div className='flex items-center justify-between'>
                      <span className='truncate text-sm font-medium'>
                        {worstAgent.name}
                      </span>
                      <Badge
                        variant='outline'
                        className='ml-2 px-1.5 py-0.5 text-xs'
                      >
                        {worstAgent.strategy}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-xs'>ROI</span>
                      <span
                        className={`text-sm font-semibold ${
                          worstAgent.roi >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatPercent(worstAgent.roi, { showSign: true })}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-xs'>P&L</span>
                      <span
                        className={`text-sm font-semibold ${
                          worstAgent.pnl >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatCompactCurrency(worstAgent.pnl, {
                          showSign: true
                        })}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-xs'>
                        Win Rate
                      </span>
                      <span className='text-sm font-semibold'>
                        {formatPercent(worstAgent.winRate)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Agent Summary & Actions */}
        <div className='col-span-12 flex flex-col gap-3 overflow-hidden lg:col-span-4'>
          {/* Agent Fleet Summary */}
          <Card className='flex-shrink-0'>
            <CardContent className='p-4'>
              <div className='mb-3 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <IconRobot className='text-muted-foreground h-4 w-4' />
                  <p className='text-sm font-semibold'>Agent Fleet</p>
                </div>
                <Badge variant='outline' className='px-2.5 py-1 text-sm'>
                  {activeAgents.length}/{totalAgents} Active
                </Badge>
              </div>

              <div className='mb-3 space-y-2.5'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-xs'>
                    Total Agents
                  </span>
                  <span className='text-sm font-semibold'>{totalAgents}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-xs'>
                    Allocated Capital
                  </span>
                  <span className='text-sm font-semibold'>
                    {formatCompactCurrency(totalAllocated)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-xs'>
                    24h Trades
                  </span>
                  <span className='text-sm font-semibold'>
                    {formatCompactNumber(totalTrades24h)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='space-y-2 border-t pt-3'>
                <Button
                  asChild
                  className='h-9 w-full text-sm'
                  variant='default'
                  size='sm'
                >
                  <Link href='/dashboard/agents'>
                    <IconEye className='mr-2 h-4 w-4' />
                    View All Agents
                    <IconArrowRight className='ml-auto h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  className='h-9 w-full text-sm'
                  variant='outline'
                  size='sm'
                >
                  <Link href='/dashboard/agents/create'>
                    <IconPlus className='mr-2 h-4 w-4' />
                    Create New Agent
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className='flex-1 overflow-hidden'>
            <CardContent className='p-4'>
              <p className='mb-3 text-sm font-semibold'>Quick Actions</p>
              <div className='space-y-1.5'>
                <Button
                  asChild
                  variant='ghost'
                  className='h-9 w-full justify-start text-sm'
                  size='sm'
                >
                  <Link href='/dashboard/agents/console'>
                    Live Agent Console
                    <IconArrowRight className='ml-auto h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='ghost'
                  className='h-9 w-full justify-start text-sm'
                  size='sm'
                >
                  <Link href='/dashboard/markets'>
                    Browse Markets
                    <IconArrowRight className='ml-auto h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='ghost'
                  className='h-9 w-full justify-start text-sm'
                  size='sm'
                >
                  <Link href='/dashboard/settings'>
                    Settings
                    <IconArrowRight className='ml-auto h-4 w-4' />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
