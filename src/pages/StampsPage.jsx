import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import StampCard from '../components/StampCard';
import { stampApi, collectionApi } from '../services/api';
import { Filter, Search, ArrowLeft, RefreshCw, Plus, X, CheckCircle2, AlertCircle, Eye, Stamp, Calendar, Globe, Tag, Layers, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function StampsPage() {
  const [stamps, setStamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('year-asc');
  const [selectedStamp, setSelectedStamp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    year: '',
    country: 'Republic of India',
    category: 'Commemorative Issue',
    description: '',
    image: '',
  });

  const loadStamps = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await stampApi.getAll();
      setStamps(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to the stamp repository.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStamps();
  }, []);

  const handleAddToCollection = async (stamp) => {
    try {
      setActionMessage({ type: 'info', text: `Adding "${stamp.name}" to your vault...` });
      await collectionApi.add({
        stampId: stamp.id,
        quantity: 1,
        condition: 'Mint Never Hinged',
      });
      setActionMessage({ type: 'success', text: `Specimen "${stamp.name}" successfully cataloged into your private vault!` });
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to add item to your collection.' });
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleCreateStamp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.year || !formData.country || !formData.category || !formData.description) {
      setActionMessage({ type: 'error', text: 'Please fill in all mandatory fields.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await stampApi.create(formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        year: '',
        country: 'Republic of India',
        category: 'Commemorative Issue',
        description: '',
        image: '',
      });
      setImagePreviewError(false);
      setActionMessage({ type: 'success', text: `Archival stamp "${res.data.name}" added to the national catalog!` });
      await loadStamps();
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Failed to create stamp.' });
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(stamps.map((s) => s.category).filter(Boolean)))];

  const filteredStamps = stamps.filter((stamp) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (stamp.category && stamp.category.toLowerCase() === selectedCategory.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (stamp.name && stamp.name.toLowerCase().includes(q)) ||
      (stamp.country && stamp.country.toLowerCase().includes(q)) ||
      (stamp.category && stamp.category.toLowerCase().includes(q)) ||
      (stamp.description && stamp.description.toLowerCase().includes(q)) ||
      String(stamp.year || '').includes(q);

    return matchesCategory && matchesSearch;
  });

  const sortedStamps = [...filteredStamps].sort((a, b) => {
    if (sortBy === 'year-asc') {
      const diff = (Number(a.year) || 0) - (Number(b.year) || 0);
      return diff !== 0 ? diff : (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'year-desc') {
      const diff = (Number(b.year) || 0) - (Number(a.year) || 0);
      return diff !== 0 ? diff : (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'name-asc') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'name-desc') {
      return (b.name || '').localeCompare(a.name || '');
    }
    return 0;
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-xs text-navy/60">
        <Link to="/" className="hover:text-burgundy flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <span className="text-navy font-medium">Postal Archive</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <SectionHeading
            badge="NATIONAL SPECIMEN REPOSITORY"
            title="The Indian Postal Archive"
            subtitle="Explore authenticated postage stamps, error varieties, and historical postal covers spanning 1852 through the modern Republic of India."
            align="left"
            className="mb-0"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadStamps}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy bg-white border border-beige hover:border-gold transition-colors"
            title="Refresh specimens from PostgreSQL database"
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
            Catalog Specimen
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
            ) : actionMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            ) : (
              <RefreshCw className="w-4 h-4 text-burgundy animate-spin shrink-0" />
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

      <div className="mb-6 p-4 bg-white border border-beige flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative w-full sm:w-72 lg:w-80">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, era, country, year, or keyword..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-ivory-100 border border-beige focus:outline-none focus:border-gold text-navy"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <label htmlFor="sort-by-select" className="font-semibold text-navy flex items-center gap-1 text-xs shrink-0 cursor-pointer">
              <ArrowUpDown className="w-3.5 h-3.5 text-gold-900" /> Sort:
            </label>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-2.5 text-xs bg-ivory-100 border border-beige focus:outline-none focus:border-gold text-navy font-medium cursor-pointer"
            >
              <option value="year-asc">Year: Oldest First</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-navy/70 overflow-x-auto pb-1 xl:pb-0">
          <span className="font-semibold text-navy flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-gold-900" /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-[11px] whitespace-nowrap transition-colors border ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-burgundy text-ivory border-burgundy font-semibold'
                  : 'bg-ivory-100 text-navy border-beige hover:bg-ivory-200'
              }`}
            >
              {cat === 'all' ? `All Eras (${stamps.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {!loading && !error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-navy/70 px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-navy">
              Showing {sortedStamps.length} of {stamps.length} {stamps.length === 1 ? 'specimen' : 'specimens'}
            </span>
            {(searchQuery.trim() || selectedCategory !== 'all') && (
              <span className="text-[11px] bg-gold/15 text-navy-900 border border-gold/40 px-2 py-0.5 font-medium">
                Filtered
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono text-navy/60 flex items-center gap-3">
            <span>
              Order: <span className="font-semibold text-navy">
                {sortBy === 'year-asc' && 'Year: Oldest First'}
                {sortBy === 'year-desc' && 'Year: Newest First'}
                {sortBy === 'name-asc' && 'Name: A to Z'}
                {sortBy === 'name-desc' && 'Name: Z to A'}
              </span>
            </span>
            {selectedCategory !== 'all' && (
              <span className="hidden sm:inline">
                Era: <span className="font-semibold text-navy">{selectedCategory}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-white border border-beige p-5 animate-pulse space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-beige">
                <div className="h-3 w-24 bg-ivory-300 rounded"></div>
                <div className="h-3 w-16 bg-ivory-300 rounded"></div>
              </div>
              <div className="h-48 bg-ivory-200 border-2 border-dashed border-beige flex items-center justify-center">
                <Stamp className="w-10 h-10 text-beige-dark/50" />
              </div>
              <div className="h-5 w-3/4 bg-ivory-300 rounded"></div>
              <div className="h-3 w-1/2 bg-ivory-300 rounded"></div>
              <div className="pt-3 border-t border-beige flex justify-between">
                <div className="h-3 w-20 bg-ivory-300 rounded"></div>
                <div className="h-3 w-16 bg-ivory-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="p-8 bg-rose-50 border border-rose-300 text-center max-w-xl mx-auto my-12">
          <AlertCircle className="w-10 h-10 text-rose-700 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-rose-950 mb-1">Archive Connection Notice</h3>
          <p className="text-xs text-rose-900 mb-6 leading-relaxed">{error}</p>
          <Button onClick={loadStamps} variant="primary" size="md">
            Retry Repository Query
          </Button>
        </div>
      )}

      {!loading && !error && sortedStamps.length === 0 && (
        <div className="p-12 bg-white border border-dashed border-beige-dark text-center max-w-xl mx-auto my-10">
          <Stamp className="w-12 h-12 text-gold-700 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-navy mb-1">No Matching Specimens Cataloged</h3>
          <p className="text-xs text-navy/60 mb-6">
            No stamps match your active filter criteria "{searchQuery || selectedCategory}".
          </p>
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            variant="outline"
            size="md"
          >
            Clear Search & Filters
          </Button>
        </div>
      )}

      {!loading && !error && sortedStamps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedStamps.map((stamp) => (
            <StampCard
              key={stamp.id}
              stamp={stamp}
              onExamine={(s) => setSelectedStamp(s)}
              onAddToCollection={handleAddToCollection}
            />
          ))}
        </div>
      )}

      <div className="mt-14 p-8 bg-ivory-100 border border-dashed border-beige-dark text-center max-w-2xl mx-auto">
        <p className="font-serif text-lg text-navy mb-1">Connected to Live PostgreSQL Archive</p>
        <p className="text-xs text-navy/60 leading-relaxed">
          Cataloged entries are queryable and maintained in PostgreSQL with Prisma ORM. Add new archival discoveries or save existing rarities directly into your personal vault.
        </p>
      </div>

      {selectedStamp && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold/40 max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedStamp(null)}
              className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 text-xs font-mono text-gold-900 uppercase tracking-wider">
              <Stamp className="w-4 h-4 text-burgundy" />
              <span>Specimen Dossier • Cat. #{selectedStamp.id.slice(0, 8)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="bg-ivory-100 border border-beige-dark/50 p-4 text-center">
                <div className="aspect-[4/3] bg-white border border-beige overflow-hidden flex items-center justify-center mb-3">
                  {selectedStamp.image ? (
                    <img
                      src={selectedStamp.image}
                      alt={selectedStamp.name}
                      className="w-full h-full object-cover filter contrast-[1.05]"
                    />
                  ) : (
                    <Stamp className="w-16 h-16 text-gold" />
                  )}
                </div>
                <span className="text-[11px] font-mono text-navy/60 block">
                  Original Resolution Proof Scan
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-navy leading-tight mb-1">
                    {selectedStamp.name}
                  </h3>
                  <span className="text-burgundy font-semibold uppercase tracking-wider text-[11px]">
                    {selectedStamp.category}
                  </span>
                </div>

                <div className="space-y-2 border-t border-b border-beige py-3 text-navy/80">
                  <div className="flex items-center justify-between">
                    <span className="text-navy/50 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-900" /> Issue Year:
                    </span>
                    <span className="font-mono font-bold text-navy">{selectedStamp.year}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-navy/50 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gold-900" /> Territory / State:
                    </span>
                    <span className="font-medium text-navy">{selectedStamp.country}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-navy/50 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-gold-900" /> Primary Classification:
                    </span>
                    <span className="font-medium text-navy">{selectedStamp.category}</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-navy block mb-1 uppercase tracking-wider text-[10px]">
                    Historical Monograph & Provenance
                  </span>
                  <p className="text-navy/70 leading-relaxed text-xs">
                    {selectedStamp.description || 'No extended historical description recorded in the national ledger.'}
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <Button
                    onClick={() => {
                      handleAddToCollection(selectedStamp);
                      setSelectedStamp(null);
                    }}
                    variant="primary"
                    size="md"
                    className="w-full text-xs"
                    icon={Plus}
                    iconPosition="left"
                  >
                    Add to My Collection Vault
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold/40 max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-bold block mb-1">
                ARCHIVAL ENROLLMENT
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy">
                Catalog New Stamp Specimen
              </h3>
              <p className="text-xs text-navy/60 mt-1">
                Persist a verified stamp directly into the PostgreSQL database ledger.
              </p>
            </div>

            <form onSubmit={handleCreateStamp} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Stamp Name / Inscription *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1911 First Aerial Post Allahabad"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Year of Issue *
                  </label>
                  <input
                    type="number"
                    required
                    min="1800"
                    max="2030"
                    placeholder="e.g. 1911"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Country / State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. British India"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Archival Category *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aerophilately, Pre-Imperial, Princely States"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Historical Description & Provenance *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Details of print errors, postmarks, watermarks, or commemorative significance..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                  Specimen Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/stamp-scan.jpg"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreviewError(false);
                  }}
                  className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                />

                {formData.image.trim() && (
                  <div className="mt-2.5 p-3 bg-ivory-100 border border-beige flex items-center gap-3">
                    <div className="relative w-16 h-16 bg-white border border-beige overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                      {!imagePreviewError ? (
                        <img
                          src={formData.image.trim()}
                          alt="Specimen live preview"
                          className="w-full h-full object-cover filter contrast-[1.03]"
                          onError={() => setImagePreviewError(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-rose-50 flex flex-col items-center justify-center text-rose-600 p-1 text-center">
                          <AlertCircle className="w-5 h-5 mb-0.5" />
                          <span className="text-[9px] font-mono leading-none">Error</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-navy/60 font-semibold">
                          Live Scan Preview
                        </span>
                        {!imagePreviewError ? (
                          <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5">
                            Valid Image Link
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-1.5 py-0.5">
                            Broken Link
                          </span>
                        )}
                      </div>
                      {!imagePreviewError ? (
                        <p className="text-[11px] text-navy/70 truncate">
                          Specimen image rendered successfully for catalogue.
                        </p>
                      ) : (
                        <p className="text-[11px] text-rose-700 leading-tight">
                          Unable to render scan from this URL. Please verify the link address.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
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
                  disabled={submitting}
                >
                  {submitting ? 'Saving to Database...' : 'Register in Catalogue'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
