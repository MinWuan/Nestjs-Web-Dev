import { Redis } from 'ioredis';
import { logger } from '@/common/logger/app.logger';

export async function checkAndLogRedis(redisClient: Redis, connectionName: string) {
  logger.log(`--- Checking Connection: [${connectionName}] (Redis) ---`);

  if (redisClient.status === 'ready' || redisClient.status === 'connect') {
    logger.log(`✓ Redis status: ${redisClient.status}`);
    logger.log(`✓ Redis host: ${redisClient.options.host}:${redisClient.options.port}`);

    try {
      // Ping để test kết nối
      const pingResult = await redisClient.ping();
      logger.log(`✓ Redis ping successful: ${pingResult}`);

      // Lấy thông tin Redis server
      const info = await redisClient.info('server');
      const versionMatch = info.match(/redis_version:(.+)/);
      if (versionMatch) {
        logger.log(`✓ Redis version: ${versionMatch[1].trim()}`);
      }

      // Kiểm tra số lượng keys (optional)
      const dbSize = await redisClient.dbsize();
      logger.log(`✓ Redis database size: ${dbSize} keys`);

    } catch (error: any) {
      logger.warn(`⚠ [${connectionName}] Health check failed:`, error.message);
    }
  } else {
    logger.error({
      message: `Redis is not ready for connection: [${connectionName}] - Status: ${redisClient.status}`,
    });
  }
}
