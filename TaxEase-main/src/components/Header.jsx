import { Bell, Search, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-[#0b1220]/70 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between px-10 py-5">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tax deductions, investments, or reports..."
              className="w-full pl-12 pr-4 py-3 input-dark rounded-xl text-[15px] transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative p-2.5 hover:bg-slate-800/70 rounded-xl transition-all group">
            <Bell className="w-5 h-5 text-slate-300 group-hover:text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0b1220]"></span>
          </button>

          <div className="relative flex items-center gap-3.5 pl-5 border-l border-slate-800">
            <div className="text-right">
              <p className="text-[15px] font-semibold text-slate-100">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email || ''}</p>
            </div>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
            >
              <User className="w-5 h-5 text-white" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 glass-card rounded-xl overflow-hidden shadow-xl">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-800/50 transition-all text-slate-300 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
