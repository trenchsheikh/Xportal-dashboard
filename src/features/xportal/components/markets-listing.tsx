'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Market, MarketCategory, MarketStatus } from '@/types/xportal';
import { IconRobot, IconSearch } from '@tabler/icons-react';
import { mockMarkets } from '@/lib/mock-data';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function MarketsListing() {
  const [markets] = useState<Market[]>(mockMarkets);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MarketCategory | 'All'>(
    'All'
  );
  const [statusFilter, setStatusFilter] = useState<MarketStatus | 'All'>('All');

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch =
      market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || market.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All' || market.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className='space-y-4'>
      {/* Filters */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 md:flex-row'>
            <div className='flex-1'>
              <div className='relative'>
                <IconSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input
                  placeholder='Search markets...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-9'
                />
              </div>
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(v) =>
                setCategoryFilter(v as MarketCategory | 'All')
              }
            >
              <SelectTrigger className='w-full md:w-[180px]'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All Categories</SelectItem>
                <SelectItem value='Crypto'>Crypto</SelectItem>
                <SelectItem value='Macro'>Macro</SelectItem>
                <SelectItem value='Sports'>Sports</SelectItem>
                <SelectItem value='Custom'>Custom</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as MarketStatus | 'All')}
            >
              <SelectTrigger className='w-full md:w-[180px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All Status</SelectItem>
                <SelectItem value='Live'>Live</SelectItem>
                <SelectItem value='Upcoming'>Upcoming</SelectItem>
                <SelectItem value='Settled'>Settled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Markets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Markets</CardTitle>
          <CardDescription>
            {filteredMarkets.length} market
            {filteredMarkets.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Market</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Implied Probability</TableHead>
                <TableHead>24h Volume</TableHead>
                <TableHead>Liquidity</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMarkets.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className='text-muted-foreground text-center'
                  >
                    No markets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMarkets.map((market) => {
                  const yesOutcome = market.outcomes.find(
                    (o) => o.label === 'YES'
                  );
                  const resolutionDate = new Date(market.resolutionTime);
                  const timeToResolution = formatDistanceToNow(resolutionDate, {
                    addSuffix: true
                  });

                  return (
                    <TableRow key={market.id}>
                      <TableCell className='max-w-[300px] font-medium'>
                        <div className='truncate' title={market.title}>
                          {market.title}
                        </div>
                        <div className='text-muted-foreground mt-1 text-xs'>
                          {market.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>{market.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            market.status === 'Live'
                              ? 'default'
                              : market.status === 'Settled'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {market.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {yesOutcome ? (
                          <span className='font-mono font-semibold'>
                            {(yesOutcome.price * 100).toFixed(1)}%
                          </span>
                        ) : (
                          <span className='text-muted-foreground'>N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {market.volume24h.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0
                        })}
                      </TableCell>
                      <TableCell>
                        {market.liquidity.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0
                        })}
                      </TableCell>
                      <TableCell className='text-muted-foreground text-sm'>
                        {timeToResolution}
                      </TableCell>
                      <TableCell>
                        {market.hasActiveAgents ? (
                          <Badge variant='secondary' className='gap-1'>
                            <IconRobot className='h-3 w-3' />
                            {market.agentExposure?.length || 0} active
                          </Badge>
                        ) : (
                          <span className='text-muted-foreground text-sm'>
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant='ghost' size='sm' asChild>
                          <Link href={`/dashboard/markets/${market.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
