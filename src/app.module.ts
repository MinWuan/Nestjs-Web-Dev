import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/infrastructure/db/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { GraphqlModule } from '@/shared/graphql/graphql.module';
import { JwtConfigModule } from '@/common/config/jwt.config.module';
import { ModulesModule } from '@/modules';
import { AppController } from './app.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //cấu hình toàn cục
      ignoreEnvFile: true, // QUAN TRỌNG: ĐỂ TRÁNH LOAD .env MẶC ĐỊNH CỦA NESTJS
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    DatabaseModule,
    LoggerModule,
    GraphqlModule,
    JwtConfigModule,
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
