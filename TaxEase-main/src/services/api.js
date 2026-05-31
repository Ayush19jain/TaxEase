import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Income API
export const getIncome = async (userId, financialYear) => {
  const response = await axios.get(`${API_URL}/income/${userId}`, {
    params: { financialYear },
  });
  return response.data;
};

export const createIncome = async (incomeData) => {
  const response = await axios.post(`${API_URL}/income`, incomeData);
  return response.data;
};

export const updateIncome = async (id, incomeData) => {
  const response = await axios.put(`${API_URL}/income/${id}`, incomeData);
  return response.data;
};

// Investment API
export const getInvestments = async (userId, financialYear) => {
  const response = await axios.get(`${API_URL}/investments/${userId}`, {
    params: { financialYear },
  });
  return response.data;
};

export const getInvestmentSummary = async (userId, financialYear) => {
  const response = await axios.get(`${API_URL}/investments/${userId}/summary`, {
    params: { financialYear },
  });
  return response.data;
};

export const createInvestment = async (investmentData) => {
  const response = await axios.post(`${API_URL}/investments`, investmentData);
  return response.data;
};

export const updateInvestment = async (id, investmentData) => {
  const response = await axios.put(`${API_URL}/investments/${id}`, investmentData);
  return response.data;
};

export const deleteInvestment = async (id) => {
  const response = await axios.delete(`${API_URL}/investments/${id}`);
  return response.data;
};

// Tax API
export const calculateTax = async (taxData) => {
  const response = await axios.post(`${API_URL}/tax/calculate`, taxData);
  return response.data;
};

export const generateTaxReport = async (reportData) => {
  const response = await axios.post(`${API_URL}/tax/report`, reportData);
  return response.data;
};

export const getTaxReports = async (userId) => {
  const response = await axios.get(`${API_URL}/tax/reports/${userId}`);
  return response.data;
};

export const downloadTaxReport = (reportId) => {
  window.open(`${API_URL}/tax/report/${reportId}/download`, '_blank');
};

// Tax Wallet API
export const getWallet = async (userId, financialYear) => {
  const response = await axios.get(`${API_URL}/wallet/${userId}`, {
    params: { financialYear },
  });
  return response.data;
};

export const getWalletSummary = async (userId, financialYear) => {
  const response = await axios.get(`${API_URL}/wallet/${userId}/summary`, {
    params: { financialYear },
  });
  return response.data;
};

export const addWalletInvestment = async ({ userId, financialYear, section, name, amount }) => {
  const response = await axios.post(`${API_URL}/wallet/add`, {
    userId,
    financialYear,
    section,
    name,
    amount,
  });
  return response.data;
};

export const updateWalletSlot = async ({ sectionId, slotId, name, amount }) => {
  const response = await axios.put(`${API_URL}/wallet/${sectionId}/slot/${slotId}`, {
    name,
    amount,
  });
  return response.data;
};

export const deleteWalletSlot = async ({ sectionId, slotId }) => {
  const response = await axios.delete(`${API_URL}/wallet/${sectionId}/slot/${slotId}`);
  return response.data;
};

export const initializeWallet = async ({ userId, financialYear, sections }) => {
  const response = await axios.post(`${API_URL}/wallet/initialize`, {
    userId,
    financialYear,
    sections,
  });
  return response.data;
};
