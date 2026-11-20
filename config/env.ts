import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const nodeEnv = process.env.NODE_ENV || 'development';
export const port = Number(process.env.PORT) || 3000;
// Checked above, so it is always set here
export const databaseUrl = process.env.DATABASE_URL as string;
export const logLevel = process.env.LOG_LEVEL || 'info';
