import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import { collectionApi, stampApi } from '../services/api';
import { useWishlist } from '../utils/wishlist';
import {
  Compass,
  Target,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Heart,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  Plus,
  ExternalLink,
  Layers,
  Globe,
  Calendar,
  X,
  Award,
  Info,
  Check,
  Package
} from 'lucide-react';

const ERA_RANGES = [
  { id: 'classic', label: 'Classic Era (Pre-1900)', filter: (year) => year && Number(year) < 1900 },
  { id: 'early20', label: 'Early 20th C. (1900–1946)', filter: (year) => year && Number(year) >= 1900 && Number(year) <= 1946 },
  { id: 'republic', label: 'Early Republic (1947–1970)', filter: (year) => year && Number(year) >= 1947 && Number(year) <= 1970 },
  { id: 'modern', label: 'Modern Era (Post-1970)', filter: (year) => year && Number(year) > 1970 },
];

export default function CollectionGapAnalyzerPage() {
  const { wishlistIds, isWishlisted, toggleWishlist } = useWishlist();

  const [collection, setCollection] = useState([]);
  const [catalogStamps, setCatalogStamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Dimension & Filter state
  const [dimension, setDimension] = useState('territory'); // 'territory' | 'category' | 'era'
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'missing' | 'collected' | 'wishlisted'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('gap-first'); // 'gap-first' | 'year-asc' | 'year-desc' | 'name-asc'

  // Vault Deposit Modal state
  const [depositModalStamp, setDepositModalStamp] = useState(null);
  const [depositCondition, setDepositCondition] = useState('Mint Never Hinged');
  const [depositQuantity, setDepositQuantity] = useState(1);
  const [submittingDeposit, setSubmittingDeposit] = useState(false);

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
      setError(err.message || 'Unable to retrieve catalog and vault records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stable ID mapping of user vault holdings
  const ownedStampIdSet = useMemo(() => {
    return new Set(
      collection
        .map((item) => String(item.stampId || item.stamp?.id))
        .filter(Boolean)
    );
  }, [collection]);

  const ownedItemMap = useMemo(() => {
    const map = new Map();
    collection.forEach((item) => {
      const key = String(item.stampId || item.stamp?.id);
      if (key) map.set(key, item);
    });
    return map;
  }, [collection]);

  // Track uncataloged items in vault
  const uncatalogedHoldings = useMemo(() => {
    return collection.filter((item) => {
      const sId = String(item.stampId || item.stamp?.id);
      return !catalogStamps.some((s) => String(s.id) === sId);
    });
  }, [collection, catalogStamps]);

  // Evaluate each catalog stamp
  const evaluatedStamps = useMemo(() => {
    return catalogStamps.map((stamp) => {
      const strId = String(stamp.id);
      const isOwned = ownedStampIdSet.has(strId);
      const ownedRecord = isOwned ? ownedItemMap.get(strId) : null;
      const isSaved = isWishlisted(strId);

      return {
        ...stamp,
        isOwned,
        ownedRecord,
        isWishlisted: isSaved,
      };
    });
  }, [catalogStamps, ownedStampIdSet, ownedItemMap, isWishlisted]);

  // Overall Catalog Metrics
  const totalCatalogCount = evaluatedStamps.length;
  const collectedCatalogCount = evaluatedStamps.filter((s) => s.isOwned).length;
  const missingCatalogCount = totalCatalogCount - collectedCatalogCount;
  const overallCompletionRate = totalCatalogCount > 0
    ? Math.round((collectedCatalogCount / totalCatalogCount) * 100)
    : 0;

  // Wishlist Gap Analytics
  const totalWishlistCount = wishlistIds.length;
  const acquiredWishlistCount = wishlistIds.filter((id) => ownedStampIdSet.has(String(id))).length;
  const missingInCatalogAndWishlistCount = evaluatedStamps.filter((s) => !s.isOwned && s.isWishlisted).length;

  // Segment generation based on selected dimension
  const segmentList = useMemo(() => {
    if (dimension === 'territory') {
      const territories = Array.from(new Set(evaluatedStamps.map((s) => s.country || 'India'))).sort();
      return territories.map((territory) => {
        const matching = evaluatedStamps.filter((s) => (s.country || 'India') === territory);
        const collected = matching.filter((s) => s.isOwned).length;
        const total = matching.length;
        const missing = total - collected;
        const completionRate = total > 0 ? Math.round((collected / total) * 100) : 0;
        return {
          id: territory,
          name: territory,
          total,
          collected,
          missing,
          completionRate,
          stamps: matching,
        };
      });
    }

    if (dimension === 'category') {
      const categories = Array.from(new Set(evaluatedStamps.map((s) => s.category || 'National Issue'))).sort();
      return categories.map((cat) => {
        const matching = evaluatedStamps.filter((s) => (s.category || 'National Issue') === cat);
        const collected = matching.filter((s) => s.isOwned).length;
        const total = matching.length;
        const missing = total - collected;
        const completionRate = total > 0 ? Math.round((collected / total) * 100) : 0;
        return {
          id: cat,
          name: cat,
          total,
          collected,
          missing,
          completionRate,
          stamps: matching,
        };
      });
    }

    // Dimension === 'era'
    return ERA_RANGES.map((era) => {
      const matching = evaluatedStamps.filter((s) => era.filter(s.year));
      const collected = matching.filter((s) => s.isOwned).length;
      const total = matching.length;
      const missing = total - collected;
      const completionRate = total > 0 ? Math.round((collected / total) * 100) : 0;
      return {
        id: era.id,
        name: era.label,
        total,
        collected,
        missing,
        completionRate,
        stamps: matching,
      };
    }).filter((era) => era.total > 0);
  }, [dimension, evaluatedStamps]);

  // Filtered Stamps according to segment, status, search, and sort
  const displayedStamps = useMemo(() => {
    let result = evaluatedStamps;

    // Filter by segment
    if (selectedSegment !== 'all') {
      if (dimension === 'territory') {
        result = result.filter((s) => (s.country || 'India') === selectedSegment);
      } else if (dimension === 'category') {
        result = result.filter((s) => (s.category || 'National Issue') === selectedSegment);
      } else if (dimension === 'era') {
        const eraObj = ERA_RANGES.find((e) => e.id === selectedSegment);
        if (eraObj) result = result.filter((s) => eraObj.filter(s.year));
      }
    }

    // Filter by status
    if (statusFilter === 'missing') {
      result = result.filter((s) => !s.isOwned);
    } else if (statusFilter === 'collected') {
      result = result.filter((s) => s.isOwned);
    } else if (statusFilter === 'wishlisted') {
      result = result.filter((s) => !s.isOwned && s.isWishlisted);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((s) => {
        const matchName = s.name?.toLowerCase().includes(q);
        const matchCountry = (s.country || 'India').toLowerCase().includes(q);
        const matchCategory = s.category?.toLowerCase().includes(q);
        const matchYear = String(s.year || '').toLowerCase().includes(q);
        const matchDesc = s.description?.toLowerCase().includes(q);
        return matchName || matchCountry || matchCategory || matchYear || matchDesc;
      });
    }

    // Sort result
    return [...result].sort((a, b) => {
      if (sortBy === 'gap-first') {
        if (!a.isOwned && b.isOwned) return -1;
        if (a.isOwned && !b.isOwned) return 1;
        return (Number(a.year) || 0) - (Number(b.year) || 0);
      }
      if (sortBy === 'year-asc') {
        return (Number(a.year) || 0) - (Number(b.year) || 0);
      }
      if (sortBy === 'year-desc') {
        return (Number(b.year) || 0) - (Number(a.year) || 0);
      }
      if (sortBy === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });
  }, [evaluatedStamps, dimension, selectedSegment, statusFilter, searchQuery, sortBy]);

  // Derived Insights
  const insights = useMemo(() => {
    const list = [];
    if (totalCatalogCount === 0) return list;

    // Closest incomplete segment
    const incompleteSegments = segmentList.filter((seg) => seg.completionRate < 100 && seg.total > 0);
    if (incompleteSegments.length > 0) {
      const closest = [...incompleteSegments].sort((a, b) => b.completionRate - a.completionRate)[0];
      list.push({
        type: 'opportunity',
        title: `Priority Acquisition Milestone: ${closest.name}`,
        detail: `You have completed ${closest.completionRate}% (${closest.collected}/${closest.total} specimens). Acquiring ${closest.missing} more ${closest.missing === 1 ? 'stamp' : 'stamps'} will achieve 100% series completion.`,
      });
    }

    // Completed segments
    const completedSegments = segmentList.filter((seg) => seg.completionRate === 100 && seg.total > 0);
    if (completedSegments.length > 0) {
      list.push({
        type: 'achievement',
        title: `Completed Series: ${completedSegments.map((s) => s.name).join(', ')}`,
        detail: `Exceptional archival discipline! You hold 100% of all cataloged specimens in ${completedSegments.length === 1 ? 'this series' : 'these series'}.`,
      });
    }

    // Wishlist gap closure
    if (missingInCatalogAndWishlistCount > 0) {
      list.push({
        type: 'wishlist',
        title: `${missingInCatalogAndWishlistCount} Targeted Gaps in Wishlist`,
        detail: `${missingInCatalogAndWishlistCount} of your ${missingCatalogCount} missing catalog specimens are currently saved in your active Wishlist ready for member exchange or marketplace acquisition.`,
      });
    }

    // Historical Scope insight
    list.push({
      type: 'scope',
      title: 'PostgreSQL Catalog Benchmark',
      detail: `Your collection is evaluated against ${totalCatalogCount} standardized specimens from the National Postal Archive. ${uncatalogedHoldings.length > 0 ? `${uncatalogedHoldings.length} custom specimens in your vault exist outside official catalog benchmarks.` : 'All vault specimens are catalog-verified.'}`,
    });

    return list;
  }, [totalCatalogCount, segmentList, missingInCatalogAndWishlistCount, missingCatalogCount, uncatalogedHoldings.length]);

  // Handle Quick Vault Deposit
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!depositModalStamp) return;

    try {
      setSubmittingDeposit(true);
      await collectionApi.add({
        stampId: depositModalStamp.id,
        quantity: parseInt(depositQuantity, 10) || 1,
        condition: depositCondition,
      });

      setActionMessage({
        type: 'success',
        text: `Specimen "${depositModalStamp.name}" deposited into your vault! Gap closed.`,
      });
      setDepositModalStamp(null);
      await loadData();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to deposit specimen into vault.',
      });
    } finally {
      setSubmittingDeposit(false);
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
        <Link to="/collection" className="hover:text-burgundy">
          My Vault
        </Link>
        <span>/</span>
        <span className="text-navy font-medium">Gap Analyzer</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <SectionHeading
            badge="ARCHIVAL COMPLETION AUDIT"
            title="Philatelic Gap Analyzer"
            subtitle="Compare your vault holdings against the official National Postal Archive to identify missing specimens, track series completion, and align wishlist priorities."
            align="left"
            className="mb-0"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy bg-white border border-beige hover:border-gold transition-colors"
            title="Refresh catalog and vault data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-burgundy' : 'text-gold-900'}`} />
            <span>Sync Catalog</span>
          </button>

          <Button
            to="/wishlist"
            variant="outline"
            size="sm"
            icon={Heart}
            iconPosition="left"
            className="text-xs font-semibold uppercase tracking-wider"
          >
            Wishlist ({totalWishlistCount})
          </Button>

          <Button
            to="/collection"
            variant="primary"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            className="text-xs font-semibold uppercase tracking-wider"
          >
            My Vault
          </Button>
        </div>
      </div>

      {/* Action Notification Message */}
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

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-beige p-5 animate-pulse space-y-3">
                <div className="h-3 bg-ivory-200 w-1/2"></div>
                <div className="h-7 bg-ivory-300 w-3/4"></div>
                <div className="h-2 bg-ivory-200 w-full"></div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-beige p-8 animate-pulse text-center">
            <div className="h-4 bg-ivory-300 w-1/3 mx-auto mb-3"></div>
            <div className="h-3 bg-ivory-200 w-1/2 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-8 bg-rose-50 border border-rose-300 text-center max-w-xl mx-auto my-8">
          <AlertCircle className="w-8 h-8 text-rose-700 mx-auto mb-2" />
          <h4 className="font-serif font-bold text-rose-950 mb-1">Unable to Load Gap Analyzer</h4>
          <p className="text-xs text-rose-900 mb-4">{error}</p>
          <Button onClick={loadData} variant="primary" size="sm">
            Retry Analysis
          </Button>
        </div>
      )}

      {/* Insufficient Catalog Limitation State */}
      {!loading && !error && totalCatalogCount === 0 && (
        <div className="p-12 bg-white border border-dashed border-beige-dark text-center max-w-xl mx-auto my-8">
          <Info className="w-12 h-12 text-gold-700 mx-auto mb-3" />
          <h4 className="font-serif text-xl font-bold text-navy mb-1">
            Insufficient Catalog Benchmark Data
          </h4>
          <p className="text-xs text-navy/60 mb-6 leading-relaxed">
            The National Postal Archive currently has no catalog specimens recorded in the database.
            Gap analysis requires an official catalog baseline to determine which specimens are missing from your vault.
          </p>
          <Button to="/stamps" variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
            Browse Postal Archive
          </Button>
        </div>
      )}

      {/* Main Analyzer Content */}
      {!loading && !error && totalCatalogCount > 0 && (
        <>
          {/* Top KPI Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Overall Completion */}
            <div className="bg-white border border-beige p-4 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50">
                  Overall Completion
                </span>
                <span className="text-xs font-mono font-bold text-burgundy">
                  {overallCompletionRate}%
                </span>
              </div>
              <div className="font-serif text-2xl font-bold text-navy mb-2">
                {collectedCatalogCount} <span className="text-xs font-sans text-navy/50 font-normal">of {totalCatalogCount} Cataloged</span>
              </div>
              <div className="w-full bg-ivory-200 h-2 border border-beige/60 overflow-hidden">
                <div
                  className="bg-burgundy h-full transition-all duration-500"
                  style={{ width: `${overallCompletionRate}%` }}
                ></div>
              </div>
            </div>

            {/* Missing Specimens Gap */}
            <div className="bg-white border border-beige p-4 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50 block mb-1">
                Specimen Gaps to Fill
              </span>
              <div className="font-serif text-2xl font-bold text-rose-800">
                {missingCatalogCount}
                <span className="text-xs font-sans text-navy/50 font-normal ml-1">Missing</span>
              </div>
              <span className="text-[11px] text-navy/60 block mt-1">
                {missingCatalogCount === 0
                  ? 'All benchmark specimens acquired!'
                  : `${Math.round((missingCatalogCount / totalCatalogCount) * 100)}% of catalog remaining`}
              </span>
            </div>

            {/* Wishlist Alignment */}
            <div className="bg-white border border-beige p-4 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50 block mb-1">
                Wishlist Gap Alignment
              </span>
              <div className="font-serif text-2xl font-bold text-gold-900">
                {missingInCatalogAndWishlistCount}
                <span className="text-xs font-sans text-navy/50 font-normal ml-1">Targeted</span>
              </div>
              <span className="text-[11px] text-navy/60 block mt-1">
                {acquiredWishlistCount > 0
                  ? `${acquiredWishlistCount} previously targeted already acquired`
                  : 'Save missing stamps to wishlist'}
              </span>
            </div>

            {/* Series Completed */}
            <div className="bg-white border border-beige p-4 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-navy/50 block mb-1">
                Series Completed
              </span>
              <div className="font-serif text-2xl font-bold text-emerald-800">
                {segmentList.filter((s) => s.completionRate === 100).length}
                <span className="text-xs font-sans text-navy/50 font-normal ml-1">of {segmentList.length}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                {segmentList.some((s) => s.completionRate === 100)
                  ? 'Full provenance verified'
                  : 'In progress across all series'}
              </span>
            </div>
          </div>

          {/* Archival Insights Strip */}
          {insights.length > 0 && (
            <div className="mb-8 bg-ivory-100 border border-beige p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-gold-900" />
                <h4 className="font-serif text-sm font-bold text-navy uppercase tracking-wider">
                  Archival Audit Insights & Strategic Recommendations
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {insights.map((ins, idx) => (
                  <div key={idx} className="bg-white border border-beige p-3 shadow-xs">
                    <strong className="text-navy font-serif font-bold block mb-1">
                      {ins.title}
                    </strong>
                    <p className="text-navy/70 leading-relaxed font-sans">{ins.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Workbench Container */}
          <div className="bg-white border border-beige p-5 sm:p-6 mb-8 shadow-xs">
            {/* Dimension Selection Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-beige">
              <div>
                <h3 className="font-serif text-xl font-bold text-navy">
                  Collection Completion Workbench
                </h3>
                <p className="text-xs text-navy/60 mt-0.5">
                  Select a segmentation lens to inspect series completion percentages and missing specimens.
                </p>
              </div>

              {/* Dimension Tabs */}
              <div className="inline-flex border border-beige bg-ivory-50 p-1 shadow-xs text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDimension('territory');
                    setSelectedSegment('all');
                  }}
                  className={`px-3 py-1.5 font-semibold transition-colors flex items-center gap-1.5 ${
                    dimension === 'territory'
                      ? 'bg-burgundy text-ivory shadow-xs'
                      : 'text-navy hover:text-burgundy'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>By Territory</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDimension('category');
                    setSelectedSegment('all');
                  }}
                  className={`px-3 py-1.5 font-semibold transition-colors flex items-center gap-1.5 ${
                    dimension === 'category'
                      ? 'bg-burgundy text-ivory shadow-xs'
                      : 'text-navy hover:text-burgundy'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>By Series / Category</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDimension('era');
                    setSelectedSegment('all');
                  }}
                  className={`px-3 py-1.5 font-semibold transition-colors flex items-center gap-1.5 ${
                    dimension === 'era'
                      ? 'bg-burgundy text-ivory shadow-xs'
                      : 'text-navy hover:text-burgundy'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>By Historical Era</span>
                </button>
              </div>
            </div>

            {/* Segment Cards Grid with Progress Bars */}
            <div className="pt-5 pb-5">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono uppercase tracking-wider text-navy/50 text-[10px]">
                  {dimension === 'territory' ? 'Territory Segments' : dimension === 'category' ? 'Series & Categories' : 'Historical Epochs'}
                </span>
                {selectedSegment !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedSegment('all')}
                    className="text-burgundy font-semibold hover:underline text-[11px]"
                  >
                    View All Segments
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* "All" Card */}
                <button
                  type="button"
                  onClick={() => setSelectedSegment('all')}
                  className={`p-3 border text-left transition-all ${
                    selectedSegment === 'all'
                      ? 'border-burgundy bg-burgundy/5 ring-1 ring-burgundy'
                      : 'border-beige hover:border-gold bg-ivory-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-serif font-bold text-navy text-xs">
                      All {dimension === 'territory' ? 'Territories' : dimension === 'category' ? 'Categories' : 'Eras'}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-burgundy">
                      {overallCompletionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-ivory-200 h-1.5 border border-beige/60 overflow-hidden mb-2">
                    <div
                      className="bg-burgundy h-full transition-all"
                      style={{ width: `${overallCompletionRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-navy/60 font-mono">
                    <span>Held: {collectedCatalogCount}/{totalCatalogCount}</span>
                    <span className="text-rose-800 font-semibold">{missingCatalogCount} gaps</span>
                  </div>
                </button>

                {/* Individual Segment Cards */}
                {segmentList.map((seg) => {
                  const isSelected = selectedSegment === seg.id;
                  const isComplete = seg.completionRate === 100;

                  return (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSelectedSegment(seg.id)}
                      className={`p-3 border text-left transition-all relative ${
                        isSelected
                          ? 'border-burgundy bg-burgundy/5 ring-1 ring-burgundy'
                          : 'border-beige hover:border-gold bg-white'
                      }`}
                    >
                      {isComplete && (
                        <span className="absolute top-2 right-2 text-emerald-700" title="100% Series Complete">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div className="flex justify-between items-start mb-1 pr-4">
                        <span className="font-serif font-bold text-navy text-xs truncate max-w-[150px]">
                          {seg.name}
                        </span>
                        <span className={`font-mono text-[11px] font-bold ${isComplete ? 'text-emerald-700' : 'text-burgundy'}`}>
                          {seg.completionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-ivory-200 h-1.5 border border-beige/60 overflow-hidden mb-2">
                        <div
                          className={`h-full transition-all ${isComplete ? 'bg-emerald-600' : 'bg-burgundy'}`}
                          style={{ width: `${seg.completionRate}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-navy/60 font-mono">
                        <span>Held: {seg.collected}/{seg.total}</span>
                        <span className={seg.missing > 0 ? 'text-rose-800 font-semibold' : 'text-emerald-700 font-semibold'}>
                          {seg.missing > 0 ? `${seg.missing} missing` : 'Complete'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter and Search Bar for Specimens */}
            <div className="pt-4 border-t border-beige space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalog specimens by name, country, category, year..."
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

                {/* Status Filter Buttons */}
                <div className="inline-flex border border-beige bg-ivory-50 p-0.5 text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 font-semibold transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-white text-navy shadow-xs border border-beige'
                        : 'text-navy/60 hover:text-navy'
                    }`}
                  >
                    All ({evaluatedStamps.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('missing')}
                    className={`px-3 py-1.5 font-semibold transition-colors flex items-center gap-1 ${
                      statusFilter === 'missing'
                        ? 'bg-rose-700 text-ivory shadow-xs'
                        : 'text-rose-800 hover:text-rose-950'
                    }`}
                  >
                    <span>Gaps Only</span>
                    <span className="font-mono text-[10px] bg-rose-900/20 px-1 py-0.2">
                      {missingCatalogCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('collected')}
                    className={`px-3 py-1.5 font-semibold transition-colors flex items-center gap-1 ${
                      statusFilter === 'collected'
                        ? 'bg-emerald-700 text-ivory shadow-xs'
                        : 'text-emerald-800 hover:text-emerald-950'
                    }`}
                  >
                    <span>Collected</span>
                    <span className="font-mono text-[10px] bg-emerald-900/20 px-1 py-0.2">
                      {collectedCatalogCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('wishlisted')}
                    className={`px-3 py-1.5 font-semibold transition-colors flex items-center gap-1 ${
                      statusFilter === 'wishlisted'
                        ? 'bg-gold-800 text-ivory shadow-xs'
                        : 'text-gold-900 hover:text-gold-950'
                    }`}
                  >
                    <Heart className="w-3 h-3 text-current" />
                    <span>Wishlisted ({missingInCatalogAndWishlistCount})</span>
                  </button>
                </div>

                {/* Sort dropdown */}
                <div className="sm:w-56 bg-ivory-50 border border-beige px-2.5 py-1.5 text-xs flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-navy/50 shrink-0">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-transparent text-navy font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="gap-first">Missing Gaps First</option>
                    <option value="year-asc">Issue Year (Oldest First)</option>
                    <option value="year-desc">Issue Year (Newest First)</option>
                    <option value="name-asc">Specimen Name (A to Z)</option>
                  </select>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between text-xs text-navy/60 pt-2 border-t border-beige/40 font-mono text-[11px]">
                <div>
                  Showing <strong>{displayedStamps.length}</strong> of <strong>{evaluatedStamps.length}</strong> catalog specimens
                  {selectedSegment !== 'all' && (
                    <span> in <em>{selectedSegment}</em></span>
                  )}
                  {statusFilter !== 'all' && (
                    <span> (filter: <em>{statusFilter}</em>)</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Owned in Vault
                  </span>
                  <span className="flex items-center gap-1 text-rose-800">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span> Missing Specimen Gap
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specimen Audit Cards Grid */}
          {displayedStamps.length === 0 ? (
            <div className="p-12 bg-white border border-dashed border-beige text-center max-w-xl mx-auto my-8">
              <Package className="w-10 h-10 text-gold-700 mx-auto mb-2 opacity-60" />
              <h4 className="font-serif text-lg font-bold text-navy mb-1">
                No Specimens Match Current Filter
              </h4>
              <p className="text-xs text-navy/60 mb-4 leading-relaxed">
                No catalog specimens meet your search query or selected status filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSegment('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-burgundy text-ivory hover:bg-burgundy-900 transition-colors uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayedStamps.map((stamp) => {
                const isOwned = stamp.isOwned;
                const ownedRecord = stamp.ownedRecord;
                const isSaved = isWishlisted(stamp.id);

                return (
                  <div
                    key={stamp.id}
                    className={`bg-white border p-5 flex flex-col justify-between transition-all ${
                      isOwned
                        ? 'border-emerald-300/80 bg-emerald-50/10 hover:border-emerald-500'
                        : 'border-beige hover:border-gold hover:shadow-stamp-hover'
                    }`}
                  >
                    <div>
                      {/* Card Top Pill & Badges */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-burgundy font-semibold">
                          {stamp.category || 'National Issue'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isOwned ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold">
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span>IN VAULT</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-mono font-bold">
                              <span>MISSING GAP</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stamp Title */}
                      <h4 className="font-serif text-lg font-bold text-navy leading-snug mb-1">
                        {stamp.name}
                      </h4>

                      {/* Image Frame with Wishlist Heart */}
                      <div className="relative aspect-[4/3] bg-ivory-100 border border-beige-dark/50 overflow-hidden mb-3 flex items-center justify-center">
                        {stamp.image ? (
                          <img
                            src={stamp.image}
                            alt={stamp.name}
                            className={`w-full h-full object-cover filter contrast-[1.03] ${
                              !isOwned ? 'opacity-90' : ''
                            }`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-navy/40 p-4 text-center">
                            <span className="text-xs font-serif font-bold text-navy">{stamp.name}</span>
                          </div>
                        )}

                        {/* Year Badge */}
                        <div className="absolute top-2 left-2 bg-navy/90 text-ivory text-[10px] font-mono px-2 py-0.5 border border-gold/30">
                          {stamp.year ? `Year ${stamp.year}` : 'Archival'}
                        </div>

                        {/* Wishlist Heart Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(stamp)}
                          className={`absolute top-2 right-2 p-1.5 transition-transform active:scale-90 shadow-sm border ${
                            isSaved
                              ? 'bg-rose-700 text-ivory border-rose-800'
                              : 'bg-white/90 text-navy hover:text-rose-700 border-beige'
                          }`}
                          title={isSaved ? 'Remove from wishlist' : 'Save missing specimen to wishlist'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current text-ivory' : ''}`} />
                        </button>

                        {/* Quantity Owned Indicator */}
                        {isOwned && (
                          <div className="absolute bottom-2 right-2 bg-emerald-900 text-ivory text-[10px] font-mono px-2 py-0.5 shadow-sm">
                            Qty Held: {ownedRecord?.quantity || 1}
                          </div>
                        )}
                      </div>

                      {/* Stamp Details */}
                      <div className="space-y-1.5 text-xs text-navy/70 border-t border-beige pt-3">
                        <div className="flex justify-between">
                          <span className="text-navy/50">Territory:</span>
                          <span className="font-medium text-navy">{stamp.country || 'India'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-navy/50">Catalog ID:</span>
                          <span className="font-mono text-[11px] text-navy/70">
                            {String(stamp.id).slice(0, 8)}
                          </span>
                        </div>
                        {isOwned ? (
                          <div className="flex justify-between">
                            <span className="text-navy/50">Vault Condition:</span>
                            <span className="font-semibold text-emerald-800">
                              {ownedRecord?.condition || 'Mint Never Hinged'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex justify-between">
                            <span className="text-navy/50">Archival Benchmark:</span>
                            <span className="text-navy/70 italic">Standard Catalog Specimen</span>
                          </div>
                        )}
                        {stamp.description && (
                          <p className="text-[11px] text-navy/60 line-clamp-2 pt-1 border-t border-beige/40 leading-relaxed">
                            {stamp.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="mt-4 pt-3 border-t border-beige flex items-center justify-between gap-2">
                      {isOwned ? (
                        <Link
                          to="/collection"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:text-emerald-950"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>View in Vault</span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 w-full justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setDepositModalStamp(stamp);
                              setDepositCondition('Mint Never Hinged');
                              setDepositQuantity(1);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-burgundy text-ivory hover:bg-burgundy-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                            title="Deposit this missing specimen into your vault"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Deposit</span>
                          </button>

                          <Link
                            to={`/marketplace?search=${encodeURIComponent(stamp.name)}`}
                            className="inline-flex items-center gap-1 text-[11px] text-navy/70 hover:text-burgundy font-medium"
                            title="Search marketplace for this missing specimen"
                          >
                            <span>Marketplace</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      )}

                      {/* Wishlist Status indicator */}
                      {!isOwned && isSaved && (
                        <span className="text-[10px] font-mono text-gold-900 bg-gold/10 border border-gold/30 px-1.5 py-0.5 shrink-0">
                          In Wishlist
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Nav Banner to Related Modules */}
          <div className="bg-ivory-100 border border-beige p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-bold">
                ACQUISITION CHANNELS
              </div>
              <h4 className="font-serif text-lg font-bold text-navy mt-0.5">
                Ready to Acquire Missing Collection Specimens?
              </h4>
              <p className="text-xs text-navy/60 mt-1 max-w-xl">
                Use your linked National Philatelic Deposit Account (PDA) for automatic new-issue allocations or trade with verified collectors on the Society Marketplace.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/marketplace"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-beige text-navy hover:border-gold transition-colors"
              >
                Explore Marketplace
              </Link>
              <Link
                to="/pda"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-burgundy text-ivory hover:bg-burgundy-900 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Manage PDA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Quick Deposit to Vault Modal */}
      {depositModalStamp && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold/40 max-w-md w-full p-6 sm:p-8 relative shadow-2xl animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => setDepositModalStamp(null)}
              className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-bold block mb-1">
                CLOSE COLLECTION GAP
              </span>
              <h3 className="font-serif text-xl font-bold text-navy">
                Deposit Specimen into Vault
              </h3>
              <p className="text-xs text-navy/60 mt-1">
                Record your acquisition of <strong className="font-serif text-navy">"{depositModalStamp.name}"</strong> to close this catalog gap in PostgreSQL.
              </p>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-ivory-100 border border-beige space-y-1">
                <div className="flex justify-between">
                  <span className="text-navy/50">Specimen:</span>
                  <span className="font-serif font-bold text-navy">{depositModalStamp.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/50">Territory:</span>
                  <span className="font-medium text-navy">{depositModalStamp.country || 'India'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy/50">Issue Year:</span>
                  <span className="font-mono text-navy">{depositModalStamp.year}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Specimen Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={depositQuantity}
                    onChange={(e) => setDepositQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Preservation Condition *
                  </label>
                  <select
                    value={depositCondition}
                    onChange={(e) => setDepositCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy text-xs"
                  >
                    <option>Mint Never Hinged</option>
                    <option>Fine Used</option>
                    <option>Very Fine Used</option>
                    <option>Original Gum, Mint</option>
                    <option>Embossed Seal</option>
                    <option>Historical Cover</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-beige">
                <Button
                  onClick={() => setDepositModalStamp(null)}
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
                  disabled={submittingDeposit}
                >
                  {submittingDeposit ? 'Depositing...' : 'Confirm Deposit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
