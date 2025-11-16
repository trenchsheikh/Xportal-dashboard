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
import type { Market } from '@/types/xportal';
import { IconRobot } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

interface MarketActivitySnapshotProps {
  markets: Market[];
}

export function MarketActivitySnapshot({
  markets
}: MarketActivitySnapshotProps) {
  // Show top 5 active markets
  const activeMarkets = markets
    .filter((m) => m.status === 'Live')
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Activity Snapshot</CardTitle>
        <CardDescription>Top active markets by 24h volume</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Market</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Implied Probability</TableHead>
              <TableHead>24h Volume</TableHead>
              <TableHead>Resolution</TableHead>
              <TableHead>Agents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeMarkets.map((market) => {
              const yesOutcome = market.outcomes.find((o) => o.label === 'YES');
              const resolutionDate = new Date(market.resolutionTime);
              const timeToResolution = formatDistanceToNow(resolutionDate, {
                addSuffix: true
              });

              return (
                <TableRow key={market.id}>
                  <TableCell className='max-w-[300px] font-medium'>
                    <div className='truncate'>{market.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{market.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {yesOutcome ? (
                      <span className='font-mono'>
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
                  <TableCell className='text-muted-foreground text-sm'>
                    {timeToResolution}
                  </TableCell>
                  <TableCell>
                    {market.hasActiveAgents ? (
                      <Badge variant='secondary' className='gap-1'>
                        <IconRobot className='h-3 w-3' />
                        Active
                      </Badge>
                    ) : (
                      <span className='text-muted-foreground text-sm'>—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
