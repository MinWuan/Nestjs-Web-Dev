const SERVER_PORT = 3000;
const SERVER_HOST = 'localhost';

class Config {
  public NODE_ENV: string;

  public PORT: number;
  public HOST: string;

  public CLIENT_URL: string;
  public CLIENT_URL2: string
  public CLIENT_URL3: string;
  public CLIENT_URL4: string;

  public PRIVATE_KEY_WALLET: string;
  public SINATURE_KEY: string;
  public ENCRYPTION_KEY: string;
  public ENCRYPTION_IV: string;

  public MONGO_URI: string;
  public MONGO_URI_MAIN: string;
  public JWT_KEY_AUTH: string;
  public JWT_EXPIRES_AUTH: string;

  public REDIS_HOST: string;
  public REDIS_PORT: number;
  public REDIS_USERNAME: string;
  public REDIS_PASSWORD: string;

  public REDIS_EXPIRES_AUTH: number

  public COOKIE_NAME_AUTH: string;
  public COOKIE_EXPIRES_IN: number;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || '(unknown)';

    this.PORT = +(process.env.PORT ?? SERVER_PORT);
    this.HOST = process.env.HOST || SERVER_HOST;

    this.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8888';
    this.CLIENT_URL2 = process.env.CLIENT_URL2 || '';
    this.CLIENT_URL3 = process.env.CLIENT_URL3 || '';
    this.CLIENT_URL4 = process.env.CLIENT_URL4 || '';

    this.PRIVATE_KEY_WALLET = process.env.PRIVATE_KEY_WALLET || 'private-key-wallet';
    this.SINATURE_KEY = process.env.SINATURE_KEY || "signature-key";
    this.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "encryption-key";
    this.ENCRYPTION_IV = process.env.ENCRYPTION_IV || "encryption-iv";

    this.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nest';
    this.MONGO_URI_MAIN = process.env.MONGO_URI_MAIN || 'mongodb://localhost:27017/web_dev';
    this.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
    this.REDIS_PORT = +(process.env.REDIS_PORT || 6379);
    this.REDIS_USERNAME = process.env.REDIS_USERNAME || 'admin';
    this.REDIS_PASSWORD = process.env.REDIS_PASSWORD || 'password';

    this.REDIS_EXPIRES_AUTH = Number(process.env.REDIS_EXPIRES_AUTH) || 86400; // 1 day (seconds)

    this.JWT_KEY_AUTH = process.env.JWT_KEY_AUTH || 'secret-key-auth';
    this.JWT_EXPIRES_AUTH = process.env.JWT_EXPIRES_AUTH || '1h';

    this.COOKIE_NAME_AUTH = process.env.COOKIE_NAME_AUTH || 'session';
    this.COOKIE_EXPIRES_IN = Number(process.env.COOKIE_EXPIRES_IN) || 86400000; // 1 day (miliseconds)
  }
}

export const config: Config = new Config();
