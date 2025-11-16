'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type {
  StrategyType,
  RiskTier,
  TimeHorizon,
  MarketCategory
} from '@/types/xportal';
import { openRouterModels, mockAgents } from '@/lib/mock-data';
import {
  IconCheck,
  IconCopy,
  IconAlertCircle,
  IconRocket,
  IconSparkles,
  IconSettings
} from '@tabler/icons-react';

const strategies: StrategyType[] = [
  'Momentum',
  'Mean Reversion',
  'News-driven',
  'Macro Trends',
  'Volatility',
  'Arbitrage'
];

const categories: MarketCategory[] = ['Crypto', 'Macro', 'Sports', 'Custom'];

const timeHorizons: TimeHorizon[] = ['Intraday', 'Swing', 'Long-term'];

// Agent Templates for Simple Mode
interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  strategy: StrategyType;
  modelId: string;
  riskTier: RiskTier;
  initialFund: number;
  maxAllocation: number;
  maxPerMarket: number;
  maxTradesPerDay: number;
  allowedCategories: MarketCategory[];
  timeHorizon: TimeHorizon;
  instructions: string;
  autoEntry: boolean;
  autoExit: boolean;
  requireConfirmation: boolean;
  confirmationThreshold: number;
  paperMode: boolean;
  icon: string;
}

const agentTemplates: AgentTemplate[] = [
  {
    id: 'momentum-trader',
    name: 'Momentum Trader',
    description:
      'Captures trending markets with quick entry/exit. Best for volatile crypto markets.',
    strategy: 'Momentum',
    modelId: 'openrouter/anthropic/claude-3.5-sonnet',
    riskTier: 'Medium',
    initialFund: 10000,
    maxAllocation: 30000,
    maxPerMarket: 25,
    maxTradesPerDay: 50,
    allowedCategories: ['Crypto'],
    timeHorizon: 'Intraday',
    instructions:
      'Focus on strong momentum signals. Enter when price breaks key resistance with volume. Exit on momentum exhaustion or stop-loss triggers.',
    autoEntry: true,
    autoExit: true,
    requireConfirmation: false,
    confirmationThreshold: 1000,
    paperMode: true,
    icon: '📈'
  },
  {
    id: 'news-scanner',
    name: 'News Scanner',
    description:
      'Monitors news and sentiment to catch rapid market movements. High-frequency trading.',
    strategy: 'News-driven',
    modelId: 'openrouter/openai/gpt-4.1',
    riskTier: 'High',
    initialFund: 15000,
    maxAllocation: 50000,
    maxPerMarket: 30,
    maxTradesPerDay: 100,
    allowedCategories: ['Crypto', 'Macro'],
    timeHorizon: 'Intraday',
    instructions:
      'Scan news feeds and social sentiment. React quickly to breaking news. Use tight stop-losses. Prioritize high-volume markets.',
    autoEntry: true,
    autoExit: true,
    requireConfirmation: true,
    confirmationThreshold: 5000,
    paperMode: true,
    icon: '📰'
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion Bot',
    description:
      'Trades market overextensions. Lower risk, steady returns. Good for range-bound markets.',
    strategy: 'Mean Reversion',
    modelId: 'openrouter/mistralai/mixtral-8x7b-instruct',
    riskTier: 'Low',
    initialFund: 5000,
    maxAllocation: 20000,
    maxPerMarket: 15,
    maxTradesPerDay: 30,
    allowedCategories: ['Crypto', 'Macro'],
    timeHorizon: 'Swing',
    instructions:
      'Identify overextended markets using RSI and Bollinger Bands. Enter when price deviates significantly from mean. Exit at mean reversion or profit target.',
    autoEntry: true,
    autoExit: true,
    requireConfirmation: false,
    confirmationThreshold: 1000,
    paperMode: true,
    icon: '🔄'
  },
  {
    id: 'arbitrage-hunter',
    name: 'Arbitrage Hunter',
    description:
      'Finds price discrepancies across markets. Low risk, requires fast execution.',
    strategy: 'Arbitrage',
    modelId: 'openrouter/anthropic/claude-3.5-sonnet',
    riskTier: 'Low',
    initialFund: 20000,
    maxAllocation: 40000,
    maxPerMarket: 20,
    maxTradesPerDay: 200,
    allowedCategories: ['Crypto'],
    timeHorizon: 'Intraday',
    instructions:
      'Scan for price differences between markets. Execute quickly when spread exceeds threshold. Focus on high-liquidity pairs.',
    autoEntry: true,
    autoExit: true,
    requireConfirmation: false,
    confirmationThreshold: 1000,
    paperMode: true,
    icon: '⚡'
  },
  {
    id: 'macro-strategist',
    name: 'Macro Strategist',
    description:
      'Trades based on macroeconomic trends. Longer timeframes, higher conviction positions.',
    strategy: 'Macro Trends',
    modelId: 'openrouter/openai/gpt-4.1',
    riskTier: 'Medium',
    initialFund: 25000,
    maxAllocation: 60000,
    maxPerMarket: 35,
    maxTradesPerDay: 10,
    allowedCategories: ['Macro', 'Crypto'],
    timeHorizon: 'Long-term',
    instructions:
      'Analyze macroeconomic indicators, Fed policy, inflation data. Build high-conviction positions. Hold for weeks to months. Use wider stop-losses.',
    autoEntry: true,
    autoExit: false,
    requireConfirmation: true,
    confirmationThreshold: 10000,
    paperMode: true,
    icon: '🌍'
  },
  {
    id: 'volatility-trader',
    name: 'Volatility Trader',
    description:
      'Profits from market volatility. Trades both directions, uses options strategies.',
    strategy: 'Volatility',
    modelId: 'openrouter/anthropic/claude-3.5-sonnet',
    riskTier: 'High',
    initialFund: 15000,
    maxAllocation: 45000,
    maxPerMarket: 30,
    maxTradesPerDay: 60,
    allowedCategories: ['Crypto', 'Macro'],
    timeHorizon: 'Swing',
    instructions:
      'Monitor VIX and volatility indicators. Enter when volatility is expected to expand or contract. Use both long and short positions. Manage risk carefully.',
    autoEntry: true,
    autoExit: true,
    requireConfirmation: true,
    confirmationThreshold: 5000,
    paperMode: true,
    icon: '📊'
  }
];

function calculateRiskTier(
  maxAllocation: number,
  maxPerMarket: number,
  maxTradesPerDay: number
): RiskTier {
  const totalRisk =
    maxAllocation / 100000 + maxPerMarket / 50 + maxTradesPerDay / 100;
  if (totalRisk < 0.5) return 'Low';
  if (totalRisk < 1.5) return 'Medium';
  return 'High';
}

export function CreateAgentWizard() {
  const [creationMode, setCreationMode] = useState<'simple' | 'advanced'>(
    'simple'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [mode, setMode] = useState<'create' | 'clone'>('create');
  const [cloneAgentId, setCloneAgentId] = useState('');
  const [cloneAgent, setCloneAgent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    strategy: '' as StrategyType | '',
    modelId: '',
    maxAllocation: 30000,
    maxPerMarket: 20,
    maxTradesPerDay: 50,
    allowedCategories: [] as MarketCategory[],
    timeHorizon: '' as TimeHorizon | '',
    instructions: '',
    autoEntry: true,
    autoExit: true,
    requireConfirmation: false,
    confirmationThreshold: 1000,
    paperMode: true,
    initialFund: 10000,
    timeLimitEnabled: false,
    timeLimitDays: 30,
    timeLimitUnlimited: true
  });

  const riskTier = calculateRiskTier(
    formData.maxAllocation,
    formData.maxPerMarket,
    formData.maxTradesPerDay
  );

  const selectedModel = openRouterModels.find((m) => m.id === formData.modelId);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleCategory = (category: MarketCategory) => {
    updateFormData({
      allowedCategories: formData.allowedCategories.includes(category)
        ? formData.allowedCategories.filter((c) => c !== category)
        : [...formData.allowedCategories, category]
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = agentTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setFormData({
        name: template.name,
        description: template.description,
        strategy: template.strategy,
        modelId: template.modelId,
        maxAllocation: template.maxAllocation,
        maxPerMarket: template.maxPerMarket,
        maxTradesPerDay: template.maxTradesPerDay,
        allowedCategories: template.allowedCategories,
        timeHorizon: template.timeHorizon,
        instructions: template.instructions,
        autoEntry: template.autoEntry,
        autoExit: template.autoExit,
        requireConfirmation: template.requireConfirmation,
        confirmationThreshold: template.confirmationThreshold,
        paperMode: template.paperMode,
        initialFund: template.initialFund,
        timeLimitEnabled: false,
        timeLimitDays: 30,
        timeLimitUnlimited: true
      });
    }
  };

  const handleCloneAgent = () => {
    const agent = mockAgents.find((a) => a.id === cloneAgentId);
    if (agent) {
      setCloneAgent(agent);
      setFormData({
        name: `${agent.name} (Clone)`,
        description: agent.description,
        strategy: agent.strategy,
        modelId:
          agent.modelProvider && agent.modelName
            ? `${agent.modelProvider}/${agent.modelName}`
            : '',
        maxAllocation: agent.allocatedUsdc,
        maxPerMarket: 20,
        maxTradesPerDay: 50,
        allowedCategories: [],
        timeHorizon: '' as TimeHorizon | '',
        instructions: '',
        autoEntry: true,
        autoExit: true,
        requireConfirmation: false,
        confirmationThreshold: 1000,
        paperMode: true,
        initialFund: agent.allocatedUsdc,
        timeLimitEnabled: false,
        timeLimitDays: 30,
        timeLimitUnlimited: true
      });
    }
  };

  const handleDeploy = () => {
    // Placeholder for deploying agent
    // eslint-disable-next-line no-console
    console.log('Deploying agent with data:', formData);
    alert('Agent deployment feature coming soon!');
  };

  const isFormValid = () => {
    if (creationMode === 'simple') {
      return selectedTemplate !== null && formData.name.trim() !== '';
    }
    return (
      formData.name.trim() !== '' &&
      formData.strategy !== '' &&
      formData.modelId !== '' &&
      formData.maxAllocation > 0 &&
      formData.initialFund > 0 &&
      formData.allowedCategories.length > 0 &&
      formData.timeHorizon !== '' &&
      formData.instructions.trim() !== ''
    );
  };

  return (
    <div className='w-full'>
      {/* Mode Selector */}
      <Card className='mb-4'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-4'>
            <Label className='text-sm font-semibold whitespace-nowrap'>
              Creation Mode:
            </Label>
            <div className='flex gap-2'>
              <Button
                variant={creationMode === 'simple' ? 'default' : 'outline'}
                size='sm'
                onClick={() => {
                  setCreationMode('simple');
                  setSelectedTemplate(null);
                }}
                className='gap-2'
              >
                <IconSparkles className='h-4 w-4' />
                Simple
              </Button>
              <Button
                variant={creationMode === 'advanced' ? 'default' : 'outline'}
                size='sm'
                onClick={() => {
                  setCreationMode('advanced');
                  setSelectedTemplate(null);
                }}
                className='gap-2'
              >
                <IconSettings className='h-4 w-4' />
                Advanced
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {creationMode === 'simple' ? (
        /* Simple Mode - Template Selection */
        <div className='grid w-full grid-cols-12 gap-4'>
          <div className='col-span-12 lg:col-span-9'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {agentTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`hover:border-primary cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary border-2'
                      : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-2xl'>{template.icon}</span>
                        <CardTitle className='text-base'>
                          {template.name}
                        </CardTitle>
                      </div>
                      {selectedTemplate === template.id && (
                        <IconCheck className='text-primary h-5 w-5' />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-3 pt-0'>
                    <p className='text-muted-foreground text-sm'>
                      {template.description}
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {template.strategy}
                      </Badge>
                      <Badge
                        variant={
                          template.riskTier === 'Low'
                            ? 'default'
                            : template.riskTier === 'Medium'
                              ? 'secondary'
                              : 'destructive'
                        }
                        className='text-xs'
                      >
                        {template.riskTier} Risk
                      </Badge>
                      <Badge variant='outline' className='text-xs'>
                        {template.timeHorizon}
                      </Badge>
                    </div>
                    <div className='text-muted-foreground space-y-1 text-xs'>
                      <div className='flex justify-between'>
                        <span>Initial Fund:</span>
                        <span className='font-semibold'>
                          {template.initialFund.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0
                          })}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Max Trades/Day:</span>
                        <span className='font-semibold'>
                          {template.maxTradesPerDay}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Simple Mode Summary */}
          <div className='col-span-12 lg:col-span-3'>
            <Card className='sticky top-4'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-semibold'>
                    Agent Summary
                  </CardTitle>
                  {selectedTemplate && (
                    <Badge
                      variant={
                        riskTier === 'Low'
                          ? 'default'
                          : riskTier === 'Medium'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className='text-xs'
                    >
                      {riskTier}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                {selectedTemplate ? (
                  <>
                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Template</span>
                        <span className='font-medium'>
                          {
                            agentTemplates.find(
                              (t) => t.id === selectedTemplate
                            )?.name
                          }
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Strategy</span>
                        <span className='font-medium'>{formData.strategy}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>
                          Initial Fund
                        </span>
                        <span className='font-medium tabular-nums'>
                          {formData.initialFund.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0
                          })}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Mode</span>
                        <Badge variant='outline' className='text-xs'>
                          {formData.paperMode ? 'Paper' : 'Live'}
                        </Badge>
                      </div>
                    </div>
                    <Separator className='my-2' />
                    <div className='space-y-3'>
                      <div className='space-y-2'>
                        <Label htmlFor='simple-name' className='text-sm'>
                          Agent Name *
                        </Label>
                        <Input
                          id='simple-name'
                          value={formData.name}
                          onChange={(e) =>
                            updateFormData({ name: e.target.value })
                          }
                          placeholder='Customize agent name'
                        />
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Label className='text-sm'>
                            Initial Fund (USDC) *
                          </Label>
                          <span className='text-sm font-semibold tabular-nums'>
                            {formData.initialFund.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0
                            })}
                          </span>
                        </div>
                        <Slider
                          value={[formData.initialFund]}
                          onValueChange={([v]) =>
                            updateFormData({ initialFund: v })
                          }
                          min={1000}
                          max={100000}
                          step={1000}
                        />
                        <p className='text-muted-foreground text-xs'>
                          Starting capital for this agent
                        </p>
                      </div>
                    </div>
                    <Alert className='mt-3 py-2'>
                      <IconAlertCircle className='h-4 w-4' />
                      <AlertDescription className='text-sm'>
                        Template settings are pre-configured. You can customize
                        the name and initial fund.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={handleDeploy}
                      disabled={!isFormValid()}
                      size='lg'
                      className='mt-2 w-full gap-2'
                    >
                      <IconRocket className='h-4 w-4' />
                      Deploy Agent
                    </Button>
                  </>
                ) : (
                  <div className='text-muted-foreground py-8 text-center text-sm'>
                    Select a template to get started
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Advanced Mode - Full Form */
        <div className='grid w-full grid-cols-12 gap-4'>
          {/* Left Column - Form Sections */}
          <div className='col-span-12 grid w-full grid-cols-12 gap-4 lg:col-span-9'>
            {/* Mode Selection - Full Width */}
            <div className='col-span-12'>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-2'>
                    <Label className='text-xs font-semibold whitespace-nowrap'>
                      Mode:
                    </Label>
                    <div className='flex gap-2'>
                      <Button
                        variant={mode === 'create' ? 'default' : 'outline'}
                        size='sm'
                        className='h-8 text-xs'
                        onClick={() => setMode('create')}
                      >
                        Create New
                      </Button>
                      <Button
                        variant={mode === 'clone' ? 'default' : 'outline'}
                        size='sm'
                        className='h-8 gap-1 text-xs'
                        onClick={() => setMode('clone')}
                      >
                        <IconCopy className='h-3 w-3' />
                        Clone
                      </Button>
                    </div>
                    {mode === 'clone' && (
                      <div className='ml-auto flex max-w-xs flex-1 gap-2'>
                        <Input
                          placeholder='Agent ID (e.g., agent-1)'
                          value={cloneAgentId}
                          onChange={(e) => setCloneAgentId(e.target.value)}
                          className='h-8 text-xs'
                        />
                        <Button
                          onClick={handleCloneAgent}
                          disabled={!cloneAgentId.trim()}
                          size='sm'
                          className='h-8 text-xs'
                        >
                          Load
                        </Button>
                      </div>
                    )}
                    {cloneAgent && (
                      <Badge variant='outline' className='text-xs'>
                        <IconCheck className='mr-1 h-3 w-3' />
                        {cloneAgent.name}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rest of Advanced Form - Same as before */}
            {/* Row 1: Basics & AI Model */}
            <Card className='col-span-12 lg:col-span-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold'>Basics</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                <div className='space-y-2'>
                  <Label htmlFor='name' className='text-sm'>
                    Name *
                  </Label>
                  <Input
                    id='name'
                    placeholder='Agent name'
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='description' className='text-sm'>
                    Description
                  </Label>
                  <Textarea
                    id='description'
                    placeholder='Brief description'
                    value={formData.description}
                    onChange={(e) =>
                      updateFormData({ description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='strategy' className='text-sm'>
                    Strategy *
                  </Label>
                  <Select
                    value={formData.strategy}
                    onValueChange={(v) =>
                      updateFormData({ strategy: v as StrategyType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className='col-span-12 lg:col-span-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold'>
                  AI Model (OpenRouter) *
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                <div className='space-y-2'>
                  <Label className='text-sm'>Model</Label>
                  <Select
                    value={formData.modelId}
                    onValueChange={(v) => updateFormData({ modelId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select model' />
                    </SelectTrigger>
                    <SelectContent>
                      {openRouterModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div>
                            <div className='font-medium'>{model.name}</div>
                            <div className='text-muted-foreground text-sm'>
                              {model.provider} • {model.latency}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedModel && (
                  <div className='bg-muted rounded border p-3 text-sm'>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='text-muted-foreground'>Provider:</span>
                      <Badge variant='outline'>{selectedModel.provider}</Badge>
                    </div>
                    <div className='text-muted-foreground'>
                      {selectedModel.useCase}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Row 2: Capital & Markets */}
            <Card className='col-span-12 lg:col-span-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold'>
                  Capital & Limits
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Initial Fund *</Label>
                    <span className='text-sm font-semibold tabular-nums'>
                      {formData.initialFund.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })}
                    </span>
                  </div>
                  <Slider
                    value={[formData.initialFund]}
                    onValueChange={([v]) => updateFormData({ initialFund: v })}
                    min={1000}
                    max={100000}
                    step={1000}
                  />
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Max Allocation</Label>
                    <span className='text-sm font-semibold tabular-nums'>
                      {formData.maxAllocation.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })}
                    </span>
                  </div>
                  <Slider
                    value={[formData.maxAllocation]}
                    onValueChange={([v]) =>
                      updateFormData({ maxAllocation: v })
                    }
                    min={1000}
                    max={100000}
                    step={1000}
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-sm'>Max %/Market</Label>
                      <span className='text-sm font-semibold tabular-nums'>
                        {formData.maxPerMarket}%
                      </span>
                    </div>
                    <Slider
                      value={[formData.maxPerMarket]}
                      onValueChange={([v]) =>
                        updateFormData({ maxPerMarket: v })
                      }
                      min={1}
                      max={50}
                      step={1}
                    />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-sm'>Max Trades/Day</Label>
                      <span className='text-sm font-semibold tabular-nums'>
                        {formData.maxTradesPerDay}
                      </span>
                    </div>
                    <Slider
                      value={[formData.maxTradesPerDay]}
                      onValueChange={([v]) =>
                        updateFormData({ maxTradesPerDay: v })
                      }
                      min={1}
                      max={200}
                      step={1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='col-span-12 lg:col-span-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold'>
                  Markets & Rules
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                <div className='space-y-2'>
                  <Label className='text-sm'>Categories *</Label>
                  <div className='flex flex-wrap gap-2'>
                    {categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant={
                          formData.allowedCategories.includes(cat)
                            ? 'default'
                            : 'outline'
                        }
                        className='cursor-pointer px-3 py-1 text-sm'
                        onClick={() => toggleCategory(cat)}
                      >
                        {formData.allowedCategories.includes(cat) && (
                          <IconCheck className='mr-1 h-4 w-4' />
                        )}
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='timeHorizon' className='text-sm'>
                    Time Horizon *
                  </Label>
                  <Select
                    value={formData.timeHorizon}
                    onValueChange={(v) =>
                      updateFormData({ timeHorizon: v as TimeHorizon })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                      {timeHorizons.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='instructions' className='text-sm'>
                    System Prompt *
                  </Label>
                  <Textarea
                    id='instructions'
                    placeholder='Agent instructions...'
                    value={formData.instructions}
                    onChange={(e) =>
                      updateFormData({ instructions: e.target.value })
                    }
                    rows={4}
                    className='font-mono text-sm'
                  />
                </div>
              </CardContent>
            </Card>

            {/* Row 3: Execution & Time Limit */}
            <Card className='col-span-12 lg:col-span-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold'>
                  Execution Settings
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Auto Entry</Label>
                    <Switch
                      checked={formData.autoEntry}
                      onCheckedChange={(v) => updateFormData({ autoEntry: v })}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Auto Exit</Label>
                    <Switch
                      checked={formData.autoExit}
                      onCheckedChange={(v) => updateFormData({ autoExit: v })}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Require Confirm</Label>
                    <Switch
                      checked={formData.requireConfirmation}
                      onCheckedChange={(v) =>
                        updateFormData({ requireConfirmation: v })
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <Label className='text-sm'>Paper Mode</Label>
                    <Switch
                      checked={formData.paperMode}
                      onCheckedChange={(v) => updateFormData({ paperMode: v })}
                    />
                  </div>
                </div>
                {formData.requireConfirmation && (
                  <div className='space-y-2'>
                    <Label htmlFor='threshold' className='text-sm'>
                      Confirmation Threshold (USDC)
                    </Label>
                    <Input
                      id='threshold'
                      type='number'
                      value={formData.confirmationThreshold}
                      onChange={(e) =>
                        updateFormData({
                          confirmationThreshold: Number(e.target.value)
                        })
                      }
                    />
                  </div>
                )}
                {!formData.paperMode && (
                  <Alert variant='destructive'>
                    <IconAlertCircle className='h-4 w-4' />
                    <AlertDescription className='text-sm'>
                      Live mode uses real USDC
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className='col-span-12 lg:col-span-6'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-semibold'>
                  Time Limit
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                <div className='flex items-center justify-between'>
                  <Label className='text-sm'>Enable Time Limit</Label>
                  <Switch
                    checked={formData.timeLimitEnabled}
                    onCheckedChange={(v) => {
                      updateFormData({ timeLimitEnabled: v });
                      if (v) {
                        updateFormData({ timeLimitUnlimited: false });
                      }
                    }}
                  />
                </div>
                {formData.timeLimitEnabled && (
                  <>
                    <div className='flex items-center justify-between'>
                      <Label className='text-sm'>Unlimited Runtime</Label>
                      <Switch
                        checked={formData.timeLimitUnlimited}
                        onCheckedChange={(v) =>
                          updateFormData({ timeLimitUnlimited: v })
                        }
                      />
                    </div>
                    {!formData.timeLimitUnlimited && (
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <Label className='text-sm'>Days</Label>
                          <span className='text-sm font-semibold tabular-nums'>
                            {formData.timeLimitDays}
                          </span>
                        </div>
                        <Slider
                          value={[formData.timeLimitDays]}
                          onValueChange={([v]) =>
                            updateFormData({ timeLimitDays: v })
                          }
                          min={1}
                          max={365}
                          step={1}
                        />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Deploy */}
          <div className='col-span-12 lg:col-span-3'>
            <Card className='sticky top-4 flex flex-col'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-sm font-semibold'>
                    Summary
                  </CardTitle>
                  <Badge
                    variant={
                      riskTier === 'Low'
                        ? 'default'
                        : riskTier === 'Medium'
                          ? 'secondary'
                          : 'destructive'
                    }
                    className='text-xs'
                  >
                    {riskTier}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='flex flex-col space-y-3 pt-0'>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Name</span>
                    <span
                      className='max-w-[140px] truncate font-medium'
                      title={formData.name}
                    >
                      {formData.name || '—'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Strategy</span>
                    <span className='font-medium'>
                      {formData.strategy || '—'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Model</span>
                    <span
                      className='max-w-[140px] truncate text-xs font-medium'
                      title={selectedModel?.name}
                    >
                      {selectedModel?.name || '—'}
                    </span>
                  </div>
                  <Separator className='my-2' />
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Initial Fund</span>
                    <span className='font-medium tabular-nums'>
                      {formData.initialFund.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Max Allocation
                    </span>
                    <span className='font-medium tabular-nums'>
                      {formData.maxAllocation.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Time Limit</span>
                    <span className='font-medium'>
                      {formData.timeLimitEnabled
                        ? formData.timeLimitUnlimited
                          ? 'Unlimited'
                          : `${formData.timeLimitDays}d`
                        : 'None'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Mode</span>
                    <Badge variant='outline' className='text-xs'>
                      {formData.paperMode ? 'Paper' : 'Live'}
                    </Badge>
                  </div>
                </div>
                <Separator className='my-2' />
                <Alert className='py-2'>
                  <IconAlertCircle className='h-4 w-4' />
                  <AlertDescription className='text-sm'>
                    Review all settings before deploying
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={handleDeploy}
                  disabled={!isFormValid()}
                  size='lg'
                  className='mt-2 w-full gap-2'
                >
                  <IconRocket className='h-4 w-4' />
                  Deploy Agent
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
