import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, Plus, Trash2, Edit3, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getWallet,
  getWalletSummary,
  addWalletInvestment,
  updateWalletSlot,
  deleteWalletSlot,
  initializeWallet,
} from '../services/api';

const DEFAULT_YEAR = '2024-25';

const SECTION_LABELS = {
  '80C': 'Section 80C',
  '80CCD(1B)': 'Section 80CCD(1B)',
  '80D': 'Section 80D',
  '80DD': 'Section 80DD',
  '80DDB': 'Section 80DDB',
  '80E': 'Section 80E',
  '80G': 'Section 80G',
  '80TTA': 'Section 80TTA',
};

function formatCurrency(value = 0) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

const Wallet = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [financialYear, setFinancialYear] = useState(DEFAULT_YEAR);
  const [sections, setSections] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newInvestment, setNewInvestment] = useState({
    section: '80C',
    name: '',
    amount: '',
  });

  const loadWallet = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      // Ensure wallet sections exist for this year
      await initializeWallet({
        userId,
        financialYear,
        sections: Object.keys(SECTION_LABELS),
      });

      const [walletData, walletSummary] = await Promise.all([
        getWallet(userId, financialYear),
        getWalletSummary(userId, financialYear),
      ]);

      setSections(walletData || []);
      setSummary(walletSummary || null);
    } catch (err) {
      console.error('Failed to load wallet', err);
      setError('Could not load tax wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, financialYear]);

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    if (!userId) return;

    if (!newInvestment.name || !newInvestment.amount) {
      setError('Please enter a name and amount for the investment.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await addWalletInvestment({
        userId,
        financialYear,
        section: newInvestment.section,
        name: newInvestment.name,
        amount: Number(newInvestment.amount),
      });

      setNewInvestment((prev) => ({ ...prev, name: '', amount: '' }));
      await loadWallet();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to add investment.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (sectionId, slotId) => {
    if (!window.confirm('Remove this investment from your wallet?')) return;
    try {
      setLoading(true);
      setError(null);
      await deleteWalletSlot({ sectionId, slotId });
      await loadWallet();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to delete investment.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSlotAmount = async (sectionId, slotId, name, amount) => {
    const newAmount = window.prompt('Update amount for this investment (₹):', amount);
    if (newAmount === null) return;

    const parsed = Number(newAmount);
    if (Number.isNaN(parsed) || parsed <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updateWalletSlot({ sectionId, slotId, name, amount: parsed });
      await loadWallet();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update investment.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white heading-font flex items-center gap-3">
            <WalletIcon className="w-7 h-7 text-cyan-400" />
            Tax Wallet
          </h1>
          <p className="text-slate-300 mt-1">
            Track your Section 80 deductions and see how much tax-saving headroom you still have.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300">Financial Year</label>
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="bg-slate-900/60 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2"
          >
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
          </select>
        </div>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-900/40 border border-red-700 text-red-100 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs text-slate-400 mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-cyan-300">{formatCurrency(summary.totalInvested)}</p>
            <p className="text-xs text-slate-500 mt-2">Across all selected sections</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs text-slate-400 mb-1">Total Eligible Limit</p>
            <p className="text-2xl font-bold text-emerald-300">{formatCurrency(summary.totalLimit)}</p>
            <p className="text-xs text-slate-500 mt-2">Combined deduction ceiling</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-xs text-slate-400 mb-1">Remaining Headroom</p>
            <p className="text-2xl font-bold text-yellow-300">{formatCurrency(summary.totalRemaining)}</p>
            <p className="text-xs text-slate-500 mt-2">You can still invest this much tax-efficiently</p>
          </div>
        </motion.div>
      )}

      {/* Add Investment Form */}
      <motion.form
        onSubmit={handleAddInvestment}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-end"
      >
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Section</label>
            <select
              value={newInvestment.section}
              onChange={(e) => setNewInvestment((prev) => ({ ...prev, section: e.target.value }))}
              className="w-full bg-slate-900/60 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2"
            >
              {Object.keys(SECTION_LABELS).map((value) => (
                <option key={value} value={value}>
                  {SECTION_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Investment Name</label>
            <input
              type="text"
              value={newInvestment.name}
              onChange={(e) => setNewInvestment((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. ELSS, Health Insurance"
              className="w-full bg-slate-900/60 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Amount (₹)</label>
            <input
              type="number"
              min="0"
              value={newInvestment.amount}
              onChange={(e) => setNewInvestment((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-full bg-slate-900/60 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="gradient-button flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {loading ? 'Saving...' : 'Add to Wallet'}
        </button>
      </motion.form>

      {/* Sections List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <motion.div
            key={section._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {SECTION_LABELS[section.section] || section.section}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Limit: {formatCurrency(section.limit)} • Invested: {formatCurrency(section.invested)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Remaining</p>
                <p className="text-sm font-semibold text-emerald-300">
                  {formatCurrency(section.remaining)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                style={{ width: `${Math.min(100, Math.round(section.progress || 0))}%` }}
              />
            </div>

            {/* Slots */}
            <div className="space-y-2">
              {section.slots && section.slots.length > 0 ? (
                section.slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="flex items-center justify-between bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-slate-100">{slot.name}</p>
                      <p className="text-xs text-slate-500">
                        Added on {slot.dateAdded ? new Date(slot.dateAdded).toLocaleDateString('en-IN') : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-emerald-300">
                        {formatCurrency(slot.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateSlotAmount(section._id, slot._id, slot.name, slot.amount)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
                        title="Edit amount"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(section._id, slot._id)}
                        className="p-1.5 rounded-lg hover:bg-red-900/40 text-red-300"
                        title="Remove from wallet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">
                  No investments added in this section yet. Use the form above to start.
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
