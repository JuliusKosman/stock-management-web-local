import axios from 'axios';

const BASE_URL = "http://localhost:5000/api"; // sesuaikan port backend

// Produk
export const getProducts = () => axios.get(`${BASE_URL}/products`);
export const addProduct = (data) => axios.post(`${BASE_URL}/products`, data);

// Stock In
export const addStockIn = (data) => axios.post(`${BASE_URL}/stock-in`, data);
export const getStockInHistory = () => axios.get(`${BASE_URL}/stock-in`);

// Stock Out
export const addStockOut = (data) => axios.post(`${BASE_URL}/stock-out`, data);

// Logs
export const getLogs = () => axios.get(`${BASE_URL}/logs`);
