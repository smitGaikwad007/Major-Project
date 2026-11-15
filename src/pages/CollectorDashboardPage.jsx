import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import { collectionApi, stampApi } from '../services/api';
import { useWishlist } from '../utils/wishlist';
import {
  Archive,
  Stamp,
  Globe,
  Calendar,
  Heart,
  TrendingUp,
  Target,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Package,
  Layers,
  ShieldCheck,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  PieChart,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

const TARGET_STORAGE_KEY = 'philately_collector_target_goal';

export default function CollectorDashboardPage() {
  const { wishlistIds, count: wishlistCount } = useWishlist();

  const [collection, setCollection] = useState([]);
  const [catalogStamps, setCatalogStamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Target completion goal persisted in localStorage
  const [targetGoal, setTargetGoal] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(TARGET_STORAGE_KEY);
      return stored ? parseInt(stored, 10) : null;
    } catch {
      return null;
    }
  });
  const [targetInput, setTargetInput] = useState('');
  const [editingTarget, setEditingTarget] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [colRes, stampRes] = await Promise.all([
        collectionApi.getAll().catch(() => ({ data: [] })),
        stampApi.getAll().catch(() => ({ data: [] })),
      ]);

      setCollection(colRes?.data || []);
      setCatalogStamps(stampRes?.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load collector analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTarget = (e) => {
    e.preventDefault();
    const parsed = parseInt(targetInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setTargetGoal(parsed);
      setEditingTarget(false);
      try {
        localStorage.setItem(TARGET_STORAGE_KEY, String(parsed));
      } catch (err) {
        console.error('Failed to save target goal:', err);
      }
    }
  };

  const handleResetTarget = () => {
    setTargetGoal(null);
    setTargetInput('');
    setEditingTarget(false);
    try {
      localStorage.removeItem(TARGET_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear target goal:', err);
    }
  };

  // Enrich collection items with catalog stamp data if stamp object is not populated
  const enrichedCollection = collection.map((item) => {
    if (item.stamp) return item;
    const matched = catalogStamps.find((s) => String(s.id) === String(item.stampId));
    return {
      ...item,
      stamp: matched || null,
    };
  });

  // Dynamic Metrics Derivation
  const totalSpecimens = enrichedCollection.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );
  const uniqueVarieties = enrichedCollection.length;

  const uniqueCountriesSet = new Set(
    enrichedCollection.map((item) => item.stamp?.country).filter(Boolean)
  );
  const uniqueCountriesCount = uniqueCountriesSet.size;

  // Check if real value/price data exists on any collection record
  const itemsWithValue = enrichedCollection.filter(
    (item) => item.value || item.price || item.stamp?.price || item.stamp?.value
  );
  const totalCalculatedValue =
    itemsWithValue.length > 0
      ? itemsWithValue.reduce(
          (sum, item) =>
            sum +
            Number(item.value || item.price || item.stamp?.price || item.stamp?.value || 0),
          0
        )
      : null;

  // Country Breakdown Analytics
  const countryMap = {};
  enrichedCollection.forEach((item) => {
    const country = item.stamp?.country || 'Unrecorded Territory';
    const qty = Number(item.quantity) || 1;
    countryMap[country] = (countryMap[country] || 0) + qty;
  });

  const countryData = Object.entries(countryMap)
    .map(([country, count]) => ({
      country,
      count,
      percentage: totalSpecimens > 0 ? Math.round((count / totalSpecimens) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Chronological Timeline Analytics (Year of Issue)
  const yearMap = {};
  enrichedCollection.forEach((item) => {
    const rawYear = item.stamp?.year;
    const validYear = rawYear && !isNaN(Number(rawYear)) ? Number(rawYear) : 'Unknown';
    const qty = Number(item.quantity) || 1;
    yearMap[validYear] = (yearMap[validYear] || 0) + qty;
  });

  const timelineData = Object.entries(yearMap)
    .map(([year, count]) => ({
      year,
      count,
      sortKey: year === 'Unknown' ? 999999 : Number(year),
    }))
    .sort((a, b) => a.sortKey - b.sortKey);

  const maxYearCount = Math.max(...timelineData.map((d) => d.count), 1);

  // Recently Added Stamps (up to 4)
  // Fallback ordering: uses createdAt timestamp if available; otherwise preserves database array order
  const recentStamps = [...enrichedCollection]
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    })
    .slice(0, 4);

  // Wishlist relationship insights
  const collectedStampIds = new Set(
    enrichedCollection.map((item) => String(item.stampId || item.stamp?.id))
  );
  const wishlistedAcquiredCount = (wishlistIds || []).filter((id) =>
    collectedStampIds.has(String(id))
  ).length;

  // Completion calculation
  const completionPercentage =
    targetGoal && targetGoal > 0
      ? Math.min(100, Math.round((totalSpecimens / targetGoal) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-ivory-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs text-navy/60 font-mono uppercase tracking-wider">
          <Link to="/" className="hover:text-burgundy flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold">Collector Analytics Dashboard</span>
        </div>

        {/* Dashboard Title & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <SectionHeading
              badge="MEMBER ARCHIVAL INTELLIGENCE"
              title="Collector Dashboard"
              subtitle="Comprehensive portfolio analytics, acquisition timelines, geographical distribution, and collection progress derived from your live vault records."
              align="left"
              className="mb-0"
            />
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy bg-white border border-beige hover:border-gold transition-colors shadow-sm"
              title="Refresh vault analytics"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-burgundy' : 'text-gold-900'}`} />
              <span>Refresh Metrics</span>
            </button>

            <Link
              to="/collection"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-burgundy text-ivory hover:bg-burgundy-900 transition-colors shadow-sm"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Open Vault</span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-beige p-5 animate-pulse space-y-3">
                <div className="h-3 bg-ivory-200 w-1/2"></div>
                <div className="h-8 bg-ivory-300 w-3/4"></div>
                <div className="h-3 bg-ivory-200 w-1/3"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error Notification */}
        {error && !loading && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-300 text-xs text-rose-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={loadData}
              className="font-semibold text-rose-800 hover:underline ml-4"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && (
          <>
            {/* 1. KEY METRIC SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              {/* Metric 1: Total Specimens */}
              <div className="bg-white border-2 border-beige p-5 shadow-sm hover:border-gold/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-navy/50 text-xs font-mono uppercase tracking-wider mb-2">
                    <span>Holdings in Vault</span>
                    <Archive className="w-4 h-4 text-burgundy" />
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-navy leading-tight">
                    {totalSpecimens}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-beige/60 text-xs text-navy/60 flex items-center justify-between">
                  <span>{uniqueVarieties} Cataloged {uniqueVarieties === 1 ? 'Variety' : 'Varieties'}</span>
                  <Link to="/collection" className="font-semibold text-burgundy hover:underline">
                    View Vault →
                  </Link>
                </div>
              </div>

              {/* Metric 2: Estimated Collection Value */}
              <div className="bg-white border-2 border-beige p-5 shadow-sm hover:border-gold/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-navy/50 text-xs font-mono uppercase tracking-wider mb-2">
                    <span>Estimated Valuation</span>
                    <Award className="w-4 h-4 text-gold-900" />
                  </div>
                  {totalCalculatedValue !== null ? (
                    <div className="font-serif text-3xl sm:text-4xl font-bold text-burgundy leading-tight">
                      ₹{totalCalculatedValue.toLocaleString('en-IN')}
                    </div>
                  ) : (
                    <div>
                      <div className="font-serif text-2xl font-bold text-navy/60 leading-tight">
                        Not Available
                      </div>
                      <span className="text-[11px] text-navy/50 font-sans block mt-0.5">
                        Appraisal requires certificate valuation
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-beige/60 text-xs text-navy/60">
                  <span>Standard Dak Bhavan Escrow Audit</span>
                </div>
              </div>

              {/* Metric 3: Geographic Distribution */}
              <div className="bg-white border-2 border-beige p-5 shadow-sm hover:border-gold/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-navy/50 text-xs font-mono uppercase tracking-wider mb-2">
                    <span>Territories & States</span>
                    <Globe className="w-4 h-4 text-emerald-800" />
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-navy leading-tight">
                    {uniqueCountriesCount}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-beige/60 text-xs text-navy/60">
                  <span>{uniqueCountriesCount === 1 ? 'Region' : 'Regions'} represented</span>
                </div>
              </div>

              {/* Metric 4: Wishlist Count */}
              <div className="bg-white border-2 border-beige p-5 shadow-sm hover:border-gold/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-navy/50 text-xs font-mono uppercase tracking-wider mb-2">
                    <span>Specimens Sought</span>
                    <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-navy leading-tight">
                    {wishlistCount}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-beige/60 text-xs text-navy/60 flex items-center justify-between">
                  <span>Saved in Wishlist</span>
                  <Link to="/wishlist" className="font-semibold text-burgundy hover:underline">
                    View Wishlist →
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. COLLECTION COMPLETION PROGRESS */}
            <div className="bg-white border border-beige p-6 sm:p-7 shadow-sm mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-gold-900" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-navy">
                      Archival Collection Target Goal
                    </h3>
                    <p className="text-xs text-navy/60">
                      Track your accession progress toward an established specimen holdings milestone.
                    </p>
                  </div>
                </div>

                {targetGoal !== null && !editingTarget && (
                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="font-mono text-xs font-semibold text-burgundy bg-ivory-200 border border-beige px-3 py-1">
                      {totalSpecimens} of {targetGoal} Target ({completionPercentage}%)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetInput(String(targetGoal));
                        setEditingTarget(true);
                      }}
                      className="text-xs text-navy/60 hover:text-burgundy underline font-medium"
                    >
                      Adjust Goal
                    </button>
                  </div>
                )}
              </div>

              {/* Active Target Progress Bar */}
              {targetGoal !== null && !editingTarget ? (
                <div className="space-y-2 mt-4">
                  <div className="w-full bg-ivory-200 border border-beige h-4 overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-burgundy via-burgundy-800 to-gold transition-all duration-700"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-navy/60">
                    <span>Vault Base: 0 Stamps</span>
                    <span>
                      {totalSpecimens >= targetGoal ? (
                        <span className="text-emerald-800 font-bold flex items-center gap-1 inline-flex">
                          <CheckCircle2 className="w-3 h-3" /> Goal Achieved!
                        </span>
                      ) : (
                        `${targetGoal - totalSpecimens} specimens remaining to reach target`
                      )}
                    </span>
                    <span>Target: {targetGoal} Stamps</span>
                  </div>
                </div>
              ) : (
                /* Target Setup Form */
                <form
                  onSubmit={handleSaveTarget}
                  className="mt-4 p-4 bg-ivory-100 border border-beige flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <label htmlFor="target-input" className="text-xs font-semibold text-navy shrink-0">
                    Set Target Number of Stamps:
                  </label>
                  <input
                    id="target-input"
                    type="number"
                    min="1"
                    max="10000"
                    placeholder="e.g. 25, 50, or 100"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="w-full sm:w-48 px-3 py-1.5 text-xs font-mono bg-white border border-beige focus:outline-none focus:border-gold text-navy"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="sm" type="submit">
                      Save Goal
                    </Button>
                    {editingTarget && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => setEditingTarget(false)}
                        >
                          Cancel
                        </Button>
                        <button
                          type="button"
                          onClick={handleResetTarget}
                          className="text-xs text-rose-700 hover:underline px-2"
                        >
                          Clear Goal
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* 3. TWO-COLUMN CHARTS: COUNTRY DISTRIBUTION & TIMELINE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 items-stretch">
              {/* Chart 1: Country-wise analytics */}
              <div className="bg-white border border-beige p-6 sm:p-7 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-beige mb-5">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gold-900" />
                      <h3 className="font-serif text-lg font-bold text-navy">
                        Geographic Distribution
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-navy/50">
                      {countryData.length} {countryData.length === 1 ? 'Territory' : 'Territories'}
                    </span>
                  </div>

                  {countryData.length === 0 ? (
                    <div className="py-12 text-center text-navy/40">
                      <Globe className="w-10 h-10 mx-auto mb-2 text-gold-700/50" />
                      <p className="text-xs font-serif text-navy/70 font-semibold">
                        No Country Data Cataloged
                      </p>
                      <p className="text-[11px] text-navy/50 mt-1 max-w-xs mx-auto">
                        Deposit specimens into your vault to view geographical territory analytics.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {countryData.map((item, idx) => (
                        <div key={item.country} className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center text-navy">
                            <span className="font-medium truncate max-w-[220px]">
                              {item.country}
                            </span>
                            <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                              <span className="text-navy font-bold">{item.count} Stamps</span>
                              <span className="text-navy/50">({item.percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-ivory-200 border border-beige/60 h-2.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                idx === 0
                                  ? 'bg-burgundy'
                                  : idx === 1
                                  ? 'bg-gold'
                                  : idx === 2
                                  ? 'bg-navy'
                                  : 'bg-emerald-800'
                              }`}
                              style={{ width: `${Math.max(5, item.percentage)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-beige/60 text-[11px] text-navy/50 font-mono">
                  Calculated from physical specimen holdings registered in PostgreSQL.
                </div>
              </div>

              {/* Chart 2: Collection Timeline (Issue Year Distribution) */}
              <div className="bg-white border border-beige p-6 sm:p-7 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-beige mb-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold-900" />
                      <h3 className="font-serif text-lg font-bold text-navy">
                        Chronological Issue Timeline
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-navy/50">
                      Chronological Era Order
                    </span>
                  </div>

                  {timelineData.length === 0 ? (
                    <div className="py-12 text-center text-navy/40">
                      <Calendar className="w-10 h-10 mx-auto mb-2 text-gold-700/50" />
                      <p className="text-xs font-serif text-navy/70 font-semibold">
                        No Chronological Data Recorded
                      </p>
                      <p className="text-[11px] text-navy/50 mt-1 max-w-xs mx-auto">
                        Deposit stamps with documented years of issue to generate your chronological timeline.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Timeline Bar Chart */}
                      <div className="flex items-end gap-2.5 sm:gap-4 h-48 pt-6 pb-2 px-2 border-b border-beige overflow-x-auto">
                        {timelineData.map((item) => {
                          const barHeight = Math.max(18, Math.round((item.count / maxYearCount) * 100));
                          return (
                            <div
                              key={String(item.year)}
                              className="flex-1 min-w-[48px] flex flex-col items-center justify-end h-full group cursor-pointer"
                              title={`${item.count} Stamps issued in ${item.year}`}
                            >
                              <span className="text-[10px] font-mono font-bold text-burgundy mb-1 group-hover:scale-110 transition-transform">
                                {item.count}
                              </span>
                              <div
                                className="w-full bg-ivory-200 border border-beige group-hover:border-gold transition-all relative overflow-hidden flex items-end"
                                style={{ height: `${barHeight}%` }}
                              >
                                <div className="w-full h-full bg-gradient-to-t from-burgundy to-gold/80 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              <span className="text-[11px] font-mono text-navy/70 mt-2 truncate max-w-full text-center font-medium">
                                {item.year}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-navy/60 px-2 pt-1">
                        <span>Earliest Era: {timelineData[0]?.year}</span>
                        <span>Latest Era: {timelineData[timelineData.length - 1]?.year}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-3 border-t border-beige/60 text-[11px] text-navy/50 font-mono">
                  Visualizes chronological concentration of Indian philatelic issues in your vault.
                </div>
              </div>
            </div>

            {/* 4. WISHLIST INSIGHTS STRIP */}
            <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-burgundy-950 text-ivory p-6 sm:p-8 mb-10 border border-gold/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-mono text-gold-400 uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                  <span>Wishlist Acquisition Intelligence</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-ivory">
                  {wishlistCount > 0
                    ? `You have bookmarked ${wishlistCount} ${wishlistCount === 1 ? 'rarity' : 'rarities'} for your acquisition portfolio.`
                    : 'Your acquisition wishlist currently contains 0 saved specimens.'}
                </h3>
                <p className="text-xs text-ivory/70 leading-relaxed">
                  {wishlistedAcquiredCount > 0
                    ? `You have already accessioned ${wishlistedAcquiredCount} of your bookmarked stamps into your personal vault.`
                    : 'Browse authenticated specimens in the postal catalog and tag the heart icon to curate your future acquisitions.'}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/wishlist"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-gold text-navy-950 hover:bg-gold-500 transition-colors shadow-sm"
                >
                  <span>Review Wishlist ({wishlistCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/stamps"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory border border-ivory/30 hover:border-ivory transition-colors"
                >
                  <span>Explore Archive</span>
                </Link>
              </div>
            </div>

            {/* 5. RECENTLY ADDED SPECIMENS */}
            <div className="mb-14">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-beige">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-navy">
                    Recently Vaulted Specimens
                  </h3>
                  <p className="text-xs text-navy/60">
                    Displaying up to 4 recent deposits ordered by database ledger accession.
                  </p>
                </div>

                <Link
                  to="/collection"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy hover:text-navy transition-colors group"
                >
                  <span>View All {totalSpecimens} Vault Holdings</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {recentStamps.length === 0 ? (
                <div className="p-10 bg-white border border-dashed border-beige-dark text-center max-w-lg mx-auto">
                  <Package className="w-10 h-10 text-gold-700 mx-auto mb-2 opacity-60" />
                  <h4 className="font-serif text-lg font-bold text-navy mb-1">
                    No Holdings Deposited Yet
                  </h4>
                  <p className="text-xs text-navy/60 mb-5 leading-relaxed">
                    Start cataloging your personal collection by depositing items directly from the Postal Archive.
                  </p>
                  <Button to="/stamps" variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                    Browse Postal Archive
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentStamps.map((item) => {
                    const stamp = item.stamp || {};
                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-beige p-4 flex flex-col justify-between hover:border-gold hover:shadow-stamp-hover transition-all group"
                      >
                        <div>
                          <div className="relative aspect-[4/3] bg-ivory-100 overflow-hidden border border-beige/60 mb-3 flex items-center justify-center">
                            {stamp.image ? (
                              <img
                                src={stamp.image}
                                alt={stamp.name || 'Specimen'}
                                className="w-full h-full object-cover filter contrast-[1.03] transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <Stamp className="w-10 h-10 text-gold-700/60" />
                            )}
                            <span className="absolute top-2 left-2 bg-navy text-ivory text-[10px] font-mono px-2 py-0.5">
                              Issue {stamp.year || 'Historical'}
                            </span>
                            <span className="absolute bottom-2 right-2 bg-burgundy text-ivory text-[10px] font-semibold px-2 py-0.5 shadow-sm">
                              Qty: {item.quantity || 1}
                            </span>
                          </div>

                          <div className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-semibold mb-1">
                            {stamp.category || 'National Archive'}
                          </div>

                          <h4 className="font-serif text-base font-bold text-navy leading-snug line-clamp-1 group-hover:text-burgundy transition-colors mb-1">
                            {stamp.name || `Vault Item #${item.stampId?.slice(0, 8)}`}
                          </h4>

                          <p className="text-xs text-navy/60 mb-2 truncate">
                            {stamp.country || 'India'}
                          </p>

                          <div className="text-[11px] text-navy/70 border-t border-beige/60 pt-2 flex items-center justify-between">
                            <span className="text-navy/50">Condition:</span>
                            <span className="font-medium text-navy-800">{item.condition}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-beige flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-800 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-700" />
                            Vault Verified
                          </span>

                          <Link
                            to="/collection"
                            className="text-xs font-semibold text-burgundy hover:text-navy inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Manage</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
