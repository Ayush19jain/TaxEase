import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Calculator } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      
      // Use auth context to login
      login(response.data.token, response.data.user);
      
      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      // Handle network errors
      if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK' || !err.response) {
        setError('Cannot connect to server. Please make sure the backend is running and try again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0b1220] via-[#0f1a2e] to-[#0a1222]">
        <div className="absolute inset-0 opacity-20">
          <img src="/src/assets/finance-grid.svg" alt="" className="w-full h-full object-cover" style={{mixBlendMode: 'overlay'}} />
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-3 rounded-xl shadow-lg shadow-indigo-500/20">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white heading-font">TaxEase</h1>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
        <p className="text-slate-300 text-center mb-8">Sign in to continue to your account</p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 input-dark rounded-xl text-[15px]"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 input-dark rounded-xl text-[15px]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
