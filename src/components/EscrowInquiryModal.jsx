import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Button from './Button';

export default function EscrowInquiryModal({ item, onClose }) {
  const [inquiryText, setInquiryText] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  if (!item) return null;

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setTimeout(() => {
      setInquirySuccess(`Inquiry dispatched to ${item.seller} under PCI escrow rules.`);
      setSubmittingInquiry(false);
      setInquiryText('');
      setTimeout(() => {
        setInquirySuccess(null);
        onClose();
      }, 3000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border-2 border-gold/40 max-w-md w-full p-6 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1 transition-colors"
          aria-label="Close inquiry modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-xs font-mono text-gold-900 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>PCI Escrow Acquisition Request</span>
        </div>

        <h3 className="font-serif text-xl font-bold text-navy mb-1 leading-snug">
          {item.title}
        </h3>

        <div className="text-xs text-navy/70 mb-4 pb-3 border-b border-beige space-y-1">
          <div>
            Seller: <strong className="text-navy">{item.seller}</strong> ({item.location})
          </div>
          {item.certificate && (
            <div>
              Certificate: <strong className="text-burgundy">{item.certificate}</strong>
            </div>
          )}
          <div>
            Price: <strong className="font-serif text-base text-navy">{item.formattedPrice}</strong>
          </div>
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
                className="w-full px-3 py-2 bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy text-navy"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                onClick={onClose}
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
  );
}
