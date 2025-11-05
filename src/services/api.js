import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

// Income API
export const getIncome = async (userId, financialYear) => {
  const response = await axios.get(`${API_URL}/api/income/${userId}`, {
    params: { financialYear },
  });
  return response.data;
};

export const createIncome = async (incomeData) => {
  const response = await axios.post(`${API_URL}/api/income`, incomeData);
  return response.data;
};

export const updateIncome = async (id, incomeData) => {
  const response = await axios.put(`${API_URL}/api/income/${id}`, incomeData);
  return response.data;
};

// Investment API
export const getInvestments = async (userId, financialYear) => {
  const response = await axios.get(`${API_URL}/api/investments/${userId}`, {
    params: { financialYear },
  });
  return response.data;
};

export const getInvestmentSummary = async (userId, financialYear) => {
  const response = await axios.get(`${API_URL}/api/investments/${userId}/summary`, {
    params: { financialYear },
  });
  return response.data;
};

export const createInvestment = async (investmentData) => {
  const response = await axios.post(`${API_URL}/api/investments`, investmentData);
  return response.data;
};

export const updateInvestment = async (id, investmentData) => {
  const response = await axios.put(`${API_URL}/api/investments/${id}`, investmentData);
  return response.data;
};

export const deleteInvestment = async (id) => {
  const response = await axios.delete(`${API_URL}/api/investments/${id}`);
  return response.data;
};

// Tax API
export const calculateTax = async (taxData) => {
  const response = await axios.post(`${API_URL}/api/tax/calculate`, taxData);
  return response.data;
};

export const generateTaxReport = async (reportData) => {
  const response = await axios.post(`${API_URL}/api/tax/report`, reportData);
  return response.data;
};

export const getTaxReports = async (userId) => {
  const response = await axios.get(`${API_URL}/api/tax/reports/${userId}`);
  return response.data;
};

export const downloadTaxReport = (reportId) => {
  window.open(`${API_URL}/api/tax/report/${reportId}/download`, '_blank');
};
