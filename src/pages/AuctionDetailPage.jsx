import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { auctionApi } from '../services/api';
import Button from '../components/Button';
import {
  Gavel,
  Clock,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Lock,
  Tag,
  Award,
  Calendar,
  User,
  History,
  TrendingUp,
  RefreshCw,
  FileText,
  Layers,
  Heart,
  Share2,
  Info,
  Check,
  ExternalLink,
} from 'lucide-react';

// Fallback seed lots in case backend is offline or during initial static rendering
const FALLBACK_AUCTIONS = [
  {
    id: "auc-1",
    title: "1854 Inverted Head Four Annas (Lithographic Error Rarity)",
    description: "Monumental world philatelic rarity printed at Surveyor General's Office in Calcutta. Showing Queen Victoria's head inverted inside the octagonal frame. Full margins, Cooper Diamond 1 postmark.",
    sellerName: "Sardar Jasjit Singh",
    sellerEmail: "jasjit@philatelysociety.in",
    sellerReputation: "Life Fellow (PCI)",
    sellerLocation: "Kolkata, West Bengal",
    startingPrice: 250000,
    minIncrement: 5000,
    currentBid: 310000,
    minNextBid: 315000,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "LIVE",
    isLive: true,
    bidCount: 4,
    highestBidder: "Prof. Debabrata Roy",
    category: "Classic British India",
    condition: "Good Used, Octagonal Cut",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Ferrary Collection, Royal Philatelic Society London Cert #9842.",
    certificate: "RPSL Certificate #9842 (Grade AAA)",
    bids: [
      {
        id: "bid-4",
        bidderName: "Prof. Debabrata Roy",
        bidderEmail: "roy@bengal.pda",
        amount: 310000,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-3",
        bidderName: "Maharaja Vikramaditya",
        bidderEmail: "vikram@royalpost.in",
        amount: 295000,
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-2",
        bidderName: "Cdr. Suresh Menon",
        bidderEmail: "suresh@navyphilately.org",
        amount: 275000,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-1",
        bidderName: "Maharaja Vikramaditya",
        bidderEmail: "vikram@royalpost.in",
        amount: 260000,
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "auc-2",
    title: "1948 Mahatma Gandhi Memorial 10 Rs 'SERVICE' Overprint",
    description: "Seminal post-independence memorial gem. One of only 200 copies overprinted 'SERVICE' for the Secretariat of C. Rajagopalachari. Original gum, very fine light hinge.",
    sellerName: "Dr. Arvind Swaminathan",
    sellerEmail: "arvind@kolkataguild.in",
    sellerReputation: "Grand Prix National Laureate",
    sellerLocation: "Chennai, Tamil Nadu",
    startingPrice: 120000,
    minIncrement: 2500,
    currentBid: 145000,
    minNextBid: 147500,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "LIVE",
    isLive: true,
    bidCount: 2,
    highestBidder: "Rohan Singhal",
    category: "Republic of India",
    condition: "Mint Lightly Hinged (MLH)",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Secretariat Official Archives, Dak Bhavan Verification Stamp 1948.",
    certificate: "BPA Certificate #44102",
    bids: [
      {
        id: "bid-6",
        bidderName: "Rohan Singhal",
        bidderEmail: "rohan@delhiphilately.com",
        amount: 145000,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-5",
        bidderName: "Ananya Deshmukh",
        bidderEmail: "ananya@pune.in",
        amount: 130000,
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "auc-3",
    title: "1852 Scinde Dawk White Embossed ½ Anna",
    description: "First adhesive postage stamp issued on the Asian continent under Sir Bartle Frere. Embossed circular seal on brittle white paper, exceptional embossing relief.",
    sellerName: "Col. Pradeep Sen",
    sellerEmail: "sen@sindhpostal.org",
    sellerReputation: "Senior Philatelist (50+ yrs)",
    sellerLocation: "New Delhi",
    startingPrice: 350000,
    minIncrement: 10000,
    currentBid: null,
    minNextBid: 350000,
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "UPCOMING",
    isUpcoming: true,
    bidCount: 0,
    highestBidder: null,
    category: "Classic British India",
    condition: "Fine Embossed, Small Margin Fault",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    provenance: "Karachi District Post Office records.",
    certificate: "Dak Bhavan Historical Register #DB-1852-01",
    bids: [],
  },
  {
    id: "auc-4",
    title: "1911 First Aerial Post Official Allahabad-Naini Flight Cover",
    description: "World's First Airmail flight by Henri Pequet carrying 6,500 letters across the Yamuna river. Franked with Victoria 2½a, magenta bilingual magenta cancel.",
    sellerName: "Meera Kulkarni",
    sellerEmail: "meera@postalhistory.in",
    sellerReputation: "Aero-Philatelic Society Chair",
    sellerLocation: "Mumbai, Maharashtra",
    startingPrice: 75000,
    minIncrement: 2000,
    currentBid: 98000,
    minNextBid: 100000,
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "ENDED",
    isEnded: true,
    bidCount: 3,
    highestBidder: "Prof. Debabrata Roy",
    category: "Postal History",
    condition: "Superb Historical Cover",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80",
    provenance: "Ex-Allahabad Exhibition Committee Archival Box.",
    certificate: "India Postal Circle Certificate #IPC-1911",
    winner: {
      bidderName: "Prof. Debabrata Roy",
      bidderEmail: "roy@bengal.pda",
      amount: 98000,
    },
    bids: [
      {
        id: "bid-9",
        bidderName: "Prof. Debabrata Roy",
        bidderEmail: "roy@bengal.pda",
        amount: 98000,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-8",
        bidderName: "Ananya Deshmukh",
        bidderEmail: "ananya@pune.in",
        amount: 88000,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "bid-7",
        bidderName: "Virendra Malviya",
        bidderEmail: "malviya@jaipur.in",
        amount: 80000,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "auc-5",
    title: "1866 Travancore State ½ Chuckram 'Shankha' Sheet Margin Strip",
    description: "Rare indigenous Anchel post classic from Trivandrum mint. Printed on native unwatermarked handmade laid paper depicting sacred Conch Shell.",
    sellerName: "Prof. K. R. Namboodiri",
    sellerEmail: "namboodiri@kerala.in",
    sellerReputation: "Princely States Specialist",
    sellerLocation: "Thiruvananthapuram, Kerala",
    startingPrice: 180000,
    minIncrement: 5000,
    currentBid: null,
    minNextBid: 180000,
    startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lifecycleStatus: "ENDED",
    isEnded: true,
    bidCount: 0,
    highestBidder: null,
    category: "Princely States",
    condition: "MNH Sheet Margin Strip",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    provenance: "Travancore Royal Anchel Archives.",
    certificate: "South India Philatelic Circle #SIPC-1866",
    winner: null,
    bids: [],
  },
];

export default function AuctionDetailPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('monograph');

  // Bid form state
  const [bidderName, setBidderName] = useState('Member Collector');
  const [bidAmount, setBidAmount] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [copiedLink, setCopiedLink] = useState(false);

  // Live timer interval: updates every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch auction detail
  const fetchAuction = async () => {
    try {
      const res = await auctionApi.getById(id);
      if (res && res.data) {
        setAuction(res.data);
      } else {
        // Fallback
        const fallback = FALLBACK_AUCTIONS.find((a) => String(a.id) === String(id));
        setAuction(fallback || null);
      }
    } catch {
      // Offline fallback lookup
      const fallback = FALLBACK_AUCTIONS.find((a) => String(a.id) === String(id));
      setAuction(fallback || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setFeedback(null);
    fetchAuction();
  }, [id]);

  // Sync default bid amount when auction loads
  useEffect(() => {
    if (auction) {
      const minRequired = auction.currentBid
        ? Number(auction.currentBid) + Number(auction.minIncrement || 500)
        : Number(auction.startingPrice);
      setBidAmount(String(minRequired));
    }
  }, [auction]);

  // Derived real-time countdown calculations
  const countdown = useMemo(() => {
    if (!auction) return { label: 'Concluded', value: '00:00:00', isLive: false, isUpcoming: false, isEnded: true };

    const start = new Date(auction.startTime).getTime();
    const end = new Date(auction.endTime).getTime();
    const now = currentTime.getTime();

    if (now < start) {
      const diff = Math.max(0, start - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return {
        label: 'Bidding Opens In',
        value: `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        isUpcoming: true,
        isLive: false,
        isEnded: false,
      };
    } else if (now >= end) {
      return {
        label: 'Auction Concluded',
        value: 'Gavel Fell',
        isUpcoming: false,
        isLive: false,
        isEnded: true,
      };
    } else {
      const diff = Math.max(0, end - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return {
        label: 'Closes In',
        value: `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        isUpcoming: false,
        isLive: true,
        isEnded: false,
      };
    }
  }, [auction, currentTime]);

  // Handle Quick Increment Click
  const handleQuickIncrement = (addValue) => {
    if (!auction) return;
    const currentBase = Number(bidAmount) || (auction.currentBid ? Number(auction.currentBid) : Number(auction.startingPrice));
    const newAmount = currentBase + addValue;
    setBidAmount(String(newAmount));
  };

  // Handle Bid Placement
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!bidderName.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a valid Collector / Bidder Name.' });
      return;
    }

    const numericAmount = Number(bidAmount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid monetary bid amount.' });
      return;
    }

    const minRequired = auction.currentBid
      ? Number(auction.currentBid) + Number(auction.minIncrement || 500)
      : Number(auction.startingPrice);

    if (numericAmount < minRequired) {
      setFeedback({
        type: 'error',
        message: `Your bid of ₹${numericAmount.toLocaleString('en-IN')} is below the minimum required bid of ₹${minRequired.toLocaleString('en-IN')}.`,
      });
      return;
    }

    // Client-side Anti-shill check
    if (auction.sellerName && bidderName.trim().toLowerCase() === auction.sellerName.toLowerCase()) {
      setFeedback({
        type: 'error',
        message: 'Anti-Shill Policy: Consignors cannot place bids on their own auction lots.',
      });
      return;
    }

    setSubmittingBid(true);

    try {
      const res = await auctionApi.placeBid(auction.id, {
        amount: numericAmount,
        bidderName: bidderName.trim(),
        bidderEmail: `${bidderName.trim().toLowerCase().replace(/\s+/g, '.')}@member.pda`,
      });

      if (res && res.data) {
        setAuction(res.data.auction);
        const nextMin = Number(numericAmount) + Number(auction.minIncrement || 500);
        setBidAmount(String(nextMin));
        setFeedback({
          type: 'success',
          message: `Archival bid of ₹${numericAmount.toLocaleString('en-IN')} successfully logged! You are currently the leading bidder.`,
        });
      } else {
        // Fallback local state update
        const newBidObj = {
          id: `bid-local-${Date.now()}`,
          bidderName: bidderName.trim(),
          bidderEmail: `${bidderName.trim().toLowerCase().replace(/\s+/g, '.')}@member.pda`,
          amount: numericAmount,
          createdAt: new Date().toISOString(),
        };
        const updatedBids = [newBidObj, ...(auction.bids || [])];
        const nextMin = Number(numericAmount) + Number(auction.minIncrement || 500);
        setAuction((prev) => ({
          ...prev,
          currentBid: numericAmount,
          minNextBid: nextMin,
          bidCount: updatedBids.length,
          highestBidder: bidderName.trim(),
          bids: updatedBids,
        }));
        setBidAmount(String(nextMin));
        setFeedback({
          type: 'success',
          message: `Archival bid of ₹${numericAmount.toLocaleString('en-IN')} successfully logged! You are currently the leading bidder.`,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to record bid. Please try again or refresh the lot ledger.',
      });
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-12 h-12 bg-burgundy/10 border-2 border-dashed border-burgundy flex items-center justify-center mb-4">
          <RefreshCw className="w-6 h-6 text-burgundy animate-spin" />
        </div>
        <p className="font-serif text-lg text-navy font-semibold">Retrieving Archival Auction Dossier...</p>
        <p className="text-xs text-navy/60 mt-1">Connecting to Philatelic Congress Registry</p>
      </div>
    );
  }

  // Not Found State
  if (!auction) {
    return (
      <div className="min-h-[70vh] py-16 px-4 max-w-4xl mx-auto flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-ivory-200 border-2 border-dashed border-beige flex items-center justify-center mb-6">
          <Gavel className="w-10 h-10 text-gold-700/60" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-burgundy font-semibold mb-2">
          Archival Auction Register
        </span>
        <h1 className="font-serif text-3xl font-bold text-navy mb-3">Auction Lot Not Found</h1>
        <p className="text-sm text-navy/70 leading-relaxed max-w-md mb-8">
          The auction lot reference <code className="font-mono font-bold bg-ivory-300 px-2 py-0.5 border border-beige">{id}</code> could not be located in the bourse ledger.
        </p>
        <Button to="/auctions" variant="primary" size="md" icon={ArrowLeft} iconPosition="left">
          Return to Auction Bourse
        </Button>
      </div>
    );
  }

  const minRequiredBid = auction.currentBid
    ? Number(auction.currentBid) + Number(auction.minIncrement || 500)
    : Number(auction.startingPrice);

  const bidsList = Array.isArray(auction.bids) ? auction.bids : [];
  const otherAuctions = FALLBACK_AUCTIONS.filter((a) => String(a.id) !== String(auction.id)).slice(0, 3);

  return (
    <div className="min-h-screen bg-ivory-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs text-navy/60 mb-6 font-mono uppercase tracking-wider"
        >
          <Link to="/" className="hover:text-burgundy transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-burgundy transition-colors">
            Marketplace
          </Link>
          <span>/</span>
          <Link to="/auctions" className="hover:text-burgundy transition-colors">
            Archival Auctions
          </Link>
          <span>/</span>
          <span className="text-navy font-semibold">Lot #{auction.id.toUpperCase()}</span>
        </nav>

        {/* Top Header & Status Strip */}
        <div className="bg-white border border-beige p-5 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-gold-900 bg-gold-50 border border-gold/30 px-2.5 py-0.5">
                LOT #{auction.id.toUpperCase()}
              </span>
              <span className="text-xs text-navy/40 font-mono">•</span>
              <span className="text-xs font-mono text-navy/70 uppercase">
                {auction.category || 'Archival Philately'}
              </span>

              {/* Status Badge */}
              {countdown.isLive && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  Live Bidding Active
                </span>
              )}
              {countdown.isUpcoming && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                  <Clock className="w-3 h-3 text-amber-700" />
                  Upcoming Auction
                </span>
              )}
              {countdown.isEnded && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-navy-100 text-navy-800 border border-navy-300">
                  <Gavel className="w-3 h-3 text-navy-700" />
                  Auction Concluded
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy leading-tight pt-1">
              {auction.title}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-navy/80 bg-ivory-100 border border-beige hover:border-gold transition-colors"
              title="Share Lot Link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-navy/60" />
                  <span>Share Lot</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={fetchAuction}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-navy bg-white border border-beige hover:border-gold transition-colors"
              title="Sync auction state with society ledger"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-900" />
              <span>Refresh Ledger</span>
            </button>
          </div>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Specimen Archival Scan, Badges, Tabs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Specimen Frame */}
            <div className="relative bg-white border-2 border-beige shadow-sm p-4 sm:p-6 flex flex-col items-center justify-center overflow-hidden">
              <div className="w-full relative flex items-center justify-center bg-navy-950/5 min-h-[360px] sm:min-h-[420px] border border-beige/60">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="max-h-[380px] w-auto object-contain transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Archival Seal Watermark */}
                <div className="absolute bottom-3 right-3 bg-navy-950/80 backdrop-blur-xs text-gold px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest border border-gold/30">
                  Dak Bhavan Archive Scan
                </div>
              </div>

              {/* Physical Specimen Metadata Tag Strip */}
              <div className="w-full mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-ivory-100 p-2.5 border border-beige">
                  <span className="block text-[10px] font-mono text-navy/50 uppercase">Condition</span>
                  <span className="font-semibold text-navy">{auction.condition || 'Archival Fine'}</span>
                </div>
                <div className="bg-ivory-100 p-2.5 border border-beige">
                  <span className="block text-[10px] font-mono text-navy/50 uppercase">Certification</span>
                  <span className="font-semibold text-navy truncate block" title={auction.certificate}>
                    {auction.certificate || 'PCI Verified'}
                  </span>
                </div>
                <div className="bg-ivory-100 p-2.5 border border-beige col-span-2 sm:col-span-1">
                  <span className="block text-[10px] font-mono text-navy/50 uppercase">Consignment Vault</span>
                  <span className="font-semibold text-navy">Dak Bhavan Custody</span>
                </div>
              </div>
            </div>

            {/* Consignor Card */}
            <div className="bg-white border border-beige p-5 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 bg-navy-950 text-gold flex items-center justify-center font-serif text-lg font-bold border border-gold/40">
                    {auction.sellerName ? auction.sellerName.charAt(0) : 'C'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-navy">{auction.sellerName || 'Accredited Member'}</h4>
                      <span className="bg-gold-50 border border-gold/30 text-gold-900 text-[10px] px-1.5 py-0.5 font-mono uppercase">
                        Verified Consignor
                      </span>
                    </div>
                    <p className="text-xs text-navy/60">
                      {auction.sellerReputation || 'Life Member - Philatelic Congress of India'} •{' '}
                      {auction.sellerLocation || 'New Delhi, India'}
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono uppercase text-navy/50 block">Consignor Rating</span>
                  <span className="text-xs font-semibold text-emerald-700">★ 100% Provenance Score</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-beige/60 text-xs text-navy/70 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  All specimens from this consignor have undergone physical microscopic inspection and ultraviolet watermark examination.
                </span>
              </div>
            </div>

            {/* Archival Tabs: Monograph, Provenance, Society Guarantee */}
            <div className="bg-white border border-beige shadow-xs">
              <div className="flex border-b border-beige">
                <button
                  type="button"
                  onClick={() => setActiveTab('monograph')}
                  className={`flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
                    activeTab === 'monograph'
                      ? 'border-b-2 border-burgundy text-burgundy bg-ivory-50'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  Specimen Monograph
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('provenance')}
                  className={`flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
                    activeTab === 'provenance'
                      ? 'border-b-2 border-burgundy text-burgundy bg-ivory-50'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  Provenance & Chain
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('rules')}
                  className={`flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
                    activeTab === 'rules'
                      ? 'border-b-2 border-burgundy text-burgundy bg-ivory-50'
                      : 'text-navy/60 hover:text-navy'
                  }`}
                >
                  Auction Rules & Escrow
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'monograph' && (
                  <div className="space-y-4 text-sm text-navy/80 leading-relaxed font-serif">
                    <p>{auction.description}</p>
                    <p className="text-xs font-sans text-navy/60 leading-normal">
                      Specimen authenticated according to the Stanley Gibbons British Commonwealth catalogue standards and Philatelic Congress of India preservation guidelines.
                    </p>
                  </div>
                )}

                {activeTab === 'provenance' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3.5 bg-ivory-100 border border-beige">
                      <Award className="w-5 h-5 text-gold-900 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-semibold text-navy">Certified Certificate of Authenticity</h5>
                        <p className="text-xs text-navy/70 mt-0.5 font-mono">
                          {auction.certificate || 'Dak Bhavan Registered Certificate #AAA-1897'}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-navy/80 space-y-2">
                      <h5 className="font-semibold text-navy uppercase font-mono tracking-wider text-[11px]">
                        Recorded Custody History
                      </h5>
                      <p className="font-serif italic leading-relaxed">
                        {auction.provenance || 'Private estate collection; acquired through certified member exchange; registered with the National Philatelic Depository.'}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'rules' && (
                  <div className="space-y-3 text-xs text-navy/80 leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-gold-900 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-navy">100% Escrow Protection:</strong> Winning funds are held securely in the Philatelic Congress escrow account until the buyer physically inspects and verifies the specimen.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <TrendingUp className="w-4 h-4 text-gold-900 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-navy">Minimum Increments:</strong> Every successive bid must meet or exceed the current highest bid plus the required lot increment (₹{Number(auction.minIncrement || 500).toLocaleString('en-IN')}).
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-gold-900 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-navy">Anti-Shill Enforcement:</strong> Consignors are strictly barred by society charter from bidding on their own consigned lots.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Live Archival Bidding Terminal & Financial Ledger (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Terminal Main Box */}
            <div className="bg-navy-950 text-ivory border-2 border-gold/40 shadow-xl p-5 sm:p-6 relative overflow-hidden">
              {/* Subtle vintage texture overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none"></div>

              {/* Countdown Ticker Bar */}
              <div className="bg-navy-900 border border-gold/30 p-3.5 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${countdown.isLive ? 'text-emerald-400 animate-pulse' : 'text-gold'}`} />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-ivory/70">
                    {countdown.label}
                  </span>
                </div>
                <span className="font-mono text-sm sm:text-base font-bold text-gold tracking-widest">
                  {countdown.value}
                </span>
              </div>

              {/* Price Gauge Matrix */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-navy-900/80 border border-white/10 p-3">
                  <span className="text-[10px] font-mono text-ivory/50 uppercase block">Starting Price</span>
                  <span className="font-serif text-lg font-bold text-ivory/90">
                    ₹{Number(auction.startingPrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-navy-900/80 border border-white/10 p-3">
                  <span className="text-[10px] font-mono text-ivory/50 uppercase block">Required Increment</span>
                  <span className="font-serif text-lg font-bold text-gold-300">
                    +₹{Number(auction.minIncrement || 500).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="col-span-2 bg-burgundy/40 border border-gold/40 p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gold-200 block">
                      {auction.currentBid ? 'Current Highest Bid' : 'Opening Price'}
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-extrabold text-gold tracking-tight">
                      ₹{Number(auction.currentBid || auction.startingPrice).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-ivory/60 block">Verified Bids</span>
                    <span className="font-mono text-base font-bold text-ivory">
                      {auction.bidCount || bidsList.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* WINNER STATE BANNER (When Ended) */}
              {countdown.isEnded && (
                <div className="mb-6 p-4 border border-gold/40 bg-navy-900/90 text-ivory">
                  {auction.winner || (bidsList.length > 0 && bidsList[0]) ? (
                    <div>
                      <div className="flex items-center gap-2 text-gold mb-1.5">
                        <Award className="w-5 h-5 text-gold" />
                        <span className="font-mono text-xs uppercase tracking-wider font-bold">
                          Gavel Fell — Lot Realized
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-ivory">
                        Awarded to:{' '}
                        <span className="text-gold">
                          {auction.winner?.bidderName || bidsList[0]?.bidderName}
                        </span>
                      </p>
                      <p className="text-xs text-ivory/70 mt-1">
                        Final Realized Price: ₹
                        {Number(
                          auction.winner?.amount || bidsList[0]?.amount
                        ).toLocaleString('en-IN')}
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-ivory/60 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-gold-400" />
                        <span>Specimen dispatched under sealed PCI transit insurance.</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-rose-300 mb-1">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                          Reserve Not Met — Unsold
                        </span>
                      </div>
                      <p className="text-xs text-ivory/70">
                        No qualifying bids were placed before the auction concluded. This specimen has been returned to the consignor's private vault.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* UPCOMING STATE BANNER */}
              {countdown.isUpcoming && (
                <div className="mb-6 p-4 border border-amber-500/40 bg-amber-950/40 text-ivory">
                  <div className="flex items-center gap-2 text-amber-300 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                      Lot Scheduled for Future Bidding
                    </span>
                  </div>
                  <p className="text-xs text-ivory/80 leading-relaxed">
                    Bidding opens on{' '}
                    <strong className="text-amber-200">
                      {new Date(auction.startTime).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </strong>
                    . Member registration is open. Prepare your opening offer.
                  </p>
                </div>
              )}

              {/* ACTION FEEDBACK ALERT */}
              {feedback && (
                <div
                  className={`mb-5 p-3.5 text-xs flex items-start gap-2.5 border ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100'
                      : 'bg-rose-950/80 border-rose-400 text-rose-100'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="leading-snug">{feedback.message}</div>
                </div>
              )}

              {/* LIVE BIDDING FORM */}
              {countdown.isLive && (
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  {/* Minimum Required Prompt */}
                  <div className="text-xs flex items-center justify-between text-ivory/80 bg-navy-900 px-3 py-2 border border-white/10 font-mono">
                    <span>Minimum Next Valid Bid:</span>
                    <span className="font-bold text-gold">₹{minRequiredBid.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Bidder Identification */}
                  <div>
                    <label
                      htmlFor="bidder-name"
                      className="block text-[11px] font-mono uppercase tracking-wider text-ivory/70 mb-1"
                    >
                      Bidding As (Society Member / Handle)
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-gold-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="bidder-name"
                        type="text"
                        value={bidderName}
                        onChange={(e) => setBidderName(e.target.value)}
                        placeholder="e.g. Sardar Jasjit Singh or Collector Handle"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-navy-900 border border-beige/30 text-ivory focus:outline-none focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  {/* Quick-Increment Preset Buttons */}
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-ivory/50 mb-1.5">
                      Quick Increment Presets
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[500, 1000, 2500, 5000].map((increment) => (
                        <button
                          key={increment}
                          type="button"
                          onClick={() => handleQuickIncrement(increment)}
                          className="py-1 px-2 text-[11px] font-mono bg-navy-900 hover:bg-gold hover:text-navy-950 text-gold-200 border border-gold/30 transition-colors"
                        >
                          +₹{increment}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Bid Amount Input */}
                  <div>
                    <label
                      htmlFor="bid-amount"
                      className="block text-[11px] font-mono uppercase tracking-wider text-ivory/70 mb-1"
                    >
                      Your Maximum Sealed Bid (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-serif font-bold text-gold text-sm">
                        ₹
                      </span>
                      <input
                        id="bid-amount"
                        type="number"
                        min={minRequiredBid}
                        step={Number(auction.minIncrement || 500)}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 text-base font-mono font-bold bg-navy-900 border-2 border-gold text-gold focus:outline-none focus:ring-1 focus:ring-gold"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Bid Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={Gavel}
                    iconPosition="left"
                    disabled={submittingBid}
                    className="w-full justify-center text-xs uppercase tracking-wider font-bold py-3 bg-gold hover:bg-gold-500 text-navy-950 border border-gold shadow-md"
                  >
                    {submittingBid ? 'Recording Bid On Ledger...' : `Place Bid for ₹${Number(bidAmount || minRequiredBid).toLocaleString('en-IN')}`}
                  </Button>

                  {/* Anti-Shill & Safety Notice */}
                  <div className="text-[10px] text-ivory/50 leading-tight pt-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>
                      Bids are legally binding under the Philatelic Congress of India Archival Bourse Regulations.
                    </span>
                  </div>
                </form>
              )}

              {/* Link back to all auctions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-ivory/70">
                <Link to="/auctions" className="hover:text-gold flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> All Archival Lots
                </Link>
                <span className="font-mono text-[10px] text-gold-400">Dak Bhavan Official Bourse</span>
              </div>
            </div>

            {/* Bid History Ledger (Audit Trail) */}
            <div className="bg-white border border-beige shadow-xs">
              <div className="p-4 border-b border-beige flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-burgundy" />
                  <h3 className="font-semibold text-xs text-navy uppercase tracking-wider">
                    Archival Bid Ledger ({bidsList.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-navy/50 uppercase">Public Audit Record</span>
              </div>

              {bidsList.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-10 h-10 mx-auto bg-ivory-200 border border-dashed border-beige flex items-center justify-center mb-2">
                    <Gavel className="w-5 h-5 text-navy/40" />
                  </div>
                  <p className="text-xs text-navy/70 font-medium">No bids logged for this lot yet.</p>
                  <p className="text-[11px] text-navy/50 mt-1">
                    Be the inaugural bidder at starting reserve ₹{Number(auction.startingPrice).toLocaleString('en-IN')}.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-beige/60 max-h-80 overflow-y-auto">
                  {bidsList.map((bid, index) => {
                    const isHighest = index === 0;
                    return (
                      <div
                        key={bid.id || `bid-${index}`}
                        className={`p-3.5 flex items-center justify-between text-xs transition-colors ${
                          isHighest ? 'bg-gold-50/60 font-medium' : 'hover:bg-ivory-50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-navy">
                              {bid.bidderName || 'Member Collector'}
                            </span>
                            {isHighest && (
                              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-gold text-navy-950">
                                {countdown.isEnded ? 'Winner' : 'High Bid'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-navy/50 font-mono">
                            {new Date(bid.createdAt).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>

                        <div className="text-right">
                          <span
                            className={`font-serif text-sm font-bold block ${
                              isHighest ? 'text-burgundy' : 'text-navy'
                            }`}
                          >
                            ₹{Number(bid.amount).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700">Verified</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Other Active Bourse Lots */}
        {otherAuctions.length > 0 && (
          <div className="mt-12 pt-8 border-t border-beige">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-burgundy font-semibold block">
                  Archive Exchange
                </span>
                <h3 className="font-serif text-xl font-bold text-navy">Other Archival Auction Lots</h3>
              </div>
              <Link
                to="/auctions"
                className="text-xs font-semibold text-burgundy hover:text-navy flex items-center gap-1"
              >
                View Full Catalogue <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherAuctions.map((other) => (
                <Link
                  key={other.id}
                  to={`/auctions/${other.id}`}
                  className="group bg-white border border-beige hover:border-gold transition-all duration-300 p-4 flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="aspect-4/3 bg-ivory-100 border border-beige/60 overflow-hidden flex items-center justify-center p-2 relative">
                      <img
                        src={other.image}
                        alt={other.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-navy-950/80 text-gold text-[9px] font-mono uppercase px-2 py-0.5">
                        LOT #{other.id.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-navy/50 uppercase block">{other.category}</span>
                      <h4 className="font-serif text-sm font-bold text-navy line-clamp-1 group-hover:text-burgundy transition-colors">
                        {other.title}
                      </h4>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-beige/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-navy/50 uppercase block">Current Bid</span>
                      <span className="font-serif font-bold text-navy text-sm">
                        ₹{Number(other.currentBid || other.startingPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gold-900 group-hover:text-burgundy flex items-center gap-1">
                      Inspect Lot →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
