import { DataSource } from 'typeorm';
import { logger } from '@/common/logger/app.logger';

export async function checkAndLogDataSource(dataSource: DataSource, connectionName: string) {
  const ds = dataSource;
  const dbType = ds.options.type; // 'mongodb', 'mysql', 'postgres', ...

  logger.log(`--- Checking Connection: [${connectionName}] (${dbType}) ---`);

  if (ds.isInitialized) {
    logger.log(`✓ DataSource initialized: true`);
    logger.log(`✓ Database: ${ds.options.database}`);
    
    // Log entities
    logger.log(
      '✓ Entity metadata:',
      ds.entityMetadatas.map((e) => e.name),
    );

    try {
      // --- CASE 1: MONGODB ---
      if (dbType === 'mongodb') {
        const queryRunner = ds.createQueryRunner();
        const mongoClient = (queryRunner as any).databaseConnection;
        if (mongoClient) {
           const ping = await mongoClient.db(ds.options.database).admin().ping();
           logger.log(`✓ MongoDB ping successful: ${JSON.stringify(ping)}`);
        }
        await queryRunner.release();
      } 
      // --- CASE 2: SQL (MySQL, Postgres,...) ---
      else {
        // Chạy câu lệnh SQL đơn giản nhất để test kết nối
        const result = await ds.query('SELECT 1'); 
        logger.log('✓ SQL Query ping successful: ', result);
      }
    } catch (innerErr: any) {
      logger.warn(`⚠ [${connectionName}] Health check failed:`, innerErr.message);
    }
  } else {
    logger.error({
        message: `DataSource is not initialized for connection: [${connectionName}]`,
    });
  }
}