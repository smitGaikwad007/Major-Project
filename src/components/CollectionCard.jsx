import React from 'react';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Archival Collection Card Component
 * Highlights curated philatelic exhibits, historical context, and curator metadata.
 */
export default function CollectionCard({ collection, className = '' }) {
  const {
    id,
    title,
    period,
    curator,
    itemsCount,
    category,
    rarity,
    coverImage,
    description,
    tags,
  } = collection;

  return (
    <article
      className={`group bg-white border border-beige flex flex-col justify-between transition-all duration-300 hover:border-gold hover:shadow-stamp-hover ${className}`}
    >
      <div>
        {/* Cover Image & Category Frame */}
        <div className="relative aspect-[16/9] overflow-hidden bg-ivory-200 border-b border-beige">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

          {/* Period pill */}
          <div className="absolute top-3 left-3 bg-ivory/95 backdrop-blur-sm text-navy px-2.5 py-1 text-xs font-mono font-semibold tracking-wider border border-beige">
            {period}
          </div>

          {/* Category & Item count */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-ivory text-xs">
            <span className="font-semibold text-gold-300 tracking-wide uppercase text-[11px]">
              {category}
            </span>
            <span className="inline-flex items-center gap-1 bg-navy-900/80 px-2 py-0.5 border border-gold/30">
              <Layers className="w-3 h-3 text-gold" />
              <span>{itemsCount} Specimens</span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6">
          <div className="text-[11px] font-sans font-semibold tracking-widest text-burgundy uppercase mb-1.5">
            {rarity}
          </div>

          <h3 className="text-xl font-serif font-semibold text-navy group-hover:text-burgundy transition-colors leading-tight mb-2">
            {title}
          </h3>

          <p className="text-sm text-navy/70 line-clamp-3 leading-relaxed mb-4">
            {description}
          </p>

          {/* Curatorial Attribution */}
          <div className="pt-3 border-t border-beige/60 text-xs text-navy/60 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-gold-800 shrink-0" />
            <span className="truncate">Curated by <strong className="text-navy-900 font-medium">{curator}</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Tags & Link */}
      <div className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6 flex items-center justify-between border-t border-beige/40 mt-2 pt-3">
        <div className="flex flex-wrap gap-1.5">
          {tags?.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] uppercase font-sans tracking-wider bg-ivory-300/70 text-navy-800 px-2 py-0.5 border border-beige"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          to={`/stamps`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy hover:text-navy transition-colors shrink-0 group-hover:translate-x-0.5"
        >
          <span>View Exhibit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
