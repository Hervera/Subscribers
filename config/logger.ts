import { logLevel } from './env';

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
type Level = keyof typeof levels;

const threshold = levels[logLevel as Level] ?? levels.info;

const output: Record<Level, (...args: unknown[]) => void> = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.log
};

const log = (level: Level, args: unknown[]) => {
  if (levels[level] > threshold) return;
  output[level](`[${new Date().toISOString()}] ${level.toUpperCase()}:`, ...args);
};

const logger = {
  error: (...args: unknown[]) => log('error', args),
  warn: (...args: unknown[]) => log('warn', args),
  info: (...args: unknown[]) => log('info', args),
  debug: (...args: unknown[]) => log('debug', args)
};

export default logger;
