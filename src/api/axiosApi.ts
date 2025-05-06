import axios from 'axios';

export const axiosApi = axios.create({
  baseURL: 'https://drivup-backend.onrender.com',
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  }
});