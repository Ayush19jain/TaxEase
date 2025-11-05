import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Calendar, TrendingUp, Wallet, Clock } from 'lucide-react';
import { getIncome, getInvestments } from '../services/api';
import { useTax } from '../context/TaxContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const History = () => {
  const { userId } = useTax();
  const { user } = useAuth();
  const [incomeHistory, setIncomeHistory] = useState([]);
  const [investmentHistory, setInvestmentHistory] = useState([]);
  const [walletInvestments, setWalletInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const [incomeData, investmentData, walletData] = await Promise.all([
          getIncome(userId, '2024-25').catch(() => []),
          getInvestments(userId, '2024-25').catch(() => []),
          axios.get(`http://localhost:5000/api/wallet/${userId}?financialYear=2024-25`).then(res => res.data).catch(() => [])
        ]);
        setIncomeHistory(incomeData || []);
        setInvestmentHistory(investmentData || []);
        setWalletInvestments(walletData || []);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [userId, user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white heading-font">History</h1>
          <p className="text-slate-300 mt-1.5 text-sm">View your income and investment records</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Income History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-8"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-white heading-font">Income History</h2>
            </div>

            {incomeHistory.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No income records found</p>
                <p className="text-sm text-slate-400 mt-1">Start by adding your income in the calculator</p>
              </div>
            ) : (
              <div className="space-y-3">
                {incomeHistory.map((record, index) => (
                  <motion.div
                    key={record._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="flex items-center justify-between p-5 bg-slate-800/40 rounded-2xl border border-slate-700 hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">FY {record.financialYear}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">{formatDate(record.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 mb-1">Total Income</p>
                      <p className="text-2xl font-bold text-white heading-font">
                        ₹{record.totalIncome.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Tax Wallet Investments */}
          {walletInvestments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card rounded-3xl p-8"
            >
              <div className="flex items-center gap-3.5 mb-6">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white heading-font">Tax Wallet Investments</h2>
              </div>

              <div className="space-y-4">
                {walletInvestments.map((section, sectionIndex) => (
                  <div key={section._id} className="space-y-2">
                    <h3 className="text-sm font-semibold text-cyan-400 mb-2">{section.section}</h3>
                    {section.slots && section.slots.map((slot, slotIndex) => (
                      <motion.div
                        key={slot._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + sectionIndex * 0.05 + slotIndex * 0.02 }}
                        className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800"
                      >
                        <div>
                          <h4 className="font-semibold text-white">{slot.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">{formatDate(slot.dateAdded)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-cyan-400">
                            ₹{slot.amount.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Investment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-8"
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="p-2.5 bg-teal-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-white heading-font">Traditional Investments</h2>
            </div>

            {investmentHistory.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No investment records found</p>
                <p className="text-sm text-slate-400 mt-1">Add investments to track your portfolio</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investmentHistory.map((investment, index) => (
                  <motion.div
                    key={investment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="p-5 bg-gradient-to-br from-slate-800/40 to-teal-900/20 rounded-2xl border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white">{investment.investmentType}</h4>
                      <span className="text-xs px-2.5 py-1 bg-teal-100 text-teal-700 rounded-full font-medium">
                        {investment.section}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Amount</p>
                        <p className="text-xl font-bold text-teal-700">
                          ₹{investment.amount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">Date</p>
                        <p className="text-sm text-slate-600 font-medium">
                          {formatDate(investment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default History;
