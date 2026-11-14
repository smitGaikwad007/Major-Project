import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { COMMUNITY_PILLARS, TESTIMONIALS } from '../data/mockData';
import { Users, Calendar, Award, MessageSquare, ArrowLeft, ArrowRight, Search, MapPin, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function CommunityPage() {
  const [searchChapter, setSearchChapter] = useState('');

  const chapters = [
    { name: "Bengal Philatelic Association", city: "Kolkata, West Bengal", members: 2150, year: 1949, meetingDay: "First Saturday of Month" },
    { name: "South India Philatelic Association (SIPA)", city: "Chennai, Tamil Nadu", members: 1840, year: 1956, meetingDay: "Second Sunday of Month" },
    { name: "Delhi Philatelists Circle", city: "New Delhi (Dak Bhavan)", members: 3200, year: 1962, meetingDay: "Every Alternate Sunday" },
    { name: "Gujarat Philatelic Association", city: "Ahmedabad, Gujarat", members: 1450, year: 1974, meetingDay: "Third Saturday of Month" },
    { name: "Bombay Philatelic Guild", city: "Mumbai (Fort GPO)", members: 2900, year: 1938, meetingDay: "First Sunday of Month" },
    { name: "Karnataka Postal Heritage Circle", city: "Bengaluru, Karnataka", members: 1120, year: 1982, meetingDay: "Last Saturday of Month" },
  ];

  const filteredChapters = chapters.filter(
    (c) =>
      c.name.toLowerCase().includes(searchChapter.toLowerCase()) ||
      c.city.toLowerCase().includes(searchChapter.toLowerCase())
  );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {COMMUNITY_PILLARS.map((pillar) => (
          <div key={pillar.number} className="bg-white border border-beige p-6 relative flex flex-col justify-between">
            <div>
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
          </div>
        ))}
      </div>

      <div className="mb-16 bg-white border border-beige p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-beige">
          <div>
            <h3 className="font-serif text-2xl font-bold text-navy">Affiliated Regional Chapters</h3>
            <p className="text-xs text-navy/60">Find local meets, bourses, and postal symposiums in your state circle.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by city or circle..."
              value={searchChapter}
              onChange={(e) => setSearchChapter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-ivory-50 border border-beige focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-ivory-100 text-navy uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3 border-b border-beige">Chapter Name</th>
                <th className="p-3 border-b border-beige">Circle Headquarters</th>
                <th className="p-3 border-b border-beige">Guild Members</th>
                <th className="p-3 border-b border-beige">Convening Schedule</th>
                <th className="p-3 border-b border-beige">Charter Year</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige">
              {filteredChapters.map((ch, idx) => (
                <tr key={idx} className="hover:bg-ivory-50 transition-colors">
                  <td className="p-3 font-semibold text-navy flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-gold-900 shrink-0" />
                    <span>{ch.name}</span>
                  </td>
                  <td className="p-3 text-navy/80">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-navy/40" />
                      {ch.city}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-medium">{ch.members.toLocaleString('en-IN')} Fellows</td>
                  <td className="p-3 text-navy/70">{ch.meetingDay}</td>
                  <td className="p-3 font-mono text-navy/60">{ch.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-beige p-8 sm:p-10 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-semibold block mb-1">
            VOICES OF THE SOCIETY
          </span>
          <h3 className="font-serif text-2xl font-bold text-navy">
            Curatorial Fellows on Record
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-beige">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className={`${idx !== 0 ? 'md:pl-8 pt-6 md:pt-0' : ''} flex flex-col justify-between`}>
              <blockquote className="font-serif italic text-base text-navy/85 leading-relaxed mb-4">
                "{t.quote}"
              </blockquote>
              <div className="pt-3 border-t border-beige/60">
                <div className="font-serif font-bold text-sm text-navy">{t.author}</div>
                <div className="text-xs text-navy/60">{t.affiliation} • {t.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
