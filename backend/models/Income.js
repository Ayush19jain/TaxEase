import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  financialYear: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    default: 0,
  },
  businessIncome: {
    type: Number,
    default: 0,
  },
  capitalGains: {
    type: Number,
    default: 0,
  },
  otherIncome: {
    type: Number,
    default: 0,
  },
  totalIncome: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Calculate total income before saving
incomeSchema.pre('save', function(next) {
  this.totalIncome = this.salary + this.businessIncome + this.capitalGains + this.otherIncome;
  next();
});

const Income = mongoose.model('Income', incomeSchema);
export default Income;
