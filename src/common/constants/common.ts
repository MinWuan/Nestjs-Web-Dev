import { config } from '@/config.app';

export const DOMAIN = {
  test: {
    name: 'test',
    database: 'web_test',
    type: 'mongodb',
    url: config.MONGO_URI,
  },
  main:{
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
