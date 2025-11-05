import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, PlusCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTax } from '../context/TaxContext';
import WalletCard from '../components/WalletCard';
import AddInvestmentModal from '../components/AddInvestmentModal';

const AVAILABLE_SECTIONS = ['80C', '80CCD(1B)', '80D', '80DD', '80DDB', '80E', '80G', '80TTA'];

const TaxWallet = () => {
  const { user } = useAuth();
  const { setWalletDeductions } = useTax();
  const [walletData, setWalletData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('80C');
  const [financialYear] = useState('2024-25');

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const userId = user.id || user._id; // Handle both id formats
      const { data } = await axios.get(`http://localhost:5000/api/wallet/${userId}?financialYear=${financialYear}`);
      setWalletData(data);

      const summaryRes = await axios.get(`http://localhost:5000/api/wallet/${userId}/summary?financialYear=${financialYear}`);
      setSummary(summaryRes.data);
      
      // Update tax context with total deductions from wallet
      setWalletDeductions(summaryRes.data.totalInvested || 0);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  // Add investment
  const handleAddInvestment = async (investment) => {
    try {
      const userId = user.id || user._id; // Handle both id formats
      console.log('Adding investment:', investment);
      console.log('User ID:', userId);
      console.log('User object:', user);
      
      const response = await axios.post('http://localhost:5000/api/wallet/add', {
        userId: userId,
        financialYear,
        ...investment,
      });
      
      console.log('Success:', response.data);
      setIsModalOpen(false);
      fetchWalletData();
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Error adding investment';
      alert(errorMessage);
    }
  };

  // Delete slot
  const handleDeleteSlot = async (sectionId, slotId) => {
    if (!confirm('Are you sure you want to delete this investment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/wallet/${sectionId}/slot/${slotId}`);
      fetchWalletData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting investment');
    }
  };

  // Open modal with specific section
  const openModalForSection = (section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">User not loaded. Please refresh or login again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <img src="/src/assets/finance-grid.svg" alt="" className="absolute top-0 left-0 w-full h-full object-cover" style={{mixBlendMode: 'overlay'}} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
              <Wallet size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white heading-font">Smart Tax Wallet</h1>
          </div>
          <p className="text-slate-300 text-lg">Track your tax-saving investments and maximize deductions</p>
        </motion.div>

        {/* Summary Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="glass-card rounded-2xl p-6 border border-slate-800">
              <p className="text-sm text-slate-400 font-medium mb-2">Total Invested</p>
              <p className="text-3xl font-bold text-green-400 heading-font">₹{summary.totalInvested.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-slate-800">
              <p className="text-sm text-slate-400 font-medium mb-2">Total Limit</p>
              <p className="text-3xl font-bold text-cyan-400 heading-font">₹{summary.totalLimit.toLocaleString('en-IN')}</p>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-slate-800">
              <p className="text-sm text-slate-400 font-medium mb-2">Remaining</p>
              <p className="text-3xl font-bold text-orange-400 heading-font">₹{summary.totalRemaining.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
        )}

        {/* Add New Section Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="gradient-button flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Add New Investment
          </button>
        </div>

        {/* Wallet Cards */}
        {walletData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {walletData.map((section) => (
              <WalletCard
                key={section._id}
                data={section}
                onAddInvestment={openModalForSection}
                onDeleteSlot={handleDeleteSlot}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl p-12 text-center border border-slate-800"
          >
            <div className="p-4 bg-gradient-to-br from-indigo-900/40 to-cyan-900/20 rounded-2xl inline-block mb-4">
              <Wallet size={64} className="text-cyan-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2 heading-font">Your Tax Wallet is Empty</h3>
            <p className="text-slate-400 mb-8 text-lg">Start adding your tax-saving investments to track progress</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="gradient-button"
            >
              Add Your First Investment
            </button>
          </motion.div>
        )}
      </div>

      {/* Add Investment Modal */}
      <AddInvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddInvestment}
        sections={AVAILABLE_SECTIONS}
        defaultSection={selectedSection}
      />
    </div>
  );
};

export default TaxWallet;
