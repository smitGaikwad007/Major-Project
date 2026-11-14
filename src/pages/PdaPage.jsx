import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import { pdaApi } from '../services/api';
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
  ArrowRight,
  RefreshCw,
  AlertCircle,
  X,
  CreditCard,
  User,
  History
} from 'lucide-react';

export default function PdaPage() {
  const [activeTab, setActiveTab] = useState('account');

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [accountError, setAccountError] = useState(null);
  const [accountSuccess, setAccountSuccess] = useState(null);
  const [submittingAccount, setSubmittingAccount] = useState(false);

  const [name, setName] = useState('Aarav Sharma');
  const [circle, setCircle] = useState('Maharashtra Circle (Mumbai GPO)');
  const [initialDeposit, setInitialDeposit] = useState(3500);
  const [mintStamps, setMintStamps] = useState(true);
  const [firstDayCovers, setFirstDayCovers] = useState(true);
  const [miniatureSheets, setMiniatureSheets] = useState(false);

  const [verifyInput, setVerifyInput] = useState('123456785');
  const [testDigits, setTestDigits] = useState('12345678');

  const [totalApplicants, setTotalApplicants] = useState(20);
  const [totalStamps, setTotalStamps] = useState(5);
  const [winners, setWinners] = useState([]);

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      setAccountError(null);
      const res = await pdaApi.getAccounts();
      const list = res.data || [];
      setAccounts(list);
      if (list.length > 0) {
        setSelectedAccount(list[0]);
        setVerifyInput(list[0].accountNumber.replace(/\D/g, ''));
      }
    } catch (err) {
      setAccountError(err.message || 'Failed to load PDA accounts from server.');
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setAccountError('Collector name is required.');
      return;
    }

    try {
      setSubmittingAccount(true);
      setAccountError(null);
      const res = await pdaApi.openAccount({
        holderName: name.trim(),
        postalCircle: circle,
        initialDeposit: parseFloat(initialDeposit) || 1000,
        standingOrders: {
          mintStamps,
          firstDayCovers,
          miniatureSheets,
        },
      });

      const newAcc = res.data;
      setAccounts((prev) => [newAcc, ...prev]);
      setSelectedAccount(newAcc);
      setVerifyInput(newAcc.accountNumber.replace(/\D/g, ''));
      setAccountSuccess(`Deposit Account ${newAcc.accountNumber} created successfully with Modulo-11 checksum!`);
      setTimeout(() => setAccountSuccess(null), 5000);
    } catch (err) {
      setAccountError(err.message || 'Failed to open deposit account.');
    } finally {
      setSubmittingAccount(false);
    }
  };

  const isVerified = verifyChecksum(verifyInput);
  const stepsData = getChecksumSteps(testDigits);

  const handleRunAllotment = () => {
    const list = fairAllotment(totalApplicants, totalStamps, 9);
    setWinners(list);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <SectionHeading
        badge="INDIA POST • DAK BHAVAN"
        title="National Philately Deposit Account & Stamp Verifier"
        subtitle="A mathematical solution using modular arithmetic to prevent fraud, validate account numbers, and ensure fair stamp distribution across India."
        align="left"
      />

      <div className="flex border-b border-beige mb-8 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
        <div>
          {accountSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium">{accountSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setAccountSuccess(null)}
                className="text-emerald-800 hover:text-emerald-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {accountError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span className="font-medium">{accountError}</span>
              </div>
              <button
                type="button"
                onClick={() => setAccountError(null)}
                className="text-rose-800 hover:text-rose-950"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-beige p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl font-bold text-navy">Open Philately Deposit Account (PDA)</h3>
                <span className="text-[10px] font-mono uppercase bg-ivory-200 border border-beige px-2 py-0.5 text-navy-800">
                  India Post GPO
                </span>
              </div>
              <p className="text-xs text-navy/60 mb-6">
                Automatically reserves new Indian commemorative stamps, FDCs, and miniature sheets as soon as they are released.
              </p>

              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                    Collector Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Dr. Anandita Sen"
                    className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                      Postal Circle *
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
                    <label className="block text-xs font-semibold text-navy mb-1 uppercase tracking-wider">
                      Initial Deposit (₹) *
                    </label>
                    <input
                      type="number"
                      min="500"
                      step="100"
                      required
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-ivory-50 border border-beige focus:outline-none focus:border-burgundy font-mono"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-navy mb-2 uppercase tracking-wider">
                    Standing Orders (Automatic Dispatch)
                  </span>
                  <div className="space-y-2 text-xs bg-ivory-50 p-3 border border-beige">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mintStamps}
                        onChange={(e) => setMintStamps(e.target.checked)}
                        className="accent-burgundy"
                      />
                      <span className="font-medium text-navy">Commemorative Mint Stamps</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={firstDayCovers}
                        onChange={(e) => setFirstDayCovers(e.target.checked)}
                        className="accent-burgundy"
                      />
                      <span className="font-medium text-navy">First Day Covers (FDCs) with Special Postmark</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={miniatureSheets}
                        onChange={(e) => setMiniatureSheets(e.target.checked)}
                        className="accent-burgundy"
                      />
                      <span className="font-medium text-navy">Numbered Miniature Sheets</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={submittingAccount}
                  >
                    {submittingAccount ? 'Registering with Checksum...' : 'Open Verified National PDA Account'}
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              {accounts.length > 1 && (
                <div className="bg-white border border-beige p-4 shadow-sm flex items-center justify-between">
                  <span className="text-xs font-semibold text-navy flex items-center gap-1.5 uppercase tracking-wider">
                    <CreditCard className="w-3.5 h-3.5 text-gold-900" /> Switch Account:
                  </span>
                  <select
                    value={selectedAccount ? selectedAccount.accountNumber : ''}
                    onChange={(e) => {
                      const acc = accounts.find((a) => a.accountNumber === e.target.value);
                      if (acc) {
                        setSelectedAccount(acc);
                        setVerifyInput(acc.accountNumber.replace(/\D/g, ''));
                      }
                    }}
                    className="text-xs bg-ivory-50 border border-beige px-2 py-1.5 font-mono focus:outline-none focus:border-burgundy"
                  >
                    {accounts.map((a) => (
                      <option key={a.accountNumber} value={a.accountNumber}>
                        {a.accountNumber} ({a.holderName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-navy text-ivory p-6 border-2 border-gold/40 shadow-vintage relative overflow-hidden">
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
                  <span className="font-serif text-xl font-bold text-ivory">
                    {selectedAccount ? selectedAccount.holderName : name}
                  </span>
                  <span className="text-xs text-gold-300 block">
                    {selectedAccount ? selectedAccount.postalCircle : circle}
                  </span>
                </div>

                <div className="bg-navy-950 p-3 border border-gold/20 mb-4 font-mono text-center">
                  <span className="text-[10px] text-ivory/50 block mb-0.5">Account Number (Checksum Protected)</span>
                  <span className="text-base font-bold text-gold-400 tracking-wider">
                    {selectedAccount ? selectedAccount.accountNumber : 'PDA-MH-12345678-5'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-ivory/15">
                  <div>
                    <span className="text-ivory/60 block text-[10px]">Deposit Balance</span>
                    <span className="text-lg font-serif font-bold text-ivory">
                      ₹{selectedAccount ? Number(selectedAccount.balance).toLocaleString('en-IN') : Number(initialDeposit).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-xs font-semibold block">Auto-Fulfillment On</span>
                    <span className="text-[10px] text-ivory/50 font-mono">
                      {selectedAccount && selectedAccount.standingOrders?.firstDayCovers ? 'FDC Active' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-beige p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-sm font-bold text-navy">National Standing Orders Ledger</h4>
                  <span className="text-[10px] text-navy/50 font-mono">PostgreSQL Active</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-ivory-100 border border-beige">
                    <div>
                      <span className="font-medium text-navy block">Commemorative Mint Releases</span>
                      <span className="text-[10px] text-navy/60">Guaranteed unhinged Nasik pressings</span>
                    </div>
                    <span className="text-emerald-700 font-semibold font-mono">Enrolled</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-ivory-100 border border-beige">
                    <div>
                      <span className="font-medium text-navy">First Day Covers (FDCs)</span>
                      <span className="text-[10px] text-navy/60">Official special cancellation postmark</span>
                    </div>
                    <span className="text-emerald-700 font-semibold font-mono">Enrolled</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-ivory-100 border border-beige">
                    <div>
                      <span className="font-medium text-navy">Numbered Miniature Sheets</span>
                      <span className="text-[10px] text-navy/60">Subject to modular quota allocation</span>
                    </div>
                    <span className="text-gold-900 font-semibold font-mono">Standby</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'verifier' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-beige p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-navy mb-1">Verify Stamp or Account Number</h3>
            <p className="text-xs text-navy/60 mb-4">
              Uses India Post's weighted Modulo-11 checksum formula to catch counterfeit serials or mistyped accounts.
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
                First 8 digits are the base serial, 9th digit is the Modulo-11 check digit.
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
                    ? 'The 9th digit correctly satisfies the India Post Modulo-11 congruence equation.'
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
                • 123456785 (Valid Original Specimen)
              </button>
              <button
                type="button"
                onClick={() => setVerifyInput('123456789')}
                className="block text-left text-burgundy hover:underline font-mono"
              >
                • 123456789 (Tampered Last Digit → Fails)
              </button>
              <button
                type="button"
                onClick={() => setVerifyInput('213456785')}
                className="block text-left text-burgundy hover:underline font-mono"
              >
                • 213456785 (Transposed First Two Digits → Fails)
              </button>
            </div>
          </div>

          <div className="bg-white border border-beige p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-navy mb-1">Step-by-Step Mathematical Calculation</h3>
            <p className="text-xs text-navy/60 mb-4">
              Step-by-step verification weights: [8, 6, 4, 2, 3, 5, 9, 7]:
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
                    <th className="p-1.5 border-b border-beige">× Weight</th>
                    <th className="p-1.5 border-b border-beige">= Product</th>
                  </tr>
                </thead>
                <tbody>
                  {stepsData.rows.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-ivory-50'}>
                      <td className="p-1">{r.digit}</td>
                      <td className="p-1">× {r.weight}</td>
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
        <div className="bg-white border border-beige p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-navy mb-1">
            Fair Stamp Allotment Using Modular Arithmetic
          </h3>
          <p className="text-xs text-navy/60 mb-6">
            When only a few limited-edition stamps are released, this algorithm uses modular arithmetic to pick winners fairly without human bias.
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
                <span>Selected Winners (Formula: (Seed + step × 17) mod N)</span>
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
