import { Module, OnModuleInit, Inject, Global } from '@nestjs/common';
import { TypeOrmModule, InjectDataSource } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import { checkAndLogDataSource } from './database-logger.util';
import { checkAndLogRedis } from './redis-logger.util';
import { RedisProvider } from './redis.provider';
import { config } from '@/config.app';
import { DOMAIN } from '@/common/constants/common';

@Global()
@Module({
  imports: [
    // --- KẾT NỐI 1: MONGODB ---
    TypeOrmModule.forRootAsync({
      name: DOMAIN.test.name,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: DOMAIN.test.type as 'mongodb',
        url: DOMAIN.test.url,
        database: DOMAIN.test.database,
        autoLoadEntities: true, // Chỉ load entity của Mongo
        synchronize: true, // dev only
        keepConnectionAlive: config.NODE_ENV !== 'production',
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: DOMAIN.main.name,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: DOMAIN.main.type as 'mongodb',
        url: DOMAIN.main.url,
        database: DOMAIN.main.database,
        autoLoadEntities: true,
        synchronize: true,
        keepConnectionAlive: config.NODE_ENV !== 'production',
      }),
    }),

    // --- KẾT NỐI 2: MYSQL (SQL) ---
    // TypeOrmModule.forRootAsync({
    //   name: DB_MYSQL,
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql', // Hoặc 'postgres', 'mariadb'
    //     host: configService.get<string>('MYSQL_HOST'),
    //     port: 3306,
    //     username: configService.get<string>('MYSQL_USER'),
    //     password: configService.get<string>('MYSQL_PASS'),
    //     database: 'web_sql_db',
    //     autoLoadEntities: true, // Chỉ load entity của MySQL
    //     synchronize: true,
    //     keepConnectionAlive: config.NODE_ENV !== 'production',
    //   }),
    // }),
  ],
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class DatabaseModule implements OnModuleInit {
  constructor(
    @InjectDataSource(DOMAIN.test.name) private mongoDataSource: DataSource,
    @InjectDataSource(DOMAIN.main.name) private mongoDataSourceMain: DataSource,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    //@InjectDataSource(DB_MYSQL) private sqlDataSource: DataSource,
  ) {}

  async onModuleInit() {
    // Kiểm tra tất cả các connections khi khởi động
    await Promise.all([
      checkAndLogDataSource(this.mongoDataSource, DOMAIN.test.name),
      checkAndLogDataSource(this.mongoDataSourceMain, DOMAIN.main.name),
      checkAndLogRedis(this.redisClient, 'test'),
      //checkAndLogDataSource(this.sqlDataSource, DB_MYSQL),
    ]);
  }
}
