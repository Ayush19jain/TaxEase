import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';

const InvestmentCard = ({ title, description, returns, taxBenefit, icon: Icon, color, href }) => {
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={handleClick}
      role={href ? 'link' : undefined}
      className="glass-card rounded-3xl p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1.5 text-teal-300 text-sm font-semibold bg-teal-900/30 px-3 py-1.5 rounded-full border border-teal-800/50">
          <TrendingUp className="w-3.5 h-3.5" />
          {returns}
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2.5 heading-font">{title}</h3>
      <p className="text-sm text-slate-300 mb-5 line-clamp-2 leading-relaxed">{description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700/60">
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">Tax Benefit</p>
          <p className="text-sm font-bold text-cyan-400">{taxBenefit}</p>
        </div>
        <a
          className="flex items-center gap-2 text-cyan-400 text-sm font-semibold group-hover:gap-3 transition-all"
          href={href || '#'}
          target={href ? '_blank' : undefined}
          rel={href ? 'noopener noreferrer' : undefined}
          onClick={(e) => { if (!href) e.preventDefault(); e.stopPropagation(); }}
        >
          Learn More
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

export default InvestmentCard;
