import { AppLogger } from './app.logger';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
