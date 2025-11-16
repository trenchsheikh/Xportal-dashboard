// Xportal Type Definitions

export type RiskTier = 'Low' | 'Medium' | 'High';

export type AgentStatus = 'Active' | 'Paused' | 'In Review';

export type MarketStatus = 'Live' | 'Settled' | 'Upcoming';

export type MarketCategory = 'Crypto' | 'Macro' | 'Sports' | 'Custom';

export type StrategyType =
  | 'Momentum'
  | 'Mean Reversion'
  | 'News-driven'
  | 'Macro Trends'
  | 'Volatility'
  | 'Arbitrage';

export type TimeHorizon = 'Intraday' | 'Swing' | 'Long-term';

export type TradeSide = 'YES' | 'NO' | 'LONG' | 'SHORT';

export interface Agent {
  id: string;
  name: string;
  description: string;
  strategy: StrategyType;
  status: AgentStatus;
  riskTier: RiskTier;
  roi: number;
  pnl: number;
  pnlPercent: number;
  allocatedUsdc: number;
  trades24h: number;
  trades7d: number;
  winRate: number;
  maxDrawdown: number;
  openPositions: number;
  createdAt: string;
  modelProvider?: string;
  modelName?: string;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: MarketCategory;
  status: MarketStatus;
  resolutionTime: string;
  volume24h: number;
  liquidity: number;
  outcomes: MarketOutcome[];
  hasActiveAgents: boolean;
  agentExposure?: AgentExposure[];
}

export interface MarketOutcome {
  id: string;
  label: string;
  price: number; // 0-1 probability
  volume: number;
}

export interface AgentExposure {
  agentId: string;
  agentName: string;
  netExposure: number; // USDC
  positions: Position[];
}

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  outcome: string;
  side: TradeSide;
  size: number; // USDC
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  realizedPnl?: number;
  source: 'Agent' | 'Manual';
  agentId?: string;
  agentName?: string;
  openedAt: string;
  closedAt?: string;
  isHighConviction?: boolean;
  isProbation?: boolean;
}

export interface Portfolio {
  totalValue: number; // USDC
  realizedPnl: number;
  unrealizedPnl: number;
  openPositions: number;
  dailyPnl: number;
  weeklyPnl: number;
  monthlyPnl: number;
  performance7d: number[];
  performance30d: number[];
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  type: 'scan' | 'evaluation' | 'trade' | 'close';
  message: string;
  marketId?: string;
  marketTitle?: string;
  tradeSize?: number;
  pnl?: number;
}

export interface AgentThinking {
  agentId: string;
  activities: AgentActivity[];
}

export interface OpenRouterModel {
  id: string;
  name: string;
  provider: string;
  latency: 'Fast' | 'Medium' | 'Slow';
  useCase: string;
}
