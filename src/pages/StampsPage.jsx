import React from 'react';
import SectionHeading from '../components/SectionHeading';
import StampCard from '../components/StampCard';
import { RECENT_STAMPS } from '../data/mockData';
import { Filter, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StampsPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-navy/60">
        <Link to="/" className="hover:text-burgundy flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <span className="text-navy font-medium">Postal Archive</span>
      </div>

      <SectionHeading
        badge="NATIONAL SPECIMEN REPOSITORY"
        title="The Indian Postal Archive"
        subtitle="Explore over 52,000 cataloged stamps, error varieties, and historical postal covers spanning 1852 through the modern Republic of India."
        align="left"
      />

      {/* Filter / Search mock bar */}
      <div className="mb-10 p-4 bg-white border border-beige flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by issue year, dynasty, state, face value..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-ivory-100 border border-beige focus:outline-none focus:border-gold"
            readOnly
            value="Ex: Scinde Dawk, Jai Hind, Travancore..."
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-navy/70 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="font-semibold text-navy flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gold-800" /> Filter:
          </span>
          <span className="px-2.5 py-1 bg-burgundy text-ivory text-[11px]">All Eras (6)</span>
          <span className="px-2.5 py-1 bg-ivory-200 text-navy text-[11px] border border-beige">Pre-Imperial</span>
          <span className="px-2.5 py-1 bg-ivory-200 text-navy text-[11px] border border-beige">Princely States</span>
          <span className="px-2.5 py-1 bg-ivory-200 text-navy text-[11px] border border-beige">Republic 1947+</span>
        </div>
      </div>

      {/* Grid of Stamps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {RECENT_STAMPS.map((stamp) => (
          <StampCard key={stamp.id} stamp={stamp} />
        ))}
      </div>

      <div className="mt-14 p-8 bg-ivory-100 border border-dashed border-beige-dark text-center max-w-xl mx-auto">
        <p className="font-serif text-lg text-navy mb-1">Full Search & High-Resolution Microscopy Coming Soon</p>
        <p className="text-xs text-navy/60">
          The archive indexing team at Dak Bhavan is actively uploading 4,000+ new high-resolution scans for the 2026 National Philatelic Exhibition.
        </p>
      </div>
    </div>
  );
}
