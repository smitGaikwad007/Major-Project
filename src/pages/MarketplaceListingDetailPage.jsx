import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MARKETPLACE_PREVIEW } from '../data/mockData';
import {
  ShieldCheck,
  MapPin,
  Tag,
  ArrowLeft,
  Lock,
  Eye,
  CheckCircle2,
  Calendar,
  Globe,
  Award,
  Stamp,
  Star,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import Button from '../components/Button';
import EscrowInquiryModal from '../components/EscrowInquiryModal';

export default function MarketplaceListingDetailPage() {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [activeTab, setActiveTab] = useState('monograph');

  // Scroll to top whenever listing ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveImageIndex(0);
    setImageErrors({});
  }, [id]);

  const listing = MARKETPLACE_PREVIEW.find((item) => String(item.id) === String(id));

  // Handle Invalid / Not Found ID
  if (!listing) {
    return (
      <div className="min-h-[75vh] py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-ivory-200 border-2 border-dashed border-beige-dark flex items-center justify-center mb-6">
          <Tag className="w-10 h-10 text-gold-700/60" />
        </div>

        <span className="text-[11px] font-mono uppercase tracking-widest text-burgundy font-semibold mb-2">
          Archival Registry
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-3">
          Specimen Listing Not Found
        </h1>

        <p className="text-sm text-navy/70 leading-relaxed max-w-md mb-8">
          The exchange listing with catalog reference <code className="font-mono font-bold bg-ivory-300 px-2 py-0.5 border border-beige text-navy">{id}</code> could not be located in the bourse ledger. It may have been completed, deaccessioned, or temporarily withdrawn.
        </p>

        <Button
          to="/marketplace"
          variant="primary"
          size="md"
          icon={ArrowLeft}
          iconPosition="left"
        >
          Return to Exchange Marketplace
        </Button>
      </div>
    );
  }

  const galleryImages =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images
      : [listing.image];

  const currentPrimaryImage = galleryImages[activeImageIndex] || listing.image;

  const otherListings = MARKETPLACE_PREVIEW.filter(
    (item) => String(item.id) !== String(listing.id)
  ).slice(0, 3);

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs text-navy/60 mb-6 font-mono uppercase tracking-wider"
        >
          <Link to="/" className="hover:text-burgundy transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-burgundy transition-colors">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold truncate max-w-xs sm:max-w-md">
            {listing.title}
          </span>
        </nav>

        {/* Back Link Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-xs font-semibold text-burgundy hover:text-navy transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Exchange Marketplace</span>
          </Link>

          <span className="font-mono text-[11px] text-navy/50 bg-white border border-beige px-2.5 py-1">
            Ref. #{listing.id.toUpperCase()}
          </span>
        </div>

        {/* Top Escrow Safety Banner */}
        <div className="mb-8 p-3.5 sm:p-4 bg-navy-950 text-ivory flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-gold/40 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-burgundy flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-gold-300" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-ivory block">
                Dak Bhavan Escrow & Provenance Guaranteed
              </span>
              <span className="text-ivory/70 text-[11px]">
                Funds held in certified trust until physical inspection and certificate verification.
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider font-semibold text-gold-400 bg-navy-900 px-2.5 py-1 border border-gold/30">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            <span>Escrow Eligible</span>
          </span>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
          {/* Left Column: Image Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Display Frame */}
            <div className="bg-white border-2 border-beige-dark/60 p-4 sm:p-6 shadow-sm relative overflow-hidden group">
              <div className="aspect-[4/3] bg-ivory-100 border border-beige/60 overflow-hidden relative flex items-center justify-center shadow-inner">
                {/* Vintage Postmark Ornament Overlay */}
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border border-burgundy/15 pointer-events-none flex items-center justify-center rotate-12 opacity-70">
                  <span className="text-[9px] text-burgundy/40 uppercase tracking-widest text-center px-2">
                    {listing.seller} • PCI Escrow
                  </span>
                </div>

                {/* Primary Image or Fallback */}
                {!imageErrors[activeImageIndex] && currentPrimaryImage ? (
                  <img
                    src={currentPrimaryImage}
                    alt={`${listing.title} - View ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover filter contrast-[1.04] sepia-[0.04] transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={() => handleImageError(activeImageIndex)}
                  />
                ) : (
                  <div className="w-full h-full bg-ivory-200 flex flex-col items-center justify-center text-navy/40 p-6 text-center">
                    <Stamp className="w-16 h-16 mb-2 text-gold-700/60" />
                    <span className="font-serif font-bold text-navy text-sm">{listing.title}</span>
                    <span className="text-xs text-navy/60 font-mono mt-1">Archival Scan Preview</span>
                  </div>
                )}

                {/* Year Badge */}
                <div className="absolute top-3 left-3 bg-navy text-ivory text-xs font-mono font-bold px-2.5 py-1 shadow-sm border border-gold/30">
                  Circa {listing.issueYear}
                </div>

                {/* Condition Badge */}
                <div className="absolute bottom-3 right-3 bg-burgundy/95 text-ivory text-xs font-sans font-medium px-2.5 py-1 shadow-sm">
                  {listing.condition}
                </div>
              </div>

              {/* Watermark notice */}
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-navy/50">
                <span>Proof Scan • 1200 DPI Chromatic Scale</span>
                <span>Image {activeImageIndex + 1} of {galleryImages.length}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 bg-white border-2 shrink-0 overflow-hidden transition-all p-1 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-burgundy ring-2 ring-gold/50 shadow-md'
                        : 'border-beige hover:border-gold/60 opacity-75 hover:opacity-100'
                    }`}
                    aria-label={`Select image angle ${idx + 1}`}
                  >
                    {!imageErrors[idx] ? (
                      <img
                        src={imgUrl}
                        alt={`Thumbnail angle ${idx + 1}`}
                        className="w-full h-full object-cover filter contrast-[1.02]"
                        onError={() => handleImageError(idx)}
                      />
                    ) : (
                      <div className="w-full h-full bg-ivory-200 flex items-center justify-center text-[10px] text-navy/40 font-mono">
                        View {idx + 1}
                      </div>
                    )}
                    {activeImageIndex === idx && (
                      <div className="absolute inset-x-0 bottom-0 bg-burgundy text-ivory text-[9px] font-mono text-center py-0.5">
                        Active
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details, Pricing, Escrow & Inquire (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-burgundy font-mono">
                  {listing.category || 'Historical Postal Cover'}
                </span>
                <span className="text-navy/30">•</span>
                <span className="font-mono text-navy/60 text-xs">
                  {listing.country || 'Republic of India'}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight mb-3">
                {listing.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{listing.badge || 'PCI Certified Genuine'}</span>
              </div>
            </div>

            {/* Price & Primary Call to Action Box */}
            <div className="bg-white border-2 border-gold/40 p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-baseline justify-between border-b border-beige pb-3">
                <div>
                  <span className="text-[10px] font-mono text-navy/50 uppercase tracking-wider block">
                    Asking Exchange Price
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-burgundy leading-none">
                    {listing.formattedPrice}
                  </span>
                </div>

                <span className="text-xs font-mono text-navy/60 bg-ivory-200 px-2 py-1 border border-beige">
                  INR Escrow
                </span>
              </div>

              <p className="text-xs text-navy/70 leading-relaxed">
                Includes insured courier transit, physical certificate inspection window, and complete escrow protection.
              </p>

              <Button
                onClick={() => setShowInquiryModal(true)}
                variant="primary"
                size="lg"
                className="w-full text-xs sm:text-sm tracking-wider uppercase font-semibold py-3.5 shadow-md"
              >
                Inquire About This Stamp
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-navy/60 font-mono text-center">
                <Lock className="w-3.5 h-3.5 text-gold-700" />
                <span>Zero Buyer Commission • Backed by PCI Charter</span>
              </div>
            </div>

            {/* Seller Dossier Card */}
            <div className="bg-white border border-beige p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-semibold block">
                Accredited Member Dossier
              </span>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-navy leading-tight">
                    {listing.seller}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-navy/60 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-navy/40 shrink-0" />
                    <span>{listing.location}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-navy bg-gold/15 border border-gold/40 px-2 py-0.5">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span>{listing.rating || '4.95'}</span>
                  </div>
                  <span className="block text-[10px] font-mono text-navy/50 mt-0.5">
                    {listing.dealsCount || 42} Exchanges
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-beige text-[11px] text-navy/70 space-y-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Member in good standing of the National Philatelic Bureau</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Verified identity and authenticated postal depository</span>
                </div>
              </div>
            </div>

            {/* Quick Spec Matrix */}
            <div className="bg-ivory-100 border border-beige p-4 text-xs space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-navy/50 font-semibold block mb-1">
                Specimen Ledger Details
              </span>

              <div className="flex justify-between py-1 border-b border-beige/60">
                <span className="text-navy/50 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-900" /> Issue Year:
                </span>
                <span className="font-mono font-bold text-navy">{listing.issueYear}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-beige/60">
                <span className="text-navy/50 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-gold-900" /> Territory:
                </span>
                <span className="font-medium text-navy">{listing.country || 'Republic of India'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-beige/60">
                <span className="text-navy/50 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-gold-900" /> Condition:
                </span>
                <span className="font-medium text-navy">{listing.condition}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-navy/50 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-gold-900" /> Certificate:
                </span>
                <span className="font-medium text-burgundy truncate max-w-[200px]">
                  {listing.certificate || 'PCI Verified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Monograph, Certificate, Escrow Process */}
        <div className="bg-white border border-beige p-6 sm:p-8 mb-14 shadow-sm">
          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-2 border-b border-beige pb-4 mb-6 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('monograph')}
              className={`px-4 py-2 font-semibold transition-colors border ${
                activeTab === 'monograph'
                  ? 'bg-burgundy text-ivory border-burgundy'
                  : 'bg-ivory-100 text-navy border-beige hover:bg-ivory-200'
              }`}
            >
              Historical Monograph
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certificate')}
              className={`px-4 py-2 font-semibold transition-colors border ${
                activeTab === 'certificate'
                  ? 'bg-burgundy text-ivory border-burgundy'
                  : 'bg-ivory-100 text-navy border-beige hover:bg-ivory-200'
              }`}
            >
              Certificate & Authenticity
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('escrow')}
              className={`px-4 py-2 font-semibold transition-colors border ${
                activeTab === 'escrow'
                  ? 'bg-burgundy text-ivory border-burgundy'
                  : 'bg-ivory-100 text-navy border-beige hover:bg-ivory-200'
              }`}
            >
              PCI Escrow Protection
            </button>
          </div>

          {/* Tab 1: Monograph */}
          {activeTab === 'monograph' && (
            <div className="space-y-4 text-xs sm:text-sm text-navy/80 leading-relaxed max-w-4xl">
              <h3 className="font-serif text-xl font-bold text-navy">
                Archival Historical Record
              </h3>
              <p>
                {listing.description ||
                  'This verified philatelic specimen has been cataloged under the archival accession guidelines of the Dak Bhavan Philatelic Guild. Preserved in exceptional condition with period postmarks and paper characteristics verified by accredited experts.'}
              </p>
              {listing.provenance && (
                <div className="p-4 bg-ivory-100 border-l-4 border-gold text-xs space-y-1">
                  <span className="font-bold text-navy uppercase font-mono tracking-wider block">
                    Recorded Provenance
                  </span>
                  <p className="text-navy/70">{listing.provenance}</p>
                </div>
              )}
              {listing.conditionDetails && (
                <div className="p-4 bg-ivory-100 border-l-4 border-burgundy text-xs space-y-1">
                  <span className="font-bold text-navy uppercase font-mono tracking-wider block">
                    Condition Assessment
                  </span>
                  <p className="text-navy/70">{listing.conditionDetails}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Certificate */}
          {activeTab === 'certificate' && (
            <div className="space-y-4 text-xs sm:text-sm text-navy/80 leading-relaxed max-w-4xl">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-burgundy" />
                <h3 className="font-serif text-xl font-bold text-navy">
                  Authenticity Verification Record
                </h3>
              </div>
              <p>
                {listing.certificateDetails ||
                  `Certified authentic under ${listing.certificate}. Authenticity has been documented in member exchange registries and complies with Philatelic Congress of India verification standards.`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-ivory-100 border border-beige">
                  <span className="font-mono text-[10px] text-navy/50 uppercase block">
                    Issuing Authority
                  </span>
                  <span className="font-semibold text-navy text-xs sm:text-sm mt-0.5 block">
                    {listing.certificate || 'PCI Expert Committee'}
                  </span>
                </div>
                <div className="p-4 bg-ivory-100 border border-beige">
                  <span className="font-mono text-[10px] text-navy/50 uppercase block">
                    Verification Standard
                  </span>
                  <span className="font-semibold text-emerald-800 text-xs sm:text-sm mt-0.5 block">
                    100% Genuine Provenance Guaranteed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Escrow */}
          {activeTab === 'escrow' && (
            <div className="space-y-4 text-xs sm:text-sm text-navy/80 leading-relaxed max-w-4xl">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-5 h-5 text-gold-900" />
                <h3 className="font-serif text-xl font-bold text-navy">
                  PCI Buyer Escrow & Security Protocol
                </h3>
              </div>
              <p>
                {listing.escrowProtection ||
                  'Every transaction through the Collector Exchange is governed by strict escrow covenants designed to safeguard philatelists against error misrepresentations, hidden repairs, or courier loss.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-2">
                <div className="p-4 bg-ivory-100 border border-beige space-y-1">
                  <span className="font-mono text-gold-900 font-bold text-xs block">01. Escrow Lock</span>
                  <p className="text-xs text-navy/70">
                    Your acquisition funds remain locked in the official Dak Bhavan escrow account until delivery.
                  </p>
                </div>
                <div className="p-4 bg-ivory-100 border border-beige space-y-1">
                  <span className="font-mono text-gold-900 font-bold text-xs block">02. Insured Transit</span>
                  <p className="text-xs text-navy/70">
                    Dispatched in tamper-evident sealed packaging with full postal insurance coverage.
                  </p>
                </div>
                <div className="p-4 bg-ivory-100 border border-beige space-y-1">
                  <span className="font-mono text-gold-900 font-bold text-xs block">03. 7-Day Inspection</span>
                  <p className="text-xs text-navy/70">
                    Examine paper, watermark, and certificate in person. Payout to seller releases only upon approval.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other Rarities in the Bourse */}
        {otherListings.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-gold-900 font-semibold block">
                  Curated Philatelic Exchange
                </span>
                <h3 className="font-serif text-2xl font-bold text-navy">
                  More Rarities Available in the Bourse
                </h3>
              </div>

              <Link
                to="/marketplace"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy hover:text-navy transition-colors group"
              >
                <span>View Full Exchange</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherListings.map((item) => (
                <Link
                  key={item.id}
                  to={`/marketplace/listing/${item.id}`}
                  className="bg-white border border-beige p-4 flex flex-col justify-between hover:border-gold hover:shadow-stamp-hover transition-all group"
                >
                  <div>
                    <div className="relative aspect-square bg-ivory-100 overflow-hidden border border-beige/60 mb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover filter contrast-[1.03] transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 bg-navy text-ivory text-[10px] font-mono px-2 py-0.5">
                        Year {item.issueYear}
                      </span>
                    </div>

                    <h4 className="font-serif text-sm font-semibold text-navy group-hover:text-burgundy transition-colors line-clamp-2 mb-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="text-xs text-navy/60 mb-2 truncate">
                      {item.seller} • {item.location}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-beige flex items-center justify-between mt-2">
                    <span className="font-serif text-base font-bold text-burgundy">
                      {item.formattedPrice}
                    </span>
                    <span className="text-xs font-semibold text-navy group-hover:text-burgundy inline-flex items-center gap-1">
                      <span>Examine</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Escrow Inquiry Modal Integration */}
      {showInquiryModal && (
        <EscrowInquiryModal
          item={listing}
          onClose={() => setShowInquiryModal(false)}
        />
      )}
    </div>
  );
}
