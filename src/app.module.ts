import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/infrastructure/db/database.module';
import { LoggerModule } from './common/logger/logger.module';
import { GraphqlModule } from '@/shared/graphql/graphql.module';
import { JwtConfigModule } from '@/common/config/jwt.config.module';
import { ModulesModule } from '@/modules';
import { AppController } from './app.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true }, // Tự động tạo "túi" cho mỗi request HTTP
      guard: { mount: true },
      interceptor: { mount: true },
    }),
    EventEmitterModule.forRoot({
      // 1. Bật wildcard để dùng dấu * (Rất hữu ích cho Log)
      // Ví dụ: lắng nghe 'user.*' sẽ bắt được cả 'user.created', 'user.login'
      wildcard: true,
      // 2. Dấu phân cách các cấp độ sự kiện
      delimiter: '.',
      // 3. Quản lý bộ nhớ (Quan trọng)
      // Nếu bạn có nhiều Listener cho cùng 1 event, hãy tăng số này lên (ví dụ 20)
      maxListeners: 20,
      // 4. Debug lỗi bộ nhớ
      // Khi vượt quá maxListeners, nó sẽ in tên Event gây lỗi ra console để bạn biết chỗ nào rò rỉ
      verboseMemoryLeak: true,
      // 5. Quản lý lỗi (Error Handling)
      // Nếu set true, khi Listener bị lỗi, nó sẽ KHÔNG làm sập cả process của server
      ignoreErrors: false,
      // Các thông số khác giữ mặc định để tối ưu hiệu năng
      newListener: false,
      removeListener: false,
    }),
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
