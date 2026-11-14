import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import {
  calculateChecksum,
  verifyChecksum,
  getChecksumSteps,
  fairAllotment
} from '../utils/numberTheory';
import {
  Landmark,
  ShieldCheck,
  Calculator,
  CheckCircle2,
  XCircle,
  Award,
  Wallet,
  Scale,
  ArrowRight
} from 'lucide-react';

export default function PdaPage() {
  const [activeTab, setActiveTab] = useState('account');

  const [name, setName] = useState('Aarav Sharma');
  const [circle, setCircle] = useState('Maharashtra Circle (Mumbai GPO)');
  const [accountNumber, setAccountNumber] = useState('PDA-MH-12345678-5');
  const [balance, setBalance] = useState(3500);
  const [mintStamps, setMintStamps] = useState(true);
  const [firstDayCovers, setFirstDayCovers] = useState(true);
  const [miniatureSheets, setMiniatureSheets] = useState(false);

  const [verifyInput, setVerifyInput] = useState('123456785');
  const [testDigits, setTestDigits] = useState('12345678');

  const [totalApplicants, setTotalApplicants] = useState(20);
  const [totalStamps, setTotalStamps] = useState(5);
  const [winners, setWinners] = useState([]);

  const isVerified = verifyChecksum(verifyInput);
  const stepsData = getChecksumSteps(testDigits);

  const handleCreateAccount = (e) => {
    e.preventDefault();
    const randomSeq = String(Math.floor(10000000 + Math.random() * 89999999));
    const check = calculateChecksum(randomSeq);
    const shortCircle = circle.split(' ')[0].slice(0, 2).toUpperCase();
    const newAcc = `PDA-${shortCircle}-${randomSeq}-${check}`;
    setAccountNumber(newAcc);
    setVerifyInput(`${randomSeq}${check}`);
  };

  const handleRunAllotment = () => {
    const list = fairAllotment(totalApplicants, totalStamps, 9);
    setWinners(list);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SectionHeading
        badge="INDIA POST &bull; DAK BHAVAN"
        title="National Philately Deposit Account & Stamp Verifier"
        subtitle="A simple mathematical solution using modular arithmetic to prevent fraud, validate account numbers, and ensure fair stamp distribution across India."
        align="left"
      />

      <div className="flex border-b border-beige mb-8 gap-2">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'account'
              ? 'border-burgundy text-burgundy font-semibold bg-ivory-100'
              : 'border-transparent text-navy hover:text-burgundy'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>My Deposit Account</span>
        </button>

        <button
          onClick={() => setActiveTab('verifier')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'verifier'
              ? 'border-burgundy text-burgundy font-semibold bg-ivory-100'
              : 'border-transparent text-navy hover:text-burgundy'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Modulo-11 Checksum Verifier</span>
        </button>

        <button
          onClick={() => setActiveTab('allotment')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'allotment'
              ? 'border-burgundy text-burgundy font-semibold bg-ivory-100'
              : 'border-transparent text-navy hover:text-burgundy'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Fair Stamp Allotment</span>
        </button>
      </div>

      {activeTab === 'account' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-beige p-6">
            <h3 className="font-serif text-xl font-bold text-navy mb-1">Open Philately Deposit Account (PDA)</h3>
            <p className="text-xs text-navy/60 mb-6">
              Automatically reserves new Indian stamps and covers as soon as they are released.
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                  Collector Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                  Postal Circle
                </label>
                <select
                  value={circle}
                  onChange={(e) => setCircle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                >
                  <option>Maharashtra Circle (Mumbai GPO)</option>
                  <option>West Bengal Circle (Kolkata GPO)</option>
                  <option>Delhi Circle (Dak Bhavan)</option>
                  <option>Tamil Nadu Circle (Chennai GPO)</option>
                  <option>Karnataka Circle (Bengaluru GPO)</option>
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wider">
                  Standing Orders (Auto-Fulfill)
                </span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mintStamps}
                      onChange={(e) => setMintStamps(e.target.checked)}
                      className="accent-burgundy"
                    />
                    <span>Commemorative Mint Stamps</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={firstDayCovers}
                      onChange={(e) => setFirstDayCovers(e.target.checked)}
                      className="accent-burgundy"
                    />
                    <span>First Day Covers (FDCs)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={miniatureSheets}
                      onChange={(e) => setMiniatureSheets(e.target.checked)}
                      className="accent-burgundy"
                    />
                    <span>Miniature Sheets</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" className="w-full">
                  Create Verified Account
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-navy text-ivory p-6 border-2 border-gold/40 shadow-vintage">
              <div className="flex items-center justify-between mb-4 border-b border-ivory/20 pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-gold" />
                  <span className="font-serif font-bold text-sm tracking-wide text-ivory">INDIA POST PDA CARD</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 border border-emerald-700">
                  ACTIVE
                </span>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-mono text-ivory/60 uppercase block">Account Holder</span>
                <span className="font-serif text-xl font-bold text-ivory">{name}</span>
                <span className="text-xs text-gold-300 block">{circle}</span>
              </div>

              <div className="bg-navy-950 p-3 border border-gold/20 mb-4 font-mono text-center">
                <span className="text-[10px] text-ivory/50 block mb-0.5">Account Number (Checksum Protected)</span>
                <span className="text-base font-bold text-gold-400">{accountNumber}</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-ivory/15">
                <div>
                  <span className="text-ivory/60 block text-[10px]">Deposit Balance</span>
                  <span className="text-lg font-serif font-bold text-ivory">₹{balance.toLocaleString('en-IN')}</span>
                </div>
                <span className="text-emerald-400 text-xs font-semibold">Auto-Fulfillment On</span>
              </div>
            </div>

            <div className="bg-white border border-beige p-5">
              <h4 className="font-serif text-sm font-bold text-navy mb-3">Recent Auto-Debits</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-ivory-100 border border-beige">
                  <span>Constitution 75th Jubilee FDC</span>
                  <span className="font-mono font-bold text-burgundy">-₹60</span>
                </div>
                <div className="flex justify-between p-2 bg-ivory-100 border border-beige">
                  <span>Himalayan Flora Commemorative Stamp</span>
                  <span className="font-mono font-bold text-burgundy">-₹25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verifier' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-beige p-6">
            <h3 className="font-serif text-xl font-bold text-navy mb-1">Verify Stamp or Account Number</h3>
            <p className="text-xs text-navy/60 mb-4">
              Uses India Posts weighted Modulo-11 checksum formula to instantly catch fake or mistyped serial numbers.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                Enter 9-Digit Serial Number
              </label>
              <input
                type="text"
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value.replace(/\D/g, '').slice(0, 9))}
                className="w-full px-3 py-2 text-base font-mono bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                placeholder="e.g. 123456785"
              />
              <span className="text-[10px] text-navy/50 mt-1 block">
                First 8 digits are the serial number, 9th digit is the Modulo-11 check digit.
              </span>
            </div>

            <div className={`p-4 border text-xs flex items-center gap-3 ${
              isVerified ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              {isVerified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div>
                <span className="font-bold text-sm block">
                  {isVerified ? 'Authentic Number (Checksum Valid)' : 'Invalid or Fake Number'}
                </span>
                <span className="text-[11px] opacity-80">
                  {isVerified
                    ? 'The 9th digit correctly satisfies the modulo-11 congruence equation.'
                    : 'The checksum digit does not match. Possible typo or counterfeit stamp.'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-beige text-xs text-navy/70 space-y-2">
              <span className="font-bold text-navy block">Quick Test Cases:</span>
              <button
                type="button"
                onClick={() => setVerifyInput('123456785')}
                className="block text-left text-burgundy hover:underline font-mono"
              >
                &bull; 123456785 (Valid Original)
              </button>
              <button
                type="button"
                onClick={() => setVerifyInput('123456789')}
                className="block text-left text-burgundy hover:underline font-mono"
              >
                &bull; 123456789 (Tampered Last Digit &rarr; Fails)
              </button>
              <button
                type="button"
                onClick={() => setVerifyInput('213456785')}
                className="block text-left text-burgundy hover:underline font-mono"
              >
                &bull; 213456785 (Transposed First Two Digits &rarr; Fails)
              </button>
            </div>
          </div>

          <div className="bg-white border border-beige p-6">
            <h3 className="font-serif text-lg font-bold text-navy mb-1">Step-by-Step Mathematical Calculation</h3>
            <p className="text-xs text-navy/60 mb-4">
              Here is exactly how the Number Theory formula computes the check digit:
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                Base 8 Digits
              </label>
              <input
                type="text"
                value={testDigits}
                onChange={(e) => setTestDigits(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="w-full px-3 py-1.5 text-sm font-mono bg-ivory-50 border border-beige"
              />
            </div>

            <div className="overflow-x-auto mb-4 border border-beige">
              <table className="min-w-full text-xs font-mono text-center">
                <thead className="bg-ivory-200">
                  <tr>
                    <th className="p-1.5 border-b border-beige">Digit</th>
                    <th className="p-1.5 border-b border-beige">&times; Weight</th>
                    <th className="p-1.5 border-b border-beige">= Product</th>
                  </tr>
                </thead>
                <tbody>
                  {stepsData.rows.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-ivory-50'}>
                      <td className="p-1">{r.digit}</td>
                      <td className="p-1">&times; {r.weight}</td>
                      <td className="p-1 text-navy-900 font-semibold">{r.product}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-ivory-100 border border-beige text-xs space-y-1 font-mono">
              <div>Total Sum = <strong>{stepsData.sum}</strong></div>
              <div>Sum mod 11 = <strong>{stepsData.remainder}</strong></div>
              <div>Check Digit = 11 - {stepsData.remainder} = <strong className="text-burgundy text-sm">{stepsData.check}</strong></div>
              <div className="text-[11px] text-navy/60 pt-1 font-sans">
                Full valid number: <strong>{testDigits}{stepsData.check}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'allotment' && (
        <div className="bg-white border border-beige p-6">
          <h3 className="font-serif text-xl font-bold text-navy mb-1">
            Fair Stamp Allotment Using Modular Arithmetic
          </h3>
          <p className="text-xs text-navy/60 mb-6">
            When only a few limited-edition stamps are released, this algorithm uses modular arithmetic to pick winners fairly without any human bias or bot scalping.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                Total Subscribed Collectors (N)
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={totalApplicants}
                onChange={(e) => setTotalApplicants(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                Limited Stamps Available (K)
              </label>
              <input
                type="number"
                min="1"
                max={totalApplicants}
                value={totalStamps}
                onChange={(e) => setTotalStamps(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige font-mono"
              />
            </div>
          </div>

          <div className="mb-6">
            <Button onClick={handleRunAllotment} variant="primary" size="md">
              Run Fair Modular Allotment
            </Button>
          </div>

          {winners.length > 0 && (
            <div>
              <h4 className="font-serif text-base font-bold text-navy mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold-900" />
                <span>Selected Winners (Formula: (Seed + step &times; 17) mod N)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {winners.map((winnerId, index) => (
                  <div key={index} className="p-3 bg-emerald-50 border border-emerald-300 text-center">
                    <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">
                      Stamp #{index + 1}
                    </span>
                    <span className="font-serif text-lg font-bold text-navy">
                      Collector #{winnerId}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
