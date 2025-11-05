import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
  pan: {
    type: String,
    unique: true,
    sparse: true,
  },
  phoneNumber: { type: String },
  taxRegime: {
    type: String,
    enum: ['new', 'old'],
    default: 'new',
  },
  // AI Tax Assistant profile fields
  age: { type: Number, min: 18, max: 100 },
  dependents: { type: Number, default: 0, min: 0 },
  hasHomeLoan: { type: Boolean, default: false },
  homeLoanPrincipal: { type: Number, default: 0, min: 0 },
  homeLoanInterest: { type: Number, default: 0, min: 0 },
  hasHealthInsurance: { type: Boolean, default: false },
  healthInsurancePremium: { type: Number, default: 0, min: 0 },
  employmentType: {
    type: String,
    enum: ['salaried', 'self-employed', 'business'],
    default: 'salaried',
  },
  riskAppetite: {
    type: String,
    enum: ['low', 'moderate', 'high'],
    default: 'moderate',
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;
