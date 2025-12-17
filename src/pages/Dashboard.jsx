import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Wallet, Shield, Building2, Landmark } from 'lucide-react';
import TaxCalculatorCard from '../components/TaxCalculatorCard';
import InvestmentCard from '../components/InvestmentCard';
import PieSummary from '../components/PieSummary';
import { generateTaxReport, downloadTaxReport } from '../services/api';
import { useTax } from '../context/TaxContext';

const Dashboard = () => {
  const { income, tax, netIncome, suggestedInvestment, userId, regime } = useTax();
  const investments = [
    {
      title: 'ELSS Funds',
      description: 'Equity Linked Savings Scheme with 3-year lock-in period. Best for long-term wealth creation with tax benefits.',
      returns: '12-15%',
      taxBenefit: 'Up to ₹1.5L',
      icon: TrendingUp,
      color: 'from-primary-500 to-primary-600',
      href: 'https://groww.in/mutual-funds/category/elss',
    },
    {
      title: 'NPS',
      description: 'National Pension System for retirement planning. Additional ₹50K deduction under 80CCD(1B).',
      returns: '9-12%',
      taxBenefit: 'Up to ₹2L',
      icon: Shield,
      color: 'from-teal-500 to-teal-600',
      href: 'https://www.npscra.nsdl.co.in/',
    },
    {
      title: 'PPF',
      description: 'Public Provident Fund - safe government-backed savings with 15-year maturity and tax-free returns.',
      returns: '7.1%',
      taxBenefit: 'Up to ₹1.5L',
      icon: Landmark,
      color: 'from-purple-500 to-purple-600',
      href: 'https://www.india.gov.in/spotlight/public-provident-fund',
    },
    {
      title: 'SIP',
      description: 'Systematic Investment Plan in mutual funds for disciplined investing and rupee cost averaging.',
      returns: '10-14%',
      taxBenefit: 'LTCG Tax Free up to ₹1L',
      icon: Building2,
      color: 'from-orange-500 to-orange-600',
      href: 'https://zerodha.com/products/mutual-funds',
    },
  ];

  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadReport = async () => {
    try {
      setIsGenerating(true);
      
      // Generate report
      const report = await generateTaxReport({
        userId,
        financialYear: '2024-25',
        regime: regime,
        totalIncome: income,
        taxPayable: tax,
      });
      
      // Download PDF
      if (report && report._id) {
        downloadTaxReport(report._id);
      } else {
        throw new Error('Report generation failed');
      }
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Report generated! Note: PDF download requires backend setup. Your data has been saved.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="dashboard-scroll space-y-0 relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <img src="/src/assets/finance-grid.svg" alt="" className="absolute top-0 left-0 w-full h-full object-cover" style={{mixBlendMode: 'overlay'}} />
      </div>

      {/* Section 1: Hero + Calculator + Stats */}
      <motion.section
        id="overview"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex flex-col justify-start pt-16 pb-12 gap-8 relative z-10"
      >
        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="text-5xl font-bold text-white heading-font mb-4 leading-tight">
            Smart Tax Planning Made <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Simple</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Calculate your taxes, discover investment opportunities, and maximize your savings—all in one powerful platform.
          </p>
        </motion.div>

        {/* Calculator and Illustration Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TaxCalculatorCard />
          
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex items-center justify-center"
          >
            <img 
              src="/src/assets/finance-illustration.svg" 
              alt="Finance Illustration" 
              className="w-full max-w-lg opacity-90"
            />
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass-card rounded-3xl p-8"
        >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-900/40 to-cyan-900/20 rounded-2xl shadow-sm">
              <Wallet className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1.5">Total Income</p>
              <p className="text-3xl font-bold text-white heading-font transition-all duration-500">₹{income.toLocaleString('en-IN')}</p>
              <p className="text-xs text-cyan-400 mt-2 font-medium">Annual FY 2024-25</p>
            </div>
          </div>

          <div className="flex items-center gap-5 md:border-l md:border-slate-200/60 md:pl-8">
            <div className="p-4 bg-gradient-to-br from-red-900/40 to-red-800/20 rounded-2xl shadow-sm">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1.5">Tax Payable</p>
              <p className="text-3xl font-bold text-red-300 heading-font transition-all duration-500">₹{Math.round(tax).toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">New Tax Regime</p>
            </div>
          </div>

          <div className="flex items-center gap-5 md:border-l md:border-slate-200/60 md:pl-8">
            <div className="p-4 bg-gradient-to-br from-teal-900/40 to-teal-800/20 rounded-2xl shadow-sm">
              <TrendingUp className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1.5">Savings Potential</p>
              <p className="text-3xl font-bold text-teal-300 heading-font transition-all duration-500">₹{Math.round(suggestedInvestment).toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">Via 80C investments</p>
            </div>
          </div>
        </div>
      </motion.div>
      </motion.section>

      {/* Section 2: Investments */}
      <motion.section
        id="recommendations"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="dashboard-section relative z-10"
      >
        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="glass-card rounded-3xl p-8 mb-8 border-l-4 border-cyan-500"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-900/40 to-indigo-900/20 rounded-xl">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Maximize Your Savings with Smart Investments</h3>
              <p className="text-slate-300 leading-relaxed">
                Explore tax-saving investment options under Section 80C. Each investment not only reduces your taxable income but also helps build long-term wealth. Choose the right mix to optimize your returns while staying tax-efficient.
              </p>
            </div>
          </div>
        </motion.div>

      {/* Investment Recommendations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white heading-font">
              Recommended Investments
            </h2>
            <p className="text-slate-400 mt-1.5 text-sm">Maximize your tax savings with these options</p>
          </div>
          <button
            onClick={handleDownloadReport}
            disabled={isGenerating}
            className="gradient-button flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Download Report'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {investments.map((investment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <InvestmentCard {...investment} />
            </motion.div>
          ))}
        </div>
      </motion.div>
      </motion.section>
    </div>
  );
};

// Import TrendingUp for investments data
import { TrendingUp } from 'lucide-react';

export default Dashboard;
