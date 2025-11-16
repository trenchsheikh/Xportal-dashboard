'use client';

import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { IconWallet, IconCoins } from '@tabler/icons-react';

export function WalletInfo() {
  // Mock wallet data - replace with real wallet connection
  const usdcBalance = 125000.0;
  const isConnected = true;
  const network = 'Circle Arc';
  const walletAddress = '0x1234...5678';

  if (!isConnected) {
    return (
      <Badge variant='outline' className='gap-2'>
        <IconWallet className='h-3 w-3' />
        Connect Wallet
      </Badge>
    );
  }

  return (
    <div className='flex items-center gap-3'>
      <Badge variant='outline' className='gap-1.5'>
        <div className='h-2 w-2 rounded-full bg-green-500' />
        {network}
      </Badge>
      <div className='bg-background flex items-center gap-2 rounded-md border px-3 py-1.5'>
        <IconCoins className='text-primary h-4 w-4' />
        <span className='font-mono text-sm font-semibold'>
          {usdcBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}{' '}
          USDC
        </span>
      </div>
      <div className='text-muted-foreground hidden text-xs md:block'>
        {walletAddress}
      </div>
    </div>
  );
}
