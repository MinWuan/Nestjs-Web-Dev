/**
 * REPL debug script - Chạy: npx ts-node -r tsconfig-paths/register scripts/repl.ts
 * Sau đó gõ lệnh: await testFindByEmail('email@example.com')
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function bootstrap() {
  console.log('🔵 Starting REPL debug mode...\n');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  // --- KHAI BÁO CÁC HÀM TEST TẠI ĐÂY ---
  const facade = app.get('UserRepositoryFacade');

  const testFindByEmail = async (email: string) => {
    console.log(`\n🔍 Testing findByEmail("${email}")...`);
    const result = await facade.findByEmail(email);
    console.log('✅ Result:', JSON.stringify(result, null, 2));
    return result;
  };

  // Expose to global scope for REPL
  (global as any).testFindByEmail = testFindByEmail;

  console.log('✅ REPL ready! Các hàm có sẵn:');
  console.log('   testFindByEmail("email@example.com")');
  console.log('\n⏳ Đang chờ lệnh...\n');

  // Keep alive
  await new Promise(() => {});
}

bootstrap().catch((err) => {
  console.error('❌ REPL error:', err);
  process.exit(1);
});
