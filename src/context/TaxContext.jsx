import { createContext, useContext, useState, useEffect } from 'react';
import { createIncome, updateIncome, getIncome } from '../services/api';

const TaxContext = createContext();

export const useTax = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTax must be used within a TaxProvider');
  }
  return context;
};

export const TaxProvider = ({ children }) => {
  const [income, setIncome] = useState(1200000);
  const [regime, setRegime] = useState('new');
  const [userId, setUserId] = useState('6904eb2f406cd712ed7a0dfd'); // Demo user ID from MongoDB
  const [incomeRecordId, setIncomeRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTax = (incomeAmount, taxRegime) => {
    if (taxRegime === 'new') {
      if (incomeAmount <= 300000) return 0;
      if (incomeAmount <= 600000) return (incomeAmount - 300000) * 0.05;
      if (incomeAmount <= 900000) return 15000 + (incomeAmount - 600000) * 0.10;
      if (incomeAmount <= 1200000) return 45000 + (incomeAmount - 900000) * 0.15;
      if (incomeAmount <= 1500000) return 90000 + (incomeAmount - 1200000) * 0.20;
      return 150000 + (incomeAmount - 1500000) * 0.30;
    } else {
      // Old regime calculation
      if (incomeAmount <= 250000) return 0;
      if (incomeAmount <= 500000) return (incomeAmount - 250000) * 0.05;
      if (incomeAmount <= 1000000) return 12500 + (incomeAmount - 500000) * 0.20;
      return 112500 + (incomeAmount - 1000000) * 0.30;
    }
  };

  const tax = calculateTax(income, regime);
  const netIncome = income - tax;
  
  // Estimate investments based on 80C limit
  const maxInvestment = 150000;
  const suggestedInvestment = Math.min(maxInvestment, income * 0.125); // 12.5% of income

  // Load income data on mount
  useEffect(() => {
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
  };

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
};
