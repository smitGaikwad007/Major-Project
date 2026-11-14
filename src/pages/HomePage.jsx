import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stamp,
  Award,
  ShieldCheck,
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Layers,
  MapPin,
  ExternalLink,
  Lock,
  Landmark,
} from 'lucide-react';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import StampCard from '../components/StampCard';
import CollectionCard from '../components/CollectionCard';
import {
  SOCIETY_INFO,
  SOCIETY_STATS,
  FEATURED_COLLECTIONS,
  RECENT_STAMPS,
  MARKETPLACE_PREVIEW,
  COMMUNITY_PILLARS,
  TESTIMONIALS,
} from '../data/mockData';
import postmarkSvg from '../assets/postmark-stamp.svg';


export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredStamps =
    activeCategory === 'all'
      ? RECENT_STAMPS
      : RECENT_STAMPS.filter((s) =>
          s.category.toLowerCase().includes(activeCategory.toLowerCase())
        );

  return (
    <div className="space-y-20 lg:space-y-28 pb-16">
      
      
      <section className="relative pt-8 sm:pt-14 pb-16 lg:pb-24 overflow-hidden border-b border-beige">
        
        <div className="absolute inset-0 bg-grid-ivory pointer-events-none opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            
            <div className="lg:col-span-7 space-y-6">
              
              
              <div className="inline-flex items-center gap-2.5 bg-ivory-100 border border-beige px-3.5 py-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-burgundy"></span>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-navy-800 font-semibold">
                  National Philatelic Guild of India • Estd. 1897
                </span>
              </div>

              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-navy font-medium tracking-tight leading-[1.08]">
                Every Stamp <br />
                <span className="italic font-normal text-burgundy">Tells a Story.</span>
              </h1>

              
              <p className="text-base sm:text-lg text-navy/75 leading-relaxed font-sans max-w-xl">
                From the brittle red sealing-wax of the 1852 Scinde Dawk to the triumphant 1947 Jai Hind series, we curate and protect India’s living postal heritage. Connect with over 14,000 verified collectors, examine rare varieties under archival microscopy, and preserve history.
              </p>

              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Button
                  to="/stamps"
                  variant="primary"
                  size="lg"
                  className="font-serif tracking-wide text-base px-7 shadow-sm"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Explore Postal Archive
                </Button>
                <Button
                  to="/register"
                  variant="outline"
                  size="lg"
                  className="font-medium text-sm px-6 bg-white/70"
                >
                  Join the Society
                </Button>
              </div>

              
              <div className="pt-6 border-t border-beige/80 flex flex-wrap items-center gap-6 text-xs text-navy/70">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>Affiliated with Philatelic Congress of India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold-800 shrink-0" />
                  <span>Dak Bhavan Archival Standards</span>
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-5 relative flex justify-center">
              
              
              <div className="absolute -top-10 -left-10 w-36 h-36 pointer-events-none hidden sm:block -rotate-12 opacity-85 z-20">
                <img src={postmarkSvg} alt="First Day of Issue Postmark" className="w-full h-full" />
              </div>


              
              <div className="w-full max-w-md bg-white border border-beige p-5 sm:p-7 shadow-stamp hover:shadow-stamp-hover transition-all duration-300 relative">
                
                
                <div className="flex items-center justify-between pb-3 border-b border-beige text-xs">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-burgundy font-semibold">
                    Specimen Highlight
                  </span>
                  <span className="bg-ivory-200 border border-beige px-2 py-0.5 text-navy-800 text-[11px] font-mono">
                    Cat. #IN-1947-01
                  </span>
                </div>

                
                <div className="my-5 p-4 bg-ivory-100 border border-beige-dark/60 shadow-inner relative overflow-hidden">
                  
                  
                  <div className="absolute top-4 left-4 z-10 bg-navy text-ivory text-xs font-serif font-bold px-2.5 py-1 border border-gold/40 shadow-sm">
                    3½ Annas
                  </div>

                  
                  <div className="relative aspect-[4/3] bg-white border-2 border-dashed border-beige-dark/60 overflow-hidden flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
                      alt="1947 Jai Hind Tri-Colour Flag Issue"
                      className="w-full h-full object-cover filter contrast-[1.05] sepia-[0.1]"
                    />

                    
                    <div className="absolute right-3 bottom-3 w-20 h-20 rounded-full border-2 border-dashed border-burgundy/40 flex items-center justify-center rotate-12 pointer-events-none">
                      <div className="text-[8px] text-center font-mono text-burgundy/60 leading-tight font-bold">
                        DAK BHAVAN<br />★ 1947 ★<br />ARCHIVE
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-navy">
                      1947 Jai Hind National Flag
                    </h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 font-semibold">
                      Authenticity Grade 98
                    </span>
                  </div>

                  <p className="text-xs text-navy/70 leading-relaxed">
                    Issued on 15 December 1947 for domestic postage. Printed at India Security Press, Nasik, bearing the National Tricolour and the stirring inscription <em className="font-serif text-burgundy font-semibold">"जय हिन्द"</em>.
                  </p>

                  <div className="pt-3 border-t border-beige flex items-center justify-between text-xs">
                    <span className="text-navy/50 font-mono">Curator's Choice</span>
                    <Link
                      to="/stamps"
                      className="text-burgundy font-semibold hover:text-navy flex items-center gap-1 group"
                    >
                      <span>Inspect Specimen</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-950 text-ivory border border-gold/30 p-8 sm:p-12 relative overflow-hidden shadow-sm">
          
          
          <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full border border-gold/10 pointer-events-none flex items-center justify-center rotate-12">
            <Stamp className="w-32 h-32 text-gold/5" />
          </div>

          <div className="relative">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-2">
                NATIONAL REGISTRY & ARCHIVE DATA
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-ivory">
                The Scale of Indian Postal Heritage
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-navy-800">
              {SOCIETY_STATS.map((stat, idx) => (
                <div key={idx} className={`pt-6 sm:pt-0 ${idx !== 0 ? 'sm:pl-8' : ''} text-center sm:text-left`}>
                  <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gold tracking-tight mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-ivory mb-1 font-sans">
                    {stat.label}
                  </div>
                  <div className="text-xs text-ivory/60 leading-normal">
                    {stat.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-beige p-8 sm:p-12 lg:p-16 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2">
                <span className="w-5 h-[1px] bg-burgundy"></span>
                <span className="text-[11px] font-mono tracking-widest text-burgundy font-semibold uppercase">
                  A Living Chronicle Since 1852
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy leading-tight">
                Guardians of India's Postal Legacy & Princely Archives
              </h2>

              <p className="text-sm sm:text-base text-navy/75 leading-relaxed">
                Before adhesive stamps, foot runners known as <em>Harkaras</em> carried royal decrees across rugged mountain passes and monsoon-swollen rivers. With the arrival of the 1852 Scinde Dawk and the 1854 lithographed issues printed in Calcutta, India pioneered modern postal communication across Asia.
              </p>

              <p className="text-sm sm:text-base text-navy/75 leading-relaxed">
                Over 600 Princely States maintained their own feudatory postal networks—like Travancore’s sacred conch-marked Anchel system and Hyderabad’s Nizam post. The Collector’s Society was established to protect these fragile artifacts from international dispersion, creating an open scholarly haven for every Indian philatelist.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Button to="/community" variant="primary" size="md">
                  Learn About Our Mission
                </Button>
                <Link
                  to="/stamps"
                  className="text-xs font-semibold text-navy hover:text-burgundy underline underline-offset-4"
                >
                  Explore Princely State Issues
                </Link>
              </div>
            </div>

            
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-ivory-100 border border-beige p-5">
                <div className="w-10 h-10 bg-burgundy/10 border border-burgundy/30 flex items-center justify-center mb-3">
                  <Stamp className="w-5 h-5 text-burgundy" />
                </div>
                <h4 className="font-serif text-base font-bold text-navy mb-1.5">
                  1852 Scinde Dawk
                </h4>
                <p className="text-xs text-navy/70 leading-relaxed">
                  The first adhesive postage stamp in all of Asia, embossed under Sir Bartle Frere into brittle red sealing wafers.
                </p>
              </div>

              <div className="bg-ivory-100 border border-beige p-5">
                <div className="w-10 h-10 bg-gold/20 border border-gold/50 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-gold-900" />
                </div>
                <h4 className="font-serif text-base font-bold text-navy mb-1.5">
                  1854 Inverted Head
                </h4>
                <p className="text-xs text-navy/70 leading-relaxed">
                  One of the world’s very first bi-color stamps and India’s premier lithographic triumph printed at the Surveyor General’s office.
                </p>
              </div>

              <div className="bg-ivory-100 border border-beige p-5">
                <div className="w-10 h-10 bg-navy/10 border border-navy/30 flex items-center justify-center mb-3">
                  <Compass className="w-5 h-5 text-navy" />
                </div>
                <h4 className="font-serif text-base font-bold text-navy mb-1.5">
                  1911 First Aerial Post
                </h4>
                <p className="text-xs text-navy/70 leading-relaxed">
                  World’s inaugural airmail flight from Allahabad to Naini across the sacred confluence of the Ganga and Yamuna.
                </p>
              </div>

              <div className="bg-ivory-100 border border-beige p-5">
                <div className="w-10 h-10 bg-emerald-900/10 border border-emerald-800/30 flex items-center justify-center mb-3">
                  <Award className="w-5 h-5 text-emerald-800" />
                </div>
                <h4 className="font-serif text-base font-bold text-navy mb-1.5">
                  1947 Jai Hind Triptych
                </h4>
                <p className="text-xs text-navy/70 leading-relaxed">
                  The sacred trio celebrating free India: the Ashoka Lion Capital, the National Tiranga, and the Douglas DC-4 aircraft.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      
      <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="CURATED EXHIBITS & MONOGRAPHS"
          title="Featured Stamp Collections"
          subtitle="Scholarly compilations assembled by senior fellows of the Society, complete with postal cancels, paper varieties, and historical monographs."
          actionText="Explore all curated collections"
          actionLink="/stamps"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURED_COLLECTIONS.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>


      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-5 h-[1px] bg-gold"></span>
              <span className="text-[11px] font-mono tracking-widest text-gold-900 uppercase font-semibold">
                DAK BHAVAN REPOSITORY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-navy font-bold tracking-tight">
              Recently Cataloged Specimens
            </h2>
            <p className="text-sm text-navy/70 mt-1 max-w-xl">
              Fresh additions from regional state archives, verified collector estates, and the National Philatelic Museum.
            </p>
          </div>

          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 transition-colors font-medium ${
                activeCategory === 'all'
                  ? 'bg-burgundy text-ivory font-semibold'
                  : 'bg-white text-navy border border-beige hover:bg-ivory-200'
              }`}
            >
              All Eras ({RECENT_STAMPS.length})
            </button>
            <button
              onClick={() => setActiveCategory('Pre-Imperial')}
              className={`px-3 py-1.5 transition-colors font-medium ${
                activeCategory === 'Pre-Imperial'
                  ? 'bg-burgundy text-ivory font-semibold'
                  : 'bg-white text-navy border border-beige hover:bg-ivory-200'
              }`}
            >
              Pre-Imperial
            </button>
            <button
              onClick={() => setActiveCategory('Classic British')}
              className={`px-3 py-1.5 transition-colors font-medium ${
                activeCategory === 'Classic British'
                  ? 'bg-burgundy text-ivory font-semibold'
                  : 'bg-white text-navy border border-beige hover:bg-ivory-200'
              }`}
            >
              Classic India
            </button>
            <button
              onClick={() => setActiveCategory('Republic')}
              className={`px-3 py-1.5 transition-colors font-medium ${
                activeCategory === 'Republic'
                  ? 'bg-burgundy text-ivory font-semibold'
                  : 'bg-white text-navy border border-beige hover:bg-ivory-200'
              }`}
            >
              Republic 1947+
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStamps.map((stamp) => (
            <StampCard key={stamp.id} stamp={stamp} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            to="/stamps"
            variant="outline"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            className="font-medium bg-white"
          >
            Access Full Archive Database (52,000+ Items)
          </Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-ivory border-2 border-gold/40 p-8 sm:p-12 relative overflow-hidden shadow-vintage">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-[1px] bg-gold"></span>
                <span className="text-[11px] font-mono tracking-widest text-gold-400 uppercase font-semibold">
                  DAK BHAVAN NATIONAL INITIATIVE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-ivory font-bold tracking-tight mb-3">
                National Philately Deposit Account & Modulo-11 Verifier
              </h2>
              <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed mb-6">
                Overcoming regional access bottlenecks and ensuring transparent nationwide fulfillment with India Post Modulo-11 checksum verification, fair modular allotment for limited stamp releases, and automatic standing orders.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs border-t border-ivory/15 pt-5 mb-6">
                <div>
                  <span className="text-gold-400 font-bold block text-sm">Modulo-11 Checksum</span>
                  <span className="text-ivory/60 text-[11px]">Instant Fake Detection</span>
                </div>
                <div>
                  <span className="text-gold-400 font-bold block text-sm">Modular Allotment</span>
                  <span className="text-ivory/60 text-[11px]">Fair Limited Drops</span>
                </div>
                <div>
                  <span className="text-gold-400 font-bold block text-sm">National PDA Card</span>
                  <span className="text-ivory/60 text-[11px]">Auto Dispatch FDCs & Mint</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  to="/pda"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-gold hover:bg-gold-500 text-navy-950 font-bold border-gold-400"
                >
                  Access National PDA Portal
                </Button>
                <Link
                  to="/pda"
                  className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory/80 hover:text-gold transition-colors"
                >
                  Verify Stamp Provenance →
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-auto shrink-0 bg-navy-950/80 border border-gold/30 p-6 max-w-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-ivory/10 pb-3">
                <div className="w-9 h-9 bg-burgundy flex items-center justify-center border border-gold/40">
                  <Landmark className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-gold-400 uppercase tracking-widest">Active National PDA</div>
                  <div className="font-mono text-xs text-ivory font-bold">PDA-MH-0018492-3</div>
                </div>
              </div>
              <div className="text-xs space-y-2 text-ivory/70">
                <div className="flex justify-between">
                  <span>Circle:</span>
                  <span className="text-ivory font-mono">Maharashtra (Mumbai GPO)</span>
                </div>
                <div className="flex justify-between">
                  <span>Check Algorithm:</span>
                  <span className="text-emerald-400 font-mono">Verhoeff D₅ Valid</span>
                </div>
                <div className="flex justify-between">
                  <span>Standing Order:</span>
                  <span className="text-ivory font-mono">Mint / FDC / Miniature</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-ivory/10">
                  <span>Archival Grade:</span>
                  <span className="text-gold-300 font-mono">Dak Bhavan Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-100 border border-beige p-6 sm:p-10 lg:p-12">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-beige">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="w-5 h-[1px] bg-burgundy"></span>
                <span className="text-[11px] font-mono tracking-widest text-burgundy font-semibold uppercase">
                  VERIFIED COLLECTOR BOURSE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif text-navy font-bold tracking-tight">
                Marketplace Preview: Authentic Acquisitions
              </h2>
              <p className="text-sm text-navy/70 mt-1 max-w-xl">
                Trade with accredited members backed by physical certificate verification and third-party escrow.
              </p>
            </div>

            <Button
              to="/marketplace"
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="text-xs uppercase tracking-wider"
            >
              Enter The Bourse
            </Button>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MARKETPLACE_PREVIEW.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-beige p-4 flex flex-col justify-between hover:border-gold hover:shadow-stamp-hover transition-all group"
              >
                <div>
                  <div className="relative aspect-square bg-ivory-200 overflow-hidden border border-beige/60 mb-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover filter contrast-[1.02] group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-navy text-ivory text-[10px] font-mono px-2 py-0.5">
                      Issue {item.issueYear}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-ivory/95 text-navy-900 text-[10px] font-semibold px-2 py-0.5 border border-beige shadow-sm">
                      {item.condition}
                    </span>
                  </div>

                  <div className="text-[11px] font-sans font-semibold text-emerald-800 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.badge}</span>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-navy leading-snug line-clamp-2 mb-2 group-hover:text-burgundy transition-colors">
                    {item.title}
                  </h3>

                  <div className="text-xs text-navy/60 space-y-1 mb-3">
                    <div className="truncate font-medium text-navy-800">{item.seller}</div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-navy/40 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-beige flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[9px] text-navy/50 uppercase block font-mono">Asking Price</span>
                    <span className="font-serif text-lg font-bold text-burgundy">{item.formattedPrice}</span>
                  </div>
                  <Button to="/marketplace" variant="outline" size="sm" className="text-xs px-3">
                    Inquire
                  </Button>
                </div>
              </div>
            ))}
          </div>

          
          <div className="mt-8 pt-6 border-t border-beige flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy/70">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold-800 shrink-0" />
              <span>Full Escrow Protection: Funds released only after recipient physical inspection.</span>
            </div>
            <Link to="/marketplace" className="text-burgundy font-semibold hover:underline">
              Review Society Exchange Regulations →
            </Link>
          </div>

        </div>
      </section>


      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="FELLOWSHIP & COGNITIVE HERITAGE"
          title="The National Philatelic Fraternity"
          subtitle="A vibrant network connecting local collector clubs from Kolkata's historic lanes to Bombay’s Fort district and Bengaluru's modern archives."
          align="center"
        />

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {COMMUNITY_PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-white border border-beige p-6 relative flex flex-col justify-between hover:border-gold hover:shadow-stamp-hover transition-all"
            >
              <div>
                <span className="font-mono text-3xl font-bold text-gold/30 block mb-3">
                  {pillar.number}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-burgundy font-semibold block mb-1.5">
                  {pillar.highlight}
                </span>
                <h3 className="text-lg font-serif font-bold text-navy mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-navy/70 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-beige/60 mt-4">
                <Link
                  to="/community"
                  className="text-xs font-semibold text-burgundy hover:text-navy flex items-center gap-1 group"
                >
                  <span>Explore Circle</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        
        <div className="bg-white border border-beige p-8 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-semibold block mb-1">
              VOICES OF THE SOCIETY
            </span>
            <h3 className="font-serif text-2xl font-bold text-navy">
              Words from Veteran Curators
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

      </section>


      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-burgundy text-ivory border border-burgundy-900 p-8 sm:p-12 lg:p-16 relative overflow-hidden text-center shadow-lg">
          
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-ivory/10 pointer-events-none flex items-center justify-center">
            <Stamp className="w-72 h-72 text-ivory/5" />
          </div>

          <div className="relative max-w-2xl mx-auto space-y-5">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-300 font-semibold block">
              ADMISSION TO THE GUILD
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ivory tracking-tight">
              Join India's Most Distinguished Postal Society
            </h2>

            <p className="text-sm sm:text-base text-ivory/80 leading-relaxed font-sans">
              Whether you are an aspiring hobbyist curating modern first day covers or a seasoned philatelist safeguarding rare 19th-century feudatory covers, there is an honored place for you in our fellowship.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                to="/register"
                variant="gold"
                size="lg"
                className="font-serif text-base px-8 shadow"
              >
                Apply for Fellowship
              </Button>
              <Button
                to="/stamps"
                variant="outline"
                size="lg"
                className="border-ivory/40 text-ivory hover:bg-ivory hover:text-navy text-sm px-6"
              >
                Browse Specimen Archive
              </Button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
