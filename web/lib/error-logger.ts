/**
 * Error Logger
 * 
 * Centralized error logging with categorization and context.
 * Prepares for integration with error tracking services (Sentry, etc.)
 */

import { MakanaError, ErrorCategory, ErrorSeverity, formatErrorForLogging } from './error-handling';

/**
 * Log entry interface
 */
interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  category?: string;
  context?: Record<string, unknown>;
  stack?: string;
}

/**
 * Error logger class
 */
class ErrorLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Keep last 100 logs in memory
  
  /**
   * Log an error
   */
  logError(error: MakanaError): void {
    const entry: LogEntry = {
      level: this.severityToLevel(error.severity),
      message: formatErrorForLogging(error),
      timestamp: error.timestamp,
      category: error.category,
      context: {
        code: error.code,
        statusCode: error.statusCode,
        userMessage: error.userMessage,
        technicalMessage: error.technicalMessage,
        ...error.context,
      },
    };
    
    this.addLog(entry);
    this.sendToConsole(entry);
    
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorTracking(error);
    }
  }
  
  /**
   * Log a general message
   */
  log(level: 'info' | 'warn' | 'error' | 'debug', message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    
    this.addLog(entry);
    this.sendToConsole(entry);
  }
  
  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }
  
  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }
  
  /**
   * Log error message
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }
  
  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, context);
    }
  }
  
  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.slice(-count);
  }
  
  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
  }
  
  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
  
  /**
   * Add log entry to memory
   */
  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only last N logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
  
  /**
   * Send log to console
   */
  private sendToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    const message = `${prefix} ${entry.message}`;
    
    switch (entry.level) {
      case 'error':
        console.error(message, entry.context);
        break;
      case 'warn':
        console.warn(message, entry.context);
        break;
      case 'info':
        console.info(message, entry.context);
        break;
      case 'debug':
        console.debug(message, entry.context);
        break;
    }
  }
  
  /**
   * Send error to tracking service (Sentry, etc.)
   */
  private sendToErrorTracking(error: MakanaError): void {
    // TODO: Integrate with Sentry or similar service
    // Example:
    // Sentry.captureException(new Error(error.technicalMessage), {
    //   level: this.severityToSentryLevel(error.severity),
    //   tags: {
    //     category: error.category,
    //     code: error.code,
    //   },
    //   extra: error.context,
    // });
    
    // For now, just log that we would send it
    if (process.env.NODE_ENV === 'development') {
      console.log('[ErrorLogger] Would send to error tracking:', error);
    }
  }
  
  /**
   * Convert severity to log level
   */
  private severityToLevel(severity: ErrorSeverity): 'info' | 'warn' | 'error' | 'debug' {
    switch (severity) {
      case ErrorSeverity.INFO:
        return 'info';
      case ErrorSeverity.WARNING:
        return 'warn';
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        return 'error';
      default:
        return 'error';
    }
  }
}

/**
 * Singleton instance
 */
export const errorLogger = new ErrorLogger();

/**
 * Convenience functions
 */
export const logError = (error: MakanaError) => errorLogger.logError(error);
export const logInfo = (message: string, context?: Record<string, unknown>) => errorLogger.info(message, context);
export const logWarn = (message: string, context?: Record<string, unknown>) => errorLogger.warn(message, context);
export const logDebug = (message: string, context?: Record<string, unknown>) => errorLogger.debug(message, context);

/**
 * Error boundary logger
 */
export function logComponentError(error: Error, errorInfo: { componentStack: string }): void {
  errorLogger.error('Component Error', {
    message: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
  });
}

/**
 * API error logger
 */
export function logApiError(endpoint: string, error: unknown, requestData?: unknown): void {
  errorLogger.error('API Error', {
    endpoint,
    error: error instanceof Error ? error.message : String(error),
    requestData,
  });
}

/**
 * Network error logger
 */
export function logNetworkError(url: string, error: unknown): void {
  errorLogger.warn('Network Error', {
    url,
    error: error instanceof Error ? error.message : String(error),
  });
}

/**
 * Performance logger
 */
export function logPerformance(operation: string, duration: number, threshold: number = 1000): void {
  if (duration > threshold) {
    errorLogger.warn('Slow Operation', {
      operation,
      duration: `${duration}ms`,
      threshold: `${threshold}ms`,
    });
  }
}

/**
 * User action logger (for debugging)
 */
export function logUserAction(action: string, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    errorLogger.debug('User Action', {
      action,
      ...context,
    });
  }
}
