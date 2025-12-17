import { motion } from 'framer-motion';
import { FileText, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useTax } from '../context/TaxContext';

const Reports = () => {
  const { income, tax } = useTax();
  const monthlyIncome = Math.round(income / 12);
  const monthlyTax = Math.round(tax / 12);
  
  const monthlyData = [
    { month: 'Apr', income: monthlyIncome, tax: monthlyTax },
    { month: 'May', income: monthlyIncome, tax: monthlyTax },
    { month: 'Jun', income: monthlyIncome, tax: monthlyTax },
    { month: 'Jul', income: monthlyIncome, tax: monthlyTax },
    { month: 'Aug', income: monthlyIncome, tax: monthlyTax },
    { month: 'Sep', income: monthlyIncome, tax: monthlyTax },
    { month: 'Oct', income: monthlyIncome, tax: monthlyTax },
    { month: 'Nov', income: monthlyIncome, tax: monthlyTax },
    { month: 'Dec', income: monthlyIncome, tax: monthlyTax },
    { month: 'Jan', income: monthlyIncome, tax: monthlyTax },
    { month: 'Feb', income: monthlyIncome, tax: monthlyTax },
    { month: 'Mar', income: monthlyIncome, tax: monthlyTax },
  ];

  const reports = [
    {
      title: 'Annual Tax Report 2024-25',
      date: 'March 31, 2025',
      status: 'Current',
      size: '2.4 MB',
    },
    {
      title: 'Annual Tax Report 2023-24',
      date: 'March 31, 2024',
      status: 'Completed',
      size: '2.1 MB',
    },
    {
      title: 'Investment Summary Q4 2024',
      date: 'December 31, 2024',
      status: 'Completed',
      size: '1.8 MB',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white heading-font">Tax Reports</h1>
          <p className="text-slate-300 mt-1">View and download your tax reports</p>
        </div>
        <button className="gradient-button flex items-center gap-2">
          <Download className="w-4 h-4" />
          Generate New Report
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            <p className="text-sm text-slate-400">Current FY</p>
          </div>
          <p className="text-2xl font-bold text-white heading-font">2024-25</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <p className="text-sm text-slate-400">Total Income</p>
          </div>
          <p className="text-2xl font-bold text-white heading-font">₹{income.toLocaleString('en-IN')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <p className="text-sm text-slate-400">Total Tax</p>
          </div>
          <p className="text-2xl font-bold text-red-600">₹{Math.round(tax).toLocaleString('en-IN')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-slate-400">Reports</p>
          </div>
          <p className="text-2xl font-bold text-white heading-font">3</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white heading-font mb-4">Monthly Income vs Tax</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              />
              <Bar dataKey="income" fill="#6366f1" radius={[8, 8, 0, 0]} />
              <Bar dataKey="tax" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white heading-font mb-4">Tax Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              />
              <Line type="monotone" dataKey="tax" stroke="#14b8a6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white heading-font mb-4">Available Reports</h3>
        <div className="space-y-3">
          {reports.map((report, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{report.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-slate-500">{report.date}</p>
                    <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full">
                      {report.status}
                    </span>
                    <p className="text-xs text-slate-400">{report.size}</p>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
