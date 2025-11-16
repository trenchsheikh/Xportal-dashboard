'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import type { Portfolio } from '@/types/xportal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

export function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const totalPnl = portfolio.realizedPnl + portfolio.unrealizedPnl;
  const totalPnlPercent = (totalPnl / (portfolio.totalValue - totalPnl)) * 100;

  // Format data for 7-day chart
  const chartData = portfolio.performance7d.map((value, index) => ({
    day: `Day ${index + 1}`,
    value
  }));

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Portfolio Summary</h3>
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader>
            <CardDescription>Total Portfolio Value</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums'>
              {portfolio.totalValue.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
              })}
            </CardTitle>
            <CardAction>
              <Badge variant='outline' className='gap-1'>
                <IconTrendingUp className='h-3 w-3' />
                {totalPnlPercent > 0 ? '+' : ''}
                {totalPnlPercent.toFixed(2)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='text-muted-foreground'>
              {portfolio.openPositions} open positions
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Realized P&L</CardDescription>
            <CardTitle className='text-2xl font-semibold text-green-600 tabular-nums dark:text-green-400'>
              +
              {portfolio.realizedPnl.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
              })}
            </CardTitle>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='text-muted-foreground'>Locked in profits</div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Unrealized P&L</CardDescription>
            <CardTitle
              className={`text-2xl font-semibold tabular-nums ${
                portfolio.unrealizedPnl >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {portfolio.unrealizedPnl >= 0 ? '+' : ''}
              {portfolio.unrealizedPnl.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
              })}
            </CardTitle>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='text-muted-foreground'>Open positions</div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>7-Day Performance</CardDescription>
            <CardTitle
              className={`text-2xl font-semibold tabular-nums ${
                portfolio.weeklyPnl >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {portfolio.weeklyPnl >= 0 ? '+' : ''}
              {portfolio.weeklyPnl.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
              })}
            </CardTitle>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1.5 text-sm'>
            <div className='text-muted-foreground'>Weekly change</div>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Portfolio Performance</CardTitle>
          <CardDescription>
            Portfolio value over the last 7 days
          </CardDescription>
        </CardHeader>
        <div className='h-[200px] px-6 pb-6'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='hsl(var(--primary))'
                    stopOpacity={0.3}
                  />
                  <stop
                    offset='95%'
                    stopColor='hsl(var(--primary))'
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis dataKey='day' />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                  })
                }
              />
              <Area
                type='monotone'
                dataKey='value'
                stroke='hsl(var(--primary))'
                fillOpacity={1}
                fill='url(#colorValue)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
