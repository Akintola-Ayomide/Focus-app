import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
config({ path: path.join(__dirname, '../../.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  // Add other environment variables here as needed
};
