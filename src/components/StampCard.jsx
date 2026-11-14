import React, { useState } from 'react';
import { Stamp, CheckCircle2, Eye, Plus } from 'lucide-react';

export default function StampCard({ stamp, onExamine, onAddToCollection, className = '' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const id = stamp.id;
  const name = stamp.name || 'Unnamed Specimen';
  const issueYear = stamp.issueYear || stamp.year || 'Historic';
  const category = stamp.category || 'National Archive';
  const series = stamp.series || stamp.country || 'India Post';
  const description = stamp.description || '';
  const condition = stamp.condition || 'Archival Specimen';
  const grade = stamp.grade || (stamp.year && stamp.year < 1900 ? 'Rarity AAA' : 'Museum Gem');
  const faceValue = stamp.faceValue || `${issueYear}`;
  const postmark = stamp.postmark || `${stamp.country || 'India'} G.P.O.`;
  const provenance = stamp.provenance || stamp.country;
  const verified = stamp.verified !== false;
  const image = stamp.image;

  return (
    <div
      className={`group bg-white rounded-none border border-beige p-4 sm:p-5 transition-all duration-300 hover:border-gold hover:shadow-stamp-hover relative flex flex-col justify-between ${className}`}
      style={{
        backgroundImage: 'radial-gradient(circle at 100% 100%, #FAF8F3 0%, #FFFFFF 100%)',
      }}
    >
      <div className="flex items-center justify-between text-xs text-navy/60 pb-3 border-b border-beige/60">
        <span className="font-semibold uppercase tracking-wider text-[10px] text-burgundy truncate max-w-[140px]">
          {category}
        </span>
        <span className="font-mono bg-ivory-300/60 px-2 py-0.5 text-navy-800 text-[11px] border border-beige shrink-0">
          Issue {issueYear}
        </span>
      </div>

      <div className="my-4 relative p-3 bg-ivory-100 border border-beige-dark/40 shadow-inner flex items-center justify-center min-h-[220px] overflow-hidden group-hover:border-gold/60 transition-colors">
        <div className="absolute -top-3 -right-3 w-20 h-20 rounded-full border border-burgundy/20 pointer-events-none flex items-center justify-center rotate-12 opacity-60">
          <span className="text-[7px] text-burgundy/40 uppercase tracking-widest text-center px-1">
            {postmark}
          </span>
        </div>

        <div className="relative w-full aspect-[4/3] bg-ivory-50 border-2 border-dashed border-beige-dark/50 p-2 shadow-sm flex items-center justify-center overflow-hidden">
          <div className="absolute top-2 left-2 z-10 bg-navy text-ivory text-[11px] font-serif font-bold px-2 py-0.5 shadow-sm border border-gold/30">
            {faceValue}
          </div>

          <div className="absolute bottom-2 right-2 z-10 bg-burgundy/95 text-ivory text-[10px] font-sans font-medium px-2 py-0.5 shadow-sm">
            {grade}
          </div>

          {image && !imageError ? (
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
              <Stamp className="w-10 h-10 mb-2 text-gold-700" />
              <span className="text-xs font-serif font-bold text-navy line-clamp-1">{name}</span>
              <span className="text-[10px] text-navy/60 font-mono mt-0.5">Circa {issueYear}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          <h3 className="font-serif text-lg font-semibold text-navy group-hover:text-burgundy transition-colors leading-snug line-clamp-1 mb-1">
            {name}
          </h3>
          <p className="text-xs text-navy/70 mb-2 line-clamp-1">
            {series}
          </p>
          {description && (
            <p className="text-[11px] text-navy/60 line-clamp-2 mb-3 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-beige/60 text-xs space-y-1">
          <div className="flex justify-between items-center text-navy/70">
            <span className="text-navy/50 text-[11px]">Condition:</span>
            <span className="font-medium text-navy-800 text-[11px]">{condition}</span>
          </div>

          {provenance && (
            <div className="flex justify-between items-center text-navy/70">
              <span className="text-navy/50 text-[11px]">Provenance:</span>
              <span className="font-medium text-navy-800 text-[11px] truncate max-w-[150px]">{provenance}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between border-t border-beige/40">
          <div className="flex items-center gap-1.5 text-xs text-gold-900 font-medium">
            {verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
            <span className="text-[11px]">Archive Verified</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onAddToCollection && (
              <button
                type="button"
                onClick={() => onAddToCollection(stamp)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy hover:text-burgundy bg-ivory-200 hover:bg-ivory-300 border border-beige px-2 py-1 transition-colors"
                title="Save to My Vault"
              >
                <Plus className="w-3 h-3" />
                <span>Save</span>
              </button>
            )}

            {onExamine && (
              <button
                type="button"
                onClick={() => onExamine(stamp)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-burgundy hover:text-navy hover:bg-ivory-300 py-1 px-2 transition-colors border border-transparent hover:border-beige"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Examine</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
