import asyncHandler from 'express-async-handler';
import axios from 'axios';
import User from '../models/User.js';
import Income from '../models/Income.js';
import Investment from '../models/Investment.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// @desc    Get AI tax recommendations
// @route   POST /api/ai/recommendations
// @access  Private
export const getAIRecommendations = asyncHandler(async (req, res) => {
  const { userId, financialYear } = req.body;

  // Validate user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get user income data
  const incomeData = await Income.findOne({ userId, financialYear });
  if (!incomeData) {
    res.status(404);
    throw new Error('Income data not found for the specified financial year');
  }

  // Get user investments for current deductions
  const investments = await Investment.find({ userId, financialYear });
  const currentDeductions = investments.reduce((sum, inv) => sum + inv.amount, 0);

  // Prepare request payload for AI service
  const aiRequestData = {
    user_id: userId,
    age: user.age || 30, // Default if not provided
    annual_income: incomeData.totalIncome,
    current_deductions: currentDeductions,
    dependents: user.dependents || 0,
    has_home_loan: user.hasHomeLoan || false,
    home_loan_principal: user.homeLoanPrincipal || 0,
    home_loan_interest: user.homeLoanInterest || 0,
    has_health_insurance: user.hasHealthInsurance || false,
    health_insurance_premium: user.healthInsurancePremium || 0,
    employment_type: user.employmentType || 'salaried',
    investment_risk_appetite: user.riskAppetite || 'moderate',
    financial_year: financialYear,
  };

  try {
    // Call AI service
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/ai/tax-recommendations`,
      aiRequestData,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000, // 10 second timeout
      }
    );

    res.json({
      success: true,
      data: aiResponse.data,
      message: 'AI recommendations generated successfully',
    });
  } catch (error) {
    console.error('Error calling AI service:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503);
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
    
    res.status(500);
    throw new Error('Failed to generate AI recommendations');
  }
});

// @desc    Get AI recommendations with user profile
// @route   POST /api/ai/recommendations/quick
// @access  Private
export const getQuickRecommendations = asyncHandler(async (req, res) => {
  const {
    age,
    annual_income,
    current_deductions,
    dependents,
    has_home_loan,
    home_loan_interest,
    has_health_insurance,
    health_insurance_premium,
    employment_type,
    investment_risk_appetite,
  } = req.body;

  // Validate required fields
  if (!annual_income || !age) {
    res.status(400);
    throw new Error('Age and annual income are required');
  }

  const aiRequestData = {
    user_id: req.user?._id?.toString() || 'guest',
    age,
    annual_income,
    current_deductions: current_deductions || 0,
    dependents: dependents || 0,
    has_home_loan: has_home_loan || false,
    home_loan_principal: 0,
    home_loan_interest: home_loan_interest || 0,
    has_health_insurance: has_health_insurance || false,
    health_insurance_premium: health_insurance_premium || 0,
    employment_type: employment_type || 'salaried',
    investment_risk_appetite: investment_risk_appetite || 'moderate',
    financial_year: '2024-25',
  };

  try {
    const aiResponse = await axios.post(
      `${AI_SERVICE_URL}/api/ai/tax-recommendations`,
      aiRequestData,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    res.json({
      success: true,
      data: aiResponse.data,
    });
  } catch (error) {
    console.error('Error calling AI service:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      res.status(503);
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
    
    res.status(500);
    throw new Error('Failed to generate AI recommendations');
  }
});

// @desc    Check AI service health
// @route   GET /api/ai/health
// @access  Public
export const checkAIServiceHealth = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 3000,
    });

    res.json({
      success: true,
      aiService: {
        status: response.data.status,
        url: AI_SERVICE_URL,
      },
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      aiService: {
        status: 'unavailable',
        url: AI_SERVICE_URL,
        error: error.message,
      },
    });
  }
});
