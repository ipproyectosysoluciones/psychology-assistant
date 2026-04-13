/**
 * Environment variables type declarations
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: 'development' | 'test' | 'production';
      MONGO_URI?: string;
      DATABASE_URL?: string;
      JWT_SECRET?: string;
      JWT_EXPIRE?: string;
      REFRESH_TOKEN_SECRET?: string;
      SESSION_SECRET?: string;
      SESSION_TIMEOUT?: string;
      TWO_FA_WINDOW?: string;
      LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug' | 'verbose';
      CORS_ORIGIN?: string;
      FRONTEND_URL?: string;
      API_URL?: string;
      EMAIL_SERVICE_PASSWORD?: string;
      EXTERNAL_API_KEY?: string;
    }
  }
}

export {};
