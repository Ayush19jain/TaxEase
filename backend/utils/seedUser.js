import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedDemoUser = async () => {
  try {
    await connectDB();

    // Check if demo user already exists
    let demoUser = await User.findOne({ email: 'demo@taxease.com' });

    if (!demoUser) {
      // Create demo user with a valid ObjectId
      demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@taxease.com',
        pan: 'DEMO12345A',
        phoneNumber: '+91 9999999999',
        taxRegime: 'new',
      });
      console.log('✅ Demo user created successfully');
    } else {
      console.log('✅ Demo user already exists');
    }

    console.log('Demo User Details:', {
      id: demoUser._id,
      name: demoUser.name,
      email: demoUser.email,
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
    process.exit(1);
  }
};

seedDemoUser();
