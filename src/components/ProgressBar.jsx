import { motion } from 'framer-motion';

const ProgressBar = ({ progress, invested, limit }) => {
  // Determine color based on progress
  const getColor = () => {
    if (progress >= 90) return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    if (progress >= 60) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-green-500 to-teal-500';
  };

  const getMessage = () => {
    if (progress >= 100) return '🎯 Max savings achieved!';
    if (progress >= 90) return '🔵 Almost maxed out!';
    if (progress >= 60) return '🟡 Great progress!';
    return '🟢 Keep going!';
  };

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-slate-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${getColor()} transition-colors duration-300 shadow-lg`}
        />
      </div>

      {/* Progress Info */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-300">
          ₹{invested.toLocaleString('en-IN')} / ₹{limit.toLocaleString('en-IN')}
        </span>
        <span className="font-semibold text-white">{Math.round(progress)}%</span>
      </div>

      {/* Motivational Message */}
      <p className="text-xs text-center font-medium text-cyan-400">
        {getMessage()}
      </p>
    </div>
  );
};

export default ProgressBar;
