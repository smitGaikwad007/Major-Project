import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import { auctionApi } from '../services/api';
import {
  Gavel,
  Clock,
  Flame,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

// Client-side fallback auctions in case backend API is temporarily offline
const FALLBACK_AUCTIONS = [
  {
    id: "auc-1",
    title: "1854 Inverted Head Four Annas (Lithographic Error Rarity)",
    description: "Monumental world philatelic rarity printed at Surveyor General's Office in Calcutta. Showing Queen Victoria's head inverted inside the octagonal frame. Full margins, Cooper Diamond 1 postmark.",
    sellerName: "Sardar Jasjit Singh",
    sellerEmail: "jasjit@philatelysociety.in",
    startingPrice: 250000,
    minIncrement: 5000,
    currentBid: 310000,
    minNextBid: 315000,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "LIVE",
    isLive: true,
    bidCount: 4,
    highestBidder: "Prof. Debabrata Roy",
    category: "Classic British India",
    condition: "Good Used, Octagonal Cut",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Ferrary Collection, Royal Philatelic Society London Cert #9842.",
    certificate: "RPSL Certificate #9842 (Grade AAA)",
  },
  {
    id: "auc-2",
    title: "1948 Mahatma Gandhi Memorial 10 Rs 'SERVICE' Overprint",
    description: "Seminal post-independence memorial gem. One of only 200 copies overprinted 'SERVICE' for the Secretariat of C. Rajagopalachari. Original gum, very fine light hinge.",
    sellerName: "Dr. Arvind Swaminathan",
    sellerEmail: "arvind@kolkataguild.in",
    startingPrice: 120000,
    minIncrement: 2500,
    currentBid: 135000,
    minNextBid: 137500,
    startTime: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 52 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "LIVE",
    isLive: true,
    bidCount: 2,
    highestBidder: "Rajeshwar Rao",
    category: "Republic of India",
    condition: "Very Fine Mint Light Hinge",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
    provenance: "Governor General Archives (Rashtrapati Bhavan 1948).",
    certificate: "BPA Certificate #14802",
  },
  {
    id: "auc-3",
    title: "1852 Scinde Dawk Scarlet Wafer (Embossed Red Sealing Wax)",
    description: "Asia's first adhesive postage stamp. Circular red wafer embossed with the East India Company Merchants' Mark, issued under Sir Bartle Frere in the province of Sindh.",
    sellerName: "Heritage Philatelic Trust",
    sellerEmail: "heritage@dakbhavan.in",
    startingPrice: 450000,
    minIncrement: 10000,
    currentBid: null,
    minNextBid: 450000,
    startTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 90 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "UPCOMING",
    isUpcoming: true,
    bidCount: 0,
    category: "Pre-Imperial India",
    condition: "Fine Embossed Seal",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Bartle Frere Estate, private vault London & New Delhi.",
    certificate: "National Philatelic Bureau Certificate #NB-1852-S",
  },
  {
    id: "auc-4",
    title: "1911 First Aerial Post Allahabad to Naini Confluence Flown Cover",
    description: "Historic postal envelope carried by French aviator Henri Pequet aboard a Humber-Sommer biplane on 18 February 1911. Complete with magenta aerial cancel over Yamuna confluence.",
    sellerName: "Captain Devashish Bose",
    sellerEmail: "devashish@bose.org",
    startingPrice: 75000,
    minIncrement: 2000,
    currentBid: 98000,
    minNextBid: 100000,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "ENDED",
    isEnded: true,
    bidCount: 3,
    winner: { bidderName: "Prof. Debabrata Roy", amount: 98000 },
    category: "Aerophilately",
    condition: "Historical Postal Cover",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Bose Family Trust, auctioned at Stanley Gibbons (1984).",
    certificate: "BPA Certificate #4891",
  },
];

// Helper to format remaining time nicely
function formatTimeRemaining(ms) {
  if (ms <= 0) return 'Ended';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Filter & Search state
  const [statusTab, setStatusTab] = useState('ALL'); // 'ALL' | 'LIVE' | 'UPCOMING' | 'ENDED'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('ending-soon');

  // Create Auction Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    minIncrement: '500',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    sellerName: 'Distinguished Fellow Member',
    sellerEmail: 'member@philatelysociety.in',
    category: 'Commemorative Issue',
    condition: 'Mint Never Hinged',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    provenance: 'Private Member Repository',
    certificate: 'PCI Guild Authenticated Genuine',
  });

  // Ticking countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await auctionApi.getAll().catch(() => null);

      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAuctions(res.data);
      } else {
        setAuctions(FALLBACK_AUCTIONS);
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve auction catalogue.');
      setAuctions(FALLBACK_AUCTIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuctions();
  }, []);

  // Compute dynamic stats from auction dataset
  const stats = useMemo(() => {
    const live = auctions.filter((a) => {
      const start = new Date(a.startTime).getTime();
      const end = new Date(a.endTime).getTime();
      return currentTime >= start && currentTime < end;
    });

    const upcoming = auctions.filter((a) => new Date(a.startTime).getTime() > currentTime);
    const ended = auctions.filter((a) => new Date(a.endTime).getTime() <= currentTime);

    const totalBids = auctions.reduce((sum, a) => sum + (Number(a.bidCount) || 0), 0);
    const totalVolume = auctions.reduce((sum, a) => sum + (Number(a.currentBid) || Number(a.startingPrice) || 0), 0);

    return {
      liveCount: live.length,
      upcomingCount: upcoming.length,
      endedCount: ended.length,
      totalCount: auctions.length,
      totalBids,
      totalVolume,
    };
  }, [auctions, currentTime]);

  // Categories list
  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(auctions.map((a) => a.category).filter(Boolean))).sort()];
  }, [auctions]);

  // Filtered & Sorted Auctions
  const displayedAuctions = useMemo(() => {
    let result = auctions.map((a) => {
      const start = new Date(a.startTime).getTime();
      const end = new Date(a.endTime).getTime();
      let status = 'LIVE';
      if (currentTime < start) status = 'UPCOMING';
      else if (currentTime >= end) status = 'ENDED';

      const msRemaining = Math.max(0, end - currentTime);
      const msUntilStart = Math.max(0, start - currentTime);

      return {
        ...a,
        computedStatus: status,
        msRemaining,
        msUntilStart,
      };
    });

    // Filter by Tab
    if (statusTab !== 'ALL') {
      result = result.filter((a) => a.computedStatus === statusTab);
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((a) => (a.category || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((a) =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.sellerName || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === 'ending-soon') {
        if (a.computedStatus === 'LIVE' && b.computedStatus !== 'LIVE') return -1;
        if (b.computedStatus === 'LIVE' && a.computedStatus !== 'LIVE') return 1;
        return a.msRemaining - b.msRemaining;
      }
      if (sortBy === 'price-desc') {
        const pA = Number(a.currentBid || a.startingPrice);
        const pB = Number(b.currentBid || b.startingPrice);
        return pB - pA;
      }
      if (sortBy === 'price-asc') {
        const pA = Number(a.currentBid || a.startingPrice);
        const pB = Number(b.currentBid || b.startingPrice);
        return pA - pB;
      }
      if (sortBy === 'bids-desc') {
        return (Number(b.bidCount) || 0) - (Number(a.bidCount) || 0);
      }
      return 0;
    });
  }, [auctions, statusTab, selectedCategory, searchQuery, sortBy, currentTime]);

  // Handle Create Auction Submission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmittingCreate(true);
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);

      if (end.getTime() <= start.getTime()) {
        setActionMessage({
          type: 'error',
          text: 'Auction closing date must be scheduled after the opening date.',
        });
        return;
      }

      const res = await auctionApi.create({
        ...formData,
        startingPrice: Number(formData.startingPrice),
        minIncrement: Number(formData.minIncrement) || 500,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      setShowCreateModal(false);
      setActionMessage({
        type: 'success',
        text: 'Auction lot successfully cataloged and scheduled on the National Bourse!',
      });
      await loadAuctions();
      setTimeout(() => setActionMessage(null), 5000);
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to create auction lot.',
      });
    } finally {
      setSubmittingCreate(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs text-navy/60">
        <Link to="/" className="hover:text-burgundy flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <Link to="/marketplace" className="hover:text-burgundy">
          Marketplace
        </Link>
        <span>/</span>
        <span className="text-navy font-medium">Archival Auctions</span>
      </div>

      {/* Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <SectionHeading
            badge="NATIONAL ARCHIVAL BOURSE"
            title="Philatelic Auctions & Bidding"
            subtitle="Verified member auctions for monumental subcontinental rarities, historical postal covers, and error varieties with certified PCI escrow protection."
            align="left"
            className="mb-0"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadAuctions}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy bg-white border border-beige hover:border-gold transition-colors"
            title="Refresh live auction catalogue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-burgundy' : 'text-gold-900'}`} />
            <span>Sync Lots</span>
          </button>

          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            size="sm"
            icon={Plus}
            iconPosition="left"
            className="text-xs font-semibold uppercase tracking-wider"
          >
            List Auction Lot
          </Button>
        </div>
      </div>

      {/* Bourse Navigation Switcher */}
      <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-beige pb-4">
        <Link
          to="/marketplace"
          className="group inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-navy bg-white border border-beige hover:border-gold hover:text-burgundy transition-all"
        >
          <Tag className="w-3.5 h-3.5 text-navy/60 group-hover:text-burgundy" />
          <span>Fixed-Price Bourse</span>
        </Link>
        <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-burgundy text-ivory border border-burgundy shadow-xs inline-flex items-center gap-2">
          <Gavel className="w-3.5 h-3.5 text-gold" />
          <span>Live Archival Auctions</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Active Bidding Live"></span>
        </span>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`mb-6 p-4 border text-xs flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            )}
            <span className="font-medium">{actionMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-navy/50 hover:text-navy p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-beige p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50">
              Live Auctions
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <span className="font-serif text-2xl font-bold text-navy block">
            {stats.liveCount} Lots
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">Bidding Active Now</span>
        </div>

        <div className="bg-white border border-beige p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50 block mb-1">
            Upcoming Lots
          </span>
          <span className="font-serif text-2xl font-bold text-gold-900 block">
            {stats.upcomingCount} Scheduled
          </span>
          <span className="text-[11px] text-navy/60">Opening this week</span>
        </div>

        <div className="bg-white border border-beige p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50 block mb-1">
            Total Bids Placed
          </span>
          <span className="font-serif text-2xl font-bold text-burgundy block">
            {stats.totalBids} Verified Bids
          </span>
          <span className="text-[11px] text-navy/60">Member authenticated</span>
        </div>

        <div className="bg-white border border-beige p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50 block mb-1">
            Auction Bourse Volume
          </span>
          <span className="font-serif text-2xl font-bold text-navy block">
            ₹{stats.totalVolume.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">PCI Escrow Protected</span>
        </div>
      </div>

      {/* Tab Switcher: Fixed Price vs Auctions Banner */}
      <div className="mb-6 bg-ivory-100 border border-beige p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-navy">Trading Venue:</span>
          <div className="inline-flex border border-beige bg-white p-0.5 shadow-xs">
            <Link
              to="/marketplace"
              className="px-3 py-1 font-semibold text-navy/70 hover:text-navy transition-colors"
            >
              Fixed-Price Listings
            </Link>
            <span className="px-3 py-1 font-semibold bg-burgundy text-ivory shadow-xs">
              Live Archival Auctions
            </span>
          </div>
        </div>

        <span className="text-navy/60 font-mono text-[11px] hidden sm:inline">
          Server-synchronized clocks & anti-shill verification active
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-beige p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        {/* Row 1: Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-beige/60 pb-3">
          <div className="inline-flex border border-beige bg-ivory-50 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setStatusTab('ALL')}
              className={`px-3 py-1.5 font-semibold transition-colors ${
                statusTab === 'ALL'
                  ? 'bg-white text-navy shadow-xs border border-beige'
                  : 'text-navy/60 hover:text-navy'
              }`}
            >
              All Lots ({stats.totalCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusTab('LIVE')}
              className={`px-3 py-1.5 font-semibold transition-colors flex items-center gap-1.5 ${
                statusTab === 'LIVE'
                  ? 'bg-emerald-700 text-ivory shadow-xs'
                  : 'text-emerald-800 hover:text-emerald-950'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Now ({stats.liveCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusTab('UPCOMING')}
              className={`px-3 py-1.5 font-semibold transition-colors ${
                statusTab === 'UPCOMING'
                  ? 'bg-gold-800 text-ivory shadow-xs'
                  : 'text-gold-900 hover:text-gold-950'
              }`}
            >
              Upcoming ({stats.upcomingCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusTab('ENDED')}
              className={`px-3 py-1.5 font-semibold transition-colors ${
                statusTab === 'ENDED'
                  ? 'bg-navy text-ivory shadow-xs'
                  : 'text-navy/60 hover:text-navy'
              }`}
            >
              Concluded ({stats.endedCount})
            </button>
          </div>

          <div className="text-[11px] font-mono text-navy/60">
            Showing <strong className="text-navy">{displayedAuctions.length}</strong> of{' '}
            <strong className="text-navy">{auctions.length}</strong> lots
          </div>
        </div>

        {/* Row 2: Search, Category & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lots by title, seller, category, description..."
              className="w-full pl-10 pr-9 py-2 bg-ivory-50 border border-beige text-xs text-navy placeholder:text-navy/40 focus:outline-none focus:border-burgundy"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="sm:w-56 bg-ivory-50 border border-beige px-2.5 py-1.5 text-xs flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-navy/50 shrink-0">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-navy font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="sm:w-56 bg-ivory-50 border border-beige px-2.5 py-1.5 text-xs flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-navy/50 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-transparent text-navy font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ending-soon">Closing Soonest</option>
              <option value="price-desc">Highest Price First</option>
              <option value="price-asc">Lowest Price First</option>
              <option value="bids-desc">Most Bids Placed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-beige p-5 animate-pulse space-y-3">
              <div className="h-44 bg-ivory-200"></div>
              <div className="h-4 bg-ivory-300 w-3/4"></div>
              <div className="h-3 bg-ivory-200 w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && displayedAuctions.length === 0 && (
        <div className="p-12 bg-white border border-dashed border-beige text-center max-w-xl mx-auto my-8">
          <Gavel className="w-12 h-12 text-gold-700 mx-auto mb-3 opacity-60" />
          <h4 className="font-serif text-xl font-bold text-navy mb-1">
            No Auction Lots Match Criteria
          </h4>
          <p className="text-xs text-navy/60 mb-6 leading-relaxed">
            There are no auction listings matching your selected status, category, or search query.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStatusTab('ALL');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-burgundy text-ivory text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-900 transition-colors"
            >
              Reset Filters
            </button>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="outline"
              size="sm"
            >
              List an Auction
            </Button>
          </div>
        </div>
      )}

      {/* Auction Cards Grid */}
      {!loading && displayedAuctions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedAuctions.map((auction) => {
            const isLive = auction.computedStatus === 'LIVE';
            const isUpcoming = auction.computedStatus === 'UPCOMING';
            const isEnded = auction.computedStatus === 'ENDED';
            const currentPrice = Number(auction.currentBid || auction.startingPrice);

            return (
              <div
                key={auction.id}
                className="bg-white border border-beige p-5 flex flex-col justify-between hover:border-gold hover:shadow-stamp-hover transition-all relative"
              >
                <div>
                  {/* Top Status & Category Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-burgundy font-semibold">
                      {auction.category || 'National Issue'}
                    </span>

                    {/* Status Pill */}
                    {isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span>LIVE BIDDING</span>
                      </span>
                    )}

                    {isUpcoming && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold/15 text-gold-950 border border-gold/40 text-[10px] font-mono font-bold">
                        <Clock className="w-3 h-3 text-gold-800" />
                        <span>UPCOMING</span>
                      </span>
                    )}

                    {isEnded && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-ivory-200 text-navy/70 border border-beige text-[10px] font-mono font-bold">
                        <span>CONCLUDED</span>
                      </span>
                    )}
                  </div>

                  {/* Stamp Title */}
                  <h4 className="font-serif text-lg font-bold text-navy leading-snug mb-1">
                    {auction.title}
                  </h4>

                  {/* Image Frame with Countdown Timer */}
                  <div className="relative aspect-[4/3] bg-ivory-100 border border-beige-dark/50 overflow-hidden mb-3 flex items-center justify-center">
                    {auction.image ? (
                      <img
                        src={auction.image}
                        alt={auction.title}
                        className="w-full h-full object-cover filter contrast-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-navy/40 p-4 text-center">
                        <Gavel className="w-10 h-10 mb-1 text-gold" />
                        <span className="text-xs font-serif font-bold text-navy">{auction.title}</span>
                      </div>
                    )}

                    {/* Countdown Overlay Pill */}
                    <div className="absolute bottom-2 left-2 right-2 bg-navy/90 backdrop-blur-xs text-ivory px-2.5 py-1 text-xs font-mono flex items-center justify-between border border-gold/30">
                      <span className="text-[10px] uppercase text-ivory/70 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold" />
                        {isLive ? 'Closes In:' : isUpcoming ? 'Opens In:' : 'Status:'}
                      </span>
                      <span className={`font-bold ${isLive ? 'text-gold' : 'text-ivory'}`}>
                        {isLive
                          ? formatTimeRemaining(auction.msRemaining)
                          : isUpcoming
                          ? formatTimeRemaining(auction.msUntilStart)
                          : 'Closed'}
                      </span>
                    </div>
                  </div>

                  {/* Seller & Provenance Strip */}
                  <div className="flex items-center justify-between text-xs text-navy/60 mb-3 pb-2 border-b border-beige">
                    <span className="truncate max-w-[180px]">By {auction.sellerName}</span>
                    <span className="text-[11px] font-mono text-emerald-800 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Lot</span>
                    </span>
                  </div>

                  {/* Pricing & Bidding Metrics Box */}
                  <div className="p-3 bg-ivory-50 border border-beige mb-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-navy/60 font-mono text-[10px] uppercase">
                        {auction.currentBid ? 'Current Highest Bid:' : 'Starting Bid:'}
                      </span>
                      <span className="font-serif text-xl font-bold text-burgundy">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between text-[11px] text-navy/70 border-t border-beige/60 pt-1.5 font-mono">
                      <span>Bids: <strong>{auction.bidCount || 0}</strong></span>
                      {isLive && (
                        <span>Next Min: <strong>₹{(Number(auction.minNextBid) || currentPrice + 500).toLocaleString('en-IN')}</strong></span>
                      )}
                      {isEnded && auction.winner && (
                        <span className="text-emerald-800 font-semibold truncate max-w-[140px]">
                          Won by {auction.winner.bidderName}
                        </span>
                      )}
                      {isEnded && !auction.winner && (
                        <span className="text-rose-800 font-semibold">Reserve Unsold</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-2">
                  <Link
                    to={`/auctions/${auction.id}`}
                    className={`w-full py-2 px-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                      isLive
                        ? 'bg-burgundy text-ivory hover:bg-burgundy-900 shadow-xs'
                        : isUpcoming
                        ? 'bg-white border border-gold text-navy hover:bg-gold hover:text-navy-950'
                        : 'bg-ivory-200 border border-beige text-navy hover:bg-ivory-300'
                    }`}
                  >
                    <span>{isLive ? 'Enter Bidding Terminal' : isUpcoming ? 'Inspect Lot & Watch' : 'View Auction Ledger'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Auction Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold/40 max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-bold block mb-1">
                NATIONAL ARCHIVAL BOURSE CONSIGNMENT
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy">
                Consign Specimen for Auction
              </h3>
              <p className="text-xs text-navy/60 mt-1">
                List an archival stamp specimen for official member bidding with server-synchronized timing and anti-shill protections.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Auction Lot Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1854 Inverted Head Four Annas Rarity"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-serif text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                  >
                    <option>Classic British India</option>
                    <option>Republic of India</option>
                    <option>Pre-Imperial India</option>
                    <option>Princely States</option>
                    <option>Aerophilately</option>
                    <option>Commemorative Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Preservation Condition *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                  >
                    <option>Mint Never Hinged</option>
                    <option>Fine Used</option>
                    <option>Very Fine Used</option>
                    <option>Original Gum, Mint</option>
                    <option>Historical Postal Cover</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Starting Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    placeholder="e.g. 50000"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Min Bid Increment (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={formData.minIncrement}
                    onChange={(e) => setFormData({ ...formData, minIncrement: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Auction Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Auction End Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Seller Name / Chapter *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Seller Email
                  </label>
                  <input
                    type="email"
                    value={formData.sellerEmail}
                    onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Specimen Image Scan URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Provenance & Certificate Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Philatelic Society London Cert #9842"
                  value={formData.certificate}
                  onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Archival Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Historical details, die variations, watermark condition, cancels..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-beige">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  size="md"
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={submittingCreate}
                >
                  {submittingCreate ? 'Cataloging Lot...' : 'Publish Auction Lot'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
