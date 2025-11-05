import mongoose from 'mongoose';

const taxReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  financialYear: {
    type: String,
    required: true,
  },
  totalIncome: {
    type: Number,
    required: true,
  },
  totalDeductions: {
    type: Number,
    default: 0,
  },
  taxableIncome: {
    type: Number,
    required: true,
  },
  taxAmount: {
    type: Number,
    required: true,
  },
  regime: {
    type: String,
    enum: ['new', 'old'],
    required: true,
  },
  taxBreakdown: {
    income: Number,
    tax: Number,
    healthInsurance: Number,
  },
  investments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment',
  }],
}, {
  timestamps: true,
});

const TaxReport = mongoose.model('TaxReport', taxReportSchema);
export default TaxReport;
