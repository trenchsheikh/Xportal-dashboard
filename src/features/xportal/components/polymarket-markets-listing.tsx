'use client';

import { useState, useEffect } from 'react';
import type { Market, MarketCategory } from '@/types/xportal';
import {
  IconSearch,
  IconRefresh,
  IconBookmark,
  IconFilter
} from '@tabler/icons-react';
import Link from 'next/link';

interface PolymarketMarketsListingProps {
  initialMarkets?: Market[];
}

const categories = [
  'All',
  'Politics',
  'Sports',
  'Finance',
  'Crypto',
  'Geopolitics',
  'Earnings',
  'Tech',
  'Culture',
  'World',
  'Economy',
  'Elections'
] as const;

const filterTags = [
  'All',
  'Trump',
  'Chile Election',
  'Epstein',
  'Venezuela',
  'Ukraine',
  'Best of 2025',
  'Mamdani',
  'Gemini 3',
  'China',
  'Google Search'
];

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}m`;
  }
  if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}k`;
  }
  return `$${volume.toFixed(0)}`;
}

function getProbabilityClass(prob: number): string {
  if (prob >= 0.6) return 'prob-high';
  if (prob >= 0.4) return 'prob-medium';
  return 'prob-low';
}

function SemiCircleProgress({ percentage }: { percentage: number }) {
  const radius = 40;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color =
    percentage >= 60 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className='semi-circle-progress'>
      <svg className='semi-circle-svg' viewBox='0 0 100 50'>
        <path
          d={`M 10 50 A ${radius} ${radius} 0 0 1 90 50`}
          fill='none'
          stroke='hsl(var(--muted))'
          strokeWidth='8'
        />
        <path
          className='semi-circle-progress-path'
          d={`M 10 50 A ${radius} ${radius} 0 0 1 90 50`}
          fill='none'
          stroke={color}
          strokeWidth='8'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
        />
      </svg>
      <div className='semi-circle-text'>
        <div className={`large-probability ${getProbabilityClass(percentage)}`}>
          {percentage.toFixed(0)}%
        </div>
        <div className='chance-label'>chance</div>
      </div>
    </div>
  );
}

function MarketCard({ market }: { market: Market }) {
  const yesOutcome = market.outcomes.find((o) => o.label === 'YES');
  const noOutcome = market.outcomes.find((o) => o.label === 'NO');
  const yesProb = yesOutcome ? yesOutcome.price * 100 : 50;
  const volume = formatVolume(market.volume24h);

  // Get market image or use default
  const marketImage = market.imageUrl || market.image || null;

  return (
    <Link
      href={`/dashboard/markets/${market.id}`}
      className='market-card-compact'
    >
      <div className='market-card-header'>
        <div className='market-header-left'>
          <div className='market-image'>
            {marketImage ? (
              <img
                src={marketImage}
                alt={market.title}
                className='market-image-img'
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const icon = target.nextElementSibling as HTMLElement;
                  if (icon) icon.style.display = 'block';
                }}
              />
            ) : null}
            <span
              className='market-image-icon'
              style={{ display: marketImage ? 'none' : 'block' }}
            >
              📊
            </span>
          </div>
          <h3 className='market-question'>{market.title}</h3>
        </div>
        <button className='icon-btn' onClick={(e) => e.preventDefault()}>
          <IconBookmark className='h-4 w-4' />
        </button>
      </div>

      {yesOutcome && noOutcome ? (
        <>
          <div className='market-probability-display'>
            <SemiCircleProgress percentage={yesProb} />
          </div>
          <div className='market-buttons-row'>
            <button
              className='market-btn yes-btn'
              onClick={(e) => e.preventDefault()}
            >
              Yes
            </button>
            <button
              className='market-btn no-btn'
              onClick={(e) => e.preventDefault()}
            >
              No
            </button>
          </div>
        </>
      ) : (
        <div className='market-outcome-row'>
          {market.outcomes.slice(0, 2).map((outcome) => (
            <div key={outcome.id} className='outcome-info'>
              <span className='outcome-label'>{outcome.label}</span>
              <span
                className={`outcome-percent ${getProbabilityClass(outcome.price * 100)}`}
              >
                {(outcome.price * 100).toFixed(0)}%
              </span>
              <div className='outcome-buttons'>
                <button
                  className='outcome-btn yes-btn-small'
                  onClick={(e) => e.preventDefault()}
                >
                  Yes
                </button>
                <button
                  className='outcome-btn no-btn-small'
                  onClick={(e) => e.preventDefault()}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='market-volume'>
        <span className='volume-text'>{volume} Vol.</span>
        {market.status === 'Live' && (
          <span
            style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}
          >
            LIVE
          </span>
        )}
      </div>
    </Link>
  );
}

export function PolymarketMarketsListing({
  initialMarkets = []
}: PolymarketMarketsListingProps) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'Trending' | 'Breaking' | 'New'>(
    'Trending'
  );

  const fetchMarkets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/markets');
      if (response.ok) {
        const data = await response.json();
        setMarkets(data.markets || []);
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialMarkets.length === 0) {
      fetchMarkets();
    }
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch =
      market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || market.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className='markets-page-wrapper'>
      {/* Top Navigation */}
      <div className='top-nav-bar'>
        <div className='top-nav-content'>
          <button
            className={`top-nav-item ${activeTab === 'Trending' ? 'active' : ''}`}
            onClick={() => setActiveTab('Trending')}
          >
            Trending
          </button>
          <button
            className={`top-nav-item ${activeTab === 'Breaking' ? 'active' : ''}`}
            onClick={() => setActiveTab('Breaking')}
          >
            Breaking
          </button>
          <button
            className={`top-nav-item ${activeTab === 'New' ? 'active' : ''}`}
            onClick={() => setActiveTab('New')}
          >
            New
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`top-nav-item ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='markets-content'>
        {/* Search and Filters */}
        <div className='search-filter-section'>
          <div className='search-bar-wrapper'>
            <div className='search-bar'>
              <IconSearch className='search-icon h-5 w-5' />
              <input
                type='text'
                className='search-input'
                placeholder='Search markets...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className='filter-icons'>
              <button
                className='filter-icon-btn'
                onClick={fetchMarkets}
                disabled={isLoading}
              >
                <IconRefresh
                  className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
                />
              </button>
              <button className='filter-icon-btn'>
                <IconFilter className='h-5 w-5' />
              </button>
              <button className='filter-icon-btn'>
                <IconBookmark className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          <div className='filter-tags-bar'>
            {filterTags.map((tag) => (
              <button
                key={tag}
                className={`filter-tag ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
            <button className='filter-tag-more'>→</button>
          </div>
        </div>

        {/* Markets Grid */}
        {filteredMarkets.length === 0 ? (
          <div className='empty-state'>
            <p>No markets found</p>
          </div>
        ) : (
          <div className='markets-grid'>
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
