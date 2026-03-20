import { Module } from '@nestjs/common';
// import { DemoModule } from '@/modules/_demo';
// import { RoleTestModule } from '@/modules/_role-test';
import { UserModule } from '@/modules/user';
import { RoleModule } from '@/modules/role';
import { S3Module } from '@/modules/s3';
import { BlockchainModule } from '@/modules/blockchain';

@Module({
  imports: [
    // DemoModule, 
    // RoleTestModule, 
    UserModule, 
    RoleModule, 
    S3Module,
    BlockchainModule
  ],
  providers: [],
})
export class ModulesModule {}

