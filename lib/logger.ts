type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static instance: Logger;
  private isDevelopment = process.env.NODE_ENV === 'development';

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
      service: 'space-by-creative',
    };
  }

  public info(message: string, meta?: any) {
    const log = this.formatMessage('info', message, meta);
    console.log(JSON.stringify(log));
  }

  public warn(message: string, meta?: any) {
    const log = this.formatMessage('warn', message, meta);
    console.warn(JSON.stringify(log));
  }

  public error(message: string, error?: Error | unknown, meta?: any) {
    const log = this.formatMessage('error', message, {
      ...meta,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    console.error(JSON.stringify(log));
  }

  public debug(message: string, meta?: any) {
    if (this.isDevelopment) {
      const log = this.formatMessage('debug', message, meta);
      console.debug(JSON.stringify(log));
    }
  }
}

export const logger = Logger.getInstance();
