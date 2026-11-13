import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Editorial Section Heading Component
 * Features serif typography, muted gold flourishes, and optional archival action links.
 */
export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = 'center',
  actionText,
  actionLink,
  className = '',
}) {
  const isCentered = align === 'center';

  return (
    <div className={`mb-12 md:mb-16 ${isCentered ? 'text-center' : 'text-left'} ${className}`}>
      {/* Eyebrow / Category badge */}
      {badge && (
        <div className={`inline-flex items-center gap-2 mb-3.5 ${isCentered ? 'justify-center' : 'justify-start'}`}>
          <span className="w-6 h-[1px] bg-gold"></span>
          <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-gold-800 font-sans">
            {badge}
          </span>
          <span className="w-6 h-[1px] bg-gold"></span>
        </div>
      )}

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-navy tracking-tight font-medium leading-[1.18]">
        {title}
      </h2>

      {/* Philatelic Ornamental Divider */}
      <div className={`flex items-center gap-3 my-4 ${isCentered ? 'justify-center' : 'justify-start'}`}>
        <div className="w-12 h-[1px] bg-beige-dark"></div>
        <div className="w-2 h-2 rotate-45 border border-gold bg-ivory"></div>
        <div className="w-12 h-[1px] bg-beige-dark"></div>
      </div>

      {/* Subtitle / Description & Action Link */}
      <div className={`flex flex-col ${isCentered ? 'items-center' : 'items-start'} max-w-2xl ${isCentered ? 'mx-auto' : ''}`}>
        {subtitle && (
          <p className="text-base sm:text-lg text-navy/70 leading-relaxed font-sans font-normal">
            {subtitle}
          </p>
        )}

        {actionText && actionLink && (
          <div className="mt-4">
            <Link
              to={actionLink}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy hover:text-navy transition-colors group"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
