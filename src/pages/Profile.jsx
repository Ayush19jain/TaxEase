import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building, Calendar, Edit, Save } from 'lucide-react';
import { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ayush Kumar',
    email: 'ayush.kumar@example.com',
    phone: '+91 98765 43210',
    pan: 'ABCDE1234F',
    address: 'Mumbai, Maharashtra',
    occupation: 'Software Engineer',
    employer: 'Tech Solutions Pvt Ltd',
    dob: '1995-06-15',
    taxRegime: 'New',
  });

  const handleSave = () => {
    setIsEditing(false);
    // Mock save action
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white heading-font">My Profile</h1>
          <p className="text-slate-300 mt-1">Manage your personal information</p>
        </div>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="gradient-button flex items-center gap-2"
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mx-auto flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
          <p className="text-slate-300 mb-4">{profile.occupation}</p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="px-3 py-1 bg-indigo-900/30 text-cyan-300 rounded-full font-medium border border-slate-700">
              Premium User
            </span>
            <span className="px-3 py-1 bg-teal-900/30 text-teal-300 rounded-full font-medium border border-slate-700">
              {profile.taxRegime} Regime
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-left">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Phone className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-800">{profile.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 heading-font">Personal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2.5 input-dark rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2.5 input-dark rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2.5 input-dark rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                PAN Number
              </label>
              <input
                type="text"
                value={profile.pan}
                onChange={(e) => setProfile({ ...profile, pan: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 input-dark rounded-lg disabled:opacity-60 disabled:cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="date"
                  value={profile.dob}
                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2.5 input-dark rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Occupation
              </label>
              <input
                type="text"
                value={profile.occupation}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 input-dark rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Employer
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={profile.employer}
                  onChange={(e) => setProfile({ ...profile, employer: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2.5 input-dark rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2.5 input-dark rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/60">
            <h4 className="text-lg font-bold text-white mb-4 heading-font">Tax Preferences</h4>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Preferred Tax Regime
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setProfile({ ...profile, taxRegime: 'New' })}
                  disabled={!isEditing}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    profile.taxRegime === 'New'
                      ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700'
                  }`}
                >
                  New Regime
                </button>
                <button
                  onClick={() => setProfile({ ...profile, taxRegime: 'Old' })}
                  disabled={!isEditing}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    profile.taxRegime === 'Old'
                      ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 border border-slate-700'
                  }`}
                >
                  Old Regime
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
