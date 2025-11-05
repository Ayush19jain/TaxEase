import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Calculator, TrendingUp, Wallet, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTax } from '../context/TaxContext';

const Sidebar = () => {
  const { income, tax, suggestedInvestment } = useTax();
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
    { path: '/investments', icon: Wallet, label: 'Investments' },
    { path: '/tax-wallet', icon: TrendingUp, label: 'Tax Wallet' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const chartData = [
    { name: 'Tax', value: Math.round(tax), color: '#6366f1' },
    { name: 'Investments', value: Math.round(suggestedInvestment), color: '#14b8a6' },
    { name: 'Net Income', value: Math.round(income - tax - suggestedInvestment), color: '#3b82f6' },
  ];

  return (
    <motion.aside
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-72 h-screen bg-[#0b1220]/85 backdrop-blur-xl text-slate-200 fixed left-0 top-0 shadow-2xl border-r border-slate-800 z-50 overflow-y-auto"
    >
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white heading-font tracking-tight">
            TaxEase
          </h1>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-900/40 to-cyan-900/20 text-white border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`} />
                  <span className="font-medium text-[15px]">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Tax Summary Section */}
        <div className="mt-10">
          <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide mb-4 px-2">Quick Summary</h3>
          
          <div className="bg-gradient-to-br from-slate-900/60 to-indigo-900/30 rounded-2xl p-5 border border-slate-800 shadow-sm">
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Tax Breakdown</h4>
            
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-2.5 h-2.5 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-100 font-semibold">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
