import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Stamp, ShieldCheck, User, Compass } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Postal Archive', path: '/stamps' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Collector Circles', path: '/community' },
    { name: 'My Vault', path: '/collection' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-md border-b border-beige">
      {/* Top Philatelic Notice Bar */}
      <div className="bg-navy-950 text-ivory/80 text-[11px] py-1.5 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            <span className="font-mono uppercase tracking-wider text-[10px] text-gold-400">
              Dak Bhavan Archive Edition
            </span>
            <span className="hidden sm:inline text-ivory/40">•</span>
            <span className="hidden sm:inline text-ivory/70">
              India's Premier Philatelic Guild & Historical Repository
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/community" className="hover:text-gold transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-gold" />
              <span>PCI Verified Standards</span>
            </Link>
            <span className="text-ivory/30">|</span>
            <span className="font-mono text-gold-400">Est. 1897</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Society Crest */}
          <Link to="/" className="flex items-center gap-3.5 group">
            {/* Stamp Perforated Icon Crest */}
            <div className="w-11 h-11 bg-burgundy text-ivory flex items-center justify-center border-2 border-beige-dark shadow-sm relative transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0.5 border border-dashed border-gold/60"></div>
              <Stamp className="w-6 h-6 text-gold" />
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-navy group-hover:text-burgundy transition-colors leading-none">
                PHILATELY
              </span>
              <span className="text-[10px] uppercase font-sans font-semibold tracking-[0.22em] text-gold-900 mt-0.5">
                The Collector’s Society
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-medium transition-colors tracking-wide relative ${
                    isActive
                      ? 'text-burgundy font-semibold'
                      : 'text-navy-800 hover:text-burgundy'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-burgundy"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-navy hover:text-burgundy transition-colors"
            >
              Log In
            </Link>
            <Button
              to="/register"
              variant="primary"
              size="sm"
              className="text-xs font-semibold tracking-wider uppercase px-4 py-2 border border-burgundy-900 shadow-sm"
            >
              Join Society
            </Button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-navy hover:text-burgundy focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory border-b border-beige px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 text-base font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-ivory-300 text-burgundy font-semibold border-l-2 border-burgundy'
                      : 'text-navy hover:bg-ivory-200'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-beige flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium text-navy border border-navy/20 hover:bg-navy/5"
            >
              Log In
            </Link>
            <Button
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              variant="primary"
              size="md"
              className="w-full text-center"
            >
              Join the Society
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
