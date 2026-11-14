import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { MARKETPLACE_PREVIEW } from '../data/mockData';
import { ShieldCheck, MapPin, Tag, ArrowLeft, Lock, Eye, X, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function MarketplacePage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [inquirySuccess, setInquirySuccess] = useState(null);
  const [inquiryText, setInquiryText] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MARKETPLACE_PREVIEW.map((item) => (
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
