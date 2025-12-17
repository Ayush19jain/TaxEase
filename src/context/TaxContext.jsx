import { createContext, useContext, useState, useEffect } from 'react';
import { createIncome, updateIncome, getIncome } from '../services/api';
import { useAuth } from './AuthContext.jsx';

const TaxContext = createContext();

export const useTax = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};

export const TaxProvider = ({ children }) => {
  const { user } = useAuth();
  const [income, setIncome] = useState(1200000);
  const [regime, setRegime] = useState('new');
  const userId = user?.id || user?._id || null;
  const [incomeRecordId, setIncomeRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletDeductions, setWalletDeductions] = useState(0);

  const calculateTax = (incomeAmount, taxRegime, deductions = 0) => {
    // Apply deductions to taxable income (only for old regime)
    const taxableIncome = taxRegime === 'old' ? Math.max(0, incomeAmount - deductions) : incomeAmount;
    
    if (taxRegime === 'new') {
      if (taxableIncome <= 300000) return 0;
      if (taxableIncome <= 600000) return (taxableIncome - 300000) * 0.05;
      if (taxableIncome <= 900000) return 15000 + (taxableIncome - 600000) * 0.10;
      if (taxableIncome <= 1200000) return 45000 + (taxableIncome - 900000) * 0.15;
      if (taxableIncome <= 1500000) return 90000 + (taxableIncome - 1200000) * 0.20;
      return 150000 + (taxableIncome - 1500000) * 0.30;
    } else {
      // Old regime calculation with deductions
      if (taxableIncome <= 250000) return 0;
      if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
      if (taxableIncome <= 1000000) return 12500 + (taxableIncome - 500000) * 0.20;
      return 112500 + (taxableIncome - 1000000) * 0.30;
    }
  };

  const tax = calculateTax(income, regime, walletDeductions);
  const netIncome = income - tax;
  
  // Estimate investments based on 80C limit
  const maxInvestment = 150000;
  const remainingDeduction = Math.max(0, maxInvestment - walletDeductions);
  const suggestedInvestment = Math.min(remainingDeduction, income * 0.125); // 12.5% of income

  // Load income data on mount
  useEffect(() => {
    if (!userId) return;
    const loadIncome = async () => {
      try {
        setIsLoading(true);
        const records = await getIncome(userId, '2024-25');
        if (records && records.length > 0) {
          const latest = records[0];
          setIncome(latest.totalIncome);
          setIncomeRecordId(latest._id);
        }
      } catch (error) {
        console.log('No previous income data found, using defaults');
      } finally {
        setIsLoading(false);
      }
    };
    loadIncome();
  }, [userId]);

  // Save to backend when income or regime changes
  useEffect(() => {
    if (!userId) return;
    const saveIncome = async () => {
      try {
        const incomeData = {
          userId,
          financialYear: '2024-25',
          salary: income,
          businessIncome: 0,
          capitalGains: 0,
          otherIncome: 0,
        };

        if (incomeRecordId) {
          await updateIncome(incomeRecordId, incomeData);
        } else {
          const newRecord = await createIncome(incomeData);
          setIncomeRecordId(newRecord._id);
        }
      } catch (error) {
        console.error('Error saving income:', error);
      }
    };

    // Debounce save - wait 1 second after user stops typing
    const timeoutId = setTimeout(saveIncome, 1000);
    return () => clearTimeout(timeoutId);
  }, [income, userId, incomeRecordId]);

  const value = {
    income,
    setIncome,
    regime,
    setRegime,
    tax,
    netIncome,
    suggestedInvestment,
    calculateTax,
    userId,
    isLoading,
    walletDeductions,
    setWalletDeductions,
  };

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
};
