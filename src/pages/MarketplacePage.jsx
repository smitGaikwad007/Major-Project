import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { MARKETPLACE_PREVIEW } from '../data/mockData';
import { ShieldCheck, MapPin, Star, Tag, ArrowLeft, Lock } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function MarketplacePage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
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

      {/* Escrow banner */}
      <div className="mb-8 p-4 bg-navy-950 text-ivory flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gold/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-burgundy flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-gold-300" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ivory">100% Escrow & Authenticity Guarantee</h4>
            <p className="text-xs text-ivory/70">
              Funds are held securely until you receive and verify the specimen condition with your certificate of provenance.
            </p>
          </div>
        </div>
        <Button variant="gold" size="sm" className="shrink-0 text-xs uppercase tracking-wider">
          Sell a Specimen
        </Button>
      </div>

      {/* Listings Grid */}
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
                <span className="absolute bottom-2 right-2 bg-ivory text-navy-900 text-[10px] font-semibold px-2 py-0.5 border border-beige shadow-sm">
                  {item.condition}
                </span>
              </div>

              <div className="text-[11px] font-sans font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{item.badge}</span>
              </div>

              <h4 className="font-serif text-base font-semibold text-navy leading-snug line-clamp-2 mb-2">
                {item.title}
              </h4>

              <div className="text-xs text-navy/60 space-y-1 mb-3">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-navy-800">{item.seller}</span>
                  <span className="text-navy/40">•</span>
                  <span className="flex items-center text-gold-900 font-semibold">
                    <Star className="w-3 h-3 fill-gold text-gold mr-0.5" />
                    {item.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-navy/40" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-beige flex items-center justify-between mt-2">
              <div>
                <span className="text-[10px] text-navy/50 uppercase block font-mono">Asking Price</span>
                <span className="font-serif text-lg font-bold text-burgundy">{item.formattedPrice}</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Inquire
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
