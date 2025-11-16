import type {
  Agent,
  AgentActivity,
  Market,
  Portfolio,
  Position,
  OpenRouterModel
} from '@/types/xportal';

// Mock Portfolio Data
export const mockPortfolio: Portfolio = {
  totalValue: 125000.0,
  realizedPnl: 8500.0,
  unrealizedPnl: 3200.0,
  openPositions: 12,
  dailyPnl: 450.0,
  weeklyPnl: 2100.0,
  monthlyPnl: 8500.0,
  performance7d: [120000, 121500, 122000, 123200, 124100, 124500, 125000],
  performance30d: [
    116500, 117200, 118000, 118500, 119200, 120000, 120500, 121000, 121500,
    122000, 122500, 123000, 123500, 124000, 124200, 124400, 124600, 124700,
    124800, 124900, 124950, 125000, 125000, 125000, 125000, 125000, 125000,
    125000, 125000, 125000
  ]
};

// Mock Agents Data
export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Momentum Hunter',
    description: 'Specializes in momentum-based trading on crypto markets',
    strategy: 'Momentum',
    status: 'Active',
    riskTier: 'Medium',
    roi: 12.5,
    pnl: 2500.0,
    pnlPercent: 8.3,
    allocatedUsdc: 30000,
    trades24h: 8,
    trades7d: 45,
    winRate: 68.5,
    maxDrawdown: -5.2,
    openPositions: 4,
    createdAt: '2024-01-15T10:00:00Z',
    modelProvider: 'openrouter',
    modelName: 'anthropic-claude-3.5'
  },
  {
    id: 'agent-2',
    name: 'News Sentinel',
    description: 'Tracks news and sentiment for rapid market reactions',
    strategy: 'News-driven',
    status: 'Active',
    riskTier: 'High',
    roi: 18.2,
    pnl: 4200.0,
    pnlPercent: 14.0,
    allocatedUsdc: 30000,
    trades24h: 12,
    trades7d: 78,
    winRate: 72.0,
    maxDrawdown: -8.5,
    openPositions: 5,
    createdAt: '2024-01-20T14:30:00Z',
    modelProvider: 'openrouter',
    modelName: 'gpt-4.1'
  },
  {
    id: 'agent-3',
    name: 'Mean Reversion Bot',
    description: 'Identifies overextended markets and trades reversions',
    strategy: 'Mean Reversion',
    status: 'Paused',
    riskTier: 'Low',
    roi: 5.8,
    pnl: 1200.0,
    pnlPercent: 4.0,
    allocatedUsdc: 30000,
    trades24h: 0,
    trades7d: 22,
    winRate: 65.0,
    maxDrawdown: -3.1,
    openPositions: 2,
    createdAt: '2024-02-01T09:15:00Z',
    modelProvider: 'openrouter',
    modelName: 'mixtral-8x7b'
  },
  {
    id: 'agent-4',
    name: 'Macro Strategist',
    description: 'Focuses on long-term macro trends and economic indicators',
    strategy: 'Macro Trends',
    status: 'Active',
    riskTier: 'Medium',
    roi: 9.3,
    pnl: 1800.0,
    pnlPercent: 6.0,
    allocatedUsdc: 30000,
    trades24h: 3,
    trades7d: 15,
    winRate: 70.0,
    maxDrawdown: -4.2,
    openPositions: 1,
    createdAt: '2024-02-10T11:00:00Z',
    modelProvider: 'openrouter',
    modelName: 'anthropic-claude-3.5'
  }
];

// Mock Markets Data
export const mockMarkets: Market[] = [
  {
    id: 'market-1',
    title: 'Will BTC close above $70k on Friday?',
    description: 'Bitcoin price prediction for end of week',
    category: 'Crypto',
    status: 'Live',
    resolutionTime: '2024-03-15T16:00:00Z',
    volume24h: 125000,
    liquidity: 500000,
    outcomes: [
      { id: 'yes', label: 'YES', price: 0.65, volume: 325000 },
      { id: 'no', label: 'NO', price: 0.35, volume: 175000 }
    ],
    hasActiveAgents: true,
    agentExposure: [
      {
        agentId: 'agent-1',
        agentName: 'Momentum Hunter',
        netExposure: 5000,
        positions: []
      }
    ]
  },
  {
    id: 'market-2',
    title: 'Will ETH reach $4000 before March 31?',
    description: 'Ethereum price milestone prediction',
    category: 'Crypto',
    status: 'Live',
    resolutionTime: '2024-03-31T23:59:59Z',
    volume24h: 98000,
    liquidity: 420000,
    outcomes: [
      { id: 'yes', label: 'YES', price: 0.58, volume: 243600 },
      { id: 'no', label: 'NO', price: 0.42, volume: 176400 }
    ],
    hasActiveAgents: true,
    agentExposure: [
      {
        agentId: 'agent-2',
        agentName: 'News Sentinel',
        netExposure: 3200,
        positions: []
      }
    ]
  },
  {
    id: 'market-3',
    title: 'Will the Fed cut rates in Q2 2024?',
    description: 'Federal Reserve interest rate prediction',
    category: 'Macro',
    status: 'Live',
    resolutionTime: '2024-06-30T23:59:59Z',
    volume24h: 156000,
    liquidity: 680000,
    outcomes: [
      { id: 'yes', label: 'YES', price: 0.72, volume: 489600 },
      { id: 'no', label: 'NO', price: 0.28, volume: 190400 }
    ],
    hasActiveAgents: false
  },
  {
    id: 'market-4',
    title: 'Will SOL hit $200 by end of month?',
    description: 'Solana price target prediction',
    category: 'Crypto',
    status: 'Live',
    resolutionTime: '2024-03-31T23:59:59Z',
    volume24h: 67000,
    liquidity: 280000,
    outcomes: [
      { id: 'yes', label: 'YES', price: 0.45, volume: 126000 },
      { id: 'no', label: 'NO', price: 0.55, volume: 154000 }
    ],
    hasActiveAgents: true,
    agentExposure: [
      {
        agentId: 'agent-1',
        agentName: 'Momentum Hunter',
        netExposure: 2100,
        positions: []
      },
      {
        agentId: 'agent-4',
        agentName: 'Macro Strategist',
        netExposure: 1800,
        positions: []
      }
    ]
  }
];

// Mock Positions Data
export const mockPositions: Position[] = [
  {
    id: 'pos-1',
    marketId: 'market-1',
    marketTitle: 'Will BTC close above $70k on Friday?',
    outcome: 'YES',
    side: 'YES',
    size: 5000,
    entryPrice: 0.62,
    currentPrice: 0.65,
    unrealizedPnl: 241.94,
    source: 'Agent',
    agentId: 'agent-1',
    agentName: 'Momentum Hunter',
    openedAt: '2024-03-10T10:30:00Z',
    isHighConviction: true
  },
  {
    id: 'pos-2',
    marketId: 'market-2',
    marketTitle: 'Will ETH reach $4000 before March 31?',
    outcome: 'YES',
    side: 'YES',
    size: 3200,
    entryPrice: 0.55,
    currentPrice: 0.58,
    unrealizedPnl: 174.55,
    source: 'Agent',
    agentId: 'agent-2',
    agentName: 'News Sentinel',
    openedAt: '2024-03-11T14:20:00Z'
  },
  {
    id: 'pos-3',
    marketId: 'market-4',
    marketTitle: 'Will SOL hit $200 by end of month?',
    outcome: 'NO',
    side: 'NO',
    size: 1800,
    entryPrice: 0.52,
    currentPrice: 0.55,
    unrealizedPnl: -54.0,
    source: 'Agent',
    agentId: 'agent-4',
    agentName: 'Macro Strategist',
    openedAt: '2024-03-12T09:15:00Z',
    isProbation: true
  }
];

// Mock Agent Activities (for Live Console)
export const mockAgentActivities: Record<string, AgentActivity[]> = {
  'agent-1': [
    {
      id: 'act-1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'scan',
      message: 'Scanning BTC macro markets for 24h volatility patterns.'
    },
    {
      id: 'act-2',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      type: 'evaluation',
      message:
        'Evaluated Market #1 – Expected edge: +3.2%. Considering long position.',
      marketId: 'market-1',
      marketTitle: 'Will BTC close above $70k on Friday?'
    },
    {
      id: 'act-3',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      type: 'trade',
      message: 'Opened long YES position on Market #1 with 5000 USDC.',
      marketId: 'market-1',
      marketTitle: 'Will BTC close above $70k on Friday?',
      tradeSize: 5000
    },
    {
      id: 'act-4',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      type: 'close',
      message: 'Closed position on Market #5 – locked in +7.4%.',
      marketId: 'market-5',
      pnl: 370
    }
  ],
  'agent-2': [
    {
      id: 'act-5',
      timestamp: new Date(Date.now() - 200000).toISOString(),
      type: 'scan',
      message: 'Monitoring news feeds for ETH-related sentiment shifts.'
    },
    {
      id: 'act-6',
      timestamp: new Date(Date.now() - 150000).toISOString(),
      type: 'evaluation',
      message: 'Positive news detected. Evaluating Market #2 – Edge: +2.8%.',
      marketId: 'market-2',
      marketTitle: 'Will ETH reach $4000 before March 31?'
    },
    {
      id: 'act-7',
      timestamp: new Date(Date.now() - 100000).toISOString(),
      type: 'trade',
      message: 'Opened YES position on Market #2 with 3200 USDC.',
      marketId: 'market-2',
      marketTitle: 'Will ETH reach $4000 before March 31?',
      tradeSize: 3200
    }
  ]
};

// OpenRouter Models
export const openRouterModels: OpenRouterModel[] = [
  {
    id: 'openrouter/anthropic-claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    latency: 'Fast',
    useCase: 'Best for complex reasoning and market analysis'
  },
  {
    id: 'openrouter/openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    latency: 'Medium',
    useCase: 'Balanced performance for trading decisions'
  },
  {
    id: 'openrouter/mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    latency: 'Fast',
    useCase: 'Cost-effective for high-frequency scanning'
  },
  {
    id: 'openrouter/anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    latency: 'Slow',
    useCase: 'Maximum reasoning power for complex strategies'
  }
];
