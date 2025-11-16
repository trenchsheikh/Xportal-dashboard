'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Agent, AgentActivity, Position } from '@/types/xportal';
import {
  mockAgents,
  mockAgentActivities,
  mockPositions
} from '@/lib/mock-data';
import {
  IconRobot,
  IconTrendingUp,
  IconTrendingDown,
  IconFilter
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface LiveAgentConsoleProps {
  initialAgentId?: string;
}

// Agent colors for the chart
const agentColors = [
  '#3b82f6', // blue
  '#a855f7', // purple
  '#f97316', // orange
  '#000000', // black
  '#06b6d4', // cyan
  '#10b981', // green
  '#ef4444', // red
  '#eab308' // yellow
];

// Generate time series data for all agents with live updates
function generateAgentEquityData(
  agents: Agent[],
  days: number = 30,
  liveUpdate: boolean = false
) {
  const now = new Date();
  const data = [];

  // For live updates, we want the last point to be "now" and not complete
  const endOffset = liveUpdate ? 1 : 0;

  for (let i = days; i >= endOffset; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const point: any = { date: dateStr, timestamp: date.getTime() };

    agents.forEach((agent, index) => {
      const initialValue = agent.allocatedUsdc;
      const currentValue = initialValue + agent.pnl;
      const progress = i === endOffset ? 1 : (days - i) / days;

      // Simulate equity curve with some volatility, but ensure it ends at current value
      const volatility = Math.sin(progress * Math.PI * 2) * 0.1;
      const trend = (currentValue - initialValue) * progress;
      const value = initialValue + trend + volatility * initialValue * 0.1;

      point[agent.id] = Math.max(0, value);
    });

    data.push(point);
  }

  // Add live point at current time (always at the end, showing current PNL)
  if (liveUpdate) {
    const livePoint: any = {
      date: now.toISOString().split('T')[0],
      timestamp: now.getTime(),
      isLive: true
    };

    agents.forEach((agent) => {
      // Use actual current PNL value - this updates in real-time
      const currentValue = agent.allocatedUsdc + agent.pnl;
      livePoint[agent.id] = currentValue;
    });

    data.push(livePoint);
  }

  return data;
}

interface Trade {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  market: string;
  outcome: string;
  side: 'BUY' | 'SELL';
  size: number;
  entryPrice: number;
  currentPrice?: number;
  pnl: number;
  pnlPercent: number;
  thoughtProcess?: string;
}

// Generate mock trades from activities
function generateTradesFromActivities(
  agents: Agent[],
  activities: Record<string, AgentActivity[]>
): Trade[] {
  const trades: Trade[] = [];

  agents.forEach((agent) => {
    const agentActivities = activities[agent.id] || [];
    agentActivities
      .filter((a) => a.type === 'trade' || a.type === 'close')
      .forEach((activity, index) => {
        const isClose = activity.type === 'close';
        const pnl =
          activity.pnl ||
          (Math.random() > 0.5 ? Math.random() * 500 : -Math.random() * 300);
        const size = activity.tradeSize || Math.random() * 5000 + 1000;

        trades.push({
          id: `${agent.id}-${index}`,
          agentId: agent.id,
          agentName: agent.name,
          timestamp: activity.timestamp,
          market: activity.marketTitle || activity.marketId || 'Market',
          outcome: 'YES', // Default outcome, can be extracted from message if needed
          side: isClose ? 'SELL' : 'BUY',
          size,
          entryPrice: Math.random() * 0.5 + 0.3,
          currentPrice: isClose ? undefined : Math.random() * 0.5 + 0.3,
          pnl,
          pnlPercent: (pnl / size) * 100,
          thoughtProcess:
            activity.message ||
            `Analyzed market conditions and identified ${isClose ? 'exit' : 'entry'} opportunity based on ${agent.strategy.toLowerCase()} strategy.`
        });
      });
  });

  return trades.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function LiveAgentConsole({ initialAgentId }: LiveAgentConsoleProps) {
  const [viewMode, setViewMode] = useState<'currency' | 'percent'>('currency');
  const [timeFilter, setTimeFilter] = useState<'all' | '72h' | '24h' | '7d'>(
    'all'
  );
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trade' | 'thought'>('trade');
  const [liveUpdateCounter, setLiveUpdateCounter] = useState(0);
  const [selectedAgentIds, setSelectedAgentIds] = useState<Set<string>>(
    new Set()
  );

  const activeAgents = mockAgents.filter((a) => a.status === 'Active');

  // Initialize selected agents to all active agents
  useEffect(() => {
    if (selectedAgentIds.size === 0) {
      setSelectedAgentIds(new Set(activeAgents.map((a) => a.id)));
    }
  }, [activeAgents, selectedAgentIds.size]);

  // Filter agents based on selection
  const filteredAgents = useMemo(() => {
    if (selectedAgentIds.size === 0) return activeAgents;
    return activeAgents.filter((a) => selectedAgentIds.has(a.id));
  }, [activeAgents, selectedAgentIds]);

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(agentId)) {
        newSet.delete(agentId);
      } else {
        newSet.add(agentId);
      }
      // Ensure at least one agent is selected
      if (newSet.size === 0 && activeAgents.length > 0) {
        return new Set([activeAgents[0].id]);
      }
      return newSet;
    });
  };

  const selectAllAgents = () => {
    setSelectedAgentIds(new Set(activeAgents.map((a) => a.id)));
  };

  const deselectAllAgents = () => {
    if (activeAgents.length > 0) {
      setSelectedAgentIds(new Set([activeAgents[0].id]));
    }
  };

  // Live update effect - simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdateCounter((prev) => prev + 1);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate chart data with extended time range and live updates (using filtered agents)
  const chartData = useMemo(() => {
    const days =
      timeFilter === 'all'
        ? 60
        : timeFilter === '7d'
          ? 7
          : timeFilter === '72h'
            ? 3
            : 1;
    return generateAgentEquityData(filteredAgents, days, true);
  }, [filteredAgents, timeFilter, liveUpdateCounter]);

  // Generate trades (using filtered agents)
  const allTrades = useMemo(() => {
    return generateTradesFromActivities(filteredAgents, mockAgentActivities);
  }, [filteredAgents]);

  // Filter trades by time
  const filteredTrades = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();

    if (timeFilter === '24h') {
      cutoff.setHours(cutoff.getHours() - 24);
    } else if (timeFilter === '72h') {
      cutoff.setHours(cutoff.getHours() - 72);
    } else if (timeFilter === '7d') {
      cutoff.setDate(cutoff.getDate() - 7);
    }

    return timeFilter === 'all'
      ? allTrades
      : allTrades.filter((t) => new Date(t.timestamp) >= cutoff);
  }, [allTrades, timeFilter]);

  // Set initial selected trade
  useEffect(() => {
    if (!selectedTrade && filteredTrades.length > 0) {
      setSelectedTrade(filteredTrades[0].id);
    }
  }, [filteredTrades, selectedTrade]);

  // Auto-scroll thought process chat to bottom on new activities
  useEffect(() => {
    if (activeTab === 'thought') {
      const scrollArea = document.getElementById('thought-scroll');
      if (scrollArea) {
        const scrollContainer = scrollArea.querySelector(
          '[data-radix-scroll-area-viewport]'
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }
    }
  }, [activeTab, liveUpdateCounter]);

  const selectedTradeData =
    filteredTrades.find((t) => t.id === selectedTrade) || filteredTrades[0];

  // Calculate current values for each agent (using real-time PNL, filtered)
  const currentValues = useMemo(() => {
    const values: Record<string, number> = {};

    filteredAgents.forEach((agent) => {
      // Use actual current PNL value
      const value = agent.allocatedUsdc + agent.pnl;
      values[agent.id] = value;
    });

    return values;
  }, [filteredAgents, liveUpdateCounter]);

  // Format Y-axis based on view mode
  const formatYAxis = (value: number) => {
    if (viewMode === 'percent') {
      // Calculate percentage change from initial
      return `${((value / 10000 - 1) * 100).toFixed(0)}%`;
    }
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const formatTooltip = (value: number, name: string) => {
    const agent = filteredAgents.find((a) => a.id === name);
    if (!agent) return [value, name];

    if (viewMode === 'percent') {
      const percent = ((value / agent.allocatedUsdc - 1) * 100).toFixed(2);
      return [`${percent}%`, agent.name];
    }

    return [
      value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }),
      agent.name
    ];
  };

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
      {/* Left Side - Performance Chart */}
      <div className='lg:col-span-8'>
        <Card>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg font-semibold'>
                TOTAL ACCOUNT VALUE
              </CardTitle>
              <div className='flex items-center gap-2'>
                {/* View Mode Toggle */}
                <div className='flex rounded-md border'>
                  <Button
                    variant={viewMode === 'currency' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-8 rounded-r-none px-3 text-xs'
                    onClick={() => setViewMode('currency')}
                  >
                    $
                  </Button>
                  <Button
                    variant={viewMode === 'percent' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-8 rounded-l-none px-3 text-xs'
                    onClick={() => setViewMode('percent')}
                  >
                    %
                  </Button>
                </div>
                {/* Time Filter */}
                <div className='flex rounded-md border'>
                  <Button
                    variant={timeFilter === 'all' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-8 rounded-r-none px-3 text-xs'
                    onClick={() => setTimeFilter('all')}
                  >
                    ALL
                  </Button>
                  <Button
                    variant={timeFilter === '72h' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-8 rounded-none px-3 text-xs'
                    onClick={() => setTimeFilter('72h')}
                  >
                    72H
                  </Button>
                  <Button
                    variant={timeFilter === '24h' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-8 rounded-none px-3 text-xs'
                    onClick={() => setTimeFilter('24h')}
                  >
                    24H
                  </Button>
                  <Button
                    variant={timeFilter === '7d' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-8 rounded-l-none px-3 text-xs'
                    onClick={() => setTimeFilter('7d')}
                  >
                    7D
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-[500px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  key={liveUpdateCounter} // Force re-render on updates
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='hsl(var(--border))'
                  />
                  <XAxis
                    dataKey='date'
                    tick={{ fontSize: 12 }}
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => {
                      const date = new Date(value);
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
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
                  <Tooltip
                    formatter={formatTooltip}
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
                  {filteredAgents.map((agent, index) => {
                    const originalIndex = activeAgents.findIndex(
                      (a) => a.id === agent.id
                    );
                    return (
                      <Line
                        key={agent.id}
                        type='monotone'
                        dataKey={agent.id}
                        stroke={agentColors[originalIndex % agentColors.length]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: agentColors[originalIndex % agentColors.length]
                        }}
                        name={agent.name}
                        isAnimationActive={false} // Disable animation for smoother updates
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Current Values Legend */}
            <div className='mt-4 flex flex-wrap gap-4'>
              {filteredAgents.map((agent) => {
                const currentValue =
                  currentValues[agent.id] || agent.allocatedUsdc + agent.pnl;
                const initialValue = agent.allocatedUsdc;
                const change = currentValue - initialValue;
                const changePercent = ((change / initialValue) * 100).toFixed(
                  2
                );
                const originalIndex = activeAgents.findIndex(
                  (a) => a.id === agent.id
                );

                return (
                  <div
                    key={agent.id}
                    className='bg-muted/50 flex items-center gap-2 rounded-md border px-3 py-2 transition-all'
                  >
                    <div
                      className='h-3 w-3 rounded-full'
                      style={{
                        backgroundColor:
                          agentColors[originalIndex % agentColors.length]
                      }}
                    />
                    <div className='flex flex-col'>
                      <span className='text-xs font-medium'>{agent.name}</span>
                      <span className='text-xs font-semibold tabular-nums'>
                        {currentValue.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        })}
                      </span>
                      <span
                        className={`text-xs ${
                          change >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {change >= 0 ? '+' : ''}
                        {changePercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Live Trades */}
      <div className='lg:col-span-4'>
        <Card className='flex h-full flex-col'>
          <CardHeader className='pb-2'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-base font-semibold'>
                Live Trades
              </CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' size='sm' className='gap-2'>
                    <IconFilter className='h-4 w-4' />
                    Agents ({selectedAgentIds.size}/{activeAgents.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-64' align='end'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-sm font-semibold'>
                        Filter Agents
                      </Label>
                      <div className='flex gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-7 text-xs'
                          onClick={selectAllAgents}
                        >
                          All
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-7 text-xs'
                          onClick={deselectAllAgents}
                        >
                          None
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <ScrollArea className='h-[200px]'>
                      <div className='space-y-2'>
                        {activeAgents.map((agent) => {
                          const isSelected = selectedAgentIds.has(agent.id);
                          const originalIndex = activeAgents.findIndex(
                            (a) => a.id === agent.id
                          );

                          return (
                            <div
                              key={agent.id}
                              className='hover:bg-muted/50 -mx-2 flex cursor-pointer items-center space-x-2 rounded-md p-2'
                              onClick={() => toggleAgentSelection(agent.id)}
                            >
                              <Checkbox
                                id={`agent-${agent.id}`}
                                checked={isSelected}
                                onCheckedChange={() =>
                                  toggleAgentSelection(agent.id)
                                }
                              />
                              <Label
                                htmlFor={`agent-${agent.id}`}
                                className='flex flex-1 cursor-pointer items-center gap-2'
                              >
                                <div
                                  className='h-3 w-3 rounded-full'
                                  style={{
                                    backgroundColor:
                                      agentColors[
                                        originalIndex % agentColors.length
                                      ]
                                  }}
                                />
                                <span className='text-sm'>{agent.name}</span>
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'trade' | 'thought')}
            className='flex min-h-0 w-full flex-1 flex-col'
          >
            <div className='flex-shrink-0 px-4 pb-2'>
              <TabsList className='w-full'>
                <TabsTrigger value='trade' className='flex-1'>
                  Trade Details
                </TabsTrigger>
                <TabsTrigger value='thought' className='flex-1'>
                  Thought Process
                </TabsTrigger>
              </TabsList>
            </div>
            <CardContent className='flex min-h-0 flex-1 flex-col overflow-hidden p-0'>
              <TabsContent
                value='trade'
                className='m-0 h-full overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col'
              >
                <ScrollArea className='h-full'>
                  <div className='space-y-2 p-4'>
                    {filteredTrades.length === 0 ? (
                      <div className='text-muted-foreground py-8 text-center text-sm'>
                        No trades in selected timeframe
                      </div>
                    ) : (
                      filteredTrades.map((trade, index) => (
                        <Card
                          key={trade.id}
                          className={`hover:border-primary cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedTrade === trade.id
                              ? 'border-primary border-2 shadow-md'
                              : ''
                          }`}
                          style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                          }}
                          onClick={() => {
                            setSelectedTrade(trade.id);
                            setActiveTab('trade');
                          }}
                        >
                          <CardContent className='p-3'>
                            <div className='space-y-2'>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                  <IconRobot className='text-muted-foreground h-4 w-4' />
                                  <span className='text-sm font-medium'>
                                    {trade.agentName}
                                  </span>
                                </div>
                                <Badge
                                  variant={
                                    trade.side === 'BUY'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className='text-xs'
                                >
                                  {trade.side}
                                </Badge>
                              </div>

                              <div className='space-y-1'>
                                <div className='flex items-center justify-between text-xs'>
                                  <span className='text-muted-foreground'>
                                    Market
                                  </span>
                                  <span className='font-medium'>
                                    {trade.market}
                                  </span>
                                </div>
                                <div className='flex items-center justify-between text-xs'>
                                  <span className='text-muted-foreground'>
                                    Outcome
                                  </span>
                                  <Badge variant='outline' className='text-xs'>
                                    {trade.outcome}
                                  </Badge>
                                </div>
                                <div className='flex items-center justify-between text-xs'>
                                  <span className='text-muted-foreground'>
                                    Size
                                  </span>
                                  <span className='font-medium tabular-nums'>
                                    {trade.size.toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'USD',
                                      minimumFractionDigits: 0
                                    })}
                                  </span>
                                </div>
                                <Separator className='my-1' />
                                <div className='flex items-center justify-between'>
                                  <span className='text-muted-foreground text-xs'>
                                    P&L
                                  </span>
                                  <div className='flex items-center gap-1'>
                                    {trade.pnl >= 0 ? (
                                      <IconTrendingUp className='h-3 w-3 text-green-600' />
                                    ) : (
                                      <IconTrendingDown className='h-3 w-3 text-red-600' />
                                    )}
                                    <span
                                      className={`text-sm font-semibold tabular-nums ${
                                        trade.pnl >= 0
                                          ? 'text-green-600 dark:text-green-400'
                                          : 'text-red-600 dark:text-red-400'
                                      }`}
                                    >
                                      {trade.pnl >= 0 ? '+' : ''}
                                      {trade.pnl.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 2
                                      })}
                                    </span>
                                  </div>
                                </div>
                                <div className='flex items-center justify-between text-xs'>
                                  <span className='text-muted-foreground'>
                                    P&L %
                                  </span>
                                  <span
                                    className={`font-semibold tabular-nums ${
                                      trade.pnlPercent >= 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}
                                  >
                                    {trade.pnlPercent >= 0 ? '+' : ''}
                                    {trade.pnlPercent.toFixed(2)}%
                                  </span>
                                </div>
                              </div>

                              <div className='text-muted-foreground pt-1 text-xs'>
                                {formatDistanceToNow(
                                  new Date(trade.timestamp),
                                  { addSuffix: true }
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value='thought'
                className='m-0 h-full overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col'
              >
                <ScrollArea className='h-full' id='thought-scroll'>
                  <div className='space-y-3 p-4'>
                    {(() => {
                      // Combine all agent activities into one chronological feed
                      const allActivities: Array<
                        AgentActivity & { agentId: string; agentName: string }
                      > = [];

                      filteredAgents.forEach((agent) => {
                        const agentActivities =
                          mockAgentActivities[agent.id] || [];
                        agentActivities
                          .filter((a) => {
                            const activityTime = new Date(
                              a.timestamp
                            ).getTime();
                            const cutoff =
                              timeFilter === 'all'
                                ? 0
                                : timeFilter === '24h'
                                  ? Date.now() - 24 * 60 * 60 * 1000
                                  : timeFilter === '72h'
                                    ? Date.now() - 72 * 60 * 60 * 1000
                                    : Date.now() - 7 * 24 * 60 * 60 * 1000;
                            return activityTime >= cutoff;
                          })
                          .forEach((activity) => {
                            allActivities.push({
                              ...activity,
                              agentId: agent.id,
                              agentName: agent.name
                            });
                          });
                      });

                      // Sort by timestamp (newest first for chat-like feel)
                      allActivities.sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      );

                      if (allActivities.length === 0) {
                        return (
                          <div className='text-muted-foreground py-8 text-center text-sm'>
                            No activity in selected timeframe
                          </div>
                        );
                      }

                      return allActivities.map((activity, index) => {
                        const timestamp = new Date(activity.timestamp);
                        const timeStr = timestamp.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        });
                        const agent = filteredAgents.find(
                          (a) => a.id === activity.agentId
                        );
                        const originalIndex = activeAgents.findIndex(
                          (a) => a.id === activity.agentId
                        );

                        return (
                          <div
                            key={`${activity.agentId}-${activity.id}`}
                            className='bg-card hover:border-primary/50 flex gap-3 rounded-lg border p-3 transition-all'
                            style={{
                              animation: `fadeIn 0.3s ease-out ${index * 0.02}s both`
                            }}
                          >
                            <div className='flex-shrink-0'>
                              <div
                                className='flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white'
                                style={{
                                  backgroundColor:
                                    agentColors[
                                      originalIndex % agentColors.length
                                    ]
                                }}
                              >
                                <IconRobot className='h-4 w-4' />
                              </div>
                            </div>
                            <div className='flex-1 space-y-1'>
                              <div className='flex items-center gap-2'>
                                <span className='text-sm font-semibold'>
                                  {activity.agentName}
                                </span>
                                <Badge
                                  variant={
                                    activity.type === 'trade' ||
                                    activity.type === 'close'
                                      ? 'default'
                                      : activity.type === 'evaluation'
                                        ? 'secondary'
                                        : 'outline'
                                  }
                                  className='text-xs'
                                >
                                  {activity.type}
                                </Badge>
                                <span className='text-muted-foreground ml-auto text-xs'>
                                  {timeStr}
                                </span>
                              </div>
                              <p className='text-sm leading-relaxed'>
                                {activity.message}
                              </p>
                              {activity.marketTitle && (
                                <div className='text-muted-foreground text-xs'>
                                  📊 {activity.marketTitle}
                                </div>
                              )}
                              {activity.tradeSize && (
                                <div className='text-muted-foreground text-xs'>
                                  💰 Size:{' '}
                                  {activity.tradeSize.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0
                                  })}
                                </div>
                              )}
                              {activity.pnl !== undefined && (
                                <div
                                  className={`text-xs font-semibold ${
                                    activity.pnl >= 0
                                      ? 'text-green-600 dark:text-green-400'
                                      : 'text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {activity.pnl >= 0 ? '📈' : '📉'} P&L:{' '}
                                  {activity.pnl >= 0 ? '+' : ''}
                                  {activity.pnl.toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
