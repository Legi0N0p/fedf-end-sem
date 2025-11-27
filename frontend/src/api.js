import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Accounts API
export const getAccounts = () => apiClient.get('/accounts');
export const getAccount = (id) => apiClient.get(`/accounts/${id}`);
export const createAccount = (data) => apiClient.post('/accounts', data);
export const updateAccount = (id, data) => apiClient.patch(`/accounts/${id}`, data);
export const deleteAccount = (id) => apiClient.delete(`/accounts/${id}`);

// Transactions API
export const getTransactions = (accountId = null) => {
  const params = accountId ? { accountId } : {};
  return apiClient.get('/transactions', { params });
};
export const getTransaction = (id) => apiClient.get(`/transactions/${id}`);
export const createTransaction = (data) => apiClient.post('/transactions', data);
export const updateTransaction = (id, data) =>
  apiClient.patch(`/transactions/${id}`, data);
export const deleteTransaction = (id) => apiClient.delete(`/transactions/${id}`);

// Utility API
export const validateBalance = (accountId) =>
  apiClient.get(`/validate-balance/${accountId}`);
export const getDashboardSummary = () => apiClient.get('/dashboard-summary');

export default apiClient;
