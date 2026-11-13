import React, { useState } from 'react';
import { Award, Stamp, CheckCircle2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * StampCard Component
 * Renders an archival stamp specimen with realistic philatelic borders,
 * perforation styling, denomination badges, and postmark marks.
 */
export default function StampCard({ stamp, className = '' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    name,
    series,
    issueYear,
    faceValue,
    category,
    condition,
    grade,
    image,
    postmark,
    provenance,
    verified,
  } = stamp;

  return (
    <div
      className={`group bg-white rounded-none border border-beige p-4 sm:p-5 transition-all duration-300 hover:border-gold hover:shadow-stamp-hover relative flex flex-col justify-between ${className}`}
      style={{
        backgroundImage: 'radial-gradient(circle at 100% 100%, #FAF8F3 0%, #FFFFFF 100%)',
      }}
    >
      {/* Top Meta Header: Category and Issue Year */}
      <div className="flex items-center justify-between text-xs text-navy/60 pb-3 border-b border-beige/60">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-burgundy">
          {category}
        </span>
        <span className="font-mono bg-ivory-300/60 px-2 py-0.5 text-navy-800 text-[11px] border border-beige">
          Issue {issueYear}
        </span>
      </div>

      {/* Stamp Mount Container with Perforated / Archival Frame */}
      <div className="my-4 relative p-3 bg-ivory-100 border border-beige-dark/40 shadow-inner flex items-center justify-center min-h-[220px] overflow-hidden group-hover:border-gold/60 transition-colors">
        {/* Subtle postal cancellation watermark overlay */}
        <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full border border-burgundy/20 pointer-events-none flex items-center justify-center rotate-12 opacity-60">
          <span className="text-[7px] text-burgundy/40 uppercase tracking-widest text-center px-1">
            {postmark || 'POSTAL CANCELLATION'}
          </span>
        </div>

        {/* Perforated Stamp Inner Plate */}
        <div className="relative w-full aspect-[4/3] bg-ivory-50 border-2 border-dashed border-beige-dark/50 p-2 shadow-sm flex items-center justify-center overflow-hidden">
          {/* Denomination / Face Value Pill */}
          <div className="absolute top-2 left-2 z-10 bg-navy text-ivory text-[11px] font-serif font-bold px-2 py-0.5 shadow-sm border border-gold/30">
            {faceValue}
          </div>

          {/* Condition / Grade Badge */}
          <div className="absolute bottom-2 right-2 z-10 bg-burgundy/95 text-ivory text-[10px] font-sans font-medium px-2 py-0.5 shadow-sm">
            {grade}
          </div>

          {/* Stamp Artwork Image with Fallback */}
          {!imageError ? (
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover filter contrast-[1.04] sepia-[0.08] transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-ivory-200 flex flex-col items-center justify-center text-navy/40 p-3 text-center">
              <Stamp className="w-8 h-8 mb-1 text-gold" />
              <span className="text-[11px] font-serif font-semibold">{name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          <h3 className="font-serif text-lg font-semibold text-navy group-hover:text-burgundy transition-colors leading-snug line-clamp-1 mb-1">
            {name}
          </h3>
          <p className="text-xs text-navy/70 mb-3 line-clamp-1">
            {series}
          </p>
        </div>

        <div className="pt-3 border-t border-beige/60 text-xs space-y-1.5">
          <div className="flex justify-between items-center text-navy/70">
            <span className="text-navy/50">Condition:</span>
            <span className="font-medium text-navy-800">{condition}</span>
          </div>

          {provenance && (
            <div className="flex justify-between items-center text-navy/70">
              <span className="text-navy/50">Provenance:</span>
              <span className="font-medium text-navy-800 truncate max-w-[150px]">{provenance}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 flex items-center justify-between border-t border-beige/40">
          <div className="flex items-center gap-1.5 text-xs text-gold-900 font-medium">
            {verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
            <span className="text-[11px]">Archive Verified</span>
          </div>

          <Link
            to={`/stamps`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy hover:text-navy transition-colors py-1 px-2 hover:bg-ivory-300"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Examine</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
