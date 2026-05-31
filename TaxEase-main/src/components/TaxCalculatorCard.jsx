import { Calculator, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTax } from '../context/TaxContext';

const TaxCalculatorCard = () => {
  const { income, setIncome, regime, setRegime, tax, netIncome } = useTax();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-card rounded-3xl p-8"
    >
      <div className="flex items-center gap-3.5 mb-8">
        <div className="p-2.5 bg-gradient-to-br from-indigo-900/40 to-cyan-900/20 rounded-xl">
          <Calculator className="w-6 h-6 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 heading-font">Tax Calculator</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Annual Income
          </label>
          <div className="relative">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full pl-12 pr-4 py-3.5 input-dark rounded-xl text-[15px] font-semibold transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Tax Regime
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setRegime('new')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-[15px] transition-all ${
                regime === 'new'
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              New Regime
            </button>
            <button
              onClick={() => setRegime('old')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-[15px] transition-all ${
                regime === 'old'
                  ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700'
              }`}
            >
              Old Regime
            </button>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-slate-200/60">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/10 p-5 rounded-2xl border border-red-900/40 shadow-sm">
              <p className="text-xs text-red-300 font-semibold uppercase tracking-wide mb-2">Tax Payable</p>
              <p className="text-2xl font-bold text-red-300 heading-font">
                ₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-gradient-to-br from-teal-900/30 to-teal-800/10 p-5 rounded-2xl border border-teal-900/40 shadow-sm">
              <p className="text-xs text-teal-300 font-semibold uppercase tracking-wide mb-2">Net Income</p>
              <p className="text-2xl font-bold text-teal-300 heading-font">
                ₹{netIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaxCalculatorCard;
