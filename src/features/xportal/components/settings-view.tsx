'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { IconWallet, IconAlertTriangle } from '@tabler/icons-react';
import { useState } from 'react';

export function SettingsView() {
  const [settings, setSettings] = useState({
    maxAutoAllocation: 100000,
    globalKillSwitch: false,
    newMarketAlerts: true,
    drawdownAlerts: true,
    largePnlAlerts: true,
    drawdownThreshold: 10,
    pnlAlertThreshold: 5000
  });

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className='space-y-6'>
      {/* Profile & Wallet */}
      <Card>
        <CardHeader>
          <CardTitle>Profile & Wallet</CardTitle>
          <CardDescription>
            Your account information and wallet details
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-4'>
            <IconWallet className='text-muted-foreground h-5 w-5' />
            <div className='flex-1'>
              <Label>Connected Wallet</Label>
              <p className='text-muted-foreground font-mono text-sm'>
                0x1234...5678
              </p>
            </div>
            <Button variant='outline' size='sm'>
              Change Wallet
            </Button>
          </div>
          <Separator />
          <div className='space-y-2'>
            <Label>Network</Label>
            <Badge variant='outline' className='px-3 py-1.5 text-base'>
              Circle Arc
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Global Risk Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Global Risk Limits</CardTitle>
          <CardDescription>
            Set maximum limits for all agents combined
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>Max USDC Auto-allocated to All Agents</Label>
              <span className='text-sm font-semibold'>
                {settings.maxAutoAllocation.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0
                })}
              </span>
            </div>
            <Slider
              value={[settings.maxAutoAllocation]}
              onValueChange={([v]) => updateSetting('maxAutoAllocation', v)}
              min={10000}
              max={500000}
              step={10000}
            />
            <p className='text-muted-foreground text-xs'>
              Total maximum USDC that can be allocated across all agents
            </p>
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Global Kill Switch</Label>
              <p className='text-muted-foreground text-sm'>
                Immediately pause all auto-trading across all agents
              </p>
            </div>
            <Switch
              checked={settings.globalKillSwitch}
              onCheckedChange={(v) => updateSetting('globalKillSwitch', v)}
            />
          </div>

          {settings.globalKillSwitch && (
            <div className='border-destructive bg-destructive/10 rounded-lg border p-4'>
              <div className='text-destructive flex items-center gap-2'>
                <IconAlertTriangle className='h-4 w-4' />
                <span className='font-semibold'>
                  All auto-trading is disabled
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what events trigger notifications
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>New Matching Markets</Label>
              <p className='text-muted-foreground text-sm'>
                Get notified when new markets match your agent criteria
              </p>
            </div>
            <Switch
              checked={settings.newMarketAlerts}
              onCheckedChange={(v) => updateSetting('newMarketAlerts', v)}
            />
          </div>

          <Separator />

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Agent Drawdown Alerts</Label>
              <p className='text-muted-foreground text-sm'>
                Alert when an agent exceeds drawdown threshold
              </p>
            </div>
            <Switch
              checked={settings.drawdownAlerts}
              onCheckedChange={(v) => updateSetting('drawdownAlerts', v)}
            />
          </div>

          {settings.drawdownAlerts && (
            <div className='ml-6 space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm'>Drawdown Threshold (%)</Label>
                <span className='text-sm font-semibold'>
                  {settings.drawdownThreshold}%
                </span>
              </div>
              <Slider
                value={[settings.drawdownThreshold]}
                onValueChange={([v]) => updateSetting('drawdownThreshold', v)}
                min={1}
                max={50}
                step={1}
              />
            </div>
          )}

          <Separator />

          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Large P&L Events</Label>
              <p className='text-muted-foreground text-sm'>
                Notify on significant profit or loss events
              </p>
            </div>
            <Switch
              checked={settings.largePnlAlerts}
              onCheckedChange={(v) => updateSetting('largePnlAlerts', v)}
            />
          </div>

          {settings.largePnlAlerts && (
            <div className='ml-6 space-y-2'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm'>P&L Alert Threshold (USDC)</Label>
                <span className='text-sm font-semibold'>
                  {settings.pnlAlertThreshold.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                  })}
                </span>
              </div>
              <Slider
                value={[settings.pnlAlertThreshold]}
                onValueChange={([v]) => updateSetting('pnlAlertThreshold', v)}
                min={1000}
                max={50000}
                step={1000}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className='flex justify-end gap-2'>
        <Button variant='outline'>Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
