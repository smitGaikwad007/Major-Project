import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { MARKETPLACE_PREVIEW } from '../data/mockData';
import { ShieldCheck, MapPin, Tag, ArrowLeft, Lock, Eye, X, CheckCircle2, Search, Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function MarketplacePage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [inquirySuccess, setInquirySuccess] = useState(null);
  const [inquiryText, setInquiryText] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setTimeout(() => {
      setInquirySuccess(`Inquiry dispatched to ${selectedItem.seller} under PCI escrow rules.`);
      setSubmittingInquiry(false);
      setInquiryText('');
      setTimeout(() => {
        setInquirySuccess(null);
        setSelectedItem(null);
      }, 3000);
    }, 800);
  };

  const conditions = [
    'all',
    ...Array.from(new Set(MARKETPLACE_PREVIEW.map((item) => item.condition).filter(Boolean))),
  ];

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('default');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCondition !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'default';

  const filteredListings = MARKETPLACE_PREVIEW.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.seller.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      (item.condition && item.condition.toLowerCase().includes(q)) ||
      (item.certificate && item.certificate.toLowerCase().includes(q)) ||
      String(item.issueYear || '').includes(q);

    const matchesCondition =
      selectedCondition === 'all' ||
      (item.condition && item.condition.toLowerCase() === selectedCondition.toLowerCase());

    const parsedMin = minPrice !== '' ? Number(minPrice) : null;
    const matchesMin = parsedMin === null || isNaN(parsedMin) || item.price >= parsedMin;

    const parsedMax = maxPrice !== '' ? Number(maxPrice) : null;
    const matchesMax = parsedMax === null || isNaN(parsedMax) || item.price <= parsedMax;

    return matchesSearch && matchesCondition && matchesMin && matchesMax;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
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
        <span className="text-navy font-medium">Marketplace</span>
      </div>

      <SectionHeading
        badge="CERTIFIED PHILATELIC BOURSE"
        title="Collector's Exchange"
        subtitle="Acquire and trade authenticated Indian postage rarities, first day covers, and postal history specimens under our verified provenance protocol."
        align="left"
      />

      <div className="mb-8 p-4 bg-navy-950 text-ivory flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gold/30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-burgundy flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-gold-300" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ivory">100% Escrow & Authenticity Guarantee</h4>
            <p className="text-xs text-ivory/70">
              Funds are held securely in society escrow until you receive and verify the specimen condition with physical certificate of provenance.
            </p>
          </div>
        </div>
        <Link
          to="/register"
          className="shrink-0 text-xs uppercase tracking-wider font-semibold bg-gold text-navy-950 px-4 py-2 hover:bg-gold-500 transition-colors"
        >
          Accredited Dealer Status
        </Link>
      </div>

      <div className="mb-6 p-4 sm:p-5 bg-white border border-beige shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exchange by title, seller, location, certificate, or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-ivory-100 border border-beige focus:outline-none focus:border-gold text-navy"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
                title="Clear search text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <label htmlFor="marketplace-sort" className="font-semibold text-navy flex items-center gap-1 text-xs shrink-0 cursor-pointer">
              <ArrowUpDown className="w-3.5 h-3.5 text-gold-900" /> Sort:
            </label>
            <select
              id="marketplace-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-2.5 text-xs bg-ivory-100 border border-beige focus:outline-none focus:border-gold text-navy font-medium cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between pt-3 border-t border-beige/60">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-navy flex items-center gap-1 shrink-0">
              <Tag className="w-3.5 h-3.5 text-gold-900" /> Price (₹):
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                step="5000"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-2.5 py-1.5 text-xs font-mono bg-ivory-100 border border-beige focus:outline-none focus:border-gold text-navy"
              />
              <span className="text-navy/40 font-mono">–</span>
              <input
                type="number"
                min="0"
                step="5000"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-2.5 py-1.5 text-xs font-mono bg-ivory-100 border border-beige focus:outline-none focus:border-gold text-navy"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-burgundy hover:text-navy hover:underline px-2 py-1 transition-colors"
                title="Reset all search, price, and sort filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-navy/70 overflow-x-auto pb-1 lg:pb-0">
            <span className="font-semibold text-navy flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-gold-900" /> Condition:
            </span>
            {conditions.map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setSelectedCondition(cond)}
                className={`px-2.5 py-1 text-[11px] whitespace-nowrap transition-colors border ${
                  selectedCondition.toLowerCase() === cond.toLowerCase()
                    ? 'bg-burgundy text-ivory border-burgundy font-semibold'
                    : 'bg-ivory-100 text-navy border-beige hover:bg-ivory-200'
                }`}
              >
                {cond === 'all' ? 'All Conditions' : cond}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-xs text-navy/70 px-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-navy">
            Showing {sortedListings.length} of {MARKETPLACE_PREVIEW.length} {MARKETPLACE_PREVIEW.length === 1 ? 'listing' : 'listings'}
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] bg-gold/15 text-navy-900 border border-gold/40 px-2 py-0.5 font-medium">
              Filtered
            </span>
          )}
        </div>

        <div className="text-[11px] font-mono text-navy/60 flex items-center gap-3">
          {sortBy !== 'default' && (
            <span>
              Order: <span className="font-semibold text-navy">
                {sortBy === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
              </span>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span>
              Price Range: <span className="font-semibold text-navy">
                ₹{minPrice ? Number(minPrice).toLocaleString('en-IN') : '0'} – {maxPrice ? `₹${Number(maxPrice).toLocaleString('en-IN')}` : 'Any'}
              </span>
            </span>
          )}
        </div>
      </div>

      {sortedListings.length === 0 ? (
        <div className="p-12 bg-white border border-dashed border-beige-dark text-center max-w-xl mx-auto my-10">
          <Tag className="w-12 h-12 text-gold-700 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-navy mb-1">No Matching Exchange Listings</h3>
          <p className="text-xs text-navy/60 mb-6 leading-relaxed">
            No philatelic rarities match your active price constraints or filter parameters. Try adjusting your minimum/maximum budget or clearing filters.
          </p>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            size="md"
          >
            Clear Filters & View All
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedListings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-beige p-4 flex flex-col justify-between hover:border-gold hover:shadow-stamp-hover transition-all"
            >
              <div>
                <div className="relative aspect-square bg-ivory-100 overflow-hidden border border-beige/60 mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover filter contrast-[1.03]"
                  />
                  <span className="absolute top-2 left-2 bg-navy text-ivory text-[10px] font-mono px-2 py-0.5">
                    Year {item.issueYear}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-ivory/95 text-navy-900 text-[10px] font-semibold px-2 py-0.5 border border-beige shadow-sm">
                    {item.condition}
                  </span>
                </div>

                <div className="text-[11px] font-sans font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.badge}</span>
                </div>

                <h3 className="font-serif text-base font-semibold text-navy leading-snug line-clamp-2 mb-2">
                  {item.title}
                </h3>

                <div className="text-xs text-navy/60 space-y-1 mb-3">
                  <div className="truncate font-medium text-navy-800">{item.seller}</div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-navy/40 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-beige flex items-center justify-between mt-2">
                <div>
                  <span className="text-[9px] text-navy/50 uppercase block font-mono">Asking Price</span>
                  <span className="font-serif text-lg font-bold text-burgundy">{item.formattedPrice}</span>
                </div>
                <Button
                  onClick={() => setSelectedItem(item)}
                  variant="outline"
                  size="sm"
                  className="text-xs px-3"
                >
                  Inquire
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-14 p-8 bg-ivory-100 border border-dashed border-beige-dark text-center max-w-xl mx-auto">
        <p className="font-serif text-lg text-navy mb-1">Physical Bourses Scheduled Bi-Weekly</p>
        <p className="text-xs text-navy/60 leading-relaxed">
          In addition to our digital escrow exchange, physical tables are held on the first Sunday of every month across Kolkata, Mumbai, and New Delhi GPOs.
        </p>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gold/40 max-w-md w-full p-6 relative shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-gold-900 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>PCI Escrow Acquisition Request</span>
            </div>

            <h3 className="font-serif text-xl font-bold text-navy mb-1">
              {selectedItem.title}
            </h3>

            <div className="text-xs text-navy/70 mb-4 pb-3 border-b border-beige">
              <div>Seller: <strong className="text-navy">{selectedItem.seller}</strong> ({selectedItem.location})</div>
              <div>Certificate: <strong className="text-burgundy">{selectedItem.certificate}</strong></div>
              <div>Price: <strong className="font-serif text-base text-navy">{selectedItem.formattedPrice}</strong></div>
            </div>

            {inquirySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{inquirySuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-navy uppercase tracking-wider text-[10px] mb-1">
                    Your Inscription / Condition Query
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    placeholder="Inquire regarding hinge marks, margin margins, or request additional digital microscopy..."
                    className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <Button
                    onClick={() => setSelectedItem(null)}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={submittingInquiry}
                  >
                    {submittingInquiry ? 'Dispatching...' : 'Submit Escrow Inquiry'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
