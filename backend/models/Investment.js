import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  financialYear: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['ELSS', 'PPF', 'NPS', 'SIP', 'FD', 'LIC', 'EPF', 'NSC', 'Other'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  section: {
    type: String,
    enum: ['80C', '80CCD(1B)', '80D', 'Other'],
    default: '80C',
  },
  returns: {
    type: Number, // Expected annual returns percentage
    default: 0,
  },
  description: String,
  dateInvested: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Investment = mongoose.model('Investment', investmentSchema);
export default Investment;
