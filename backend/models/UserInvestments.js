import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const userInvestmentsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  financialYear: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    enum: ['80C', '80CCD(1B)', '80D', '80DD', '80DDB', '80E', '80G', '80TTA'],
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  invested: {
    type: Number,
    default: 0,
    min: 0,
  },
  slots: [slotSchema],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique section per user per financial year
userInvestmentsSchema.index({ userId: 1, financialYear: 1, section: 1 }, { unique: true });

// Method to calculate remaining limit
userInvestmentsSchema.methods.getRemainingLimit = function() {
  return Math.max(0, this.limit - this.invested);
};

// Method to calculate progress percentage
userInvestmentsSchema.methods.getProgressPercentage = function() {
  return this.limit > 0 ? (this.invested / this.limit) * 100 : 0;
};

// Pre-save hook to update invested amount from slots
userInvestmentsSchema.pre('save', function(next) {
  this.invested = this.slots.reduce((sum, slot) => sum + slot.amount, 0);
  this.lastUpdated = new Date();
  next();
});

const UserInvestments = mongoose.model('UserInvestments', userInvestmentsSchema);
export default UserInvestments;
