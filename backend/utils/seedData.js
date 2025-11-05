import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Income from '../models/Income.js';
import Investment from '../models/Investment.js';
import connectDB from '../config/db.js';

dotenv.config();

const sampleData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Income.deleteMany();
    await Investment.deleteMany();

    console.log('Cleared existing data');

    // Create sample user
    const user = await User.create({
      name: 'Ayush Kumar',
      email: 'ayush@example.com',
      pan: 'ABCDE1234F',
      phoneNumber: '9876543210',
      taxRegime: 'new',
    });

    console.log('Created sample user:', user._id);

    // Create sample income
    const income = await Income.create({
      userId: user._id,
      financialYear: '2024-25',
      salary: 1200000,
      businessIncome: 0,
      capitalGains: 0,
      otherIncome: 0,
      totalIncome: 1200000,
    });

    console.log('Created sample income:', income._id);

    // Create sample investments
    const investments = await Investment.insertMany([
      {
        userId: user._id,
        financialYear: '2024-25',
        type: 'ELSS',
        amount: 50000,
        section: '80C',
        returns: 13.5,
        description: 'Equity Linked Savings Scheme',
      },
      {
        userId: user._id,
        financialYear: '2024-25',
        type: 'PPF',
        amount: 60000,
        section: '80C',
        returns: 7.1,
        description: 'Public Provident Fund',
      },
      {
        userId: user._id,
        financialYear: '2024-25',
        type: 'NPS',
        amount: 40000,
        section: '80CCD(1B)',
        returns: 10.5,
        description: 'National Pension System',
      },
    ]);

    console.log(`Created ${investments.length} sample investments`);

    console.log('\\nSample data created successfully!');
    console.log(`User ID: ${user._id}`);
    console.log('\\nUse this User ID in the frontend for testing.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

sampleData();
