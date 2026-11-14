import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stamp, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [postalCircle, setPostalCircle] = useState('Maharashtra (Mumbai Circle)');
  const [specialization, setSpecialization] = useState('');
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setStatusMessage({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    setStatusMessage({
      type: 'success',
      text: `Petition received for ${fullName}. Fellowship credentials dispatched to ${email}. Redirecting to Society Portal...`
    });

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-navy/60 hover:text-burgundy">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
        </Link>
      </div>

      <div className="bg-white border border-beige p-8 sm:p-10 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-burgundy mx-auto mb-3 border border-gold/50 flex items-center justify-center">
            <Stamp className="w-6 h-6 text-gold-300" />
          </div>
          <span className="text-[11px] font-mono tracking-widest text-gold-900 uppercase">
            Dak Bhavan Guild Roster
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy mt-1">
            Society Membership Application
          </h2>
          <p className="text-xs sm:text-sm text-navy/65 mt-2 max-w-sm mx-auto">
            Become an accredited member of the Collector's Society of India with verified provenance privileges.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`mb-6 p-4 border text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mb-6 p-4 bg-ivory-100 border border-beige space-y-2 text-xs text-navy/80">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Digital Certificate of Provenance for verified specimens</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Direct access to regional bourses in 28 state chapters</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Quarterly dispatch of the National Philatelic Gazette</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Sen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
                Postal State / Circle *
              </label>
              <select
                value={postalCircle}
                onChange={(e) => setPostalCircle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-gold"
              >
                <option>Maharashtra (Mumbai Circle)</option>
                <option>West Bengal (Kolkata Circle)</option>
                <option>Delhi (Capital Circle)</option>
                <option>Karnataka (Bengaluru Circle)</option>
                <option>Tamil Nadu (Chennai Circle)</option>
                <option>Kerala (Trivandrum Circle)</option>
                <option>Rajasthan (Jaipur Circle)</option>
                <option>Other State Postal Circle</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
              Primary Philatelic Specialization
            </label>
            <input
              type="text"
              placeholder="e.g. Princely States, 1947 Republic, Aerophilately..."
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="collector@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-gold"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-4 font-serif">
            Submit Membership Petition
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-beige text-center">
          <p className="text-xs text-navy/70">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-burgundy hover:underline">
              Sign In to Your Vault
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
