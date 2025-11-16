// Polymarket API Service
// Fetches live market data from Polymarket

export interface PolymarketMarket {
  id: string;
  question: string;
  description?: string;
  slug: string;
  image?: string;
  endDate?: string;
  startDate?: string;
  outcomes: string[];
  volume?: number;
  liquidity?: number;
  marketMakerAddress?: string;
  conditionId?: string;
  resolutionSource?: string;
  groupItemTitle?: string;
  groupItemImage?: string;
  groupItemSlug?: string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  new?: boolean;
  icon?: string;
  iconColor?: string;
  iconSlug?: string;
  questionId?: string;
  outcomePrices?: number[];
  volumeNum?: number;
  liquidityNum?: number;
  endDate_iso?: string;
  startDate_iso?: string;
  imageUrl?: string;
  iconUrl?: string;
  groupItemImageUrl?: string;
}

export interface PolymarketResponse {
  data?: {
    markets?: PolymarketMarket[];
  };
  errors?: Array<{ message: string }>;
}

// Polymarket API endpoints
const POLYMARKET_GRAPHQL_URL = 'https://clob.polymarket.com/events';
const POLYMARKET_MARKETS_URL = 'https://clob.polymarket.com/markets';

// Fetch markets from Polymarket using their public API
export async function fetchPolymarketMarkets(
  limit: number = 50
): Promise<PolymarketMarket[]> {
  try {
    // Try the markets endpoint first
    const response = await fetch(
      `${POLYMARKET_MARKETS_URL}?limit=${limit}&active=true&closed=false`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Xportal-Dashboard/1.0'
        },
        next: { revalidate: 60 } // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      // If markets endpoint fails, try events endpoint
      const eventsResponse = await fetch(
        `${POLYMARKET_GRAPHQL_URL}?limit=${limit}`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Xportal-Dashboard/1.0'
          },
          next: { revalidate: 60 }
        }
      );

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        // Extract markets from events
        if (Array.isArray(eventsData)) {
          return eventsData;
        }
        if (eventsData.data && Array.isArray(eventsData.data)) {
          return eventsData.data;
        }
      }

      throw new Error(`Polymarket API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    }

    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    if (data.markets && Array.isArray(data.markets)) {
      return data.markets;
    }

    // If no data found, return mock data structure for demo
    return generateMockPolymarketMarkets(limit);
  } catch (error) {
    console.error('Error fetching Polymarket markets:', error);
    // Return mock data for demo purposes if API fails
    return generateMockPolymarketMarkets(limit);
  }
}

// Generate mock Polymarket-style markets for demo
function generateMockPolymarketMarkets(limit: number): PolymarketMarket[] {
  const mockMarkets: PolymarketMarket[] = [
    {
      id: 'pm-1',
      question: 'Will Bitcoin reach $100,000 by end of 2024?',
      description:
        'Market resolves YES if BTC/USD closes above $100,000 on any major exchange on Dec 31, 2024',
      slug: 'bitcoin-100k-2024',
      active: true,
      closed: false,
      outcomes: ['YES', 'NO'],
      outcomePrices: [0.42, 0.58],
      volumeNum: 1250000,
      liquidityNum: 850000,
      endDate_iso: new Date('2024-12-31').toISOString(),
      imageUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
    },
    {
      id: 'pm-2',
      question: 'Will Ethereum reach $5,000 before Bitcoin reaches $100,000?',
      description:
        'Market resolves YES if ETH/USD reaches $5,000 before BTC/USD reaches $100,000',
      slug: 'eth-5k-before-btc-100k',
      active: true,
      closed: false,
      outcomes: ['YES', 'NO'],
      outcomePrices: [0.35, 0.65],
      volumeNum: 980000,
      liquidityNum: 620000,
      endDate_iso: new Date('2024-12-31').toISOString(),
      imageUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      id: 'pm-3',
      question:
        'Will the US Federal Reserve cut rates by 0.5% or more in 2024?',
      description:
        'Market resolves YES if the Fed cuts rates by 0.5% or more in total during 2024',
      slug: 'fed-rate-cut-2024',
      active: true,
      closed: false,
      outcomes: ['YES', 'NO'],
      outcomePrices: [0.68, 0.32],
      volumeNum: 2100000,
      liquidityNum: 1500000,
      endDate_iso: new Date('2024-12-31').toISOString(),
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Jerome_Powell_Official_Photo.jpg/256px-Jerome_Powell_Official_Photo.jpg'
    },
    {
      id: 'pm-4',
      question: 'Will the S&P 500 close above 6,000 in 2024?',
      description:
        'Market resolves YES if SPX closes above 6,000 on any trading day in 2024',
      slug: 'sp500-6000-2024',
      active: true,
      closed: false,
      outcomes: ['YES', 'NO'],
      outcomePrices: [0.55, 0.45],
      volumeNum: 1750000,
      liquidityNum: 1100000,
      endDate_iso: new Date('2024-12-31').toISOString(),
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/SP500.svg/256px-SP500.svg.png'
    },
    {
      id: 'pm-5',
      question: 'Will Donald Trump win the 2024 US Presidential Election?',
      description: 'Market resolves based on official election results',
      slug: 'trump-2024-election',
      active: true,
      closed: false,
      outcomes: ['YES', 'NO'],
      outcomePrices: [0.52, 0.48],
      volumeNum: 8500000,
      liquidityNum: 5200000,
      endDate_iso: new Date('2024-11-05').toISOString(),
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/256px-Donald_Trump_official_portrait.jpg'
    },
    {
      id: 'pm-6',
      question: 'Will the Lakers win the 2024 NBA Championship?',
      description: 'Market resolves based on official NBA Finals results',
      slug: 'lakers-nba-championship-2024',
      active: true,
      closed: false,
      outcomes: ['YES', 'NO'],
      outcomePrices: [0.18, 0.82],
      volumeNum: 450000,
      liquidityNum: 280000,
      endDate_iso: new Date('2024-06-20').toISOString(),
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/256px-Los_Angeles_Lakers_logo.svg.png'
    },
    {
      id: 'pm-7',
      question:
        'Will AI-generated content account for >50% of internet traffic by 2025?',
      description:
        'Market resolves based on verified internet traffic analytics',
      slug: 'ai-content-internet-traffic-2025',
      active: true,
      closed: false,
      outcomes: ['YES', 'NO'],
      outcomePrices: [0.28, 0.72],
      volumeNum: 320000,
      liquidityNum: 190000,
      endDate_iso: new Date('2025-12-31').toISOString(),
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/OpenAI_Logo.svg/256px-OpenAI_Logo.svg.png'
    },
    {
      id: 'pm-8',
      question: 'Will OpenAI release GPT-5 before 2025?',
      description:
        'Market resolves YES if GPT-5 is publicly released before Jan 1, 2025',
      slug: 'gpt5-release-2024',
      active: true,
      closed: false,
      outcomes: ['YES', 'NO'],
      outcomePrices: [0.38, 0.62],
      volumeNum: 680000,
      liquidityNum: 420000,
      endDate_iso: new Date('2024-12-31').toISOString(),
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/OpenAI_Logo.svg/256px-OpenAI_Logo.svg.png'
    }
  ];

  return mockMarkets.slice(0, limit);
}

// Transform Polymarket market to our Market type
import type {
  Market,
  MarketCategory,
  MarketStatus,
  MarketOutcome
} from '@/types/xportal';

export function transformPolymarketMarket(pmMarket: PolymarketMarket): Market {
  // Extract outcomes and prices
  const outcomes: MarketOutcome[] = [];

  // Polymarket typically has YES/NO outcomes
  // Try to extract prices from outcomePrices array or default to 0.5
  const prices = pmMarket.outcomePrices || [0.5, 0.5];

  if (pmMarket.outcomes && pmMarket.outcomes.length > 0) {
    pmMarket.outcomes.forEach((outcome, index) => {
      outcomes.push({
        id: `${pmMarket.id}-${index}`,
        label: outcome.toUpperCase(),
        price: prices[index] || 0.5,
        volume: 0
      });
    });
  } else {
    // Default YES/NO outcomes
    outcomes.push(
      {
        id: `${pmMarket.id}-yes`,
        label: 'YES',
        price: prices[0] || 0.5,
        volume: 0
      },
      {
        id: `${pmMarket.id}-no`,
        label: 'NO',
        price: prices[1] || 0.5,
        volume: 0
      }
    );
  }

  // Determine category based on question content
  const questionLower = pmMarket.question.toLowerCase();
  let category: MarketCategory = 'Custom';
  if (
    questionLower.includes('crypto') ||
    questionLower.includes('bitcoin') ||
    questionLower.includes('ethereum') ||
    questionLower.includes('token')
  ) {
    category = 'Crypto';
  } else if (
    questionLower.includes('sport') ||
    questionLower.includes('game') ||
    questionLower.includes('match') ||
    questionLower.includes('championship')
  ) {
    category = 'Sports';
  } else if (
    questionLower.includes('election') ||
    questionLower.includes('president') ||
    questionLower.includes('economic') ||
    questionLower.includes('gdp') ||
    questionLower.includes('inflation')
  ) {
    category = 'Macro';
  }

  // Determine status
  let status: MarketStatus = 'Live';
  if (pmMarket.closed || pmMarket.archived) {
    status = 'Settled';
  } else if (pmMarket.endDate_iso) {
    const endDate = new Date(pmMarket.endDate_iso);
    const now = new Date();
    if (endDate < now) {
      status = 'Settled';
    } else if (endDate.getTime() - now.getTime() > 7 * 24 * 60 * 60 * 1000) {
      // More than 7 days away
      status = 'Upcoming';
    }
  }

  // Calculate resolution time (use endDate or default to 30 days from now)
  let resolutionTime = new Date();
  resolutionTime.setDate(resolutionTime.getDate() + 30);
  if (pmMarket.endDate_iso) {
    resolutionTime = new Date(pmMarket.endDate_iso);
  }

  return {
    id: pmMarket.id || pmMarket.slug || `pm-${Date.now()}`,
    title: pmMarket.question || 'Untitled Market',
    description: pmMarket.description || pmMarket.question || '',
    category,
    status,
    resolutionTime: resolutionTime.toISOString(),
    volume24h: pmMarket.volumeNum || pmMarket.volume || 0,
    liquidity: pmMarket.liquidityNum || pmMarket.liquidity || 0,
    outcomes,
    hasActiveAgents: false,
    agentExposure: [],
    imageUrl:
      pmMarket.imageUrl ||
      pmMarket.image ||
      pmMarket.groupItemImageUrl ||
      undefined,
    image:
      pmMarket.image ||
      pmMarket.imageUrl ||
      pmMarket.groupItemImageUrl ||
      undefined
  };
}
