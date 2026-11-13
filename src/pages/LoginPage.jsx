import React from 'react';
import { Link } from 'react-router-dom';
import { Stamp, Lock, ArrowLeft, Shield } from 'lucide-react';
import Button from '../components/Button';

export default function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Authentication logic is disabled in this frontend foundation preview.");
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-navy/60 hover:text-burgundy">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
        </Link>
      </div>

      <div className="bg-white border border-beige p-8 shadow-sm">
        {/* Crest */}
        <div className="w-12 h-12 bg-burgundy mx-auto mb-4 border border-gold/50 flex items-center justify-center">
          <Stamp className="w-6 h-6 text-gold-300" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-navy">Member Sign In</h2>
          <p className="text-xs text-navy/60 mt-1">
            Access your private philatelic vault, bids, and certificates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy/70 mb-1">
              Member ID or Email
            </label>
            <input
              type="text"
              defaultValue="member@philatelysociety.in"
              className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy/70">
                Passphrase
              </label>
              <span className="text-[11px] text-burgundy hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              defaultValue="••••••••••••"
              className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="remember" className="rounded text-burgundy focus:ring-gold" defaultChecked />
            <label htmlFor="remember" className="text-xs text-navy/70">Keep me signed in for 30 days</label>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-2">
            Sign In to Society Portal
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-beige text-center">
          <p className="text-xs text-navy/70">
            Not yet a registered member?{' '}
            <Link to="/register" className="font-semibold text-burgundy hover:underline">
              Apply for Fellowship
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
