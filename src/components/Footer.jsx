import React from 'react';
import { Link } from 'react-router-dom';
import { Stamp, Mail, ShieldCheck, MapPin, Award, Compass, ArrowUpRight } from 'lucide-react';
import Button from './Button';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-ivory/80 border-t border-navy-800 relative overflow-hidden font-sans">
      {/* Decorative Postal Stamp Background Mark */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full border-[1.5px] border-dashed border-gold/10 pointer-events-none -mr-32 -mt-20 flex items-center justify-center rotate-45 select-none">
        <span className="text-gold/10 font-serif text-3xl uppercase tracking-[0.3em]">
          Dak Bhavan • Postmark Archive
        </span>
      </div>

      {/* Top Gazette Subscription Banner */}
      <div className="border-b border-navy-800/80 bg-navy-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 bg-burgundy/90 border border-gold/40 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-gold-300" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-ivory font-medium">
                The Philatelist's Gazette
              </h3>
              <p className="text-xs sm:text-sm text-ivory/60 mt-0.5">
                Curated dispatches on rare discoveries, upcoming bourses, and postal research papers.
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to The Philatelist's Gazette!");
            }}
            className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 max-w-md"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              className="bg-navy-950 border border-navy-700 text-ivory text-sm px-4 py-2.5 focus:outline-none focus:border-gold placeholder:text-ivory/40 min-w-[260px]"
            />
            <Button variant="gold" size="md" type="submit" className="shrink-0 text-xs uppercase tracking-wider font-semibold">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand & Headquarters Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-burgundy text-ivory flex items-center justify-center border border-gold/40 relative">
                <Stamp className="w-5 h-5 text-gold-300" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-ivory block leading-none">
                  PHILATELY
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-[0.2em] text-gold-400 mt-1 block">
                  The Collector’s Society
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-ivory/70 leading-relaxed max-w-md">
              The national society and digital repository for philatelists across India. Dedicated to the preservation, scholarly cataloging, and honorable exchange of postal artifacts from 1852 to the modern era.
            </p>

            <div className="space-y-2 text-xs text-ivory/60 pt-2 border-t border-navy-800">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Dak Bhavan & National Philatelic Bureau, Sansad Marg, New Delhi 110001</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold shrink-0" />
                <span>Affiliated with the Philatelic Congress of India (PCI)</span>
              </div>
            </div>
          </div>

          {/* Column 1: Archival Galleries */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4 font-mono">
              Archival Galleries
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li>
                <Link to="/stamps" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Classic British India (1852–1947)</span>
                </Link>
              </li>
              <li>
                <Link to="/stamps" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Princely & Feudatory States</span>
                </Link>
              </li>
              <li>
                <Link to="/stamps" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>1947 Independence Triptych</span>
                </Link>
              </li>
              <li>
                <Link to="/stamps" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Aerophilately & Flown Covers</span>
                </Link>
              </li>
              <li>
                <Link to="/stamps" className="hover:text-gold transition-colors flex items-center justify-between">
                  <span>Republic Commemoratives</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Collector Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4 font-mono">
              Collector Services
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li>
                <Link to="/marketplace" className="hover:text-gold transition-colors">
                  Verified Member Marketplace
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-gold transition-colors">
                  Watermark & Perforation Analysis
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-gold transition-colors">
                  Certificate of Provenance Desk
                </Link>
              </li>
              <li>
                <Link to="/collection" className="hover:text-gold transition-colors">
                  Digital Collection Vault
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-gold transition-colors">
                  National Bourse Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The Society */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 mb-4 font-mono">
              The Society
            </h4>
            <ul className="space-y-2.5 text-xs text-ivory/70">
              <li>
                <Link to="/community" className="hover:text-gold transition-colors">
                  About the Society
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-gold transition-colors">
                  28 Regional State Chapters
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-gold transition-colors">
                  Philatelic Ethics Charter
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gold transition-colors">
                  Apply for Membership
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold transition-colors">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Stamp Cancellation Seal */}
      <div className="border-t border-navy-900 bg-navy-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ivory/50">
          <div>
            © {currentYear} Philately – The Collector’s Society. All rights reserved. Registered Indian Cultural Heritage Guild.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-ivory transition-colors cursor-pointer">Postal Archival Code</span>
            <span className="text-navy-700">•</span>
            <span className="hover:text-ivory transition-colors cursor-pointer">Heritage Terms</span>
            <span className="text-navy-700">•</span>
            <span className="hover:text-ivory transition-colors cursor-pointer">Privacy & Provenance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
