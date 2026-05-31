import { motion } from 'framer-motion';
import { TrendingUp, Shield, Building2, Landmark } from 'lucide-react';
import InvestmentCard from '../components/InvestmentCard';

const Investments = () => {
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white heading-font">Investment Options</h1>
        <p className="text-slate-300 mt-1">Explore tax-saving investment opportunities</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {investments.map((investment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <InvestmentCard {...investment} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Investments;
