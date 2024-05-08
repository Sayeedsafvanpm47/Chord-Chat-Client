import axios from 'axios';

// Create MarketApi instance
export const MarketApi = axios.create({
  baseURL: 'http://localhost:3003/api/market'
});

export const TicketApi = axios.create({
  baseURL: 'http://localhost:3005/api/ticket-service'
});

// Create UserApi instance
export const UserApi = axios.create({
  baseURL: 'http://localhost:3002/api/user-service'
});

// Create AuthApi instance
export const AuthApi = axios.create({
  baseURL: 'http://localhost:3001/api/users'
});

// Attach interceptor to MarketApi instance
MarketApi.interceptors.request.use((config) => {
  // Add withCredentials to the request configuration
  config.withCredentials = true;
  return config;
}, (error) => {
  // Handle request errors
  return Promise.reject(error);
});

TicketApi.interceptors.request.use((config) => {
  // Add withCredentials to the request configuration
  config.withCredentials = true;
  return config;
}, (error) => {
  // Handle request errors
  return Promise.reject(error);
});

UserApi.interceptors.request.use((config) => {

  config.withCredentials = true;
  return config;
}, (error) => {
  // Handle request errors
  return Promise.reject(error);
});