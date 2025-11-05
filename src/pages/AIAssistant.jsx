import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Shield, DollarSign, Info, AlertCircle } from 'lucide-react';
import api from '../services/api';

const AIAssistant = () => {
  const [formData, setFormData] = useState({
    age: '',
    annual_income: '',
    current_deductions: '',
    dependents: 0,
    has_home_loan: false,
    home_loan_interest: '',
    has_health_insurance: false,
    health_insurance_premium: '',
    employment_type: 'salaried',
    investment_risk_appetite: 'moderate',
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const response = await api.post('/api/ai/recommendations/quick', {
        age: parseInt(formData.age),
        annual_income: parseFloat(formData.annual_income),
        current_deductions: parseFloat(formData.current_deductions) || 0,
        dependents: parseInt(formData.dependents),
        has_home_loan: formData.has_home_loan,
        home_loan_interest: parseFloat(formData.home_loan_interest) || 0,
        has_health_insurance: formData.has_health_insurance,
        health_insurance_premium: parseFloat(formData.health_insurance_premium) || 0,
        employment_type: formData.employment_type,
        investment_risk_appetite: formData.investment_risk_appetite,
      });

      setRecommendations(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to generate recommendations. Please ensure the AI service is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    const colors = {
      Low: 'text-green-600 bg-green-50',
      Moderate: 'text-yellow-600 bg-yellow-50',
      High: 'text-red-600 bg-red-50',
    };
    return colors[risk] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent heading-font">
              AI Tax Assistant
            </h1>
          </div>
          <p className="text-slate-300 text-lg">
            Get personalized tax-saving recommendations powered by machine learning
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-3xl p-8"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white heading-font">
              <Info className="w-6 h-6 text-cyan-400" />
              Your Financial Profile
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="18"
                    max="100"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Annual Income (₹) *
                  </label>
                  <input
                    type="number"
                    name="annual_income"
                    value={formData.annual_income}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Deductions (₹)
                  </label>
                  <input
                    type="number"
                    name="current_deductions"
                    value={formData.current_deductions}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dependents
                  </label>
                  <input
                    type="number"
                    name="dependents"
                    value={formData.dependents}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              {/* Employment & Risk */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Employment Type
                  </label>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  >
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business">Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Risk Appetite
                  </label>
                  <select
                    name="investment_risk_appetite"
                    value={formData.investment_risk_appetite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Home Loan */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_home_loan"
                    checked={formData.has_home_loan}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-300">I have a home loan</span>
                </label>

                {formData.has_home_loan && (
                  <input
                    type="number"
                    name="home_loan_interest"
                    value={formData.home_loan_interest}
                    onChange={handleInputChange}
                    placeholder="Annual interest paid (₹)"
                    min="0"
                    className="w-full mt-3 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                )}
              </div>

              {/* Health Insurance */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_health_insurance"
                    checked={formData.has_health_insurance}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-300">I have health insurance</span>
                </label>

                {formData.has_health_insurance && (
                  <input
                    type="number"
                    name="health_insurance_premium"
                    value={formData.health_insurance_premium}
                    onChange={handleInputChange}
                    placeholder="Annual premium (₹)"
                    min="0"
                    className="w-full mt-3 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Generating Recommendations...'
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Get AI Recommendations
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}
          </motion.div>

          {/* Recommendations Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {recommendations ? (
              <>
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-cyan-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-7 h-7" />
                    Total Tax Saving Potential
                  </h3>
                  <div className="text-5xl font-bold mb-2">
                    ₹{recommendations.total_tax_saving_potential.toLocaleString('en-IN')}
                  </div>
                  <p className="text-cyan-100 text-sm">
                    Based on {recommendations.recommendations.length} personalized recommendations
                  </p>
                </div>

                {/* Recommendations */}
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white heading-font">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    Recommended Investments
                  </h3>

                  <div className="space-y-4">
                    {recommendations.recommendations.map((rec) => (
                      <div
                        key={rec.rank}
                        className="border border-slate-700 bg-slate-800/30 rounded-xl p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 bg-cyan-900/40 text-cyan-400 font-bold rounded-full">
                              {rec.rank}
                            </span>
                            <div>
                              <h4 className="font-semibold text-lg text-white">
                                {rec.investment_type}
                              </h4>
                              <span className="text-sm text-slate-400">{rec.section}</span>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(
                              rec.risk_level
                            )}`}
                          >
                            {rec.risk_level} Risk
                          </span>
                        </div>

                        <p className="text-slate-300 text-sm mb-4">{rec.rationale}</p>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="bg-cyan-900/20 rounded-lg p-3">
                            <p className="text-xs text-slate-400 mb-1">Recommended Amount</p>
                            <p className="text-lg font-semibold text-cyan-400">
                              ₹{rec.recommended_amount.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div className="bg-green-900/20 rounded-lg p-3">
                            <p className="text-xs text-slate-400 mb-1">Tax Saving</p>
                            <p className="text-lg font-semibold text-green-400">
                              ₹{rec.potential_tax_saving.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Liquidity: {rec.liquidity}
                          </div>
                          {rec.lock_in_period && (
                            <div>Lock-in: {rec.lock_in_period}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                {recommendations.personalized_tips.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-700/30 rounded-2xl shadow-xl p-8">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white heading-font">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                      Personalized Tips
                    </h3>
                    <ul className="space-y-2">
                      {recommendations.personalized_tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-yellow-600 mt-1">💡</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-card rounded-3xl p-12 text-center">
                <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white heading-font mb-2">
                  Ready to optimize your taxes?
                </h3>
                <p className="text-slate-400">
                  Fill in your financial profile to get AI-powered recommendations
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAssistant;
