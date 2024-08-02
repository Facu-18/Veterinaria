// config/mobex.js
import dotenv from 'dotenv';
dotenv.config();

export const mobexConfig = {
    apiKey: process.env.MOBEX_API_KEY,
    apiSecret: process.env.MOBEX_API_SECRET,
    baseUrl: 'https://api.mobbex.com'
  };