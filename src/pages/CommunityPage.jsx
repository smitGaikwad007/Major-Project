import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { COMMUNITY_PILLARS, TESTIMONIALS } from '../data/mockData';
import { Users, Calendar, Award, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function CommunityPage() {
  const chapters = [
    { name: "Bengal Philatelic Association", city: "Kolkata", members: 2150, year: 1949 },
    { name: "South India Philatelic Association (SIPA)", city: "Chennai", members: 1840, year: 1956 },
    { name: "Delhi Philatelists Circle", city: "New Delhi", members: 3200, year: 1962 },
    { name: "Gujarat Philatelic Association", city: "Ahmedabad", members: 1450, year: 1974 },
    { name: "Bombay Philatelic Guild", city: "Mumbai", members: 2900, year: 1938 },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-navy/60">
        <Link to="/" className="hover:text-burgundy flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <span className="text-navy font-medium">Community Circles</span>
      </div>

      <SectionHeading
        badge="THE NATIONAL FELLOWSHIP"
        title="India's Philatelic Guild & Circles"
        subtitle="Bringing together historians, amateur hobbyists, and master numismatists across 28 states to preserve our country’s postal heritage."
        align="left"
      />

      {/* 4 Pillars of Community */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {COMMUNITY_PILLARS.map((pillar) => (
          <div key={pillar.number} className="bg-white border border-beige p-6 relative">
            <span className="font-mono text-3xl font-bold text-gold/30 absolute top-4 right-4">
              {pillar.number}
            </span>
            <div className="text-xs uppercase font-mono tracking-widest text-burgundy font-semibold mb-2">
              {pillar.highlight}
            </div>
            <h3 className="text-xl font-serif font-bold text-navy mb-2">
              {pillar.title}
            </h3>
            <p className="text-sm text-navy/70 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

      {/* Regional Chapters Table */}
      <div className="mb-16 bg-white border border-beige p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-beige">
          <div>
            <h3 className="font-serif text-2xl font-bold text-navy">Affiliated Regional Chapters</h3>
            <p className="text-xs text-navy/60">Find local meets, bourses, and postal symposiums in your state.</p>
          </div>
          <Button variant="outline" size="sm" to="/register">
            Register Your Chapter
          </Button>
        </div>

        <div className="divide-y divide-beige/70">
          {chapters.map((chapter, i) => (
            <div key={i} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-serif text-base font-semibold text-navy">{chapter.name}</h4>
                <span className="text-xs text-navy/60">{chapter.city} • Established {chapter.year}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-navy/70 font-mono">{chapter.members} Verified Members</span>
                <span className="text-burgundy font-semibold hover:underline cursor-pointer flex items-center gap-1">
                  View Chapter Roster <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="p-6 bg-ivory-200 border-l-4 border-burgundy">
            <p className="font-serif italic text-base text-navy-900 mb-4 leading-relaxed">
              "{t.quote}"
            </p>
            <div>
              <div className="font-semibold text-sm text-navy">{t.author}</div>
              <div className="text-xs text-navy/60">{t.affiliation}, {t.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
