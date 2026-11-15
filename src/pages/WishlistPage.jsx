import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import StampCard from '../components/StampCard';
import Button from '../components/Button';
import { stampApi, collectionApi } from '../services/api';
import { useWishlist } from '../utils/wishlist';
import {
  Heart,
  Stamp,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Globe,
  Tag,
  Plus,
  Loader2,
} from 'lucide-react';

export default function WishlistPage() {
  const {
    wishlistStamps,
    count,
    isWishlisted,
    toggleWishlist,
    updateWishlistStampData,
  } = useWishlist();

  const [selectedStamp, setSelectedStamp] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Background sync with PostgreSQL/API archive if running, to enrich specimens
  useEffect(() => {
    let isMounted = true;
    stampApi
      .getAll()
      .then((res) => {
        if (!isMounted) return;
        const stamps = res?.data || res?.stamps || (Array.isArray(res) ? res : []);
        if (Array.isArray(stamps) && stamps.length > 0) {
          updateWishlistStampData(stamps);
        }
      })
      .catch(() => {
        // Safe: Wishlist is completely standalone and persisted in localStorage
      });

    return () => {
      isMounted = false;
    };
  }, [updateWishlistStampData]);

  const handleAddToCollection = async (stamp) => {
    try {
      setActionMessage({ type: 'info', text: `Adding "${stamp.name}" to your vault...` });
      await collectionApi.add({
        stampId: stamp.id,
        quantity: 1,
        condition: 'Mint Never Hinged',
      });
      setActionMessage({
        type: 'success',
        text: `Specimen "${stamp.name}" successfully cataloged into your private vault!`,
      });
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to add item to your collection.',
      });
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-navy/50 mb-8 font-mono uppercase tracking-wider">
          <Link to="/" className="hover:text-burgundy transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/stamps" className="hover:text-burgundy transition-colors">
            Postal Archive
          </Link>
          <span>/</span>
          <span className="text-navy/80">My Wishlist</span>
        </div>

        {/* Page heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <SectionHeading
            badge="COLLECTOR WISHLIST"
            title="Saved Specimens"
            subtitle="Stamps bookmarked for acquisition, research, and future vault accession."
            align="left"
            className="mb-0"
          />

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-end pb-1">
            <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-1.5 shadow-sm">
              <Heart className={`w-3.5 h-3.5 ${count > 0 ? 'fill-rose-600 text-rose-600' : 'text-rose-400'}`} />
              {count} {count === 1 ? 'Specimen' : 'Specimens'} Saved
            </span>

            <Link
              to="/stamps"
              className="inline-flex items-center gap-1.5 bg-white border border-beige hover:border-gold text-xs font-semibold px-3 py-1.5 text-navy transition-colors shadow-sm"
            >
              <Stamp className="w-3.5 h-3.5 text-gold-900" />
              <span>Browse Archive</span>
            </Link>
          </div>
        </div>

        {/* Action feedback banner */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 border text-xs flex items-center justify-between ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : actionMessage.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-ivory-100 border-gold/40 text-navy'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : actionMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-burgundy animate-spin shrink-0" />
              )}
              <span className="font-medium">{actionMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionMessage(null)}
              className="text-navy/50 hover:text-navy"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Empty wishlist state - ONLY shown when count === 0 */}
        {count === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto bg-white border border-dashed border-beige-dark p-8 shadow-sm">
            <div className="w-20 h-20 bg-ivory-200 border-2 border-dashed border-beige-dark flex items-center justify-center mb-6 mx-auto">
              <Heart className="w-9 h-9 text-gold-700/50" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-navy mb-2">
              Your Wishlist is Empty
            </h3>
            <p className="text-sm text-navy/60 leading-relaxed mb-8">
              You haven't bookmarked any specimens yet. Explore the Postal Archive and click the heart icon on any stamp card to save it to your wishlist.
            </p>
            <Link
              to="/stamps"
              className="inline-flex items-center gap-2 bg-burgundy text-ivory text-sm font-semibold tracking-wider uppercase px-6 py-3 hover:bg-burgundy/90 transition-colors border border-burgundy-900 shadow-sm"
            >
              <Stamp className="w-4 h-4" />
              Explore Postal Archive
            </Link>
          </div>
        )}

        {/* Wishlist grid - shown whenever count > 0 */}
        {count > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {wishlistStamps.map((stamp) => (
                <StampCard
                  key={stamp.id}
                  stamp={stamp}
                  onExamine={(s) => setSelectedStamp(s)}
                  onAddToCollection={handleAddToCollection}
                  isWishlisted={isWishlisted(stamp.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>

            <div className="mt-14 flex justify-center">
              <Link
                to="/stamps"
                className="inline-flex items-center gap-2 text-sm font-medium text-burgundy hover:text-navy transition-colors group border border-burgundy/30 hover:border-navy/30 px-5 py-2.5 bg-white shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Return to Full Postal Archive
              </Link>
            </div>
          </>
        )}

        {/* Specimen Examination Modal */}
        {selectedStamp && (
          <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-gold/40 max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <button
                type="button"
                onClick={() => setSelectedStamp(null)}
                className="absolute top-4 right-4 text-navy/50 hover:text-navy p-1"
                aria-label="Close dossier"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 text-xs font-mono text-gold-900 uppercase tracking-wider">
                <Stamp className="w-4 h-4 text-burgundy" />
                <span>Specimen Dossier • Cat. #{String(selectedStamp.id).slice(0, 8)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <div className="bg-ivory-100 border border-beige-dark/50 p-4 text-center">
                  <div className="aspect-[4/3] bg-white border border-beige overflow-hidden flex items-center justify-center mb-3">
                    {selectedStamp.image ? (
                      <img
                        src={selectedStamp.image}
                        alt={selectedStamp.name}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                      />
                    ) : (
                      <Stamp className="w-16 h-16 text-gold" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-navy/60 block">
                    Original Resolution Proof Scan
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-navy leading-tight mb-1">
                      {selectedStamp.name}
                    </h3>
                    <span className="text-burgundy font-semibold uppercase tracking-wider text-[11px]">
                      {selectedStamp.category || 'National Archive'}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-b border-beige py-3 text-navy/80">
                    <div className="flex items-center justify-between">
                      <span className="text-navy/50 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold-900" /> Issue Year:
                      </span>
                      <span className="font-mono font-bold text-navy">
                        {selectedStamp.issueYear || selectedStamp.year || 'Historical'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-navy/50 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-gold-900" /> Territory / State:
                      </span>
                      <span className="font-medium text-navy">{selectedStamp.country || 'India'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-navy/50 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-gold-900" /> Classification:
                      </span>
                      <span className="font-medium text-navy">
                        {selectedStamp.category || 'Commemorative Issue'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-navy block mb-1 uppercase tracking-wider text-[10px]">
                      Historical Monograph & Provenance
                    </span>
                    <p className="text-navy/70 leading-relaxed text-xs">
                      {selectedStamp.description ||
                        'Specimen registered in the collector society wishlist repository.'}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button
                      onClick={() => {
                        handleAddToCollection(selectedStamp);
                        setSelectedStamp(null);
                      }}
                      variant="primary"
                      size="md"
                      className="w-full text-xs"
                      icon={Plus}
                      iconPosition="left"
                    >
                      Save to My Vault
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        toggleWishlist(selectedStamp);
                        setSelectedStamp(null);
                      }}
                      className="w-full py-2 text-xs font-semibold border border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                      <span>Remove from Wishlist</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
