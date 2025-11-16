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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Market } from '@/types/xportal';
import { IconRobot } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

interface MarketDetailViewProps {
  market: Market;
}

const COLORS = ['#22c55e', '#ef4444'];

export function MarketDetailView({ market }: MarketDetailViewProps) {
  const resolutionDate = new Date(market.resolutionTime);
  const timeToResolution = formatDistanceToNow(resolutionDate, {
    addSuffix: true
  });

  // Chart data for outcome prices
  const outcomeChartData = market.outcomes.map((outcome) => ({
    outcome: outcome.label,
    price: outcome.price * 100,
    volume: outcome.volume
  }));

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardDescription>Status</CardDescription>
            <CardTitle>
              <Badge
                variant={
                  market.status === 'Live'
                    ? 'default'
                    : market.status === 'Settled'
                      ? 'secondary'
                      : 'outline'
                }
                className='px-4 py-2 text-lg'
              >
                {market.status}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Category</CardDescription>
            <CardTitle>
              <Badge variant='outline' className='px-4 py-2 text-lg'>
                {market.category}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Resolution Time</CardDescription>
            <CardTitle className='text-lg'>{timeToResolution}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue='overview' className='w-full'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='outcomes'>Outcomes</TabsTrigger>
          <TabsTrigger value='agents'>Agent Exposure</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Market Information</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    24h Volume
                  </span>
                  <span className='font-semibold'>
                    {market.volume24h.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0
                    })}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Total Liquidity
                  </span>
                  <span className='font-semibold'>
                    {market.liquidity.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0
                    })}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>
                    Active Agents
                  </span>
                  <span className='font-semibold'>
                    {market.hasActiveAgents
                      ? market.agentExposure?.length || 0
                      : 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outcome Prices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-[200px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={outcomeChartData}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='outcome' />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value: number) => `${value.toFixed(1)}%`}
                      />
                      <Bar dataKey='price' fill='hsl(var(--primary))'>
                        {outcomeChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Outcomes Tab */}
        <TabsContent value='outcomes' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Market Outcomes</CardTitle>
              <CardDescription>
                Current prices and volumes for each outcome
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Price (Probability)</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Market Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {market.outcomes.map((outcome) => (
                    <TableRow key={outcome.id}>
                      <TableCell className='font-medium'>
                        {outcome.label}
                      </TableCell>
                      <TableCell>
                        <span className='font-mono text-lg font-semibold'>
                          {(outcome.price * 100).toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {outcome.volume.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0
                        })}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <div className='bg-muted h-2 flex-1 overflow-hidden rounded-full'>
                            <div
                              className='bg-primary h-full'
                              style={{ width: `${outcome.price * 100}%` }}
                            />
                          </div>
                          <span className='text-muted-foreground text-sm'>
                            {(outcome.price * 100).toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Exposure Tab */}
        <TabsContent value='agents' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Agent Exposure</CardTitle>
              <CardDescription>
                Agents currently trading this market
              </CardDescription>
            </CardHeader>
            <CardContent>
              {market.hasActiveAgents &&
              market.agentExposure &&
              market.agentExposure.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Net Exposure</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {market.agentExposure.map((exposure) => (
                      <TableRow key={exposure.agentId}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <IconRobot className='text-muted-foreground h-4 w-4' />
                            <span className='font-medium'>
                              {exposure.agentName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className='font-semibold'>
                            {exposure.netExposure.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0
                            })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>Active</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='text-muted-foreground py-8 text-center'>
                  No agents are currently trading this market
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
