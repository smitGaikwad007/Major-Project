import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import { collectionApi, stampApi, pdaApi } from '../services/api';
import {
  Archive,
  Plus,
  Trash2,
  RefreshCw,
  Stamp,
  Landmark,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  X,
  Package,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Tag,
  Globe
} from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const ERA_OPTIONS = [
  { value: 'all', label: 'All Eras & Periods' },
  { value: 'pre-1900', label: 'Classic Era (Pre-1900)', filter: (year) => year && Number(year) < 1900 },
  { value: '1900-1946', label: 'Early 20th C. (1900–1946)', filter: (year) => year && Number(year) >= 1900 && Number(year) <= 1946 },
  { value: '1947-1970', label: 'Early Republic (1947–1970)', filter: (year) => year && Number(year) >= 1947 && Number(year) <= 1970 },
  { value: 'post-1970', label: 'Modern Era (Post-1970)', filter: (year) => year && Number(year) > 1970 },
];

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date Deposited (Newest First)' },
  { value: 'date-asc', label: 'Date Deposited (Oldest First)' },
  { value: 'year-asc', label: 'Issue Year (Oldest First)' },
  { value: 'year-desc', label: 'Issue Year (Newest First)' },
  { value: 'name-asc', label: 'Specimen Name (A to Z)' },
  { value: 'name-desc', label: 'Specimen Name (Z to A)' },
  { value: 'quantity-desc', label: 'Quantity (High to Low)' },
];

export default function CollectionPage() {
  const [collection, setCollection] = useState([]);
  const [stamps, setStamps] = useState([]);
  const [pdaAccount, setPdaAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    stampId: '',
    quantity: 1,
    condition: 'Mint Never Hinged',
  });

  // Smart Search & Advanced Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedEra, setSelectedEra] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [colRes, stampRes, pdaRes] = await Promise.all([
        collectionApi.getAll().catch(() => ({ data: [] })),
        stampApi.getAll().catch(() => ({ data: [] })),
        pdaApi.getAccounts().catch(() => ({ data: [] })),
      ]);

      setCollection(colRes.data || []);
      setStamps(stampRes.data || []);
      if (pdaRes.data && pdaRes.data.length > 0) {
        setPdaAccount(pdaRes.data[0]);
      }
      if (stampRes.data && stampRes.data.length > 0 && !formData.stampId) {
        setFormData((prev) => ({ ...prev, stampId: stampRes.data[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve vault records from PostgreSQL.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.stampId) {
      setActionMessage({ type: 'error', text: 'Please select a catalog stamp to add.' });
      return;
    }

    try {
      setSubmitting(true);
      await collectionApi.add({
        stampId: formData.stampId,
        quantity: parseInt(formData.quantity, 10) || 1,
        condition: formData.condition,
      });

      setShowAddModal(false);
      setActionMessage({ type: 'success', text: 'Specimen successfully deposited into your private vault!' });
      await loadData();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to add item to vault.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id, name) => {
    try {
      setDeletingId(id);
      await collectionApi.remove(id);
      setActionMessage({ type: 'success', text: `Specimen "${name || 'Item'}" removed from your vault.` });
      setCollection((prev) => prev.filter((item) => item.id !== id));
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to remove specimen from vault.' });
    } finally {
      setDeletingId(null);
    }
  };

  // Enrich collection items with catalog stamps if item.stamp is not directly attached
  const enrichedCollection = collection.map((item) => {
    if (item.stamp) return item;
    const matched = stamps.find((s) => String(s.id) === String(item.stampId));
    return {
      ...item,
      stamp: matched || {},
    };
  });

  // Extract unique options dynamically from current vault holdings
  const availableCountries = Array.from(
    new Set(enrichedCollection.map((item) => item.stamp?.country || 'India').filter(Boolean))
  ).sort();

  const availableCategories = Array.from(
    new Set(enrichedCollection.map((item) => item.stamp?.category).filter(Boolean))
  ).sort();

  const availableConditions = Array.from(
    new Set(enrichedCollection.map((item) => item.condition).filter(Boolean))
  ).sort();

  // Smart Search & Filter Evaluation
  const filteredCollection = enrichedCollection.filter((item) => {
    const stamp = item.stamp || {};
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      const matchName = stamp.name?.toLowerCase().includes(query);
      const matchDesc = stamp.description?.toLowerCase().includes(query);
      const matchCountry = (stamp.country || 'India').toLowerCase().includes(query);
      const matchCategory = stamp.category?.toLowerCase().includes(query);
      const matchCondition = item.condition?.toLowerCase().includes(query);
      const matchYear = String(stamp.year || '').toLowerCase().includes(query);
      const matchStampId = String(item.stampId || '').toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCountry && !matchCategory && !matchCondition && !matchYear && !matchStampId) {
        return false;
      }
    }

    if (selectedCountry !== 'all') {
      const country = stamp.country || 'India';
      if (country !== selectedCountry) return false;
    }

    if (selectedCategory !== 'all' && stamp.category !== selectedCategory) {
      return false;
    }

    if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
      return false;
    }

    if (selectedEra !== 'all') {
      const stampYear = Number(stamp.year);
      const eraOption = ERA_OPTIONS.find((e) => e.value === selectedEra);
      if (eraOption?.filter && !eraOption.filter(stampYear)) {
        return false;
      }
    }

    return true;
  });

  // Dynamic Multi-field Sorting
  const sortedCollection = [...filteredCollection].sort((a, b) => {
    const stampA = a.stamp || {};
    const stampB = b.stamp || {};

    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'date-asc':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'year-asc':
        return (Number(stampA.year) || 0) - (Number(stampB.year) || 0);
      case 'year-desc':
        return (Number(stampB.year) || 0) - (Number(stampA.year) || 0);
      case 'name-asc':
        return (stampA.name || '').localeCompare(stampB.name || '');
      case 'name-desc':
        return (stampB.name || '').localeCompare(stampA.name || '');
      case 'quantity-desc':
        return (Number(b.quantity) || 1) - (Number(a.quantity) || 1);
      default:
        return 0;
    }
  });

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCountry !== 'all' ||
    selectedCategory !== 'all' ||
    selectedCondition !== 'all' ||
    selectedEra !== 'all' ||
    sortBy !== 'date-desc';

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedCategory('all');
    setSelectedCondition('all');
    setSelectedEra('all');
    setSortBy('date-desc');
  };

  const totalSpecimens = collection.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const filteredSpecimensTotal = sortedCollection.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const estimatedAppraisal = totalSpecimens * 68000;

  const albums = [
    { title: "Dominion & Early Republic (1947–1955)", count: 24, value: "₹1,85,000", status: "PCI Verified" },
    { title: "Princely States of Kerala (Travancore & Cochin)", count: 18, value: "₹92,000", status: "Watermark Verified" },
    { title: "Indian Aerophilately & Flown Envelopes", count: 9, value: "₹1,45,000", status: "Historical Grade" },
    { title: "Archaeological Series of 1949", count: 16, value: "₹34,000", status: "Cataloged" },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-xs text-navy/60">
        <Link to="/" className="hover:text-burgundy flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <span className="text-navy font-medium">My Vault</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <SectionHeading
            badge="COLLECTOR'S PRIVATE REPOSITORY"
            title="My Philatelic Vault"
            subtitle="Manage your personal stamp holdings, cataloged specimens, and provenance records connected directly to PostgreSQL."
            align="left"
            className="mb-0"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy bg-white border border-beige hover:border-gold transition-colors"
            title="Synchronize vault from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-burgundy' : 'text-gold-900'}`} />
            <span>Sync</span>
          </button>

          <Button
            onClick={() => setShowAddModal(true)}
            variant="primary"
            size="sm"
            icon={Plus}
            iconPosition="left"
            className="text-xs font-semibold tracking-wider uppercase px-4 py-2"
          >
            Deposit Specimen
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`mb-6 p-4 border text-xs flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : actionMessage.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-ivory-100 border-gold/40 text-navy'
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
            className="text-navy/50 hover:text-navy"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-beige p-4 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-navy/50 font-mono block">Vault Specimens</span>
          <span className="font-serif text-2xl font-bold text-navy mt-1 block">{totalSpecimens} Stamps</span>
          <span className="text-[11px] text-emerald-700 font-medium">{collection.length} Unique Varieties</span>
        </div>

        <div className="bg-white border border-beige p-4 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-navy/50 font-mono block">Estimated Appraisal</span>
          <span className="font-serif text-2xl font-bold text-burgundy mt-1 block">
            ₹{estimatedAppraisal > 0 ? estimatedAppraisal.toLocaleString('en-IN') : '0'}
          </span>
          <span className="text-[11px] text-navy/60">Dak Bhavan Archival Benchmark</span>
        </div>

        <div className="bg-white border border-beige p-4 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-navy/50 font-mono block">PCI Authentication</span>
          <span className="font-serif text-2xl font-bold text-navy mt-1 block">100%</span>
          <span className="text-[11px] text-emerald-700 font-medium">PostgreSQL Certified</span>
        </div>

        <div className="bg-white border border-beige p-4 shadow-sm">
          <span className="text-[11px] uppercase tracking-wider text-navy/50 font-mono block">Member Status</span>
          <span className="font-serif text-2xl font-bold text-gold-900 mt-1 block">Fellow</span>
          <span className="text-[11px] text-navy/60">Senior Guild Member</span>
        </div>
      </div>

      <div className="mb-10 bg-ivory-100 border border-beige p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-navy text-gold flex items-center justify-center border border-gold/40 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-semibold">
              NATIONAL DEPOSIT ACCOUNT LINKED
            </div>
            <h4 className="font-serif text-lg font-bold text-navy">
              Account: {pdaAccount ? pdaAccount.accountNumber : 'PDA-MH-12345678-5'}
            </h4>
            <p className="text-xs text-navy/60">
              Auto-fulfillment active with ₹{pdaAccount ? Number(pdaAccount.balance).toLocaleString('en-IN') : '8,450'} deposit balance on file.
            </p>
          </div>
        </div>

        <Link
          to="/pda"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-burgundy text-ivory hover:bg-burgundy-900 transition-colors"
        >
          <span>Manage PDA & Allocations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-navy">My Vault Holdings</h3>
            <p className="text-xs text-navy/60">
              Live items currently owned in your personal archive and persisted in PostgreSQL.
            </p>
          </div>
          <span className="text-xs font-mono bg-ivory-200 border border-beige px-2.5 py-1 text-navy font-semibold">
            {hasActiveFilters ? `${sortedCollection.length} of ${collection.length} Records` : `${collection.length} Records`}
          </span>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-beige p-5 animate-pulse space-y-3">
                <div className="h-40 bg-ivory-200"></div>
                <div className="h-4 bg-ivory-300 w-3/4"></div>
                <div className="h-3 bg-ivory-300 w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="p-8 bg-rose-50 border border-rose-300 text-center max-w-xl mx-auto my-6">
            <AlertCircle className="w-8 h-8 text-rose-700 mx-auto mb-2" />
            <h4 className="font-serif font-bold text-rose-950 mb-1">Unable to Load Vault Records</h4>
            <p className="text-xs text-rose-900 mb-4">{error}</p>
            <Button onClick={loadData} variant="primary" size="sm">
              Retry Sync
            </Button>
          </div>
        )}

        {!loading && !error && collection.length === 0 && (
          <div className="p-12 bg-white border border-dashed border-beige-dark text-center max-w-xl mx-auto my-8">
            <Package className="w-12 h-12 text-gold-700 mx-auto mb-3" />
            <h4 className="font-serif text-xl font-bold text-navy mb-1">Your Philatelic Vault is Empty</h4>
            <p className="text-xs text-navy/60 mb-6 leading-relaxed">
              You have not cataloged any stamp specimens in your personal collection yet. Browse the National Postal Archive to deposit your first rarity.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button to="/stamps" variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                Browse Postal Archive
              </Button>
              <Button onClick={() => setShowAddModal(true)} variant="outline" size="sm">
                Add Stamp Manually
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && collection.length > 0 && (
          <>
            {/* Smart Search & Advanced Filters Bar */}
            <div className="bg-white border border-beige p-4 sm:p-5 mb-6 space-y-4 shadow-sm">
              {/* Row 1: Search Input & Sort Dropdown */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-navy/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search vault by specimen title, year, territory, category, condition..."
                    className="w-full pl-10 pr-9 py-2.5 bg-ivory-50 border border-beige text-xs text-navy placeholder:text-navy/40 focus:outline-none focus:border-burgundy focus:bg-white transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy p-0.5"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="sm:w-72 flex items-center gap-1.5 bg-ivory-50 border border-beige px-3 py-2 text-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-navy/50 shrink-0" />
                  <span className="text-navy/50 shrink-0 font-medium text-[11px] uppercase tracking-wider">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort collection items"
                    className="w-full bg-transparent text-navy font-semibold focus:outline-none cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Secondary Filters & Clear All Button */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-beige/60 text-xs">
                {/* Territory / Country Filter */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-navy/50 mb-1">
                    Territory
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-ivory-50 border border-beige text-navy focus:outline-none focus:border-burgundy text-xs cursor-pointer"
                  >
                    <option value="all">All Territories</option>
                    {availableCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-navy/50 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-ivory-50 border border-beige text-navy focus:outline-none focus:border-burgundy text-xs cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preservation Condition Filter */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-navy/50 mb-1">
                    Condition
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-ivory-50 border border-beige text-navy focus:outline-none focus:border-burgundy text-xs cursor-pointer"
                  >
                    <option value="all">All Conditions</option>
                    {availableConditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Era Filter */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-navy/50 mb-1">
                    Historical Era
                  </label>
                  <select
                    value={selectedEra}
                    onChange={(e) => setSelectedEra(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-ivory-50 border border-beige text-navy focus:outline-none focus:border-burgundy text-xs cursor-pointer"
                  >
                    {ERA_OPTIONS.map((era) => (
                      <option key={era.value} value={era.value}>
                        {era.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Filters Action */}
                <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                    className={`w-full py-1.5 px-3 flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-colors border ${
                      hasActiveFilters
                        ? 'bg-burgundy text-ivory border-burgundy hover:bg-burgundy-900 shadow-sm cursor-pointer'
                        : 'bg-ivory-200 text-navy/40 border-beige cursor-not-allowed opacity-60'
                    }`}
                    title={hasActiveFilters ? 'Reset search and filters' : 'No filters currently applied'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Row 3: Active Filter Badges & Dynamic Holdings Counter */}
              <div className="pt-2 border-t border-beige/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-navy/50 mr-1">Active Filters:</span>
                  {!hasActiveFilters ? (
                    <span className="text-[11px] text-navy/40 italic">None (Displaying entire vault)</span>
                  ) : (
                    <>
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1 bg-burgundy/10 text-burgundy border border-burgundy/30 px-2 py-0.5 text-[11px]">
                          <span>Search: "{searchQuery}"</span>
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="hover:text-burgundy-900"
                            title="Remove search filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedCountry !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-gold/15 text-navy border border-gold/40 px-2 py-0.5 text-[11px]">
                          <span>Territory: {selectedCountry}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedCountry('all')}
                            className="hover:text-rose-700"
                            title="Remove territory filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedCategory !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-navy/10 text-navy border border-navy/20 px-2 py-0.5 text-[11px]">
                          <span>Category: {selectedCategory}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedCategory('all')}
                            className="hover:text-rose-700"
                            title="Remove category filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedCondition !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 text-[11px]">
                          <span>Condition: {selectedCondition}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedCondition('all')}
                            className="hover:text-rose-700"
                            title="Remove condition filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {selectedEra !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-ivory-200 text-navy border border-beige px-2 py-0.5 text-[11px]">
                          <span>Era: {ERA_OPTIONS.find((e) => e.value === selectedEra)?.label}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedEra('all')}
                            className="hover:text-rose-700"
                            title="Remove era filter"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {sortBy !== 'date-desc' && (
                        <span className="inline-flex items-center gap-1 bg-ivory-200 text-navy border border-beige px-2 py-0.5 text-[11px]">
                          <span>Sorted: {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}</span>
                          <button
                            type="button"
                            onClick={() => setSortBy('date-desc')}
                            className="hover:text-rose-700"
                            title="Reset sorting to newest first"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleClearFilters}
                        className="text-[11px] text-burgundy font-semibold hover:underline ml-1"
                      >
                        Reset all
                      </button>
                    </>
                  )}
                </div>

                <div className="text-[11px] font-mono text-navy/70">
                  Showing <strong className="text-navy">{sortedCollection.length}</strong> of{' '}
                  <strong className="text-navy">{collection.length}</strong> records{' '}
                  <span className="text-navy/40">({filteredSpecimensTotal} stamps)</span>
                </div>
              </div>
            </div>

            {/* Filtered Empty State (when collection has items but none match filters) */}
            {sortedCollection.length === 0 ? (
              <div className="p-12 bg-white border border-dashed border-beige-dark text-center max-w-xl mx-auto my-8">
                <div className="w-12 h-12 bg-ivory-200 border border-beige flex items-center justify-center mx-auto mb-3 text-gold-800">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-bold text-navy mb-1">No Matching Vault Specimens Found</h4>
                <p className="text-xs text-navy/60 mb-5 leading-relaxed max-w-md mx-auto">
                  No specimens in your personal collection match the search criteria or active filters. Try adjusting your search query or reset your filters to view all vault holdings.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-burgundy text-ivory hover:bg-burgundy-900 transition-colors shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              /* Holdings Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCollection.map((item) => {
                  const stamp = item.stamp || {};
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-beige p-5 flex flex-col justify-between hover:border-gold hover:shadow-stamp-hover transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-burgundy font-semibold">
                              {stamp.category || 'National Issue'}
                            </span>
                            <h4 className="font-serif text-lg font-bold text-navy leading-snug mt-0.5">
                              {stamp.name || `Specimen #${item.stampId.slice(0, 8)}`}
                            </h4>
                          </div>
                          <span className="bg-ivory-200 border border-beige px-2 py-0.5 text-navy-800 text-[11px] font-mono shrink-0">
                            {stamp.year ? `Year ${stamp.year}` : 'Archival'}
                          </span>
                        </div>

                        <div className="relative aspect-[4/3] bg-ivory-100 border border-beige-dark/50 overflow-hidden mb-4 flex items-center justify-center">
                          {stamp.image ? (
                            <img
                              src={stamp.image}
                              alt={stamp.name || 'Stamp specimen'}
                              className="w-full h-full object-cover filter contrast-[1.03]"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-navy/40 p-4 text-center">
                              <Stamp className="w-10 h-10 mb-1 text-gold" />
                              <span className="text-xs font-serif font-bold text-navy">{stamp.name}</span>
                            </div>
                          )}

                          <div className="absolute bottom-2 right-2 bg-navy text-ivory text-[10px] font-mono px-2 py-0.5 shadow-sm">
                            Qty: {item.quantity}
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-navy/70 border-t border-beige pt-3">
                          <div className="flex justify-between">
                            <span className="text-navy/50">Condition:</span>
                            <span className="font-semibold text-navy">{item.condition}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-navy/50">Territory:</span>
                            <span className="font-medium text-navy">{stamp.country || 'India'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-navy/50">Cataloged On:</span>
                            <span className="font-mono text-[11px]">
                              {new Date(item.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-beige flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Vault Verified</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => setItemToDelete({ id: item.id, name: stamp.name || 'Specimen' })}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 hover:text-rose-900 hover:bg-rose-50 px-2 py-1 transition-colors"
                          title="Deaccession specimen from vault"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{deletingId === item.id ? 'Removing...' : 'Deaccession'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-beige pt-10">
        <h3 className="font-serif text-xl font-bold text-navy mb-4">Curated Albums & Specialized Binders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {albums.map((album, idx) => (
            <div key={idx} className="bg-white border border-beige p-5 flex flex-col justify-between hover:border-gold transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-800 bg-ivory-200 px-2 py-0.5 border border-beige">
                    {album.status}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-navy mt-2 mb-1">{album.title}</h4>
                  <p className="text-xs text-navy/60">{album.count} cataloged specimens with high-res scans.</p>
                </div>
                <div className="w-10 h-10 bg-ivory-200 border border-beige flex items-center justify-center shrink-0">
                  <Stamp className="w-5 h-5 text-burgundy" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-beige flex items-center justify-between text-xs">
                <span className="font-mono text-navy/70">Estimated: <strong className="text-navy-900">{album.value}</strong></span>
                <Link to="/stamps" className="font-semibold text-burgundy hover:underline">
                  Browse Specimens →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold/40 max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-bold block mb-1">
                VAULT DEPOSIT
              </span>
              <h3 className="font-serif text-xl font-bold text-navy">
                Deposit Stamp into Vault
              </h3>
              <p className="text-xs text-navy/60 mt-1">
                Select an existing catalog specimen and record its quantity and physical preservation condition.
              </p>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Catalog Specimen *
                </label>
                {stamps.length > 0 ? (
                  <select
                    required
                    value={formData.stampId}
                    onChange={(e) => setFormData({ ...formData, stampId: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                  >
                    {stamps.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.year}) - {s.category}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-ivory-100 border border-beige text-navy/70 text-xs">
                    No catalog stamps available. Please catalog a stamp first.
                  </div>
                )}
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
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Condition *
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
                    <option>Embossed Seal</option>
                    <option>Historical Cover</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-beige">
                <Button
                  onClick={() => setShowAddModal(false)}
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
                  disabled={submitting || stamps.length === 0}
                >
                  {submitting ? 'Depositing...' : 'Confirm Deposit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold/40 max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setItemToDelete(null)}
              className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono text-rose-800 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>VAULT DEACCESSION CONFIRMATION</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-navy">
                Confirm Deaccession
              </h3>
              <p className="text-xs text-navy/70 mt-2 leading-relaxed">
                Are you sure you want to deaccession <strong className="font-serif text-navy font-bold">"{itemToDelete.name}"</strong> from your private vault?
              </p>
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-900 text-[11px] leading-relaxed">
                This action will permanently delete the specimen record and provenance data from your PostgreSQL archive.
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-beige">
              <Button
                onClick={() => setItemToDelete(null)}
                variant="outline"
                size="md"
                type="button"
                disabled={deletingId === itemToDelete.id}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={async () => {
                  const target = itemToDelete;
                  setItemToDelete(null);
                  await handleDeleteItem(target.id, target.name);
                }}
                disabled={deletingId === itemToDelete.id}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-ivory bg-rose-700 hover:bg-rose-800 transition-colors shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingId === itemToDelete.id ? 'Deaccessioning...' : 'Confirm Deaccession'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
