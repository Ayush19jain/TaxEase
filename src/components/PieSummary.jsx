import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { PieChartIcon } from 'lucide-react';
import { useTax } from '../context/TaxContext';

const PieSummary = () => {
  const { income, tax, netIncome, suggestedInvestment } = useTax();
  
  const data = [
    { name: 'Income Tax', value: Math.round(tax), color: '#ef4444' },
    { name: 'Investments', value: Math.round(suggestedInvestment), color: '#14b8a6' },
    { name: 'Net Income', value: Math.round(netIncome), color: '#6366f1' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-card rounded-3xl p-8"
    >
      <div className="flex items-center gap-3.5 mb-8">
        <div className="p-2.5 bg-gradient-to-br from-teal-900/40 to-teal-800/20 rounded-xl">
          <PieChartIcon className="w-6 h-6 text-teal-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 heading-font">Income Breakdown</h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-200/60">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: item.color }}
              ></div>
              <p className="text-xs text-slate-300 font-medium">{item.name}</p>
            </div>
            <p className="text-lg font-bold text-white heading-font">
              ₹{item.value.toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PieSummary;
