'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockPortfolio, mockAgents } from '@/lib/mock-data';
import {
  IconRobot,
  IconPlus,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowRight,
  IconEye
} from '@tabler/icons-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function XportalOverview() {
  const {
    totalValue,
    realizedPnl,
    unrealizedPnl,
    openPositions,
    performance7d
  } = mockPortfolio;
  const totalPnl = realizedPnl + unrealizedPnl;
  const totalPnlPercent = ((totalPnl / (totalValue - totalPnl)) * 100).toFixed(
    2
  );

  // Generate portfolio performance time series data (similar to Live Agent Console)
  const generatePortfolioEquityData = (days: number = 60) => {
    const now = new Date();
    const data = [];
    const initialValue = totalValue - totalPnl;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      let value: number;

      // Use performance30d data for last 30 days
      if (i <= 30 && mockPortfolio.performance30d.length > 0) {
        const index = Math.min(
          Math.floor(
            ((30 - i) / 30) * (mockPortfolio.performance30d.length - 1)
          ),
          mockPortfolio.performance30d.length - 1
        );
        value = mockPortfolio.performance30d[index];
      } else if (i <= 60 && mockPortfolio.performance7d.length > 0) {
        // Use performance7d for days 31-60, interpolate
        const progress = (60 - i) / 30; // 0 to 1 over 30 days
        const startValue = mockPortfolio.performance7d[0] || initialValue;
        const endValue =
          mockPortfolio.performance30d[0] ||
          mockPortfolio.performance7d[mockPortfolio.performance7d.length - 1] ||
          totalValue;
        value = startValue + (endValue - startValue) * progress;
      } else {
        // For earlier dates, use initial value
        value = initialValue;
      }

      data.push({
        date: dateStr,
        timestamp: date.getTime(),
        value: Math.max(initialValue * 0.8, value) // Ensure value is reasonable
      });
    }

    return data;
  };

  const portfolioChartData = generatePortfolioEquityData(60);

  const activeAgents = mockAgents.filter((a) => a.status === 'Active');
  const totalAgents = mockAgents.length;
  const totalAllocated = mockAgents.reduce(
    (sum, a) => sum + a.allocatedUsdc,
    0
  );
  const totalTrades24h = mockAgents.reduce((sum, a) => sum + a.trades24h, 0);

  // Agent Performance Data (Top 5 by ROI)
  const agentPerformanceData = [...mockAgents]
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 5)
    .map((agent) => ({
      name:
        agent.name.length > 12
          ? agent.name.substring(0, 12) + '...'
          : agent.name,
      roi: agent.roi,
      pnl: agent.pnl
    }));

  // Strategy Distribution
  const strategyData = mockAgents.reduce(
    (acc, agent) => {
      const existing = acc.find((s) => s.name === agent.strategy);
      if (existing) {
        existing.value += 1;
        existing.pnl += agent.pnl;
      } else {
        acc.push({ name: agent.strategy, value: 1, pnl: agent.pnl });
      }
      return acc;
    },
    [] as Array<{ name: string; value: number; pnl: number }>
  );

  // Chart colors
  const COLORS = [
    '#3b82f6',
    '#a855f7',
    '#f97316',
    '#10b981',
    '#ef4444',
    '#eab308',
    '#06b6d4',
    '#8b5cf6'
  ];

  return (
    <div className='flex flex-1 flex-col overflow-hidden p-4 md:px-6'>
      <div className='grid h-full grid-cols-1 gap-4 lg:grid-cols-12'>
        {/* Left Column - Portfolio Value (Large) */}
        <div className='flex flex-col space-y-4 lg:col-span-8'>
          {/* Portfolio Value Card */}
          <Card className='flex flex-1 flex-col'>
            <CardContent className='flex flex-1 flex-col p-4'>
              <div className='mb-3 flex items-start justify-between'>
                <div>
                  <p className='text-muted-foreground mb-1 text-sm'>
                    Total Portfolio Value
                  </p>
                  <h2 className='text-4xl font-bold tabular-nums'>
                    {totalValue.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </h2>
                  <div className='mt-2 flex items-center gap-2'>
                    {totalPnl >= 0 ? (
                      <IconTrendingUp className='h-4 w-4 text-green-600 dark:text-green-400' />
                    ) : (
                      <IconTrendingDown className='h-4 w-4 text-red-600 dark:text-red-400' />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        totalPnl >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {totalPnl >= 0 ? '+' : ''}
                      {totalPnl.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })}{' '}
                      ({totalPnlPercent >= 0 ? '+' : ''}
                      {totalPnlPercent}%)
                    </span>
                  </div>
                </div>
                <Badge variant='outline' className='text-xs'>
                  {openPositions} open positions
                </Badge>
              </div>

              {/* Portfolio Performance Line Chart */}
              <div className='mt-3 h-[250px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={portfolioChartData}
                    margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='hsl(var(--border))'
                    />
                    <XAxis
                      dataKey='date'
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => {
                        try {
                          const date = new Date(value);
                          if (isNaN(date.getTime())) return value;
                          const now = new Date();
                          const isToday =
                            date.toDateString() === now.toDateString();
                          if (isToday) {
                            return date.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            });
                          }
                          return date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          });
                        } catch {
                          return value;
                        }
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) =>
                        `$${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: 'none'
                      }}
                      formatter={(value: number) =>
                        value.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0
                        })
                      }
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='value'
                      stroke='hsl(var(--primary))'
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                      name='Portfolio Value'
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Charts Grid */}
          <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
            {/* Agent Performance Bar Chart */}
            <Card>
              <CardContent className='p-4'>
                <p className='mb-3 text-sm font-semibold'>
                  Top Agent Performance (ROI)
                </p>
                <div className='h-[220px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={agentPerformanceData}>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='hsl(var(--border))'
                        vertical={false}
                      />
                      <XAxis
                        dataKey='name'
                        tick={{ fontSize: 11 }}
                        angle={-45}
                        textAnchor='end'
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: 'none'
                        }}
                        formatter={(value: number) => `${value.toFixed(2)}%`}
                      />
                      <Bar
                        dataKey='roi'
                        fill='hsl(var(--primary))'
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Distribution Pie Chart */}
            <Card>
              <CardContent className='p-4'>
                <p className='mb-3 text-sm font-semibold'>
                  Strategy Distribution
                </p>
                <div className='h-[220px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={strategyData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={75}
                        fill='#8884d8'
                        dataKey='value'
                      >
                        {strategyData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: 'none'
                        }}
                        formatter={(value: number) => `${value} agents`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Agent Summary & Actions */}
        <div className='flex flex-col space-y-4 lg:col-span-4'>
          {/* Agent Fleet Summary */}
          <Card className='flex-1'>
            <CardContent className='p-4'>
              <div className='mb-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <IconRobot className='text-muted-foreground h-5 w-5' />
                  <p className='text-sm font-semibold'>Agent Fleet</p>
                </div>
                <Badge variant='outline'>
                  {activeAgents.length}/{totalAgents} Active
                </Badge>
              </div>

              <div className='mb-4 space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Total Agents
                  </span>
                  <span className='text-lg font-semibold'>{totalAgents}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Allocated Capital
                  </span>
                  <span className='text-lg font-semibold tabular-nums'>
                    {totalAllocated.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0
                    })}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    24h Trades
                  </span>
                  <span className='text-lg font-semibold'>
                    {totalTrades24h}
                  </span>
                </div>
              </div>

              <Separator className='my-4' />

              {/* Top Performing Agents */}
              <div className='mb-4'>
                <p className='mb-2 text-xs font-semibold text-green-600 dark:text-green-400'>
                  Top Performers
                </p>
                <div className='space-y-2'>
                  {[...mockAgents]
                    .sort((a, b) => b.roi - a.roi)
                    .slice(0, 2)
                    .map((agent) => (
                      <div
                        key={agent.id}
                        className='bg-muted/50 flex items-center justify-between rounded-md p-2'
                      >
                        <div className='flex items-center gap-2'>
                          <IconRobot className='text-muted-foreground h-4 w-4' />
                          <span className='text-xs font-medium'>
                            {agent.name}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <IconTrendingUp className='h-3 w-3 text-green-600' />
                          <span className='text-xs font-semibold text-green-600 tabular-nums dark:text-green-400'>
                            +{agent.roi.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Underperforming Agents */}
              <div className='mb-4'>
                <p className='mb-2 text-xs font-semibold text-red-600 dark:text-red-400'>
                  Underperformers
                </p>
                <div className='space-y-2'>
                  {[...mockAgents]
                    .sort((a, b) => a.roi - b.roi)
                    .filter((agent) => agent.roi < 10) // Only show agents with ROI < 10%
                    .slice(0, 2)
                    .map((agent) => (
                      <div
                        key={agent.id}
                        className='bg-muted/50 flex items-center justify-between rounded-md p-2'
                      >
                        <div className='flex items-center gap-2'>
                          <IconRobot className='text-muted-foreground h-4 w-4' />
                          <span className='text-xs font-medium'>
                            {agent.name}
                          </span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <IconTrendingDown className='h-3 w-3 text-red-600' />
                          <span
                            className={`text-xs font-semibold tabular-nums ${
                              agent.roi >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {agent.roi >= 0 ? '+' : ''}
                            {agent.roi.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  {[...mockAgents].filter((agent) => agent.roi < 10).length ===
                    0 && (
                    <div className='bg-muted/50 text-muted-foreground rounded-md p-2 text-center text-xs'>
                      All agents performing well
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='space-y-2 border-t pt-4'>
                <Button asChild className='w-full' variant='default'>
                  <Link href='/dashboard/agents'>
                    <IconEye className='mr-2 h-4 w-4' />
                    View All Agents
                    <IconArrowRight className='ml-auto h-4 w-4' />
                  </Link>
                </Button>
                <Button asChild className='w-full' variant='outline'>
                  <Link href='/dashboard/agents/create'>
                    <IconPlus className='mr-2 h-4 w-4' />
                    Create New Agent
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className='p-4'>
              <p className='mb-4 text-sm font-semibold'>Quick Actions</p>
              <div className='space-y-2'>
                <Button
                  asChild
                  variant='ghost'
                  className='w-full justify-start'
                >
                  <Link href='/dashboard/agents/console'>
                    Live Agent Console
                    <IconArrowRight className='ml-auto h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='ghost'
                  className='w-full justify-start'
                >
                  <Link href='/dashboard/markets'>
                    Browse Markets
                    <IconArrowRight className='ml-auto h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='ghost'
                  className='w-full justify-start'
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
