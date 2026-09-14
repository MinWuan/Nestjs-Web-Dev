import { Module } from '@nestjs/common';
import { DemoModule } from '@/modules/_demo';
// import { RoleTestModule } from '@/modules/_role-test';
import { UserModule } from '@/modules/user';
import { RoleModule } from '@/modules/role';
import { S3Module } from '@/modules/s3';
import { BlockchainModule } from '@/modules/blockchain';
import { SessionModule } from '@/modules/session';
import { AuthModule } from '@/modules/auth';
import { RankRecordModule } from '@/modules/rank-record';
import { NftAchievementModule } from '@/modules/nft-achievement';

@Module({
  imports: [
    DemoModule,
    // RoleTestModule,
    UserModule,
    RoleModule,
    S3Module,
    BlockchainModule,
    SessionModule,
    AuthModule,
    RankRecordModule,
    NftAchievementModule,
  ],
  providers: [],
})
export class ModulesModule {}

