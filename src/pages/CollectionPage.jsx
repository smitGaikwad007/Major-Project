import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { Archive, Plus, FolderOpen, Award, ArrowLeft, Stamp, Shield, Landmark, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function CollectionPage() {
  const albums = [
    { title: "Dominion & Early Republic (1947–1955)", count: 24, value: "₹1,85,000", status: "PCI Verified" },
    { title: "Princely States of Kerala (Travancore & Cochin)", count: 18, value: "₹92,000", status: "Watermark Verified" },
    { title: "Indian Aerophilately & Flown Envelopes", count: 9, value: "₹1,45,000", status: "Historical Grade" },
    { title: "Archaeological Series of 1949", count: 16, value: "₹34,000", status: "Cataloged" },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-xs text-navy/60">
        <Link to="/" className="hover:text-burgundy flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
        <span>/</span>
        <span className="text-navy font-medium">My Vault</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <SectionHeading
            badge="COLLECTOR'S PRIVATE REPOSITORY"
            title="My Philatelic Vault"
            subtitle="Manage your personal stamp albums, digital certificates of authenticity, and provenance records."
            align="left"
            className="mb-0"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button to="/pda" variant="outline" size="sm" icon={Landmark} iconPosition="left">
            PDA Standing Orders
          </Button>
          <Button to="/pda" variant="primary" size="sm" icon={ShieldCheck} iconPosition="left">
            Verify Stamp Serial
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-beige p-4">
          <span className="text-[11px] uppercase tracking-wider text-navy/50 font-mono block">Vault Specimens</span>
          <span className="font-serif text-2xl font-bold text-navy mt-1 block">67 Stamps</span>
          <span className="text-[11px] text-emerald-700 font-medium">Across 4 Bindings</span>
        </div>
        <div className="bg-white border border-beige p-4">
          <span className="text-[11px] uppercase tracking-wider text-navy/50 font-mono block">Estimated Appraisal</span>
          <span className="font-serif text-2xl font-bold text-burgundy mt-1 block">₹4,56,000</span>
          <span className="text-[11px] text-navy/60">Standard Guild Rate</span>
        </div>
        <div className="bg-white border border-beige p-4">
          <span className="text-[11px] uppercase tracking-wider text-navy/50 font-mono block">PCI Certificates</span>
          <span className="font-serif text-2xl font-bold text-navy mt-1 block">51 Issued</span>
          <span className="text-[11px] text-emerald-700 font-medium">76% Vault Verified</span>
        </div>
        <div className="bg-white border border-beige p-4">
          <span className="text-[11px] uppercase tracking-wider text-navy/50 font-mono block">Member Status</span>
          <span className="font-serif text-2xl font-bold text-gold-900 mt-1 block">Fellow</span>
          <span className="text-[11px] text-navy/60">Senior Guild Member</span>
        </div>
      </div>

      <div className="mb-10 bg-ivory-100 border border-beige p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-navy text-gold flex items-center justify-center border border-gold/40 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-gold-900 font-semibold">
              NATIONAL DEPOSIT ACCOUNT LINKED
            </div>
            <h4 className="font-serif text-lg font-bold text-navy">Account: PDA-MH-0018492-3</h4>
            <p className="text-xs text-navy/60">
              Auto-fulfillment enabled for Commemorative Mint Stamps, FDCs, and Miniature Sheets with ₹8,450 balance.
            </p>
          </div>
        </div>

        <Link
          to="/pda"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-burgundy text-ivory hover:bg-burgundy-900 transition-colors"
        >
          <span>Manage PDA & Allocations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <h3 className="font-serif text-xl font-bold text-navy mb-4">Curated Albums & Binders</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {albums.map((album, idx) => (
          <div key={idx} className="bg-white border border-beige p-5 flex flex-col justify-between hover:border-gold transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-800 bg-ivory-200 px-2 py-0.5 border border-beige">
                  {album.status}
                </span>
                <h4 className="font-serif text-lg font-bold text-navy mt-2 mb-1">{album.title}</h4>
                <p className="text-xs text-navy/60">{album.count} cataloged specimens with high-res scans.</p>
              </div>
              <div className="w-10 h-10 bg-ivory-200 border border-beige flex items-center justify-center shrink-0">
                <Stamp className="w-5 h-5 text-burgundy" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-beige flex items-center justify-between text-xs">
              <span className="font-mono text-navy/70">Estimated: <strong className="text-navy-900">{album.value}</strong></span>
              <span className="font-semibold text-burgundy hover:underline cursor-pointer">Open Binder →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
