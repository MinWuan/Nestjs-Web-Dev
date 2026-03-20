import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@/config.app';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: config.SINATURE_KEY
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}
