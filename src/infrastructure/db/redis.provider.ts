import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from '@/config.app';
import { logger } from '@/common/logger/app.logger';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    // // Xử lý trường hợp REDIS_HOST có chứa port
    // let redisHost = config.REDIS_HOST;
    // let redisPort = config.REDIS_PORT;

    // // Nếu host có dạng "host:port", tách ra
    // if (redisHost.includes(':')) {
    //   const [host, port] = redisHost.split(':');
    //   redisHost = host;
    //   redisPort = parseInt(port) || redisPort;
    // }

    const client = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      //db: config.REDIS_DB,
      password: config.REDIS_PASSWORD,
      username: config.REDIS_USERNAME,
      retryStrategy: (times) => {
        // Giới hạn retry để tránh spam log
        if (times > 10) {
          logger.error({ 
            message: `Redis retry limit reached (${times} attempts). Stopping reconnection.` 
          });
          return null; // Dừng retry
        }
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.min(times * 1000, 5000);
        logger.warn(`Redis retry attempt ${times}, reconnecting in ${delay}ms...`);
        return delay;
      },
      maxRetriesPerRequest: 10,
      enableReadyCheck: true,
      lazyConnect: false, // Kết nối ngay lập tức
    });

    // Event listeners để theo dõi trạng thái Redis
    client.on('connect', () => {
      logger.log(`Redis connecting: ${config.REDIS_HOST}:${config.REDIS_PORT}...`);
    });

    client.on('ready', () => {
      logger.log(`✅ Redis connected successfully: ${config.REDIS_HOST}:${config.REDIS_PORT}`);
    });

    client.on('error', (err) => {
      // Chỉ log error đầu tiên, tránh spam
      if (!client.status || client.status === 'connecting') {
        logger.error({ 
          message: `⚠ Redis connection failed: ${err.message}`,
          meta: { host: config.REDIS_HOST, port: config.REDIS_PORT }
        });
      }
    });

    client.on('close', () => {
      logger.warn('⚠ Redis connection closed');
    });

    return client;
  },
};
