import { config } from '@/config.app';

export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONFLICT = 'CONFLICT',
}

export enum keyJWT {
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  SESSION = 'SESSION',
  REGISTER = 'REGISTER',
}

export type PayloadSession = {
  session_id: string;
  key: keyJWT;
};

export const DOMAIN = {
  test: {
    name: 'test',
    database: 'web_test',
    type: 'mongodb',
    url: config.MONGO_URI,
  },
  main: {
    name: 'main',
    database: 'web_dev',
    type: 'mongodb',
    url: config.MONGO_URI_MAIN,
  },
  identity: {
    name: 'identity',
    database: 'identity',
    type: 'mongodb',
    url: 'mongodb://localhost:27017/identity',
  },
};
