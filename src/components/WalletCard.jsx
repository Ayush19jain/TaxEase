import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

const WalletCard = ({ data, onAddInvestment, onDeleteSlot }) => {
  const { section, limit, invested, remaining, progress, slots } = data;

  const getSectionInfo = (section) => {
    const info = {
      '80C': { title: 'Section 80C', description: 'Tax-saving investments', emoji: '💰' },
      '80CCD(1B)': { title: 'Section 80CCD(1B)', description: 'NPS contributions', emoji: '🏦' },
      '80D': { title: 'Section 80D', description: 'Health insurance', emoji: '🏥' },
      '80DD': { title: 'Section 80DD', description: 'Disabled dependent', emoji: '♿' },
      '80DDB': { title: 'Section 80DDB', description: 'Medical treatment', emoji: '💊' },
      '80E': { title: 'Section 80E', description: 'Education loan', emoji: '🎓' },
      '80G': { title: 'Section 80G', description: 'Donations', emoji: '🤝' },
      '80TTA': { title: 'Section 80TTA', description: 'Savings interest', emoji: '💳' },
    };
    return info[section] || { title: section, description: '', emoji: '📊' };
  };

  const sectionInfo = getSectionInfo(section);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-white heading-font">
            <span>{sectionInfo.emoji}</span>
            {sectionInfo.title}
          </h3>
          <p className="text-sm text-slate-400">{sectionInfo.description}</p>
          <p className="text-sm font-medium text-cyan-400 mt-1">
            Max Limit: ₹{limit.toLocaleString('en-IN')}
          </p>
        </div>
        <button
          onClick={() => onAddInvestment(section)}
          className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
          title="Add Investment"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <ProgressBar progress={progress} invested={invested} limit={limit} />

      {/* Remaining Amount */}
      <div className="mt-4 p-4 bg-gradient-to-br from-slate-900/60 to-indigo-900/30 rounded-xl border border-slate-800">
        <p className="text-sm text-slate-400">
          Remaining: <span className="font-bold text-white text-lg">₹{remaining.toLocaleString('en-IN')}</span>
        </p>
      </div>

      {/* Slots */}
      {slots && slots.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-slate-300">Investments:</h4>
          {slots.map((slot) => (
            <motion.div
              key={slot._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div>
                <p className="font-medium text-white">{slot.name}</p>
                <p className="text-sm text-slate-400">₹{slot.amount.toLocaleString('en-IN')}</p>
              </div>
              <button
                onClick={() => onDeleteSlot(data._id, slot._id)}
                className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-all"
                title="Delete Investment"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {(!slots || slots.length === 0) && (
        <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
          <p className="text-sm text-slate-400">No investments yet. Click + to add!</p>
        </div>
      )}
    </motion.div>
  );
};

export default WalletCard;
